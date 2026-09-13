import { useRef, useState, type PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
type Picture = {src:string;srcSet:string};
type Props = {beforeImage:Picture;afterImage:Picture;label:string;beforeAlt:string;afterAlt:string};
export function BeforeAfterSlider({beforeImage,afterImage,label,beforeAlt,afterAlt}:Props) {
 const {t}=useTranslation();const [position,setPosition]=useState(50);const frame=useRef<HTMLDivElement>(null);
 const update=(event:PointerEvent<HTMLDivElement>)=>{const bounds=frame.current!.getBoundingClientRect();setPosition(Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100)));};
 return <div className="comparison" ref={frame}>
  <img src={afterImage.src} srcSet={afterImage.srcSet} sizes="(max-width: 767px) 90vw, 45vw" alt={afterAlt} loading="lazy" width="1440" height="1080"/>
  <img className="comparison-before" src={beforeImage.src} srcSet={beforeImage.srcSet} sizes="(max-width: 767px) 90vw, 45vw" alt={beforeAlt} loading="lazy" width="1440" height="1080" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}/>
  <span className="comparison-label">{label}</span>
  <div className="comparison-control" role="slider" tabIndex={0} aria-label={t('about.compare.label',{label})} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} aria-valuetext={t('about.compare.value',{value:Math.round(position)})} aria-orientation="horizontal"
   onPointerDown={e=>{if(e.button!==0)return;e.currentTarget.focus({preventScroll:true});e.currentTarget.setPointerCapture(e.pointerId);update(e);}}
   onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))update(e);}}
   onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}
   onKeyDown={e=>{const changes:Record<string,number>={ArrowLeft:position-2,ArrowRight:position+2,Home:0,End:100};if(e.key in changes){e.preventDefault();setPosition(Math.max(0,Math.min(100,changes[e.key])));}}}>
   <span className="comparison-divider" style={{left:`${position}%`}}><span className="comparison-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 7-5 5 5 5m6-10 5 5-5 5"/></svg></span></span>
  </div>
 </div>;
}
