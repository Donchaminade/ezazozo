import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Phone, Flame, Share2 } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuickOrder?: () => void;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenShare }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#121111]/95 backdrop-blur-md border-b border-[#292625] shadow-lg'
            : 'bg-[#0f0e0e]/85 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="#"
              className="text-2xl font-bold tracking-tight text-[#f5f3f0] hover:text-[#e11d48] transition-colors font-display flex items-center gap-2"
              aria-label="Eza Zozo - Accueil"
            >
              <Flame className="w-6 h-6 text-[#e11d48]" aria-hidden="true" />
              <span>Eza Zozo</span>
            </a>

            {/* Zone 2: 4-6 clean text navigation links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#c4bfb9]" aria-label="Navigation principale">
              <a href="#concept" className="hover:text-[#e11d48] transition-colors py-1">
                Le Concept
              </a>
              <a href="#menu" className="hover:text-[#e11d48] transition-colors py-1">
                La Carte
              </a>
              <a href="#simulateur" className="hover:text-[#e11d48] transition-colors py-1">
                Composer
              </a>
              <a href="#tiktok" className="hover:text-[#e11d48] transition-colors py-1">
                Mr Adanlete
              </a>
              <a href="#communaute" className="hover:text-[#e11d48] transition-colors py-1 flex items-center gap-1">
                <span>Le Mur</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
              </a>
              <a href="#contact" className="hover:text-[#e11d48] transition-colors py-1">
                Accès & Horaires
              </a>
            </nav>

            {/* Zone 3: 1-2 primary actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/22890123456?text=Bonjour%20Eza%20Zozo%2C%20je%20souhaite%20commander%20un%20poisson%20brais%C3%A9%20%21"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#e11d48] hover:bg-[#be123c] rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>WhatsApp Direct</span>
              </a>

              <button
                onClick={onOpenShare}
                className="hidden sm:inline-flex p-2.5 rounded-lg text-[#c4bfb9] hover:text-[#f5f3f0] bg-[#1d1b1a] hover:bg-[#2a2624] border border-[#383330] transition-colors cursor-pointer"
                title="Partager le site et l'affiche officielle"
                aria-label="Partager le lien du site"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-lg text-[#f5f3f0] bg-[#1d1b1a] hover:bg-[#2a2624] border border-[#383330] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]"
                aria-label={`Voir le panier, ${cartCount} articles`}
              >
                <ShoppingBag className="w-5 h-5 text-[#fda4af]" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#e11d48] text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg text-[#f5f3f0] bg-[#1d1b1a] hover:bg-[#2a2624] border border-[#383330] transition-colors"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#0f0e0e]/95 backdrop-blur-lg pt-24 px-6 pb-8 flex flex-col justify-between">
          <nav className="flex flex-col gap-5 text-lg font-medium text-[#f5f3f0]" aria-label="Menu mobile">
            <a
              href="#concept"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#292625] hover:text-[#e11d48] transition-colors"
            >
              Le Concept Eza Zozo
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#292625] hover:text-[#e11d48] transition-colors"
            >
              La Carte & Prix
            </a>
            <a
              href="#simulateur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#292625] hover:text-[#e11d48] transition-colors"
            >
              Simulateur de Plateau
            </a>
            <a
              href="#tiktok"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#292625] hover:text-[#e11d48] transition-colors"
            >
              L’Univers Mr Adanlete (TikTok)
            </a>
            <a
              href="#communaute"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#292625] hover:text-[#e11d48] transition-colors flex items-center justify-between"
            >
              <span>Le Mur des Gourmands & Stories</span>
              <span className="text-[10px] bg-[#e11d48]/15 text-[#fda4af] px-2 py-0.5 rounded font-mono">Nouveau</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#292625] hover:text-[#e11d48] transition-colors"
            >
              Accès, Horaires & Plan
            </a>
          </nav>

          <div className="flex flex-col gap-3 pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShare?.();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1e1b1a] hover:bg-[#282523] border border-[#2e2a28] text-xs font-semibold text-[#f5f3f0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#fda4af]" />
              <span>Partager l'affiche & le lien</span>
            </button>

            <a
              href="https://wa.me/22890123456?text=Bonjour%20Eza%20Zozo%2C%20je%20souhaite%20commander%20un%20poisson%20brais%C3%A9%20%21"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Commander sur WhatsApp (+228 90 12 34 56)</span>
            </a>
            <p className="text-center text-xs text-[#8f8883]">
              Lomé, Togo · Ouvert 7j/7 de 11h à 23h30
            </p>
          </div>
        </div>
      )}
    </>
  );
};
