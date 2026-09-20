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
    let measuring = true;
    let midpoint = 0;
    let sections: { top: number; bottom: number; light: boolean }[] = [];
    const measure = () => {
      if (!toggle.current) return;
      const button = toggle.current.getBoundingClientRect();
      midpoint = button.top + button.height / 2;
      sections = Array.from(document.querySelectorAll('main > section, footer')).map(element => {
        const rect = element.getBoundingClientRect();
        let light = false;
        if (!element.classList.contains('hero')) {
          let surface: Element | null = element;
          while (surface) {
            const color = getComputedStyle(surface).backgroundColor.match(/[\d.]+/g)?.map(Number);
            if (color && (color.length < 4 || color[3] > .9)) {
              light = color.slice(0, 3).every(channel => channel > 220);
              break;
            }
            surface = surface.parentElement;
          }
        }
        return { top: rect.top + scrollY, bottom: rect.bottom + scrollY, light };
      });
    };
    const update = () => {
      frame = 0;
      if (measuring) { measure(); measuring = false; }
      const position = scrollY + midpoint;
      setLightBackground(sections.find(section => position >= section.top && position < section.bottom)?.light ?? true);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { measuring = true; schedule(); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    const observer = new ResizeObserver(resize);
    observer.observe(document.getElementById('root')!);
    document.querySelectorAll('main > section, footer').forEach(element => observer.observe(element));
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', resize); };
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
