import pool from '../assets/icons/zwembad.svg';
import bedrooms from '../assets/icons/bed.svg';
import bathrooms from '../assets/icons/Badkamer.svg';
import kitchen from '../assets/icons/keuken.svg';
import wifi from '../assets/icons/WiFi.svg';
import airco from '../assets/icons/Airco.svg';
import toilets from '../assets/icons/Toilet.svg';
import barbecue from '../assets/icons/bbq.svg';
import petanque from '../assets/icons/Petanque.svg';
import quiet from '../assets/icons/view.svg';
export const advantages = [
 {key:'pool',icon:pool}, {key:'bedrooms',icon:bedrooms}, {key:'bathrooms',icon:bathrooms},
 {key:'kitchen',icon:kitchen}, {key:'wifi',icon:wifi}, {key:'airco',icon:airco},
 {key:'toilets',icon:toilets}, {key:'barbecue',icon:barbecue}, {key:'petanque',icon:petanque}, {key:'quiet',icon:quiet},
] as const;
export const facilities = [
 {key:'pool',photo:'caroussel4'}, {key:'bathroom',photo:'caroussel7'},
 {key:'bedroom',photo:'caroussel8'}, {key:'petanque',photo:'caroussel3'}, {key:'kitchen',photo:'caroussel6'},
] as const;
export const brochureUrl = '/downloads/la-maison-des-trois-garcons-brochure.pdf';
