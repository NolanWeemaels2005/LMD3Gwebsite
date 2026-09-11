import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Activity, categoryKey, favoriteIds, formatDriveTime } from '../data/activities';
function Icon({ type }: { type: 'clock' | 'pin' | 'map' | 'heart' }) {
 return <svg viewBox="0 0 24 24" fill={type === 'heart' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'clock' ? <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 4"/></> : type === 'pin' ? <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></> : type === 'map' ? <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16"/> : <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>}</svg>;
}
export function ActivityCard({ activity }: { activity: Activity }) {
 const { t } = useTranslation(); const [failed,setFailed] = useState(false); const address = activity.address?.trim();
 return <article className="activity-card" data-activity-id={activity.id}><div className="activity-image">{failed ? <span className="activity-image-fallback">{t('activities.imageUnavailable')}</span> : <img src={activity.imageUrl} alt={activity.name} width="800" height="416" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)}/>}
 <span className="activity-category">{t(`activities.labels.${categoryKey(activity.category)}`)}</span>{favoriteIds.includes(activity.id) && <span className="activity-favorite"><Icon type="heart"/>{t('activities.favorite')}</span>}</div>
 <div className="activity-body"><h3>{activity.name}</h3><p className="activity-time"><Icon type="clock"/>{formatDriveTime(activity.driveTimeMinutes,t('activities.hour'),t('activities.minute'))}</p>{address && <p className="activity-address"><Icon type="pin"/><span>{address}</span></p>}<p className="activity-description">{activity.description}</p>{address && <a className="activity-route" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" aria-label={`${t('activities.route')}: ${activity.name}`}>{t('activities.route')}<Icon type="map"/></a>}</div></article>;
}
