import React from 'react';
import { Flame, Phone, MapPin, Clock, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0a0a] text-[#a8a19b] border-t border-[#211e1c] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#211e1c]">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-[#f5f3f0] font-display">
              <Flame className="w-5 h-5 text-[#ff5722]" />
              <span>Eza Zozo</span>
            </div>
            <p className="text-xs leading-relaxed text-[#8f8883]">
              L'adresse référence du poisson frais braisé au feu de bois à Lomé. Une expérience culinaire authentique portée par Mr Adanlete et son équipe d'artisans.
            </p>
            <div className="text-xs text-[#ffc107]">
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
                <a href="#concept" className="hover:text-[#ff5722] transition-colors">
                  Le Concept & Les 3 Piliers
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#ff5722] transition-colors">
                  La Carte & Les Poissons Braisés
                </a>
              </li>
              <li>
                <a href="#simulateur" className="hover:text-[#ff5722] transition-colors">
                  Simulateur de Plateau
                </a>
              </li>
              <li>
                <a href="#tiktok" className="hover:text-[#ff5722] transition-colors">
                  L'Esprit TikTok & Avis
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#ff5722] transition-colors">
                  Réservation & Localisation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Hours & Zones */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f5f3f0]">
              Horaires & Service
            </h4>
            <div className="text-xs space-y-2 text-[#8f8883]">
              <p className="flex items-center gap-2 text-[#c4bfb9]">
                <Clock className="w-4 h-4 text-[#ffc107]" />
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
                  className="hover:text-[#ff5722] transition-colors font-mono"
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
                className="px-3 py-1.5 rounded-lg bg-[#181615] border border-[#2b2725] text-xs text-[#f5f3f0] hover:text-[#ff5722] hover:border-[#ff5722] transition-colors"
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
            <Heart className="w-3.5 h-3.5 text-[#ff5722] fill-current" />
            <span>par Mr Adanlete & son équipe</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
