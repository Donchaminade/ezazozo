import React from 'react';
import { motion } from 'motion/react';

interface SmokeEffectProps {
  intensity?: 'subtle' | 'medium' | 'high';
  showEmbers?: boolean;
}

export const SmokeEffect: React.FC<SmokeEffectProps> = ({
  intensity = 'medium',
  showEmbers = true
}) => {
  // Configuration for smoke puffs
  const puffs = [
    { id: 1, left: '30%', delay: 0, duration: 4.2, xRange: [-12, 14, -8] },
    { id: 2, left: '48%', delay: 1.4, duration: 4.8, xRange: [8, -16, 10] },
    { id: 3, left: '65%', delay: 2.6, duration: 4.5, xRange: [-10, 12, -14] },
    { id: 4, left: '40%', delay: 3.2, duration: 5.0, xRange: [14, -10, 6] }
  ];

  // Configuration for glowing embers / sparks from wood fire
  const embers = [
    { id: 1, left: '38%', delay: 0.5, duration: 2.8, size: 'w-1 h-1', color: 'bg-[#ffc107]' },
    { id: 2, left: '52%', delay: 1.8, duration: 3.2, size: 'w-1.5 h-1.5', color: 'bg-[#ff5722]' },
    { id: 3, left: '44%', delay: 2.4, duration: 2.5, size: 'w-1 h-1', color: 'bg-[#ff9800]' },
    { id: 4, left: '60%', delay: 3.5, duration: 3.0, size: 'w-1 h-1', color: 'bg-[#ffd54f]' }
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {/* Warm ambient heat haze gradient at the bottom where the fish rests on the grill */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#ff5722]/15 via-[#ff9800]/5 to-transparent mix-blend-screen opacity-70" />

      {/* Floating, wafting smoke plumes */}
      {puffs.map((puff) => (
        <motion.div
          key={`smoke-puff-${puff.id}`}
          className="absolute bottom-4 rounded-full bg-gradient-to-t from-[#ff7a45]/20 via-[#f5f3f0]/25 to-transparent blur-xl"
          style={{
            left: puff.left,
            width: intensity === 'high' ? '70px' : '55px',
            height: intensity === 'high' ? '70px' : '55px'
          }}
          initial={{
            opacity: 0,
            y: 0,
            scale: 0.6,
            x: 0
          }}
          animate={{
            opacity: [0, 0.45, 0.3, 0],
            y: [-10, -90, -140],
            scale: [0.6, 1.25, 2.1],
            x: puff.xRange
          }}
          transition={{
            duration: puff.duration,
            repeat: Infinity,
            delay: puff.delay,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Floating fiery embers / sparks */}
      {showEmbers &&
        embers.map((ember) => (
          <motion.div
            key={`ember-${ember.id}`}
            className={`absolute bottom-6 rounded-full ${ember.size} ${ember.color} shadow-sm shadow-[#ff5722]`}
            style={{ left: ember.left }}
            initial={{
              opacity: 0,
              y: 0,
              scale: 0.8,
              x: 0
            }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              y: [0, -60, -110],
              x: [0, ember.id % 2 === 0 ? 12 : -12, ember.id % 2 === 0 ? -8 : 8],
              scale: [0.8, 1.2, 0.4]
            }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: 'easeOut'
            }}
          />
        ))}
    </div>
  );
};
