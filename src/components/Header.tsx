import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Shared';
import { NavigationMenu } from './NavigationMenu';
import { siteUrl, navigate, useRoute } from '../hooks/useRoute';
export function Header() {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const [lightBackground, setLightBackground] = useState(false);
  const [open, setOpen] = useState(false);
  const closed = useCallback(() => setOpen(false), []);
  const toggle = useRef<HTMLButtonElement>(null);
  const controller = useRef<((destination?: string | null) => void) | null>(null);
  useLayoutEffect(() => {
    if (open) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!toggle.current) return;
      const rect = toggle.current.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      // Inspect the page section beneath the fixed controls, ignoring their portal.
      const surface = document.elementsFromPoint(x, y)
        .map(element => element.closest('main > section, footer'))
        .find(element => element !== null);
      if (surface?.classList.contains('hero')) { setLightBackground(false); return; }
      let element: Element | null = surface ?? document.documentElement;
      while (element) {
        const channels = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (channels && (channels.length < 4 || channels[3] > .9)) {
          setLightBackground(channels.slice(0, 3).every(channel => channel > 220));
          return;
        }
        element = element.parentElement;
      }
      setLightBackground(false);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.getElementById('root')!);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [open, route, i18n.language]);
  return <header className="header">
    <Logo />
    {createPortal(<div className={`header-actions shared-navigation-controls${open ? ' shared-navigation-controls--open' : ''}`}>
      <a href={siteUrl('/reserveren')} className="button button--purple" onClick={event => { event.preventDefault(); if (open) controller.current?.('/reserveren'); else navigate('/reserveren'); }}>{t('nav.book')}</a>
      <button ref={toggle} className={`menu-toggle${lightBackground ? ' menu-toggle--light-background' : ''}`} aria-label={t(open ? 'nav.close' : 'nav.open')} aria-expanded={open} aria-controls="main-menu" onClick={() => { if (open) controller.current?.(); else setOpen(true); }}><span/><span/><span/></button>
    </div>, document.body)}
    {open && <NavigationMenu trigger={toggle} controller={controller} onClosed={closed} />}
  </header>;
}
