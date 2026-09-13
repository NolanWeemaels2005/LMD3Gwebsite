import { useTranslation } from 'react-i18next';
import { Hero } from '../components/HeroSection';
import { BookingButton } from '../components/Shared';
import { BookingCTASection } from '../components/BookingCTASection';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { aboutImages } from '../data/aboutImages';
import { siteUrl,navigate } from '../hooks/useRoute';
import '../styles/about.css';
export function AboutPage(){
 const {t}=useTranslation();
 const activitiesLink=(color='purple')=><a className={`button button--${color}`} href={siteUrl('/activiteiten')} onClick={e=>{e.preventDefault();navigate('/activiteiten');}}>{t('nav.activities')}</a>;
 return <>
  <Hero className="about-hero" image={aboutImages.hero.src} srcSet={aboutImages.hero.srcSet} alt={t('about.hero.alt')} title={t('about.hero.title')} body={t('about.hero.description')}><BookingButton/>{activitiesLink('green')}</Hero>
  <section className="about-story about-split section-inset" aria-labelledby="about-story-title"><div><h2 id="about-story-title">{t('about.story.title')}</h2><p>{t('about.story.paragraph1')}</p><p>{t('about.story.paragraph2')}</p>{activitiesLink()}</div><img {...aboutImages.story} sizes="(max-width: 767px) 90vw, 40vw" alt={t('about.story.alt')} width="1440" height="1080" loading="lazy"/></section>
  <section className="about-evolution section-inset" aria-labelledby="about-evolution-title"><h2 id="about-evolution-title">{t('about.evolution.title')}</h2><p>{t('about.evolution.description')}</p><div className="about-comparisons">{['living','terrace'].map(key=><BeforeAfterSlider key={key} beforeImage={aboutImages[`${key}-before`]} afterImage={aboutImages[`${key}-after`]} label={t(`about.evolution.${key}`)} beforeAlt={t(`about.evolution.${key}Before`)} afterAlt={t(`about.evolution.${key}After`)}/>)}</div></section>
  <section className="about-name about-split section-inset" aria-labelledby="about-name-title"><img {...aboutImages.family} sizes="(max-width: 767px) 90vw, 42vw" alt={t('about.name.alt')} width="1440" height="1080" loading="lazy"/><div><h2 id="about-name-title">{t('about.name.title')}</h2><p>{t('about.name.paragraph1')}</p><p>{t('about.name.paragraph2')}</p><BookingButton/></div></section>
  <BookingCTASection/>
 </>;
}
