import React from 'react';
import { Flame, ArrowRight, MapPin, Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenLocation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOpenLocation }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background with measured contrast scrim and generated cinematic photo */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/src/assets/images/hero_grilled_fish_1790838427559.jpg"
          alt="Poissons frais braisés au feu de bois avec herbes aromatiques et marinade chez Eza Zozo à Lomé"
          className="w-full h-full object-cover object-center filter brightness-60 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Clean solid scrim for high legibility without distracting gradients */}
        <div className="absolute inset-0 bg-[#0f0e0e]/80" />
        
        {/* Subtle comfortable rose ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#e11d48]/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="max-w-3xl">
          {/* Natural editorial trust marker - Zero-pill metadata */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 text-xs tracking-wider uppercase text-[#fda4af] font-semibold mb-4"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#e11d48]" />
              Poissonnerie & Grillades d'Exception
            </span>
            <span aria-hidden="true" className="text-[#59524e]">·</span>
            <span>Lomé, Togo</span>
            <span aria-hidden="true" className="text-[#59524e]">·</span>
            <span className="text-[#f5f3f0]">Mr Adanlete</span>
          </motion.div>

          {/* Headline percutant - couleur rose-rouge solide et confortable */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f5f3f0] tracking-tight leading-[1.1] mb-6 font-display text-balance"
          >
            L'Art du Poisson Grillé à Lomé — <span className="text-[#e11d48]">Savoureux, Généreux, Inimitable.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-[#c4bfb9] font-normal leading-relaxed mb-8 max-w-2xl text-balance"
          >
            Découvrez la fraîcheur d'Eza Zozo avec Mr Adanlete. Pêche du matin au port de Lomé, marinade secrète aux épices sauvages, grillade lente au feu de bois et accompagnements généreux.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
          >
            <button
              onClick={onExploreMenu}
              className="px-7 py-3.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#e11d48]/25 flex items-center justify-center gap-2 group cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#e11d48]"
            >
              <span>Voir la Carte & Commander</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenLocation}
              className="px-6 py-3.5 bg-[#1f1d1b]/80 hover:bg-[#2c2927] border border-[#3b3633] text-[#f5f3f0] font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#e11d48]" />
              <span>Emplacements & Horaires</span>
            </button>
          </motion.div>

          {/* Unboxed editorial proof strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#292625]/80 text-[#9e9791]"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#f5f3f0] font-display tabular-nums">
                100% Frais
              </div>
              <p className="text-xs text-[#8f8883] mt-0.5">Arrivage direct du port de pêche</p>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#f5f3f0] font-display tabular-nums">
                Feu de Bois
              </div>
              <p className="text-xs text-[#8f8883] mt-0.5">Marinade secrète & braise d'acacia</p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl font-bold text-[#f5f3f0] font-display tabular-nums flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-[#fda4af]" />
                <span>11h - 23h30</span>
              </div>
              <p className="text-xs text-[#8f8883] mt-0.5">7 jours sur 7 · Sur place & Livraison</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
