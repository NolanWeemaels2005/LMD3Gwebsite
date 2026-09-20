import { useTranslation } from 'react-i18next';
import { siteUrl, navigate } from '../hooks/useRoute';
export function HomeIntroSection() {
  const { t } = useTranslation();
  return <section className="home-intro section-inset" aria-labelledby="home-intro-title">
    <h2 id="home-intro-title">{t('homeIntro.title')}</h2>
    <p>{t('homeIntro.body')}</p><p>{t('homeIntro.stay')}</p>
    <a className="button button--green" href={siteUrl('/pluspunten')} onClick={event => { event.preventDefault(); navigate('/pluspunten'); }}>{t('homeIntro.link')}</a>
  </section>;
}
