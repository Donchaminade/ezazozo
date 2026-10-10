import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };

/** Lenis already smooths wheel scrolling; native touch scrolling gets a little scrub lag instead. */
export const scrubAmount = (): true | number =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches ? true : 0.5;

type ScrollTarget = HTMLElement | string | number;

let activeLenis: Lenis | null = null;
let lockCount = 0;
let pendingTarget: ScrollTarget | null = null;

export const setActiveLenis = (lenis: Lenis | null) => {
  activeLenis = lenis;
  if (lenis && lockCount > 0) lenis.stop();
};

export const getActiveLenis = () => activeLenis;

/**
 * Freezes the page behind an overlay and returns the release function. Locks nest; the last release
 * restores scrolling, then performs the latest `scrollToTarget` asked for meanwhile (an in-page link
 * inside a drawer is handled before the drawer closes).
 */
export const lockScroll = () => {
  if (lockCount++ === 0) {
    document.documentElement.classList.add('scroll-locked');
    activeLenis?.stop();
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--lockCount > 0) return;
    document.documentElement.classList.remove('scroll-locked');
    activeLenis?.start();
    if (pendingTarget !== null) {
      const target = pendingTarget;
      pendingTarget = null;
      scrollToTarget(target);
    }
  };
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Scrolls to a section (or offset) through Lenis when smooth scrolling is active,
 * otherwise falls back to native scrolling (instant when reduced motion is requested).
 */
export const scrollToTarget = (target: ScrollTarget) => {
  if (lockCount > 0) {
    pendingTarget = target;
    return;
  }
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
