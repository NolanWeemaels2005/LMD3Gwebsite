import { useTranslation } from 'react-i18next';
import { Hero } from '../components/HeroSection';
import { BookingCTASection } from '../components/BookingCTASection';
import { advantages, facilities, brochureUrl } from '../data/advantages';
import { photo, photoSet } from '../data/images';
import { siteUrl, navigate } from '../hooks/useRoute';
import '../styles/advantages.css';

export function AdvantagesPage() {
 const {t} = useTranslation();
 return <>
  <Hero className="advantages-hero" image={photo('bottomp5',1920)} srcSet={`${photo('bottomp5',960)} 960w, ${photo('bottomp5',1920)} 1920w, ${photo('bottomp5',2304)} 2304w`} title={t('advantages.hero.title')} body={t('advantages.hero.description')} alt={t('advantages.hero.alt')}>
   {([['/reserveren','nav.book','purple'],['/activiteiten','nav.activities','green']] as const).map(([path,key,color]) => <a key={path} href={siteUrl(path)} className={`button button--${color}`} onClick={event => {event.preventDefault();navigate(path);}}>{t(key)}</a>)}
  </Hero>
  <section className="advantages-section section-inset" aria-labelledby="advantages-title">
   <h2 id="advantages-title">{t('advantages.section.title')}</h2><p className="advantages-intro">{t('advantages.section.subtitle')}</p>
   <div className="advantages-grid">{advantages.map(item => <article className="advantage-card" key={item.key}><span className="advantage-icon"><img src={item.icon} alt="" width="80" height="80"/></span><h3>{t(`advantages.items.${item.key}.title`)}</h3><p>{t(`advantages.items.${item.key}.description`)}</p></article>)}</div>
   <div className="facilities-gallery" role="group" aria-label={t('advantages.gallery.label')}>{facilities.map(item => <figure className={`facility-photo facility-photo--${item.key}`} key={item.key}><img src={photo(item.photo)} srcSet={photoSet(item.photo)} sizes={item.key === 'pool' ? '(max-width: 1099px) 90vw, 45vw' : '(max-width: 767px) 90vw, (max-width: 1099px) 44vw, 22vw'} width="960" height="960" alt={t(`advantages.gallery.${item.key}.alt`)} loading="lazy"/><figcaption>{t(`advantages.gallery.${item.key}.label`)}</figcaption></figure>)}</div>
  </section>
  <section className="brochure-section section-inset" aria-labelledby="brochure-title"><h2 id="brochure-title">{t('advantages.brochure.title')}</h2><p>{t('advantages.brochure.subtitle')}</p><a className="button button--purple" href={brochureUrl} download aria-label={t('advantages.brochure.accessibleLabel')}>{t('advantages.brochure.button')}</a></section>
  <BookingCTASection/>
 </>;
}
