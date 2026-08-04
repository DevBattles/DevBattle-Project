/**
 * Generates an offline-safe inline SVG avatar (data URI) from a person's name.
 * Used for accounts created at runtime (registration) that have no uploaded photo.
 */
const GRADIENTS: [string, string][] = [
  ['#6366f1', '#06b6d4'],
  ['#0ea5e9', '#22c55e'],
  ['#f59e0b', '#ef4444'],
  ['#8b5cf6', '#ec4899'],
  ['#14b8a6', '#6366f1'],
  ['#f43f5e', '#f97316'],
];

export const getInitials = (name: string): string =>
  name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'DB';

export const generateAvatar = (name: string): string => {
  const initials = getInitials(name);
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const [from, to] = GRADIENTS[hash % GRADIENTS.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="28" fill="url(#g)"/>
  <text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="#ffffff"
    font-family="Inter, Segoe UI, system-ui, sans-serif" font-size="66" font-weight="800">${initials}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
