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
export const useRoute = () => useSyncExternalStore(subscribe, () => window.location.pathname);
export function navigate(path: string) {
  if (path === window.location.pathname) return;
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
