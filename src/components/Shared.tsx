import type { AnchorHTMLAttributes } from 'react';
import { navigate } from '../hooks/useRoute';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo/LogoLMD3G.svg?no-inline';
import reli from '../assets/logo/ReliIcon.svg?no-inline';
import instagram from '../assets/icons/instagram.svg?no-inline';
import facebook from '../assets/icons/facebook.svg?no-inline';

export function PlaceholderLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} href="#" onClick={event => event.preventDefault()}>{children}</a>;
}
export function BookingButton() {
  const { t } = useTranslation();
  return <a href="/reserveren" className="button button--purple" onClick={event => { event.preventDefault(); navigate('/reserveren'); }}>{t('nav.book')}</a>;
}
export function Logo() {
  const { t } = useTranslation();
  return <a className="logo" href="/" aria-label={t('nav.home')}><img src={logo} alt={t('brand')} width="1746.42" height="790.69" /></a>;
}
export function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={direction === 'left' ? 'M19 12H5m7-7-7 7 7 7' : 'M5 12h14m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export const socialPlatforms = ['instagram', 'facebook', 'reli'] as const;
type SocialPlatform = (typeof socialPlatforms)[number];
const socialIcons: Record<SocialPlatform, string> = { instagram, facebook, reli };
export function SocialIcon({ name }: { name: SocialPlatform }) {
  return <img className={`social-icon social-icon--${name}`} src={socialIcons[name]} width="24" height="24" alt="" aria-hidden="true" />;
}
