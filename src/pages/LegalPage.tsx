import { activities } from '../data/activities';
import {useTranslation} from 'react-i18next';
import {siteUrl,navigate} from '../hooks/useRoute';
import operator from '../data/legalOperator.json';
import '../styles/legal.css';
export type LegalKind='legal'|'privacy'|'cookies';
export function LegalPage({kind}:{kind:LegalKind}){
 const {t,i18n}=useTranslation();
 const hosts=[...new Set(activities.map(item=>new URL(item.imageUrl).hostname))].sort();
 const sections=t(`legalPages.${kind}.sections`,{returnObjects:true}) as {title:string;body:string}[];
 return <article className="legal-page section-inset" aria-labelledby="legal-title">
  <h1 id="legal-title">{t(`legalPages.${kind}.title`)}</h1>
  <p className="legal-updated">{t('legalPages.updated',{date:new Date(operator.updated+'T12:00:00').toLocaleDateString(i18n.language,{day:'numeric',month:'long',year:'numeric'})})}</p>
  <section className="legal-contact"><h2>{t('legalPages.contact')}</h2><p>{operator.name}<br/>{operator.contact}{operator.address&&<><br/>{operator.address}</>}{operator.country&&<><br/>{t('legalPages.country')}</>}</p><a href={`mailto:${operator.email}`}>{operator.email}</a>{operator.enterpriseNumber&&<p>{t('legalPages.enterprise')}: {operator.enterpriseNumber}</p>}</section>
  {sections.map((section,index)=><section key={index}><h2>{section.title}</h2><p>{section.body}</p></section>)}
  {kind==='privacy'&&<section><h2>{t('legalPages.providerLinks')}</h2><ul><li><a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree</a> · <a href="https://formspree.io/security/" target="_blank" rel="noopener noreferrer">{t('legalPages.safeguards')}</a></li><li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Pages</a></li><li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple iCloud</a></li><li><a href="https://www.gegevensbeschermingsautoriteit.be/burger/acties/klacht-indienen" target="_blank" rel="noopener noreferrer">{t('legalPages.supervisor')}</a></li><li><a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">{t('legalPages.authorities')}</a></li></ul></section>}
  {kind==='privacy'&&<section><h2>{t('legalPages.imageHosts')}</h2><ul>{hosts.map(host=><li key={host}>{host}</li>)}</ul></section>}
  <nav className="legal-page-links" aria-label={t('footer.legal')}>{(['legal','privacy','cookies'] as const).filter(key=>key!==kind).map(key=><a key={key} href={siteUrl('/'+key)} onClick={e=>{e.preventDefault();navigate('/'+key);}}>{t(`legalPages.${key}.title`)}</a>)}</nav>
 </article>;
}
