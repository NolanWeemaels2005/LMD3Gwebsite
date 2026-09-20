import { useSyncExternalStore } from 'react';
import { localUrl, readLocation } from '../utils/localizedPaths';
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
export const siteUrl = localUrl;
export const currentRoute = () => readLocation().route;
export const useRoute = () => useSyncExternalStore(subscribe, currentRoute);
export function navigate(path: string) {
  if (path === currentRoute()) return;
  window.history.pushState(null, '', siteUrl(path));
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
