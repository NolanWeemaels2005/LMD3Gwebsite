import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// Mobile browser toolbars resize the visual viewport during an ordinary swipe.
ScrollTrigger.config({ ignoreMobileResize: true });
export { gsap, ScrollTrigger };
