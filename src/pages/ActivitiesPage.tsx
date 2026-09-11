import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { activities, categories, favorites, locations } from '../data/activities';
import { ActivityCard } from '../components/ActivityCard';
import { Hero } from '../components/HeroSection';
import { BookingCTASection } from '../components/BookingCTASection';
import { photo } from '../data/images';
import { siteUrl, navigate } from '../hooks/useRoute';
import '../styles/activities.css';
export function ActivitiesPage() {
 const { t } = useTranslation(); const [category,setCategory] = useState(''); const [location,setLocation] = useState('');
 const batch = window.matchMedia('(max-width: 767px)').matches ? 6 : 9; const [visible,setVisible] = useState(batch);
 const filtered = useMemo(() => activities.filter(a => (!category || a.category === category) && (!location || a.location?.trim() === location)),[category,location]);
 const reset = () => {setCategory('');setLocation('');setVisible(batch);};
 return <><Hero image={photo('activiteiten-hero',1920)} srcSet={`${photo('activiteiten-hero',960)} 960w, ${photo('activiteiten-hero',1920)} 1920w, ${photo('activiteiten-hero',2560)} 2560w`} title={t('activities.heroTitle')} body={t('activities.heroBody')} alt={t('activities.heroAlt')} className="activities-hero">{[['/reserveren','nav.book','purple'],['/pluspunten','nav.benefits','green']].map(([path,key,color]) => <a key={path} className={`button button--${color}`} href={siteUrl(path)} onClick={e => {e.preventDefault();navigate(path);}}>{t(key)}</a>)}</Hero>
 <section className="activity-section favorites-section section-inset" aria-labelledby="favorites-title"><h2 id="favorites-title">{t('activities.favoritesTitle')}</h2><p className="activity-intro">{t('activities.favoritesBody')}</p><div className="activity-grid">{favorites.map(a => <ActivityCard key={a.id} activity={a}/>)}</div></section>
 <section className="activity-section all-activities section-inset" aria-labelledby="activities-title"><h2 id="activities-title">{t('activities.allTitle')}</h2><p className="activity-intro">{t('activities.allBody')}</p><div className="activity-filters"><div className="category-filters" role="group" aria-label={t('activities.category')}><button aria-pressed={!category} onClick={() => {setCategory('');setVisible(batch);}}>{t('activities.all')}</button>{categories.map(c => <button key={c.id} aria-pressed={category === c.name} onClick={() => {setCategory(c.name);setVisible(batch);}}>{t(`activities.categories.${c.id}`)}</button>)}</div><select aria-label={t('activities.location')} value={location} onChange={e => {setLocation(e.target.value);setVisible(batch);}}><option value="">{t('activities.allLocations')}</option>{locations.map(town => <option key={town}>{town}</option>)}</select></div><div className="activity-grid" aria-live="polite">{filtered.slice(0,visible).map(a => <ActivityCard key={a.id} activity={a}/>)}</div>{!filtered.length && <div className="activity-empty"><p>{t('activities.empty')}</p><button className="button button--purple" onClick={reset}>{t('activities.reset')}</button></div>}{visible < filtered.length && <button className="button button--purple activity-more" onClick={() => setVisible(n => n+batch)}>{t('activities.more')}</button>}</section><BookingCTASection/></>;
}
