import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryPhotos, photo, photoSet } from '../data/images';
import { Arrow } from './Shared';
gsap.registerPlugin(ScrollTrigger);

export function GallerySection() {
  const { t, i18n } = useTranslation();
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const previous = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const area = viewport.current!;
    const rail = track.current!;
    const indicator = progress.current!;
    const max = () => Math.max(0, rail.scrollWidth - area.clientWidth);
    const update = (position: number) => {
      const end = max();
      const fraction = end > 0 ? Math.min(1, Math.max(0, position / end)) : 0;
      indicator.style.setProperty('--progress', String(fraction));
      indicator.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
      previous.current!.disabled = fraction < .001;
      next.current!.disabled = fraction > .999 || end === 0;
    };
    const media = gsap.matchMedia();
    media.add('(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      area.scrollLeft = 0;
      section.current!.classList.add('gallery--pinned');
      const animation = gsap.to(rail, {
        x: () => -max(), ease: 'none',
        scrollTrigger: { id: 'gallery', trigger: section.current, start: 'top top', end: () => `+=${max()}`, pin: true, scrub: .25, invalidateOnRefresh: true },
        onUpdate: () => update(-Number(gsap.getProperty(rail, 'x'))),
      });
      const keyboard = (event: KeyboardEvent) => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const trigger = animation.scrollTrigger!;
        const current = window.scrollY;
        const step = rail.children[0].getBoundingClientRect().width + 36;
        const value = event.key === 'Home' ? trigger.start : event.key === 'End' ? trigger.end : current + (event.key === 'ArrowRight' ? step : -step);
        window.scrollTo({ top: Math.min(trigger.end, Math.max(trigger.start, value)), behavior: 'instant' });
      };
      area.addEventListener('keydown', keyboard);
      return () => { area.removeEventListener('keydown', keyboard); section.current?.classList.remove('gallery--pinned'); };
    });
    const onScroll = () => { if (!section.current?.classList.contains('gallery--pinned')) update(area.scrollLeft); };
    area.addEventListener('scroll', onScroll, { passive: true });
    const resize = new ResizeObserver(() => { onScroll(); ScrollTrigger.refresh(); });
    resize.observe(area);
    // The rail also changes when photos are removed or replaced during editing.
    // Refresh the tween endpoint as well as the pin distance, not only on viewport resize.
    resize.observe(rail);
    update(0);
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { resize.disconnect(); area.removeEventListener('scroll', onScroll); media.revert(); };
  }, [galleryPhotos]);
  // Translation changes may alter text height, but must not tear down the pin
  // spacer: removing it clamps the document scroll position back to the gallery.
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, [i18n.language]);

  const move = (direction: number) => {
    const area = viewport.current!;
    const card = track.current!.children[0];
    const gap = parseFloat(getComputedStyle(track.current!).gap);
    area.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section className="gallery section-inset" id="gallery" ref={section} aria-labelledby="gallery-title">
    <h2 id="gallery-title">{t('gallery.title')}</h2><p className="section-intro">{t('gallery.body')}</p>
    <div className="gallery-viewport" ref={viewport} tabIndex={0} role="region" aria-label={t('gallery.label')}><div className="gallery-track" ref={track}>{galleryPhotos.map(name => <figure className="gallery-card" key={name}><img src={photo(name)} srcSet={photoSet(name)} sizes="(max-width: 767px) 72vw, (max-width: 1099px) 38vw, 22vw" alt={t(`photos.${name}`)} width="640" height="930" loading="lazy" decoding="async" /></figure>)}</div></div>
    <div className="gallery-bottom"><div className="gallery-progress" ref={progress} role="progressbar" aria-label={t('gallery.progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span/></div><div className="gallery-controls"><button ref={previous} className="arrow-button" aria-label={t('gallery.previous')} onClick={() => move(-1)}><Arrow direction="left"/></button><button ref={next} className="arrow-button" aria-label={t('gallery.next')} onClick={() => move(1)}><Arrow direction="right"/></button></div></div>
  </section>;
}
