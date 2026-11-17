/**
 * Seeds the three featured projects. Safe to re-run: rows are upserted by slug and images are
 * uploaded with upsert to stable paths (`seed/<image>.<ext>`).
 *
 * Usage: npm run seed   (reads backend/.env)
 *
 * This script never creates users or passwords. The owner account is created by hand in the
 * Supabase dashboard (see README → "Admin setup").
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { projectInputSchema, type ProjectFormValues } from '@jomel/shared';
import type { ProjectInsertRow } from '../src/lib/database.types.js';
import { PROJECT_IMAGES_BUCKET, supabaseAdmin } from '../src/lib/supabase.js';

const IMAGES_DIR = join(import.meta.dirname, 'images');

const CONTENT_TYPES = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  avif: 'image/avif',
} as const;

interface SeedProject extends Omit<ProjectFormValues, 'imagePath'> {
  /** Base file name inside backend/seed/images (extension is detected). */
  image: string;
}

const projects: SeedProject[] = [
  {
    slug: 'intelligent-engineer',
    title: 'Intelligent Engineer',
    category: 'SaaS',
    tagline: 'PPM Services Platform for Engineers',
    description:
      'A field service management SaaS for engineering businesses — planned preventive maintenance (PPM) contracts, jobs, quotes, invoices, clients, sites and engineers in one platform, with AI-powered diagnostics. Delivered as a web app and a React Native Expo mobile app on a shared, secure backend.',
    techStack: [
      'React',
      'TypeScript',
      'Vite',
      'React Native Expo',
      'Node.js',
      'Express',
      'Supabase',
      'Stripe',
      'RevenueCat',
      'Gemini AI',
      'TanStack Query',
    ],
    liveUrl: 'https://www.intelligentengineer.com',
    sortOrder: 1,
    image: 'intelligent-engineer',
  },
  {
    slug: 'mibu-essential',
    title: 'MiBu Essential',
    category: 'Web App',
    tagline: 'Micro Business Essentials for Small Food Manufacturing',
    description:
      'An all-in-one operations app for small food manufacturing businesses — helping micro producers organize and manage their production workflow.',
    // Not verifiable from this repository — complete it from the admin dashboard.
    techStack: [],
    liveUrl: 'https://mibu.onrender.com',
    sortOrder: 2,
    image: 'mibu',
  },
  {
    slug: 'construct-mate',
    title: 'Construct Mate',
    category: 'Web App',
    tagline: 'Real-Time Task Tracking for Construction Projects',
    description:
      'A real-time task tracker and management tool for construction projects — keeping teams, tasks and progress in sync on site and in the office.',
    // Not verifiable from this repository — complete it from the admin dashboard.
    techStack: [],
    liveUrl: 'https://construct-mate-frontend-prod.onrender.com',
    sortOrder: 3,
    image: 'construct-mate',
  },
];

function findImage(base: string): { file: string; ext: keyof typeof CONTENT_TYPES } | null {
  for (const ext of Object.keys(CONTENT_TYPES) as (keyof typeof CONTENT_TYPES)[]) {
    const file = join(IMAGES_DIR, `${base}.${ext}`);
    if (existsSync(file)) return { file, ext };
  }
  return null;
}

async function uploadImage(base: string): Promise<string | null> {
  const found = findImage(base);
  if (!found) {
    console.warn(`  ⚠ No image for "${base}" — the site will render a gradient placeholder.`);
    return null;
  }
  const path = `seed/${base}.${found.ext}`;
  const body = await readFile(found.file);
  const { error } = await supabaseAdmin.storage.from(PROJECT_IMAGES_BUCKET).upload(path, body, {
    contentType: CONTENT_TYPES[found.ext],
    cacheControl: '31536000',
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
  console.log(`  ↑ uploaded ${path}`);
  return path;
}

async function main() {
  console.log('Seeding projects…');
  const missingImages: string[] = [];

  for (const { image, ...project } of projects) {
    console.log(`• ${project.title}`);
    const imagePath = await uploadImage(image);
    if (!imagePath) missingImages.push(image);

    const input = projectInputSchema.parse({
      ...project,
      imagePath,
      status: 'published',
      featured: true,
    });

    const row: ProjectInsertRow = {
      slug: input.slug,
      title: input.title,
      tagline: input.tagline,
      description: input.description,
      category: input.category,
      tech_stack: input.techStack,
      live_url: input.liveUrl,
      repo_url: input.repoUrl,
      image_path: input.imagePath,
      featured: input.featured,
      status: input.status,
      sort_order: input.sortOrder,
    };

    const { error } = await supabaseAdmin.from('projects').upsert(row, { onConflict: 'slug' });
    if (error) throw new Error(`Upsert failed for ${input.slug}: ${error.message}`);
    console.log(`  ✓ upserted ${input.slug}`);
  }

  console.log('\nDone.');
  if (missingImages.length > 0) console.log(`Missing images: ${missingImages.join(', ')}`);
}

main().catch((error: unknown) => {
  console.error('\nSeed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
