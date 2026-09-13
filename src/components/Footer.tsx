import { useEffect, useState } from 'react';
import { externalLinks } from '../data/externalLinks';
import { siteUrl } from '../hooks/useRoute';
import { useTranslation } from 'react-i18next';
import { languages, selectLanguage } from '../i18n';
import { Logo, SocialIcon, socialPlatforms } from './Shared';
export function Footer() {
  const { t, i18n } = useTranslation();
  const [pendingSocial, setPendingSocial] = useState<string | null>(null);
  useEffect(() => {
    if (!pendingSocial) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPendingSocial(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pendingSocial]);
  return <footer className="footer"><div className="footer-top"><Logo/><nav className="footer-pages" aria-label={t('footer.pages')}><h2>{t('footer.pages')}</h2><a href={siteUrl('/#home')}>{t('nav.home')}</a><a href={siteUrl('/activiteiten')}>{t('nav.nearby')}</a><a href={siteUrl('/pluspunten')}>{t('nav.benefits')}</a><a href={siteUrl('/reserveren')}>{t('nav.book')}</a><a href={siteUrl('/#gallery')}>{t('nav.gallery')}</a></nav><nav className="footer-links" aria-label={t('footer.links')}><h2>{t('footer.links')}</h2>{['instagram','facebook','rental'].map(name => externalLinks[name]?<a key={name} href={externalLinks[name]} target="_blank" rel="noopener noreferrer">{t(`social.${name}`)}</a>:<button type="button" className="social-pending-link" key={name} onClick={() => setPendingSocial(name)}>{t(`social.${name}`)}</button>)}</nav></div><div className="footer-divider"/><div className="footer-controls"><div className="language-switcher" role="group" aria-label={t('footer.language')}>{languages.map(language => <button key={language} lang={language} aria-pressed={i18n.language === language} onClick={() => selectLanguage(language)}>{t(`languages.${language}`)}</button>)}</div><nav className="social-links" aria-label={t('footer.social')}>{socialPlatforms.map(name => externalLinks[name]?<a key={name} href={externalLinks[name]} target="_blank" rel="noopener noreferrer" aria-label={t(`social.${name}`)}><SocialIcon name={name}/></a>:<button type="button" key={name} aria-label={t(`social.${name}`)} onClick={() => setPendingSocial(name)}><SocialIcon name={name}/></button>)}</nav></div><nav className="legal-links" aria-label={t('footer.legal')}>{['legal','cookies','privacy'].map(name => <a key={name} href={siteUrl('/'+name)}>{t(`footer.${name}`)}</a>)}</nav>{pendingSocial && <div className="social-notice"><p role="status">{t('footer.socialComingSoon', { platform: t(`social.${pendingSocial}`) })}</p><button type="button" aria-label={t('footer.closeNotice')} onClick={() => setPendingSocial(null)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>}</footer>;
}
