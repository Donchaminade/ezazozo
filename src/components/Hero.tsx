import React from 'react';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { MENU_ITEMS } from '../data/restaurantData';
import { BraiseHero } from './braise/BraiseHero';
import { braiseImage } from './braise/braiseConfig';
import { HeroOrderButton, HeroTitle } from './braise/HeroCopy';
import { EnableMotionButton } from './MotionPreference';

interface HeroProps {
  onOrderSignature: () => void;
}

const SIGNATURE_DISH = MENU_ITEMS.find((item) => item.id === 'dorade-royale') ?? MENU_ITEMS[0];
const DESKTOP_MEDIA = '(min-width: 768px)';

export const Hero: React.FC<HeroProps> = ({ onOrderSignature }) => {
  const reducedMotion = usePrefersReducedMotion();

  if (!reducedMotion) {
    return <BraiseHero signature={SIGNATURE_DISH} onOrderSignature={onOrderSignature} />;
  }

  // Reduced motion: the last frame of the film as a still poster, plus a way to opt in to the film. On phones the
  // bottom padding keeps it all clear of the floating buttons, and the plate shrinks on short screens to stay above the fold.
  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0b0807] px-4 pt-20 pb-32 md:pb-20 lg:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_100%,rgba(225,29,72,0.20),transparent_60%),radial-gradient(60%_50%_at_50%_85%,rgba(255,110,30,0.22),transparent_70%)]" />
        <picture className="absolute left-1/2 -translate-x-1/2 bottom-[-4%] md:bottom-[-14%] w-[230vw] md:w-[max(112vw,150svh)]">
          <source media={DESKTOP_MEDIA} srcSet={braiseImage('coals', false)} />
          <img src={braiseImage('coals', true)} alt="" decoding="async" className="block w-full max-w-none braise-coals select-none" />
        </picture>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(255,120,30,0.45),transparent_70%)]" />
      </div>

      <HeroTitle />

      <picture className="relative">
        <source media={DESKTOP_MEDIA} srcSet={braiseImage('final-plate', false)} />
        <img
          src={braiseImage('final-plate', true)}
          alt={`${SIGNATURE_DISH.name}, servie avec alloco, oignons, piment frais et citron vert`}
          width={918}
          height={607}
          decoding="async"
          className="block h-auto w-[clamp(52vw,calc((100svh-33rem)*918/607),88vw)] md:w-[min(640px,max(46vw,min(72vw,48svh)),calc(35svh*918/607))] select-none"
        />
      </picture>

      <div className="relative mt-6 md:mt-8">
        <HeroOrderButton dishName={SIGNATURE_DISH.name} onClick={onOrderSignature} />
      </div>
      <div className="relative mt-3 md:absolute md:inset-x-0 md:bottom-4 md:mt-0">
        <EnableMotionButton />
      </div>
    </section>
  );
};
