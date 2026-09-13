import { siteUrl, navigate } from '../hooks/useRoute';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { photo } from '../data/images';
import { BookingButton } from './Shared';
export function Hero({ image, srcSet, title, body, alt, children, className = '', id }: { image: string; srcSet?: string; title: string; body: string; alt: string; children: ReactNode; className?: string; id?: string }) {
 return <section className={`hero ${className}`} id={id} aria-labelledby="hero-title"><img className="hero-image" src={image} srcSet={srcSet} sizes="100vw" alt={alt} fetchPriority="high"/><div className="hero-copy"><h1 id="hero-title">{title}</h1><p>{body}</p><div className="hero-buttons">{children}</div></div></section>;
}
export function HeroSection() {
 const { t } = useTranslation();
 return <Hero id="home" image={photo('hero-home',1920)} srcSet={`${photo('hero-home',960)} 960w, ${photo('hero-home',1920)} 1920w, ${photo('hero-home',2404)} 2404w`} title={t('hero.title')} body={t('hero.body')} alt={t('hero.alt')}><BookingButton/><a className="button button--green" href={siteUrl('/over-ons')} onClick={e=>{e.preventDefault();navigate('/over-ons');}}>{t('nav.about')}</a></Hero>;
}
