import {useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useRoute} from '../hooks/useRoute';
import site from '../data/site.json';
const keys:Record<string,string>={'/':'home','/over-ons':'about','/activiteiten':'activities','/pluspunten':'advantages','/reserveren':'reservation','/legal':'legal','/privacy':'privacy','/cookies':'cookies'};
export function PageMetadata(){
 const route=useRoute();const {t,i18n}=useTranslation();
 useLayoutEffect(()=>{
  const key=keys[route];const title=key?t(`seo.${key}.title`):site.name;const description=key?t(`seo.${key}.description`):'';
  const url=new URL(route==='/'?'':route.slice(1)+'/',site.url).href;const image=new URL(site.image,site.url).href;
  document.title=title;
  const meta=(name:string,content:string,property=false)=>{const attribute=property?'property':'name';let el=document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attribute,name);document.head.append(el);}el.content=content;};
  meta('description',description);meta('robots',key?'index, follow, max-image-preview:large':'noindex, follow');
  for(const [name,content] of Object.entries({'og:type':'website','og:site_name':site.name,'og:title':title,'og:description':description,'og:url':url,'og:image':image,'og:image:type':'image/jpeg','og:image:width':'1200','og:image:height':'630','og:image:alt':t('seo.imageAlt'),'og:locale':({nl:'nl_BE',fr:'fr_FR',en:'en_GB'} as Record<string,string>)[i18n.language.split('-')[0]]||'nl_BE'}))meta(name,content,true);
  for(const [name,content] of Object.entries({'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,'twitter:image':image,'twitter:image:alt':t('seo.imageAlt')}))meta(name,content);
  let canonical=document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href=url;
  let schema=document.head.querySelector<HTMLScriptElement>('#site-schema');if(!schema){schema=document.createElement('script');schema.id='site-schema';schema.type='application/ld+json';document.head.append(schema);}
  schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[
   {'@type':'WebSite','@id':site.url+'#website',url:site.url,name:site.name,inLanguage:['nl','fr','en']},
   {'@type':'LodgingBusiness','@id':site.url+'#accommodation',name:site.name,url:site.url,image,address:{'@type':'PostalAddress',addressLocality:'Carcès',addressRegion:'Provence-Alpes-Côte d’Azur',addressCountry:'FR'}},
   {'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:i18n.language,isPartOf:{'@id':site.url+'#website'},about:{'@id':site.url+'#accommodation'}},
   ...(route==='/'?[]:[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:t('nav.home'),item:site.url},{'@type':'ListItem',position:2,name:title.split(' | ')[0],item:url}]}]),
  ]}).replace(/</g,'\\u003c');
 },[route,t,i18n.language]);
 return null;
}
