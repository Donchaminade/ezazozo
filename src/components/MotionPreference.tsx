import React, { useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { setPrefersReducedMotion } from '../lib/motion';
import { usePrefersReducedMotion, useSystemPrefersReducedMotion } from '../hooks/useMediaQuery';

/** motion/react follows the same effective preference as GSAP, Lenis and the CSS variants. */
export const MotionPreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reducedMotion = usePrefersReducedMotion();
  return <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>{children}</MotionConfig>;
};

/** Shown on the still hero: tells why nothing moves and lets the visitor opt in. */
export const EnableMotionButton: React.FC = () => {
  const systemReduced = useSystemPrefersReducedMotion();
  const enable = () => {
    setPrefersReducedMotion(false);
    // The scroll film starts from its first frame.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <button
        type="button"
        onClick={enable}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3eadb]/75 transition-colors hover:text-[#f3eadb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fda4af] cursor-pointer"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#fda4af]" aria-hidden="true" />
        Activer les animations
      </button>
      <p className="text-[11px] leading-snug text-[#a8a19b]">
        {systemReduced ? 'Votre appareil demande de réduire les animations.' : 'Vous avez réduit les animations.'}
      </p>
    </div>
  );
};

/** Footer switch. The hero changes height with the preference, so the switch is kept where it was on screen. */
export const MotionSwitch: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const before = ref.current?.getBoundingClientRect().top ?? 0;
    setPrefersReducedMotion(!reducedMotion);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const delta = el.getBoundingClientRect().top - before;
      if (Math.abs(delta) > 1) window.scrollBy(0, delta);
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={!reducedMotion}
      onClick={toggle}
      className="group inline-flex min-h-11 items-center gap-3 text-xs text-[#a8a19b] transition-colors hover:text-[#f5f3f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] rounded-lg cursor-pointer"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors ${
          reducedMotion ? 'border-[#383330] bg-[#211e1c]' : 'border-[#e11d48] bg-[#e11d48]'
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${reducedMotion ? 'translate-x-1' : 'translate-x-5'}`}
        />
      </span>
      <span>
        Animations<span aria-hidden="true"> {reducedMotion ? 'réduites' : 'activées'}</span>
      </span>
    </button>
  );
};
