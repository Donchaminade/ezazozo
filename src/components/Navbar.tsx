import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Phone, Flame, Share2 } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useOverlay } from '../hooks/useOverlay';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuickOrder?: () => void;
  onOpenShare?: () => void;
}

const WHATSAPP_URL =
  'https://wa.me/22890123456?text=Bonjour%20Eza%20Zozo%2C%20je%20souhaite%20commander%20un%20poisson%20brais%C3%A9%20%21';

const NAV_LINKS = [
  { href: '#concept', label: 'Le Concept', mobileLabel: 'Le Concept Eza Zozo' },
  { href: '#menu', label: 'La Carte', mobileLabel: 'La Carte & Prix' },
  { href: '#simulateur', label: 'Composer', mobileLabel: 'Simulateur de Plateau' },
  { href: '#tiktok', label: 'Mr Adanlete', mobileLabel: 'L’Univers Mr Adanlete (TikTok)' },
  { href: '#communaute', label: 'Le Mur', mobileLabel: 'Le Mur des Gourmands & Stories', isNew: true },
  { href: '#contact', label: 'Accès & Horaires', mobileLabel: 'Accès, Horaires & Plan' },
];

const iconButton =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#383330] bg-[#1d1b1a] transition-colors hover:bg-[#2a2624] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] cursor-pointer';

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenShare }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const closeMenu = () => setMobileMenuOpen(false);
  useOverlay(mobileMenuOpen, closeMenu);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The drawer only exists below lg: widening the window must not leave the page locked behind it.
  useEffect(() => {
    if (isDesktop) setMobileMenuOpen(false);
  }, [isDesktop]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#121111]/95 backdrop-blur-md border-b border-[#292625] shadow-lg'
            : 'bg-[#0f0e0e]/85 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-16 lg:h-20">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="#"
              onClick={closeMenu}
              className="flex min-h-11 shrink-0 items-center gap-2 text-2xl font-bold tracking-tight text-[#f5f3f0] hover:text-[#e11d48] transition-colors font-display"
              aria-label="Eza Zozo - Accueil"
            >
              <Flame className="w-6 h-6 text-[#e11d48]" aria-hidden="true" />
              <span>Eza Zozo</span>
            </a>

            {/* Zone 2: 4-6 clean text navigation links */}
            <nav
              className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium text-[#c4bfb9]"
              aria-label="Navigation principale"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap hover:text-[#e11d48] transition-colors"
                >
                  <span>{link.label}</span>
                  {link.isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />}
                </a>
              ))}
            </nav>

            {/* Zone 3: 1-2 primary actions */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex min-h-11 items-center gap-2 px-4 text-xs font-semibold text-white bg-[#e11d48] hover:bg-[#be123c] rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  WhatsApp<span className="lg:max-xl:hidden"> Direct</span>
                </span>
              </a>

              <button
                onClick={onOpenShare}
                className={`max-sm:hidden ${iconButton} text-[#c4bfb9] hover:text-[#f5f3f0]`}
                title="Partager le site et l'affiche officielle"
                aria-label="Partager le lien du site"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  onOpenCart();
                }}
                className={`relative ${iconButton} text-[#f5f3f0]`}
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
                className={`lg:hidden ${iconButton} text-[#f5f3f0]`}
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="menu-mobile"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer: below the header, scrolls on its own when the screen is short */}
      {mobileMenuOpen && (
        <div
          id="menu-mobile"
          data-lenis-prevent
          className="fixed inset-x-0 top-16 bottom-0 z-[45] lg:hidden overflow-y-auto overscroll-contain bg-[#0f0e0e]/95 backdrop-blur-lg"
        >
          <div className="mx-auto flex min-h-full max-w-xl flex-col justify-between gap-8 px-6 pt-2 pb-8">
            <nav className="flex flex-col text-lg font-medium text-[#f5f3f0]" aria-label="Menu mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex min-h-14 items-center justify-between gap-3 border-b border-[#292625] py-2 hover:text-[#e11d48] transition-colors"
                >
                  <span>{link.mobileLabel}</span>
                  {link.isNew && (
                    <span className="shrink-0 text-[10px] bg-[#e11d48]/15 text-[#fda4af] px-2 py-0.5 rounded font-mono">Nouveau</span>
                  )}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  closeMenu();
                  onOpenShare?.();
                }}
                className="w-full min-h-12 py-2.5 px-4 rounded-xl bg-[#1e1b1a] hover:bg-[#282523] border border-[#2e2a28] text-sm font-semibold text-[#f5f3f0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#fda4af]" />
                <span>Partager l'affiche & le lien</span>
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-12 py-3 px-4 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>
                  Commander sur WhatsApp <span className="whitespace-nowrap">(+228 90 12 34 56)</span>
                </span>
              </a>
              <p className="text-center text-xs text-[#8f8883]">
                Lomé, Togo · Ouvert 7j/7 de 11h à 23h30
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
