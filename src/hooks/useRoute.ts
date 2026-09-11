import { useSyncExternalStore } from 'react';
export const menuRoutes = [
  { path: '/', key: 'nav.home' },
  { path: '/over-ons', key: 'nav.about' },
  { path: '/activiteiten', key: 'nav.activities' },
  { path: '/pluspunten', key: 'nav.benefits' },
  { path: '/reserveren', key: 'nav.reserve' },
];
const subscribe = (notify: () => void) => {
  window.addEventListener('popstate', notify);
  return () => window.removeEventListener('popstate', notify);
};
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const siteUrl = (path: string) => `${base}/${path.replace(/^\//, '')}`;
export function currentRoute() {
  const pathname = window.location.pathname;
  const route = pathname === base ? '/' : pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
  return route.replace(/\/+$/, '') || '/';
}
export const useRoute = () => useSyncExternalStore(subscribe, currentRoute);
export function navigate(path: string) {
  if (path === currentRoute()) return;
  window.history.pushState(null, '', siteUrl(path));
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
