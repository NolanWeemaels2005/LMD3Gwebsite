import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nl from './locales/nl.json';
import fr from './locales/fr.json';
import en from './locales/en.json';

import { languages, readLocation, localUrl, type Language } from '../utils/localizedPaths';
export { languages, type Language } from '../utils/localizedPaths';

// A URL always identifies one language, including when storage is unavailable.
export const detectLanguage = (): Language => readLocation().language;
void i18n.use(initReactI18next).init({
  resources: { nl: { translation: nl }, fr: { translation: fr }, en: { translation: en } },
  lng: detectLanguage(), fallbackLng: 'nl', supportedLngs: [...languages],
  interpolation: { escapeValue: false }, returnNull: false,
});
const updateDocument = (language: string) => {
  document.documentElement.lang = language;
};
i18n.on('languageChanged', updateDocument);
updateDocument(i18n.language);
export function selectLanguage(language: Language) {
  try { localStorage.setItem('siteLanguage', language); } catch { /* Session selection remains available. */ }
  const url = localUrl(readLocation().route, language) + window.location.search + window.location.hash;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
window.addEventListener('popstate', () => { void i18n.changeLanguage(detectLanguage()); });
export default i18n;
