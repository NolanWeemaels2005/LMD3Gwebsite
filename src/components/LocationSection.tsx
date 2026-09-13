import { useTranslation } from 'react-i18next';
import map from '../assets/logo/MapFrance.svg';
import { siteUrl, navigate } from '../hooks/useRoute';
export function LocationSection() {
  const { t } = useTranslation();
  return <section className="location section-inset" id="location" aria-labelledby="location-title"><h2 id="location-title">{t('location.title')}</h2><div className="location-layout"><div className="location-map"><img src={map} width="1950" height="1950" alt={t('location.map')}/></div><div className="location-copy"><h3>{t('location.subtitle')}</h3><p>{t('location.body')}</p><a href={siteUrl('/activiteiten')} onClick={e=>{e.preventDefault();navigate('/activiteiten');}} className="button button--purple">{t('location.button')}</a></div></div></section>;
}
