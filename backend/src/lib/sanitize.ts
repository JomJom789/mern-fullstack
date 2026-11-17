import sanitizeHtml from 'sanitize-html';

const ENTITY_MAP: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&amp;': '&',
};

/**
 * Strips every HTML tag and attribute from user text. The result is stored and later
 * rendered by React as plain text (never through dangerouslySetInnerHTML). sanitize-html
 * escapes entities in its output, so they are decoded back to plain characters here.
 */
export function sanitizePlainText(input: string): string {
  const stripped = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  });
  return stripped
    .replace(/&(lt|gt|quot|#39|#x27|amp);/g, (entity) => ENTITY_MAP[entity] ?? entity)
    .trim();
}

export function sanitizeNullable(input: string | null | undefined): string | null {
  if (input === null || input === undefined) return null;
  const clean = sanitizePlainText(input);
  return clean.length > 0 ? clean : null;
}
