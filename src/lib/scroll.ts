import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** Lenis already smooths wheel scrolling; native touch scrolling gets a little scrub lag instead. */
export const scrubAmount = (): true | number =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches ? true : 0.5;

let activeLenis: Lenis | null = null;

export const setActiveLenis = (lenis: Lenis | null) => {
  activeLenis = lenis;
};

export const getActiveLenis = () => activeLenis;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Scrolls to a section (or offset) through Lenis when smooth scrolling is active,
 * otherwise falls back to native scrolling (instant when reduced motion is requested).
 */
export const scrollToTarget = (target: HTMLElement | string | number) => {
  const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
  if (el === null) return;

  if (activeLenis) {
    const distance = Math.abs(
      (typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY) - window.scrollY
    );
    const duration = Math.min(2.2, Math.max(0.9, distance / 2600));
    activeLenis.scrollTo(el, { duration, easing: easeOutExpo });
    return;
  }

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (typeof el === 'number') window.scrollTo({ top: el, behavior });
  else el.scrollIntoView({ behavior });
};
