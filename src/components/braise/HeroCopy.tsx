import React from 'react';
import { ShoppingBag } from 'lucide-react';

/** The hero's only copy: the brand and one headline, shared by the scroll film and its static version. */
export const HeroTitle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <h1 data-b="title-a" className={`text-center ${className}`}>
    <span
      className="block mb-4 md:mb-5 font-sans text-[11px] md:text-xs font-semibold uppercase tracking-[0.5em] text-[#fda4af] motion-safe:braise-rise [--rise-delay:200ms]"
    >
      Eza Zozo
    </span>
    <span className="sr-only">, </span>
    {/* All caps, so nothing hangs below the baseline: the bottom margin trims that empty space for what follows. */}
    <span
      data-b="title-a-inner"
      className="block -mb-[0.1em] font-display font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-[#f3eadb] text-[15vw] short-phone:text-[12vw] md:text-[min(12vw,16svh)] braise-title-glow"
    >
      <span className="block motion-safe:braise-rise [--rise-delay:300ms]">
        Né <br className="short-phone:hidden md:hidden" />
        dans
      </span>{' '}
      <span className="block motion-safe:braise-rise [--rise-delay:420ms]">
        le feu
      </span>
    </span>
  </h1>
);

interface HeroOrderButtonProps {
  dishName: string;
  onClick: () => void;
}

export const HeroOrderButton: React.FC<HeroOrderButtonProps> = ({ dishName, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group inline-flex items-center gap-2.5 rounded-full border border-[#f3eadb]/25 bg-[#0b0807]/60 py-3 pl-4 pr-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#f3eadb] backdrop-blur-md transition-colors duration-300 hover:border-[#e11d48] hover:bg-[#e11d48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fda4af] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0807] cursor-pointer"
  >
    <ShoppingBag className="h-4 w-4 text-[#fda4af] transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
    <span>Commandez</span>
    <span className="sr-only"> : {dishName}</span>
  </button>
);
