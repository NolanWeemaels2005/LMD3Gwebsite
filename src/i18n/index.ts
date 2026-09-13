import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nl from './locales/nl.json';
import fr from './locales/fr.json';
import en from './locales/en.json';

export const languages = ['nl', 'fr', 'en'] as const;
export type Language = (typeof languages)[number];
const supported = (value: string | null): value is Language => languages.includes(value as Language);
export function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem('siteLanguage');
    if (supported(saved)) return saved;
  } catch { /* Storage may be disabled; browser detection still works. */ }
  for (const locale of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const base = locale.toLowerCase().split('-')[0];
    if (supported(base)) return base;
  }
  return 'nl';
}
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
  void i18n.changeLanguage(language);
}
export default i18n;
