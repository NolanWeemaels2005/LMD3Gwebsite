import { siteUrl } from '../hooks/useRoute';
import { useRef,useState,type FormEvent } from 'react';
import { useForm,ValidationError } from '@formspree/react';
import { SubmissionError } from '@formspree/core';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { ReservationDates } from './ReservationDates';
import { contactType,validStay,stayLength,isoDate } from '../utils/reservation';
export function ReservationForm() {
 const {t}=useTranslation();const [state,submit,reset]=useForm('mqpkjgdv');const [name,setName]=useState('');const [contact,setContact]=useState('');const [message,setMessage]=useState('');const [range,setRange]=useState<DateRange>();const [attempted,setAttempted]=useState(false);const [failed,setFailed]=useState(false);const sending=useRef(false);const form=useRef<HTMLFormElement>(null);
 const errors={name:name.trim().length<2?t('reservation.nameError'):'',contact:!contactType(contact)?t('reservation.contactError'):'',dates:!validStay(range?.from,range?.to)?t('reservation.dateError'):''};
 const send=async(event:FormEvent)=>{event.preventDefault();if(sending.current)return;setAttempted(true);if(Object.values(errors).some(Boolean)){requestAnimationFrame(()=>form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return;}sending.current=true;setFailed(false);const type=contactType(contact)!;
 try {await submit({name:name.trim(),contact,contact_type:type,[type]:contact.trim(),arrival_date:isoDate(range!.from!),departure_date:isoDate(range!.to!),stay_length_days:stayLength(range!.from!,range!.to!),message:message.trim()});}catch {setFailed(true);reset();}finally {sending.current=false;}};
 const friendlyErrors=state.errors?new SubmissionError({message:t('reservation.submitError')}):null;
 return <section className="reservation-section section-inset" aria-labelledby="reservation-title"><h2 id="reservation-title">{t('reservation.title')}</h2><p className="reservation-intro">{t('reservation.intro')}</p>
 {state.succeeded?<div className="reservation-success" role="status"><h3>{t('reservation.successTitle')}</h3><p>{t('reservation.successBody')}</p><button className="button button--purple" onClick={()=>{reset();setName('');setContact('');setMessage('');setRange(undefined);setAttempted(false);}}>{t('reservation.newRequest')}</button></div>:
 <form ref={form} className="reservation-form" noValidate onSubmit={send}>
  <div className="reservation-field"><label htmlFor="reservation-name">{t('reservation.name')}</label><input id="reservation-name" name="name" autoComplete="name" required minLength={2} value={name} onChange={e=>setName(e.target.value)} aria-invalid={attempted&&!!errors.name} aria-describedby={attempted&&errors.name?'name-error':undefined}/>{attempted&&errors.name&&<p className="field-error" id="name-error">{errors.name}</p>}</div>
  <div className="reservation-field"><label htmlFor="reservation-contact">{t('reservation.contact')}</label><input id="reservation-contact" name="contact" type="text" autoComplete="email" required value={contact} onChange={e=>setContact(e.target.value)} aria-invalid={attempted&&!!errors.contact} aria-describedby={attempted&&errors.contact?'contact-error':undefined}/>{attempted&&errors.contact&&<p className="field-error" id="contact-error">{errors.contact}</p>}</div>
  <ReservationDates value={range} onChange={setRange} error={attempted?errors.dates:undefined}/>
  <div className="reservation-field"><label htmlFor="reservation-message">{t('reservation.message')}</label><textarea id="reservation-message" name="message" value={message} onChange={e=>setMessage(e.target.value)}/></div>
  <div aria-live="polite" className="field-error"><ValidationError errors={friendlyErrors} prefix=""/>{failed&&<p>{t('reservation.submitError')}</p>}</div>
  <p className="reservation-privacy">{t('legalPages.notice')} <a href={siteUrl('/privacy')} target="_blank" rel="noopener noreferrer">{t('legalPages.privacyLink')}</a></p>
  <button className="button button--purple reservation-submit" type="submit" disabled={state.submitting}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="m21 3-6 18-4-8-8-4Zm0 0L11 13"/></svg>{t(state.submitting?'reservation.sending':'reservation.send')}</button>
 </form>}
 </section>;
}
