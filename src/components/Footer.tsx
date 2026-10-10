import React, { useRef } from 'react';
import { Flame, Phone, MapPin, Clock, Heart, Share2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { gsap, ScrollTrigger, useGSAP } from '../lib/scroll';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

interface FooterProps {
  onOpenShare?: () => void;
}

const WORDMARK = Array.from('Eza Zozo');

export const Footer: React.FC<FooterProps> = ({ onOpenShare }) => {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // The wordmark rises out of the coals when the end of the page comes into view.
  useGSAP(
    () => {
      if (reducedMotion) return;
      const rise = gsap
        .timeline({ paused: true })
        .fromTo(
          '[data-letter]',
          { yPercent: 115, rotation: (i: number) => (i % 2 ? 7 : -7) },
          { yPercent: 0, rotation: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }
        )
        .fromTo('[data-wordmark-glow]', { autoAlpha: 0, scaleX: 0.5 }, { autoAlpha: 1, scaleX: 1, duration: 1.6, ease: 'power2.out' }, 0);

      ScrollTrigger.create({
        trigger: wordmarkRef.current,
        start: 'top 96%',
        onEnter: () => rise.play(),
        onLeaveBack: () => rise.reverse(),
      });
    },
    { scope: wordmarkRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <footer className="bg-[#0b0a0a] text-[#a8a19b] border-t border-[#211e1c] pt-16 pb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#211e1c]">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-[#f5f3f0] font-display">
              <Flame className="w-5 h-5 text-[#e11d48]" />
              <span>Eza Zozo</span>
            </div>
            <p className="text-xs leading-relaxed text-[#8f8883]">
              L'adresse référence du poisson frais braisé au feu de bois à Lomé. Une expérience culinaire authentique portée par Mr Adanlete et son équipe d'artisans.
            </p>
            <div className="text-xs text-[#fda4af]">
              Pêche du jour · Marinade secrète · Allocodrome
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f5f3f0]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#concept" className="hover:text-[#e11d48] transition-colors">
                  Le Concept & Les 3 Piliers
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#e11d48] transition-colors">
                  La Carte & Les Poissons Braisés
                </a>
              </li>
              <li>
                <a href="#simulateur" className="hover:text-[#e11d48] transition-colors">
                  Simulateur de Plateau
                </a>
              </li>
              <li>
                <a href="#tiktok" className="hover:text-[#e11d48] transition-colors">
                  L'Esprit TikTok & Avis
                </a>
              </li>
              <li>
                <a href="#communaute" className="hover:text-[#e11d48] transition-colors">
                  Le Mur des Gourmands
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#e11d48] transition-colors">
                  Réservation & Localisation
                </a>
              </li>
              {onOpenShare && (
                <li>
                  <button
                    onClick={onOpenShare}
                    className="hover:text-[#fda4af] text-[#e11d48] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Partager le site (Affiche)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Practical Hours & Zones */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f5f3f0]">
              Horaires & Service
            </h4>
            <div className="text-xs space-y-2 text-[#8f8883]">
              <p className="flex items-center gap-2 text-[#c4bfb9]">
                <Clock className="w-4 h-4 text-[#fda4af]" />
                <span>Tous les jours : 11h00 - 23h30</span>
              </p>
              <p>Service continu midi et soir</p>
              <p className="pt-2 text-[#a8a19b]">
                Livraison express dans tout Lomé : Bè, Tokoin, Hedzranawoé, Agoè, Adidogomé.
              </p>
            </div>
          </div>

          {/* Col 4: Contacts & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f5f3f0]">
              Nous Rejoindre
            </h4>
            <div className="space-y-2 text-xs text-[#8f8883]">
              <p className="text-[#c4bfb9]">{RESTAURANT_INFO.address}</p>
              <p>
                <a
                  href={`tel:${RESTAURANT_INFO.whatsappNumber}`}
                  className="hover:text-[#25d366] transition-colors font-mono"
                >
                  WhatsApp : {RESTAURANT_INFO.whatsappDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${RESTAURANT_INFO.phoneSecondary}`}
                  className="hover:text-[#e11d48] transition-colors font-mono"
                >
                  Appel direct : {RESTAURANT_INFO.phoneSecondary}
                </a>
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={RESTAURANT_INFO.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#181615] border border-[#2b2725] text-xs text-[#f5f3f0] hover:text-[#e11d48] hover:border-[#e11d48] transition-colors"
              >
                TikTok ({RESTAURANT_INFO.tiktokHandle})
              </a>
              <a
                href={`https://wa.me/22890123456`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#25d366]/10 border border-[#25d366]/30 text-xs text-[#25d366] hover:bg-[#25d366]/20 transition-colors"
              >
                WhatsApp Direct
              </a>
            </div>
          </div>
        </div>

        {/* Quiet copyright strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8f8883] gap-4">
          <p>© {new Date().getFullYear()} Eza Zozo Poissonnerie & Grillade. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5 text-[#a8a19b]">
            <span>Fait avec passion à Lomé, Togo</span>
            <Heart className="w-3.5 h-3.5 text-[#e11d48] fill-current" />
            <span>par Mr Adanlete & son équipe</span>
          </p>
        </div>
      </div>

      <div ref={wordmarkRef} aria-hidden="true" className="relative mt-12 select-none pointer-events-none">
        <div
          data-wordmark-glow
          className="absolute inset-x-[10%] bottom-0 h-2/3 rounded-[50%] bg-[radial-gradient(closest-side,rgba(225,29,72,0.32),rgba(255,110,30,0.10)_60%,transparent)] blur-2xl"
        />
        <div className="relative flex justify-center overflow-hidden px-4 font-display font-extrabold uppercase leading-[0.8] tracking-[-0.05em] text-[10.4vw]">
          {WORDMARK.map((letter, i) => (
            <span key={i} data-letter className="footer-wordmark-letter inline-block pb-[0.04em]">
              {letter === ' ' ? '\u00a0' : letter}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};
