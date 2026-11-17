/**
 * One-off migration: legacy MongoDB `webs` and `mobiles` collections → Supabase `public.projects`.
 *
 *   npm run migrate:mongo              # dry run: prints what would be inserted
 *   npm run migrate:mongo -- --confirm # writes to Supabase
 *
 * Mapping (see UPGRADE_PLAN.md §5):
 *   title → title, slug = slugify(title) (deduplicated), description → description (sanitized),
 *   Web → category "Web App", Mobile → category "Mobile App", url → live_url (https only),
 *   genres[] → tech_stack (tags that fail validation are dropped), status = draft, featured = false.
 *   Legacy disk uploads (imgCover/images) are not migrated; add images from the admin dashboard.
 *   Users, chats, messages and tokens are intentionally not migrated (single-owner Supabase Auth).
 *
 * Existing slugs in Supabase are never overwritten. After a successful run, remove the
 * `mongodb` devDependency from backend/package.json and delete this script.
 */
import { SAFE_TAG_REGEX, slugify } from '@jomel/shared';
import { MongoClient, type Document } from 'mongodb';
import type { ProjectInsertRow } from '../src/lib/database.types.js';
import { sanitizePlainText } from '../src/lib/sanitize.js';
import { supabaseAdmin } from '../src/lib/supabase.js';

const confirm = process.argv.includes('--confirm');
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;

interface LegacyProject extends Document {
  title?: unknown;
  description?: unknown;
  url?: unknown;
  genres?: unknown;
  createdAt?: unknown;
}

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

function toHttpsUrl(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function toTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim())
    .filter((tag) => SAFE_TAG_REGEX.test(tag));
  return [...new Set(tags)].slice(0, 30);
}

function mapDocument(
  doc: LegacyProject,
  category: string,
  usedSlugs: Set<string>,
): ProjectInsertRow | null {
  const title = sanitizePlainText(asString(doc.title)).slice(0, 120);
  const description = sanitizePlainText(asString(doc.description)).slice(0, 5000);
  if (title.length < 2 || description.length < 1) return null;

  const base = slugify(title) || 'project';
  let slug = base;
  for (let n = 2; usedSlugs.has(slug); n += 1) slug = `${base.slice(0, 75)}-${n}`;
  usedSlugs.add(slug);

  return {
    slug,
    title,
    tagline: null,
    description,
    category,
    tech_stack: toTags(doc.genres),
    live_url: toHttpsUrl(doc.url),
    repo_url: null,
    image_path: null,
    featured: false,
    status: 'draft',
    sort_order: 100,
  };
}

async function main() {
  if (!mongoUri) {
    console.error(
      'MONGODB_URI (or legacy MONGO_URL) is not set in backend/.env — nothing to migrate.',
    );
    process.exit(1);
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('projects')
    .select('slug');
  if (existingError) throw new Error(`Could not read existing projects: ${existingError.message}`);
  const usedSlugs = new Set(existing.map((row) => row.slug));

  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 10_000 });
  await client.connect();
  try {
    const db = client.db();
    const sources = [
      { collection: 'webs', category: 'Web App' },
      { collection: 'mobiles', category: 'Mobile App' },
    ];

    const rows: ProjectInsertRow[] = [];
    let skipped = 0;
    for (const { collection, category } of sources) {
      const docs = await db.collection<LegacyProject>(collection).find({}).toArray();
      console.log(`${collection}: ${docs.length} document(s)`);
      for (const doc of docs) {
        const row = mapDocument(doc, category, usedSlugs);
        if (row) rows.push(row);
        else skipped += 1;
      }
    }

    console.log(
      `\nMapped ${rows.length} project(s), skipped ${skipped} without a title/description.`,
    );
    for (const row of rows) console.log(`  • ${row.slug} [${row.category}] ${row.live_url ?? ''}`);

    if (!confirm) {
      console.log('\nDry run only. Re-run with `-- --confirm` to insert these as drafts.');
      return;
    }
    if (rows.length === 0) return;

    const { error } = await supabaseAdmin
      .from('projects')
      .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });
    if (error) throw new Error(`Insert failed: ${error.message}`);
    console.log(
      `\n✓ Inserted ${rows.length} draft project(s). Review them in the admin dashboard.`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error: unknown) => {
  console.error('Migration failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
