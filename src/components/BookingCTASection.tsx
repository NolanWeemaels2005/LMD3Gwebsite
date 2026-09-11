import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fanPhotos, fanLayers, photo, photoSet } from '../data/images';
import { BookingButton } from './Shared';
import { resolveFanGeometry } from '../utils/fanGeometry';

gsap.registerPlugin(ScrollTrigger);

export function BookingCTASection() {
  const { t, i18n } = useTranslation();
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 1100px) and (hover: hover) and (pointer: fine)',
      motion: '(prefers-reduced-motion: no-preference)',
    }, context => {
      const fan = section.current!.querySelector<HTMLElement>('.fan')!;
      const layout = fan.querySelector<HTMLElement>('.fan-layout')!;
      const cards = Array.from(section.current!.querySelectorAll<HTMLElement>('.fan-card'));
      const surfaces = cards.map(card => card.querySelector<HTMLElement>('.fan-card-hover')!);
      let activeIndex: number | null = null;

      const select = (index: number | null) => {
        if (activeIndex === index) return;
        activeIndex = index;
        if (index === null) delete fan.dataset.activeIndex;
        else fan.dataset.activeIndex = String(index);
        // Read the current scroll geometry, excluding the temporary hover channel.
        // The outer wrapper never scales; its bottom-centre anchor is stable.
        const base = cards.map(card => {
          const matrix = new DOMMatrix(getComputedStyle(card).transform);
          return {
            x: card.offsetLeft + card.offsetWidth / 2 + matrix.m41 - Number(gsap.getProperty(card, '--hover-x')),
            y: card.offsetTop + card.offsetHeight + matrix.m42,
            width: card.offsetWidth,
            height: card.offsetHeight,
            rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
          };
        });
        const target = resolveFanGeometry(base, index);
        gsap.to(layout, { x: target.centerX, duration: .4, ease: 'power3.out', overwrite: 'auto' });
        cards.forEach((card, cardIndex) => {
          gsap.to(card, { '--hover-x': target.cards[cardIndex].x - base[cardIndex].x, duration: .4, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(surfaces[cardIndex], {
            scale: target.cards[cardIndex].width / base[cardIndex].width,
            y: 0,
            duration: .4, ease: 'power3.out', overwrite: 'auto',
          });
        });
      };

      if (context.conditions!.motion) {
        // Start when the cards enter view; open over the first 40%, then hold.
        // Hover transforms and the fixed card layers are separate channels.
        gsap.timeline({
          scrollTrigger: { id: 'booking-fan', trigger: fan, start: 'top 90%', end: 'bottom 20%', scrub: .35, invalidateOnRefresh: true },
        })
          .fromTo(cards, { '--spread': 0 }, { '--spread': 1, duration: .4, ease: 'none' })
          .to({}, { duration: .6 });
      }

      if (!context.conditions!.desktop || !context.conditions!.motion) return;
      // Event-created tweens are registered in this GSAP context for cleanup on
      // unmount, viewport changes and switching reduced-motion preferences.
      context.add('activate', (index: number) => select(index));
      context.add('reset', () => select(null));
      let lastPointer: { x: number; y: number } | null = null;
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        // Moving cards can change hit-testing under a stationary pointer. Only
        // actual pointer movement should choose another card, avoiding flicker.
        if (lastPointer?.x === event.clientX && lastPointer.y === event.clientY) return;
        lastPointer = { x: event.clientX, y: event.clientY };
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.fan-card') : null;
        const index = target ? cards.indexOf(target) : -1;
        if (index >= 0 && Number(gsap.getProperty(cards[index], '--spread')) >= .85) context.activate(index);
        // Gaps inside the fan retain the active layout for fluid card-to-card travel.
      };
      const reset = () => { lastPointer = null; context.reset(); };
      fan.addEventListener('pointermove', move);
      fan.addEventListener('pointerleave', reset);
      window.addEventListener('blur', reset);
      return () => {
        fan.removeEventListener('pointermove', move);
        fan.removeEventListener('pointerleave', reset);
        window.removeEventListener('blur', reset);
        delete fan.dataset.activeIndex;
      };
    });
    // Font loading can move this section after ScrollTrigger's first measure.
    let mounted = true;
    void document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; media.revert(); };
  }, []);

  // Translation changes may alter text height, but must not tear down the pin
  // spacer: removing it clamps the document scroll position back to the gallery.
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, [i18n.language]);

  return <section className="booking" id="booking" ref={section} aria-labelledby="booking-title">
    <h2 id="booking-title">{t('cta.title')}</h2>
    <p>{t('cta.subtitle')}</p>
    <div className="fan" aria-hidden="true"><div className="fan-layout">
      {fanPhotos.map((name, index) => <div className={`fan-card fan-card--${index}`} key={name} style={{ zIndex: fanLayers[index] }}>
        <div className="fan-card-hover"><img src={photo(name)} srcSet={photoSet(name)} sizes="(max-width: 767px) 45vw, 43vw" alt="" width="480" height="840" loading="lazy" decoding="async" /></div>
      </div>)}
    </div></div>
    <BookingButton />
  </section>;
}
