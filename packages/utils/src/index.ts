/** Join truthy class-name fragments into a single string. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** `true` when running on the server (no `window`). Useful for SSR guards. */
export const isServer = typeof window === 'undefined';

/** Inclusive-exclusive integer range, e.g. `range(3)` → `[0, 1, 2]`. */
export function range(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

/** Clamp a number to the `[min, max]` interval. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build initials (max 2 chars) from a person/org name — for Avatars. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Slugify a string for use in URLs / org segments. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
