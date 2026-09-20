import type { LegalKind } from './pages/LegalPage';
import { PageLoadBoundary } from './components/PageLoadBoundary';
import { PageMetadata } from './components/PageMetadata';

import { useTranslation } from 'react-i18next';
import { useRoute, menuRoutes } from './hooks/useRoute';
import { lazy, Suspense } from 'react';
const LegalPage = lazy(() => import('./pages/LegalPage').then(module => ({ default: module.LegalPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const AdvantagesPage = lazy(() => import('./pages/AdvantagesPage').then(module => ({ default: module.AdvantagesPage })));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage').then(module => ({ default: module.ActivitiesPage })));
const ReservationPage = lazy(() => import('./pages/ReservationPage').then(module => ({ default: module.ReservationPage })));


import { Header } from './components/Header';
import { HomeIntroSection } from './components/HomeIntroSection';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingCTASection } from './components/BookingCTASection';
import { Footer } from './components/Footer';
export default function App() {
  const { t } = useTranslation();
  const route = useRoute();
  return <><PageMetadata/><a href="#main" className="skip-link">{t('nav.skip')}</a><Header/><main id="main"><PageLoadBoundary key={route} title={t('loading.failed')} retry={t('loading.retry')}><Suspense fallback={<section className="route-loading" aria-busy="true"><p role="status">{t('loading.page')}</p></section>}>{route === '/' ? <><HeroSection/><HomeIntroSection/><GallerySection/><LocationSection/><ReviewsSection/><BookingCTASection/></> : ['/legal','/privacy','/cookies'].includes(route) ? <LegalPage kind={route.slice(1) as LegalKind}/> : route === '/over-ons' ? <AboutPage/> : route === '/activiteiten' ? <ActivitiesPage/> : route === '/pluspunten' ? <AdvantagesPage/> : route === '/reserveren' ? <ReservationPage/> : <section className="route-pending"><h1>{t(menuRoutes.find(item => item.path === route)?.key ?? 'nav.home')}</h1><p>{t('nav.pending')}</p></section>}</Suspense></PageLoadBoundary></main><Footer/></>;
}
