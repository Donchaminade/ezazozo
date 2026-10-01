import React, { useState } from 'react';
import { formatPrice } from '../data/restaurantData';
import { Sparkles, Check, Phone, Plus, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';
import { motion } from 'motion/react';

interface CustomPlatterBuilderProps {
  onAddCustomPlatter: (customItem: MenuItem) => void;
}

const FISH_OPTIONS = [
  { id: 'dorade', name: 'Dorade Royale Braisée', basePrice: 6500, desc: 'Chair tendre, marinade herbes et agrumes' },
  { id: 'capitaine', name: 'Capitaine Entier de Lomé', basePrice: 8000, desc: 'Poisson noble blanc, texture ferme' },
  { id: 'carpe', name: 'Carpe Rouge Crousti-Fondante', basePrice: 7000, desc: 'Épices torréfiées et gingembre frais' },
  { id: 'bar', name: 'Grand Bar Sauvage XL', basePrice: 9500, desc: 'Pièce prestigieuse pour 2 à 3 convives' },
];

const SIZE_OPTIONS = [
  { id: 'standard', name: 'Calibre Normal (1-2 pers)', extra: 0 },
  { id: 'large', name: 'Calibre Généreux (+1 500 FCFA)', extra: 1500 },
  { id: 'xxl', name: 'Calibre Royal XXL (+3 000 FCFA)', extra: 3000 },
];

const SIDES_OPTIONS = [
  { id: 'alloco', name: 'Alloco Bananes Mûres', price: 0 },
  { id: 'attieke', name: 'Attiéké Moelleux', price: 0 },
  { id: 'frites', name: 'Frites Épicées Maison', price: 0 },
  { id: 'legumes', name: 'Légumes Sautés à l’Ail', price: 500 },
  { id: 'double-alloco', name: 'Double Portion Alloco', price: 1000 },
];

const SPICE_LEVELS = [
  { id: 'doux', name: 'Doux (Sauce oignons douce)', desc: 'Idéal pour les enfants et palais sensibles' },
  { id: 'moyen', name: 'Moyen (Légèrement relevé)', desc: 'L’équilibre parfait de Lomé' },
  { id: 'togo-fire', name: 'Piment Noir Eza Zozo 🔥', desc: 'Relevé authentique pour connaisseurs' },
];

const DRINK_OPTIONS = [
  { id: 'none', name: 'Sans boisson', price: 0 },
  { id: 'bissap', name: 'Jus de Bissap & Menthe (50cl)', price: 1000 },
  { id: 'gingembre', name: 'Jus de Gingembre Pressé (50cl)', price: 1000 },
  { id: 'cocktail', name: 'Mocktail Tropical Eza Zozo', price: 2000 },
];

export const CustomPlatterBuilder: React.FC<CustomPlatterBuilderProps> = ({ onAddCustomPlatter }) => {
  const [selectedFish, setSelectedFish] = useState(FISH_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [selectedSides, setSelectedSides] = useState<string[]>(['alloco']);
  const [selectedSpice, setSelectedSpice] = useState(SPICE_LEVELS[1]);
  const [selectedDrink, setSelectedDrink] = useState(DRINK_OPTIONS[1]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const toggleSide = (sideId: string) => {
    if (selectedSides.includes(sideId)) {
      if (selectedSides.length > 1) {
        setSelectedSides(selectedSides.filter((s) => s !== sideId));
      }
    } else {
      setSelectedSides([...selectedSides, sideId]);
    }
  };

  // Calculate total price
  const sidesExtra = selectedSides.reduce((acc, sideId) => {
    const side = SIDES_OPTIONS.find((s) => s.id === sideId);
    return acc + (side ? side.price : 0);
  }, 0);

  const totalPrice = selectedFish.basePrice + selectedSize.extra + sidesExtra + selectedDrink.price;

  const handleAddToCart = () => {
    const sidesNames = selectedSides
      .map((sId) => SIDES_OPTIONS.find((s) => s.id === sId)?.name)
      .filter(Boolean)
      .join(', ');

    const customItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: `Plateau Sur-Mesure : ${selectedFish.name} (${selectedSize.name.split(' (')[0]})`,
      category: 'plateaux',
      price: totalPrice,
      description: `Garnitures: ${sidesNames}. Assaisonnement: ${selectedSpice.name}. Boisson: ${selectedDrink.name}.`,
      image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
      portion: selectedSize.id === 'xxl' ? '3-4 personnes' : '1-2 personnes'
    };

    onAddCustomPlatter(customItem);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const getWhatsAppUrl = () => {
    const sidesNames = selectedSides
      .map((sId) => SIDES_OPTIONS.find((s) => s.id === sId)?.name)
      .join(' + ');

    const text = `*COMMANDE PLATEAU SUR-MESURE EZA ZOZO* 🔥\n` +
      `- Poisson : ${selectedFish.name}\n` +
      `- Calibre : ${selectedSize.name}\n` +
      `- Garnitures : ${sidesNames}\n` +
      `- Piment : ${selectedSpice.name}\n` +
      `- Boisson : ${selectedDrink.name}\n` +
      `*PRIX TOTAL : ${formatPrice(totalPrice)}*\n\n` +
      `Pouvez-vous valider ma commande avec Mr Adanlete ?`;

    return `https://wa.me/22890123456?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="simulateur" className="py-20 bg-[#141211] relative border-t border-[#262220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="text-xs uppercase tracking-widest text-[#e11d48] font-semibold mb-2">
            Tarification Dynamique & Transparente
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display">
            Composez Votre Plateau Idéal
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#a8a19b]">
            Personnalisez votre poisson braisé, votre calibre, vos garnitures et vos boissons. Le tarif s'ajuste instantanément en direct !
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Builder Controls Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-8 bg-[#181615] p-6 sm:p-8 rounded-2xl border border-[#2b2725]"
          >
            {/* Step 1: Fish Selection */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#fda4af] mb-3 flex items-center gap-1.5">
                <span>1. Choisissez le Poisson Frais</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FISH_OPTIONS.map((fish) => {
                  const isSelected = selectedFish.id === fish.id;
                  return (
                    <button
                      key={fish.id}
                      onClick={() => setSelectedFish(fish)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0] shadow-md'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#c4bfb9] hover:border-[#47413d]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-[#f5f3f0] font-display">{fish.name}</span>
                        <span className="text-xs font-mono font-bold text-[#e11d48]">{formatPrice(fish.basePrice)}</span>
                      </div>
                      <p className="text-xs text-[#8f8883] leading-relaxed">{fish.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Size & Calibre */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#fda4af] mb-3">
                2. Calibre & Poids du Poisson
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SIZE_OPTIONS.map((size) => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3.5 rounded-xl text-center border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#a8a19b] hover:border-[#47413d]'
                      }`}
                    >
                      {size.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Sides */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#fda4af] mb-3">
                3. Garnitures de l'Allocodrome (Sélectionnez 1 ou plusieurs)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SIDES_OPTIONS.map((side) => {
                  const isSelected = selectedSides.includes(side.id);
                  return (
                    <button
                      key={side.id}
                      onClick={() => toggleSide(side.id)}
                      className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883] hover:border-[#47413d]'
                      }`}
                    >
                      <span>{side.name}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#e11d48] shrink-0" />
                      ) : side.price > 0 ? (
                        <span className="text-[10px] text-[#fda4af]">+{side.price} F</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Spiciness */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#fda4af] mb-3">
                4. Intensité du Piment
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SPICE_LEVELS.map((spice) => {
                  const isSelected = selectedSpice.id === spice.id;
                  return (
                    <button
                      key={spice.id}
                      onClick={() => setSelectedSpice(spice)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883] hover:border-[#47413d]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#f5f3f0] mb-0.5">{spice.name}</div>
                      <div className="text-[11px] text-[#8f8883]">{spice.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Drink */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#fda4af] mb-3">
                5. Boisson du Terroir
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DRINK_OPTIONS.map((drink) => {
                  const isSelected = selectedDrink.id === drink.id;
                  return (
                    <button
                      key={drink.id}
                      onClick={() => setSelectedDrink(drink)}
                      className={`p-2.5 rounded-xl text-center border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883] hover:border-[#47413d]'
                      }`}
                    >
                      <div className="font-medium text-[#f5f3f0]">{drink.name}</div>
                      <div className="text-[10px] text-[#fda4af] mt-0.5">
                        {drink.price > 0 ? `+${formatPrice(drink.price)}` : 'Inclus'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sticky Summary & Live Pricing Card Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 lg:sticky lg:top-28"
          >
            <div className="bg-[#181615] rounded-2xl border border-[#2e2a28] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e11d48]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-[#292625] mb-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#8f8883]">Récapitulatif</div>
                  <h3 className="text-lg font-bold text-[#f5f3f0] font-display">Votre Plateau Eza Zozo</h3>
                </div>
                <Sparkles className="w-5 h-5 text-[#e11d48]" />
              </div>

              {/* Itemized breakdown */}
              <div className="space-y-3 text-xs text-[#c4bfb9] mb-6">
                <div className="flex justify-between">
                  <span>Poisson : {selectedFish.name}</span>
                  <span className="font-mono text-[#f5f3f0]">{formatPrice(selectedFish.basePrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Calibre : {selectedSize.name.split(' (')[0]}</span>
                  <span className="font-mono text-[#f5f3f0]">+{formatPrice(selectedSize.extra)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Garnitures ({selectedSides.length})</span>
                  <span className="font-mono text-[#f5f3f0]">+{formatPrice(sidesExtra)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Piment : {selectedSpice.name.split(' (')[0]}</span>
                  <span className="text-[#a8a19b]">Inclus</span>
                </div>

                <div className="flex justify-between">
                  <span>Boisson : {selectedDrink.name.split(' (')[0]}</span>
                  <span className="font-mono text-[#f5f3f0]">+{formatPrice(selectedDrink.price)}</span>
                </div>
              </div>

              {/* Total Display */}
              <div className="p-4 rounded-xl bg-[#211e1c] border border-[#332e2b] mb-6">
                <div className="text-xs text-[#8f8883]">Tarif Total Estimé</div>
                <div className="text-3xl font-extrabold text-[#e11d48] font-display tabular-nums mt-0.5">
                  {formatPrice(totalPrice)}
                </div>
                <div className="text-[11px] text-[#a8a19b] mt-1">
                  Poêlé minute sur charbon de bois d’acacia à Lomé
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#e11d48] hover:bg-[#be123c] text-white shadow-md shadow-[#e11d48]/20'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ajouté au Panier !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ajouter ce Plateau au Panier</span>
                    </>
                  )}
                </button>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/30 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Commander Direct via WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
