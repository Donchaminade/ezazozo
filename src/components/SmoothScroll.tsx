import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, scrollToTarget, setActiveLenis } from '../lib/scroll';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * Inertial wheel scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger scrubs stay in sync.
 * Touch keeps native momentum scrolling; nothing is mounted when reduced motion is requested.
 */
export const SmoothScroll = () => {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    setActiveLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Lenis' own `anchors` option does not cancel the native jump, so in-page links are handled here.
    const onAnchorClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;

      const hash = link.getAttribute('href') ?? '#';
      if (hash === '#') {
        event.preventDefault();
        scrollToTarget(0);
        history.pushState(null, '', window.location.pathname + window.location.search);
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      history.pushState(null, '', hash);

      if (link.matches('[data-skip-link]')) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener('click', onAnchorClick, true);

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener('click', onAnchorClick, true);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setActiveLenis(null);
    };
  }, [reducedMotion]);

  return null;
};
