export const languages = ['nl', 'fr', 'en'] as const;
export type Language = (typeof languages)[number];
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export function readLocation(pathname = window.location.pathname): { language: Language; route: string } {
  const path = base && pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
  const match = path.match(/^\/(fr|en)(?=\/|$)/);
  return { language: match ? match[1] as Language : 'nl', route: (match ? path.slice(match[0].length) : path).replace(/\/+$/, '') || '/' };
}
export function localizedPath(path: string, language: Language): string {
  const prefix = language === 'nl' ? '' : `/${language}`;
  return `${prefix}/${path.replace(/^\//, '')}`;
}
export function localUrl(path: string, language = readLocation().language): string {
  return base + localizedPath(path, language);
}
