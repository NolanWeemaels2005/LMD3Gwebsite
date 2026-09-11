import { useTranslation } from 'react-i18next';
import { useRoute, menuRoutes } from './hooks/useRoute';
import { lazy, Suspense } from 'react';
const ReservationPage = lazy(() => import('./pages/ReservationPage').then(module => ({ default: module.ReservationPage })));
import { AdvantagesPage } from './pages/AdvantagesPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingCTASection } from './components/BookingCTASection';
import { Footer } from './components/Footer';
export default function App() {
  const { t } = useTranslation();
  const route = useRoute();
  return <><a href="#main" className="skip-link">{t('nav.skip')}</a><Header/><main id="main">{route === '/' ? <><HeroSection/><GallerySection/><LocationSection/><ReviewsSection/><BookingCTASection/></> : route === '/activiteiten' ? <ActivitiesPage/> : route === '/pluspunten' ? <AdvantagesPage/> : route === '/reserveren' ? <Suspense fallback={<section className="route-loading" aria-busy="true"/>}><ReservationPage/></Suspense> : <section className="route-pending"><h1>{t(menuRoutes.find(item => item.path === route)?.key ?? 'nav.home')}</h1><p>{t('nav.pending')}</p></section>}</main><Footer/></>;
}
