import { photo } from './images';
// All page-specific photographs originate in images aboutpage.zip.
export const aboutImages = Object.fromEntries(
 ['hero','story','living-before','living-after','terrace-before','terrace-after','family'].map(key => [key, {
  src: photo(`about-${key}`,key==='hero'?1920:960),
  srcSet: (key==='hero'?[960,1920]:[480,960,1440]).map(width=>`${photo(`about-${key}`,width)} ${width}w`).join(', '),
 }]),
) as Record<string,{src:string;srcSet:string}>;
