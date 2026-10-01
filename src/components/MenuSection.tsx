import React, { useState, useEffect } from 'react';
import { MenuItem, CategoryType } from '../types';
import { MENU_ITEMS, formatPrice } from '../data/restaurantData';
import { Plus, Flame, Phone, Check, Sparkles, RefreshCw, Star, Eye } from 'lucide-react';
import { MenuCardSkeleton } from './Skeletons';
import { SmokeEffect } from './SmokeEffect';
import { DishDetailModal } from './DishDetailModal';
import { motion, AnimatePresence } from 'motion/react';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'Tous les Plats' },
  { id: 'poissons', label: 'Poissons Braisés' },
  { id: 'plateaux', label: 'Plateaux & Formules' },
  { id: 'accompagnements', label: 'Garnitures & Sauces' },
  { id: 'boissons', label: 'Boissons Fraîches' }
];

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);

  const handleCategoryChange = (catId: CategoryType) => {
    if (catId === activeCategory) return;
    setIsLoading(true);
    setActiveCategory(catId);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
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

  const getDirectWhatsAppUrl = (item: MenuItem) => {
    const text = `Bonjour Eza Zozo, je souhaite commander : *${item.name}* (${formatPrice(item.price)}). Pouvez-vous me confirmer la disponibilité ?`;
    return `https://wa.me/22890123456?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="menu" className="py-20 bg-[#0f0e0e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
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

          {/* Category Tabs (Segmented control style) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1a1817] rounded-xl border border-[#2e2a28] overflow-x-auto max-w-full no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#e11d48] text-white shadow-sm'
                    : 'text-[#a8a19b] hover:text-[#f5f3f0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Food Gallery Grid with Skeletons and Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <MenuCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            filteredItems.map((item, idx) => {
              const isAdded = !!addedItemIds[item.id];
              const isFromLeft = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isFromLeft ? -55 : 55, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: (idx % 6) * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col bg-[#161413] rounded-2xl overflow-hidden border border-[#2b2725] hover:border-[#423c39] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  {/* Image Container with Fallback & Click to view details */}
                  <div
                    onClick={() => setSelectedDetailItem(item)}
                    className="relative aspect-[4/3] bg-[#211e1c] overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-[#161413]/70" />

                    {/* Animated smoke and embers simulation for hot grilled items */}
                    {(item.category === 'poissons' || item.category === 'plateaux' || item.id === 'alloco-dore') && (
                      <SmokeEffect
                        intensity={item.isSpecialty ? 'high' : 'medium'}
                        showEmbers={true}
                      />
                    )}

                    {/* Hover Prompt to explore angles & details */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#121111]/90 backdrop-blur-md text-white text-xs font-semibold border border-[#e11d48]/50 flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-3.5 h-3.5 text-[#fda4af]" />
                        <span>Voir photos & avis</span>
                      </span>
                    </div>

                    {/* Top info tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {item.isSpecialty ? (
                        <span className="text-[11px] font-semibold text-[#fda4af] bg-[#121111]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#e11d48]/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#e11d48]" />
                          Spécialité Eza Zozo
                        </span>
                      ) : (
                        <span />
                      )}

                      {item.spicyLevel && item.spicyLevel > 0 ? (
                        <span className="text-[11px] font-medium text-[#f5f3f0] bg-[#121111]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#2e2a28] flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#e11d48]" />
                          {item.spicyLevel === 3 ? 'Très Pimenté' : 'Épicé'}
                        </span>
                      ) : null}
                    </div>

                    {/* Price display directly on image corner */}
                    <div className="absolute bottom-3 right-3 bg-[#121111]/95 backdrop-blur-md border border-[#e11d48]/50 px-3 py-1 rounded-lg text-sm font-bold text-[#fda4af] font-mono tabular-nums">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Portion metadata & Star rating */}
                      <div className="flex items-center justify-between text-xs text-[#8f8883] mb-2">
                        <div className="flex items-center gap-2">
                          {item.portion && <span>{item.portion}</span>}
                          {item.weightGrams && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{item.weightGrams}</span>
                            </>
                          )}
                        </div>

                        {item.rating && (
                          <button
                            onClick={() => setSelectedDetailItem(item)}
                            className="flex items-center gap-1 text-[#fda4af] font-mono font-bold text-[11px] hover:text-[#e11d48] transition-colors cursor-pointer"
                            title="Voir les avis clients"
                          >
                            <Star className="w-3 h-3 fill-[#e11d48] text-[#e11d48]" />
                            <span>{item.rating}</span>
                            <span className="text-[#8f8883] font-normal">({item.reviewCount || 0})</span>
                          </button>
                        )}
                      </div>

                      <h3
                        onClick={() => setSelectedDetailItem(item)}
                        className="text-lg font-bold text-[#f5f3f0] font-display hover:text-[#e11d48] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-[#a8a19b] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-6 pt-4 border-t border-[#262220] flex items-center gap-2">
                      <button
                        onClick={() => handleAdd(item)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#e11d48] hover:bg-[#be123c] text-white shadow-sm'
                        }`}
                        aria-label={`Ajouter ${item.name} au panier`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Ajouté !</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedDetailItem(item)}
                        className="p-2.5 rounded-xl bg-[#211e1c] hover:bg-[#2b2725] text-[#c4bfb9] hover:text-white border border-[#36312f] transition-colors cursor-pointer"
                        title="Voir détails, photos d'angles et avis"
                        aria-label={`Détails et photos de ${item.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={getDirectWhatsAppUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#211e1c] hover:bg-[#2b2725] text-[#25d366] border border-[#36312f] transition-colors"
                        title="Commander directement sur WhatsApp"
                        aria-label={`Commander ${item.name} directement sur WhatsApp`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

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
