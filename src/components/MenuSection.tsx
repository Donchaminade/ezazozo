import React, { useRef, useState } from 'react';
import { MenuItem, CategoryType } from '../types';
import { MENU_ITEMS } from '../data/restaurantData';
import { RefreshCw, GalleryHorizontal, LayoutGrid } from 'lucide-react';
import { MenuCardSkeleton } from './Skeletons';
import { MenuCard } from './MenuCard';
import { MenuCarousel } from './MenuCarousel';
import { DishDetailModal } from './DishDetailModal';
import { motion } from 'motion/react';
import { prefersReducedMotion } from '../lib/motion';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

type MenuView = 'carousel' | 'grid';

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'Tous les Plats' },
  { id: 'poissons', label: 'Poissons Braisés' },
  { id: 'plateaux', label: 'Plateaux & Formules' },
  { id: 'accompagnements', label: 'Garnitures & Sauces' },
  { id: 'boissons', label: 'Boissons Fraîches' }
];

const VIEWS: { id: MenuView; label: string; Icon: typeof LayoutGrid }[] = [
  { id: 'carousel', label: 'Carrousel', Icon: GalleryHorizontal },
  { id: 'grid', label: 'Grille', Icon: LayoutGrid }
];

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [view, setView] = useState<MenuView>('carousel');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (catId: CategoryType, tab: HTMLButtonElement) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    const tabs = tabsRef.current;
    if (tabs && tabs.scrollWidth > tabs.clientWidth) {
      tabs.scrollTo({
        left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 550);
  };

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const renderCard = (item: MenuItem, parallax = false) => (
    <MenuCard
      item={item}
      isAdded={!!addedItemIds[item.id]}
      onAdd={handleAdd}
      onOpenDetails={setSelectedDetailItem}
      parallax={parallax}
    />
  );

  return (
    <section id="menu" className="py-20 bg-[#0f0e0e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-[#fda4af] font-semibold mb-2 flex items-center gap-2">
              <span>Carte & Spécialités</span>
              <button
                onClick={handleRefresh}
                className="text-[#8f8883] hover:text-[#e11d48] transition-colors p-1 rounded inline-flex items-center gap-1 text-[11px] font-normal"
                title="Actualiser les stocks et arrivages"
                aria-label="Actualiser la carte"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#e11d48]' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display">
              La Carte Eza Zozo
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#a8a19b] max-w-xl">
              Poissons braisés à la commande, généreuses garnitures et boissons locales préparées chaque jour avec des ingrédients frais de Lomé.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            {/* Category Tabs (Segmented control style) */}
            <motion.div
              ref={tabsRef}
              layoutScroll
              data-lenis-prevent-horizontal
              className="flex min-w-0 items-center gap-1.5 p-1 bg-[#1a1817] rounded-xl border border-[#2e2a28] overflow-x-auto max-w-full no-scrollbar"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={(event) => handleCategoryChange(cat.id, event.currentTarget)}
                    aria-pressed={isActive}
                    className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      isActive ? 'text-white' : 'text-[#a8a19b] hover:text-[#f5f3f0]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="menu-tab-pill"
                        className="absolute inset-0 rounded-lg bg-[#e11d48] shadow-sm"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative">{cat.label}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Carousel / grid switch */}
            <div
              role="group"
              aria-label="Affichage de la carte"
              className="flex shrink-0 items-center gap-1 p-1 bg-[#1a1817] rounded-xl border border-[#2e2a28]"
            >
              {VIEWS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  aria-pressed={view === id}
                  title={`Affichage ${label.toLowerCase()}`}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    view === id ? 'bg-[#2b2725] text-[#f5f3f0]' : 'text-[#8f8883] hover:text-[#f5f3f0]'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {view === 'carousel' ? (
          <MenuCarousel
            items={filteredItems}
            isLoading={isLoading}
            dealKey={activeCategory}
            renderCard={(item) => renderCard(item, true)}
          />
        ) : (
          /* Food Gallery Grid with Skeletons and Scroll Reveal */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <MenuCardSkeleton key={`skeleton-${index}`} />)
              : filteredItems.map((item, idx) => {
                  const isFromLeft = idx % 2 === 0;
                  return (
                    <motion.div
                      key={`${activeCategory}-${item.id}`}
                      initial={{ opacity: 0, x: isFromLeft ? -55 : 55, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.65, delay: (idx % 6) * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {renderCard(item)}
                    </motion.div>
                  );
                })}
          </div>
        )}
      </motion.div>

      {/* Dish Detail Modal (Multiple Angles, Secret Marinade, Reviews & Ratings) */}
      <DishDetailModal
        item={selectedDetailItem}
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};
