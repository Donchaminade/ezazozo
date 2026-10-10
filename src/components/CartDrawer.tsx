import React, { useRef, useState } from 'react';
import { CartItem } from '../types';
import { formatPrice, RESTAURANT_INFO } from '../data/restaurantData';
import { X, Trash2, Plus, Minus, Phone, ShoppingBag, Bike, Utensils, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOverlay } from '../hooks/useOverlay';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const field =
  'w-full rounded-xl bg-[#1e1b1a] border border-[#2e2a28] text-base text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none pointer-fine:text-xs';

const stepButton =
  'inline-flex h-11 w-11 items-center justify-center rounded text-[#a8a19b] hover:text-white hover:bg-[#23201e] cursor-pointer pointer-fine:h-7 pointer-fine:w-7';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [deliveryType, setDeliveryType] = useState<'sur-place' | 'emporter' | 'livraison'>('livraison');
  const [selectedZone, setSelectedZone] = useState<string>(RESTAURANT_INFO.deliveryZones[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlay(isOpen, onClose, panelRef);

  const subtotal = items.reduce((acc, it) => acc + it.item.price * it.quantity, 0);

  // Parse delivery fee if delivery is chosen
  let deliveryFee = 0;
  if (deliveryType === 'livraison') {
    if (selectedZone.includes('500')) deliveryFee = 500;
    else if (selectedZone.includes('1 000')) deliveryFee = 1000;
    else if (selectedZone.includes('1 500')) deliveryFee = 1500;
    else if (selectedZone.includes('2 000')) deliveryFee = 2000;
  }

  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutWhatsApp = () => {
    let modeText = 'Dégustation sur place';
    if (deliveryType === 'emporter') modeText = 'À emporter (Click & Collect)';
    if (deliveryType === 'livraison') modeText = `Livraison à domicile (${selectedZone})`;

    let text = `*NOUVELLE COMMANDE EZA ZOZO (Lomé)* 🐟🔥\n`;
    text += `------------------------------------\n`;
    if (customerName) text += `*Client :* ${customerName}\n`;
    if (customerPhone) text += `*Téléphone :* ${customerPhone}\n`;
    text += `*Mode de commande :* ${modeText}\n`;
    if (notes) text += `*Instructions/Préférences :* ${notes}\n`;
    text += `------------------------------------\n*DÉTAIL DU PANIER :*\n`;

    items.forEach((it, idx) => {
      text += `${idx + 1}. ${it.quantity}x ${it.item.name} (${formatPrice(it.item.price * it.quantity)})\n`;
      if (it.notes) {
        text += `   _${it.notes}_\n`;
      }
    });

    text += `------------------------------------\n`;
    text += `*Sous-total :* ${formatPrice(subtotal)}\n`;
    if (deliveryType === 'livraison') {
      text += `*Frais de livraison :* ${formatPrice(deliveryFee)}\n`;
    }
    text += `*TOTAL À RÉGLER :* ${formatPrice(grandTotal)}\n\n`;
    text += `Bonjour l'équipe Eza Zozo, je confirme ma commande !`;

    window.open(`https://wa.me/22890123456?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="cart-drawer" data-lenis-prevent className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 right-0 w-full sm:max-w-md bg-[#161413] sm:border-l border-[#2e2a28] shadow-2xl flex flex-col justify-between outline-none"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#292625] flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <ShoppingBag className="w-5 h-5 shrink-0 text-[#e11d48]" />
                <h2 id="cart-title" className="text-base font-bold text-[#f5f3f0] font-display">
                  Votre Commande Eza Zozo
                </h2>
              </div>
              <button
                onClick={onClose}
                className="-my-2.5 -mr-2.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#a8a19b] hover:text-white hover:bg-[#23201e] transition-colors cursor-pointer"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-[#8f8883] space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-[#3b3633]" />
                  <p className="text-sm">Votre panier est encore vide.</p>
                  <p className="text-xs text-[#a8a19b]">
                    Ajoutez un délicieux poisson braisé ou configurez votre plateau sur-mesure !
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-[#8f8883] pb-2 border-b border-[#262220]">
                    <span>{items.reduce((a, b) => a + b.quantity, 0)} articles sélectionnés</span>
                    <button
                      onClick={onClearCart}
                      className="relative -my-3.5 -mr-1 inline-flex min-h-11 items-center px-1 text-[#e11d48] hover:underline cursor-pointer"
                    >
                      Vider le panier
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((cartItem) => (
                      <div
                        key={cartItem.item.id}
                        className="p-3 sm:p-3.5 rounded-xl bg-[#1e1b1a] border border-[#2b2725] flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-3 gap-y-2"
                      >
                        <div className="min-w-0 basis-full sm:basis-auto sm:flex-1 sm:pr-2">
                          <div className="text-sm sm:text-xs font-bold text-[#f5f3f0] line-clamp-2 font-display">
                            {cartItem.item.name}
                          </div>
                          <div className="text-xs sm:text-[11px] font-mono text-[#fda4af] mt-0.5">
                            {formatPrice(cartItem.item.price)}
                          </div>
                          {cartItem.item.description && (
                            <div className="text-[11px] sm:text-[10px] text-[#8f8883] truncate mt-0.5">
                              {cartItem.item.description}
                            </div>
                          )}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-[#121111] p-0.5 rounded-lg border border-[#332f2c] pointer-fine:gap-1.5 pointer-fine:p-1">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                            className={stepButton}
                            aria-label={`Diminuer la quantité de ${cartItem.item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm sm:text-xs font-bold text-[#f5f3f0] font-mono tabular-nums">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                            className={stepButton}
                            aria-label={`Augmenter la quantité de ${cartItem.item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(cartItem.item.id)}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#8f8883] hover:text-red-400 transition-colors cursor-pointer pointer-fine:h-8 pointer-fine:w-8"
                          aria-label={`Supprimer ${cartItem.item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Options */}
                  <div className="pt-4 border-t border-[#262220] space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#fda4af]">
                      Mode de Dégustation
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        onClick={() => setDeliveryType('livraison')}
                        aria-pressed={deliveryType === 'livraison'}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          deliveryType === 'livraison'
                            ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                            : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883]'
                        }`}
                      >
                        <Bike className="w-4 h-4 text-[#e11d48]" />
                        <span>Livraison</span>
                      </button>

                      <button
                        onClick={() => setDeliveryType('sur-place')}
                        aria-pressed={deliveryType === 'sur-place'}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          deliveryType === 'sur-place'
                            ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                            : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883]'
                        }`}
                      >
                        <Utensils className="w-4 h-4 text-[#fda4af]" />
                        <span>Sur Place</span>
                      </button>

                      <button
                        onClick={() => setDeliveryType('emporter')}
                        aria-pressed={deliveryType === 'emporter'}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          deliveryType === 'emporter'
                            ? 'bg-[#29221f] border-[#e11d48] text-[#f5f3f0]'
                            : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883]'
                        }`}
                      >
                        <Package className="w-4 h-4 text-[#a8a19b]" />
                        <span>À Emporter</span>
                      </button>
                    </div>

                    {deliveryType === 'livraison' && (
                      <div>
                        <label htmlFor="cart-zone" className="block text-[11px] text-[#c4bfb9] mb-1">
                          Quartier de Lomé pour la livraison :
                        </label>
                        <select
                          id="cart-zone"
                          value={selectedZone}
                          onChange={(e) => setSelectedZone(e.target.value)}
                          className={`${field} p-2.5`}
                        >
                          {RESTAURANT_INFO.deliveryZones.map((zone) => (
                            <option key={zone} value={zone}>
                              {zone}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Customer details for quick WhatsApp formatting */}
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="Votre Prénom / Nom"
                        aria-label="Votre prénom ou nom"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`${field} px-3 py-2.5 pointer-fine:py-2`}
                      />
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="Votre Numéro WhatsApp"
                        aria-label="Votre numéro WhatsApp"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={`${field} px-3 py-2.5 pointer-fine:py-2`}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Checkout Summary */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#292625] bg-[#1a1716] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3 text-[#a8a19b]">
                    <span>Sous-total plats</span>
                    <span className="shrink-0 font-mono text-[#f5f3f0]">{formatPrice(subtotal)}</span>
                  </div>
                  {deliveryType === 'livraison' && (
                    <div className="flex justify-between gap-3 text-[#a8a19b]">
                      <span>Frais de livraison ({selectedZone.split(' (')[0]})</span>
                      <span className="shrink-0 font-mono text-[#f5f3f0]">{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-3 text-sm font-bold pt-2 border-t border-[#292625] text-[#f5f3f0]">
                    <span>Total estimé</span>
                    <span className="shrink-0 font-mono text-base text-[#e11d48]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full min-h-12 py-3.5 px-4 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Envoyer ma Commande sur WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-[#8f8883]">
                  Paiement à la livraison ou par T-Money / Flooz / Espèces sur place
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
