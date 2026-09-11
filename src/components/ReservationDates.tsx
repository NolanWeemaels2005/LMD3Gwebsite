import { useRef, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { nl,fr,enGB } from 'react-day-picker/locale';
import { useTranslation } from 'react-i18next';
import { addCalendarDays,calendarDay,isSunday } from '../utils/reservation';
import 'react-day-picker/style.css';
export function ReservationDates({value,onChange,error}: {value:DateRange|undefined;onChange:(range:DateRange|undefined)=>void;error?:string}) {
 const {t,i18n}=useTranslation();const [open,setOpen]=useState(false);const trigger=useRef<HTMLButtonElement>(null);
 const language=i18n.language.split('-')[0];const locale=language==='fr'?fr:language==='nl'?nl:enGB;
 const dateLocale=language==='en'?'en-GB':language==='fr'?'fr-FR':'nl-BE';
 const display=(date:Date)=>date.toLocaleDateString(dateLocale,language==='en'?{day:'numeric',month:'short',year:'numeric'}:{day:'2-digit',month:'2-digit',year:'numeric'});
 const minimum=value?.from&&!value.to?addCalendarDays(value.from,7):new Date();
 const close=()=>{setOpen(false);trigger.current?.focus({preventScroll:true});};
 return <div className="reservation-dates" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();close();}}}>
  <label htmlFor="reservation-dates">{t('reservation.date')}</label>
  <button ref={trigger} id="reservation-dates" className="date-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="reservation-calendar" aria-invalid={!!error} aria-describedby={error?'dates-error':undefined} onClick={()=>setOpen(!open)}>{value?.from?`${display(value.from)} — ${value.to?display(value.to):t('reservation.departure')}`:t('reservation.datePlaceholder')}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 11h18"/></svg></button>
  {error&&<p id="dates-error" className="field-error">{error}</p>}
  {open&&<div className="reservation-calendar" id="reservation-calendar" role="dialog" aria-label={t('reservation.calendar')}><p className="calendar-help" aria-live="polite">{value?.from&&!value.to?t('reservation.minimumDeparture',{date:display(minimum)}):t('reservation.chooseArrival')}</p>
   <DayPicker mode="range" selected={value} locale={locale} autoFocus startMonth={new Date()} defaultMonth={value?.from} disabled={date=>!isSunday(date)||calendarDay(date)<calendarDay(minimum)} onDayClick={(date,modifiers)=>{if(modifiers.disabled)return;if(!value?.from||value.to)onChange({from:date,to:undefined});else {onChange({from:value.from,to:date});close();}}} labels={{labelNext:()=>t('reservation.nextMonth'),labelPrevious:()=>t('reservation.previousMonth'),labelNav:()=>t('reservation.calendarNavigation'),labelDayButton:date=>date.toLocaleDateString(dateLocale,{weekday:'long',year:'numeric',month:'long',day:'numeric'})}}/>
   <div className="calendar-actions"><button type="button" onClick={()=>onChange(undefined)}>{t('reservation.clearDates')}</button><button type="button" onClick={close}>{t('reservation.closeCalendar')}</button></div>
  </div>}
 </div>;
}
