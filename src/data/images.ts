const assets = import.meta.glob<string>('../assets/images/*.webp', { eager: true, query: '?url', import: 'default' });
export const photo = (name: string, width = 960) => assets[`../assets/images/${name}-${width}.webp`];
export const photoSet = (name: string) => `${photo(name, 480)} 480w, ${photo(name)} 960w`;
// Explicit allowlist: this gallery must never pick up other photographs.
export const galleryPhotos = [
  'caroussel0', 'caroussel1', 'caroussel2', 'caroussel3',
  'caroussel4', 'caroussel5', 'caroussel6',
  'caroussel8', 'caroussel9', 'caroussel10', 'caroussel11',
  'caroussel12', 'caroussel13',
];
export const fanPhotos = ['bottomp1', 'bottomp2', 'bottomp6', 'bottomp5', 'bottomp4', 'bottomp3', 'bottomp7'];

// Fixed layers preserve the existing centre-first order, including right-side
// precedence at formerly equal depths. Hover must never alter these values.
export const fanLayers = [1, 3, 5, 7, 6, 4, 2] as const;
