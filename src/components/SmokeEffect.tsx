import React, { useRef } from 'react';
import { useInView } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

interface SmokeEffectProps {
  intensity?: 'subtle' | 'medium' | 'high';
  showEmbers?: boolean;
}

/** Horizontal drift in px at the start, middle and end of a rise. */
type Drift = [number, number, number];

interface Loop {
  left: string;
  delay: number;
  duration: number;
  drift: Drift;
}

const PUFFS: Loop[] = [
  { left: '30%', delay: 0, duration: 4.2, drift: [-12, 14, -8] },
  { left: '48%', delay: 1.4, duration: 4.8, drift: [8, -16, 10] },
  { left: '65%', delay: 2.6, duration: 4.5, drift: [-10, 12, -14] },
  { left: '40%', delay: 3.2, duration: 5.0, drift: [14, -10, 6] }
];

// Glowing embers / sparks from the wood fire - soft comfortable rose/crimson
const EMBERS: (Loop & { size: string; color: string })[] = [
  { left: '38%', delay: 0.5, duration: 2.8, drift: [0, -12, 8], size: 'w-1 h-1', color: 'bg-[#fda4af]' },
  { left: '52%', delay: 1.8, duration: 3.2, drift: [0, 12, -8], size: 'w-1.5 h-1.5', color: 'bg-[#e11d48]' },
  { left: '44%', delay: 2.4, duration: 2.5, drift: [0, -12, 8], size: 'w-1 h-1', color: 'bg-[#f43f5e]' },
  { left: '60%', delay: 3.5, duration: 3.0, drift: [0, 12, -8], size: 'w-1 h-1', color: 'bg-[#fb7185]' }
];

/** Phones run only the first puffs and embers. */
const PHONE_LOOPS = 2;

const loopStyle = ({ left, delay, duration, drift: [x0, x1, x2] }: Loop) =>
  ({
    left,
    '--smoke-delay': `${delay}s`,
    '--smoke-duration': `${duration}s`,
    '--smoke-x0': `${x0}px`,
    '--smoke-x1': `${x1}px`,
    '--smoke-x2': `${x2}px`
  }) as React.CSSProperties;

export const SmokeEffect: React.FC<SmokeEffectProps> = ({
  intensity = 'medium',
  showEmbers = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // Cards off screen (below the fold or outside the menu carousel) stop animating.
  const inView = useInView(ref, { margin: '100px' });
  const reducedMotion = usePrefersReducedMotion();
  const animate = inView && !reducedMotion;
  const puffSize = intensity === 'high' ? 'w-[70px] h-[70px]' : 'w-[55px] h-[55px]';

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {/* Warm subtle ambient heat haze without harsh gradients */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[#e11d48]/10 opacity-60" />

      {/* Floating, wafting smoke plumes - pure soft natural steam/smoke */}
      {animate && PUFFS.map((puff, index) => (
        <div
          key={`smoke-puff-${index}`}
          className={`smoke-puff absolute bottom-4 rounded-full bg-[#f5f3f0]/20 blur-lg md:blur-xl opacity-0 ${puffSize} ${index >= PHONE_LOOPS ? 'max-md:hidden' : ''}`}
          style={loopStyle(puff)}
        />
      ))}

      {/* Floating fiery embers / sparks */}
      {animate && showEmbers &&
        EMBERS.map((ember, index) => (
          <div
            key={`ember-${index}`}
            className={`smoke-ember absolute bottom-6 rounded-full opacity-0 shadow-sm shadow-[#e11d48] ${ember.size} ${ember.color} ${index >= PHONE_LOOPS ? 'max-md:hidden' : ''}`}
            style={loopStyle(ember)}
          />
        ))}
    </div>
  );
};
