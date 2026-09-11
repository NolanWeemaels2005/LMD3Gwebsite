import { useLayoutEffect, useRef, type RefObject, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { languages, selectLanguage } from '../i18n';
import { siteUrl, menuRoutes, navigate, useRoute } from '../hooks/useRoute';

type Props = { trigger: RefObject<HTMLButtonElement | null>; onClosed: () => void; controller: RefObject<((destination?: string | null) => void) | null> };
export function NavigationMenu({ trigger, controller, onClosed }: Props) {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const scene = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const finish = useRef<() => void>(() => {});
  const pending = useRef<string | null>(null);
  const closing = useRef(false);
  const close = (destination: string | null = null) => {
    if (closing.current) return;
    closing.current = true;
    pending.current = destination === route ? null : destination;
    scene.current!.dataset.state = 'closing';
    const animation = timeline.current;
    // At time zero the page is already visually closed; GSAP cannot cross zero
    // in reverse to emit its callback. Complete this early-cancel case explicitly.
    if (animation?.time() === 0) finish.current();
    else animation?.reverse();
  };
  const follow = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    close(path === route ? null : path);
  };
  useLayoutEffect(() => {
    controller.current = close;
    const root = document.getElementById('root')!;
    const body = document.body;
    const savedY = window.scrollY;
    const previousStyle = body.getAttribute('style');
    const previousInert = root.inert;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    // Fixed-body locking covers iOS too; reserve the scrollbar width and retain
    // the visible document offset until the reverse animation has completed.
    Object.assign(body.style, { position: 'fixed', top: `${-savedY}px`, width: '100%', overflow: 'hidden', paddingRight: `${scrollbar}px`, boxSizing: 'border-box' });
    root.inert = true;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      if (previousStyle === null) body.removeAttribute('style'); else body.setAttribute('style', previousStyle);
      root.inert = previousInert;
      window.scrollTo({ top: savedY, behavior: 'instant' });
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = matchMedia('(max-width: 767px)').matches;
    const duration = reduced ? .16 : mobile ? .65 : .8;
    finish.current = () => {
      release();
      trigger.current?.focus({ preventScroll: true });
      onClosed();
      if (pending.current) navigate(pending.current);
    };
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => { scene.current!.dataset.state = 'open'; },
        onReverseComplete: () => finish.current(),
      });
      timeline.current = tl;
      tl.fromTo('.navigation-shade', { opacity: 0 }, { opacity: 1, duration, ease: 'power3.inOut' }, 0)
        .fromTo(page.current, { rotationY: reduced ? 0 : mobile ? -55 : -78, xPercent: reduced ? 3 : mobile ? 24 : 32, opacity: reduced ? 0 : 1 }, { rotationY: 0, xPercent: 0, opacity: 1, duration, ease: 'power3.inOut' }, 0)
        .fromTo('.navigation-fold', { opacity: 0 }, { opacity: .25, duration: duration * .45 }, 0)
        .to('.navigation-fold', { opacity: 0, duration: duration * .55 }, duration * .45)
        .fromTo('.navigation-enter', { opacity: 0, x: reduced ? 0 : 12 }, { opacity: 1, x: 0, duration: duration * .36, stagger: reduced ? 0 : .035, ease: 'power2.out' }, duration * .36);
    }, scene);
    trigger.current!.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key !== 'Tab') return;
      const items = [...document.querySelectorAll<HTMLElement>('.shared-navigation-controls a, .shared-navigation-controls button'), ...page.current!.querySelectorAll<HTMLElement>('a[href],button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement as HTMLElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { controller.current = null; document.removeEventListener('keydown', keydown); context.revert(); release(); };
  }, [onClosed, trigger, controller]);

  return createPortal(<div ref={scene} className="navigation-scene" data-state="opening">
    <div className="navigation-shade" onClick={() => close()} aria-hidden="true" />
    <div ref={page} className="navigation-page" role="dialog" aria-modal="true" aria-label={t('nav.label')}>
      <div className="navigation-fold" aria-hidden="true" />
      <nav id="main-menu" className="navigation-links" aria-label={t('nav.label')}>{menuRoutes.map(item => <a className="navigation-enter" key={item.path} href={siteUrl(item.path)} aria-current={route === item.path ? 'page' : undefined} onClick={event => follow(event, item.path)}>{t(item.key)}</a>)}</nav>
      <div className="navigation-languages navigation-enter" role="group" aria-label={t('footer.language')}>{languages.map(language => <button key={language} lang={language} aria-pressed={i18n.language === language} onClick={() => selectLanguage(language)}>{language.toUpperCase()}</button>)}</div>
    </div>
  </div>, document.body);
}
