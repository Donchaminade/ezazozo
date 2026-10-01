import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StoryPillars } from './components/StoryPillars';
import { MenuSection } from './components/MenuSection';
import { CustomPlatterBuilder } from './components/CustomPlatterBuilder';
import { TikTokFeed } from './components/TikTokFeed';
import { CommunityGallery } from './components/CommunityGallery';
import { OrderProcess } from './components/OrderProcess';
import { ContactAndMap } from './components/ContactAndMap';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
import { ShareModal } from './components/ShareModal';
import { CartItem, MenuItem } from './types';
import { ShoppingBag, Phone } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0e] text-[#f5f3f0] selection:bg-[#e11d48] selection:text-white flex flex-col font-sans">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#e11d48] text-white px-4 py-2 rounded-lg font-bold"
      >
        Aller au contenu principal
      </a>

      {/* Strict 3-zone Top Bar Contract */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Section 1: Hero */}
        <Hero
          onExploreMenu={() => scrollToSection('menu')}
          onOpenLocation={() => scrollToSection('contact')}
        />

        {/* Section 2: Le Concept & 3 Piliers */}
        <StoryPillars />

        {/* Section 3: Menu Vedette & Interactive Food Gallery */}
        <MenuSection onAddToCart={handleAddToCart} />

        {/* Dynamic Pricing / Custom Platter Builder */}
        <CustomPlatterBuilder onAddCustomPlatter={handleAddToCart} />

        {/* Section 4: TikTok Reels & Social Proof */}
        <TikTokFeed />

        {/* Section 5: Mur des Gourmands & Stories Communauté */}
        <CommunityGallery />

        {/* Section 6: Processus de Commande & Livraison */}
        <OrderProcess />

        {/* Section 7: Contact, Horaires & Plan d'accès */}
        <ContactAndMap />
      </main>

      {/* Footer */}
      <Footer onOpenShare={() => setIsShareOpen(true)} />

      {/* Share Modal with Rich Poster Preview */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Ambient Sound Player: Braise au feu de bois & Océan de Lomé */}
      <AmbientSoundPlayer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Mobile Floating Quick Action (respects 15% sticky cap) */}
      <div className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <a
          href="https://wa.me/22890123456?text=Bonjour%20Eza%20Zozo%2C%20je%20souhaite%20commander%20un%20poisson%20brais%C3%A9%20%21"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-[#25d366] text-white rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
          aria-label="Contacter sur WhatsApp"
        >
          <Phone className="w-5 h-5 fill-current" />
        </a>

        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-3 bg-[#e11d48] text-white rounded-full shadow-xl hover:scale-105 transition-transform relative flex items-center justify-center"
            aria-label={`Voir le panier (${totalCartCount})`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-white text-[#e11d48] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalCartCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
