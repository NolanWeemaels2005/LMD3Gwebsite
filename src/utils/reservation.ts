export function contactType(value: string): 'email' | 'phone' | null {
 const trimmed=value.trim();
 if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'email';
 if (!/^\+?[\d\s()./\-]+$/.test(trimmed)) return null;
 const digits=trimmed.replace(/\D/g,'');
 return digits.length>=8 && digits.length<=15 ? 'phone' : null;
}
export function calendarDay(date: Date) { return Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000; }
export const stayLength = (from: Date,to: Date) => calendarDay(to)-calendarDay(from);
export function addCalendarDays(date: Date,days: number) { return new Date(date.getFullYear(),date.getMonth(),date.getDate()+days); }
export const isSunday = (date: Date) => date.getDay() === 0;
export function validStay(from?: Date,to?: Date) { return !!from && !!to && isSunday(from) && isSunday(to) && calendarDay(from)>=calendarDay(new Date()) && stayLength(from,to)>=7; }
export function isoDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
