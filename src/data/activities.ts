import data from './activities.json';
export type Activity = { id: string; name: string; category: string; location?: string; address?: string; description: string; imageUrl: string; driveTimeMinutes: number };
function valid(item: unknown): item is Activity {
 const row = item as Record<string, unknown>;
 return !!row && ['id','name','category','description','imageUrl'].every(key => typeof row[key] === 'string' && !!row[key]) && typeof row.driveTimeMinutes === 'number' && Number.isFinite(row.driveTimeMinutes) && row.driveTimeMinutes >= 0;
}
export const activities = data.items.filter(valid);
if (activities.length !== data.items.length) console.error('Invalid activity data omitted.');
export const categories = data.categories;
export const favoriteIds = ['cotignac','bistrot-le-ptit-bouchon','domaine-fontainebleau-en-provence'];
export const favorites = favoriteIds.flatMap(id => { const item = activities.find(a => a.id === id); if (!item) console.error(`Missing favorite: ${id}`); return item ? [item] : []; });
export const locations = [...new Set(activities.map(a => a.location?.trim()).filter((x): x is string => !!x))].sort((a,b) => a.localeCompare(b,'fr'));
export const categoryKey = (name: string) => categories.find(c => c.name === name)?.id ?? 'activiteiten';
export function formatDriveTime(minutes: number, hour = 'u', minute = 'min') { const n = Math.round(minutes); return n < 60 ? `${n} ${minute}` : `${Math.floor(n/60)}${hour}${n%60 ? ` ${n%60} ${minute}` : ''}`; }
