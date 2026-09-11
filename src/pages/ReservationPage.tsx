import { useTranslation } from 'react-i18next';
import { Hero } from '../components/HeroSection';
import reliLogo from '../assets/logo/ReliIcon.svg?no-inline';
import { ReservationForm } from '../components/ReservationForm';
import { ReviewsSection } from '../components/ReviewsSection';
import { photo } from '../data/images';
import { siteUrl, navigate } from '../hooks/useRoute';
import '../styles/reservation.css';
export function ReservationPage(){const {t}=useTranslation();return <><Hero className="reservation-hero" image={photo('reserveer-hero',1920)} srcSet={`${photo('reserveer-hero',960)} 960w, ${photo('reserveer-hero',1920)} 1920w, ${photo('reserveer-hero',2560)} 2560w`} title={t('reservation.heroTitle')} body={t('reservation.heroBody')} alt={t('reservation.heroAlt')}><a href={siteUrl('/activiteiten')} className="button button--purple" onClick={e=>{e.preventDefault();navigate('/activiteiten');}}>{t('nav.activities')}</a><a className="button button--reli" href="https://www.reli.be/nl/provence/var/le-reflet-du-lac" target="_blank" rel="noopener noreferrer" aria-label={t('social.reli')}><img src={reliLogo} alt="" width="68" height="46"/></a></Hero><ReservationForm/><ReviewsSection titleKey="reservation.reviewsTitle" subtitleKey="reservation.reviewsSubtitle"/></>;}
