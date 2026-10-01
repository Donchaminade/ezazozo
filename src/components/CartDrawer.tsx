import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatPrice, RESTAURANT_INFO } from '../data/restaurantData';
import { X, Trash2, Plus, Minus, Phone, ShoppingBag, Bike, Utensils, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#161413] border-l border-[#2e2a28] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#292625] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ff5722]" />
              <h2 className="text-base font-bold text-[#f5f3f0] font-display">
                Votre Commande Eza Zozo
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#a8a19b] hover:text-white hover:bg-[#23201e] transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    className="text-[#ff5722] hover:underline"
                  >
                    Vider le panier
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="p-3.5 rounded-xl bg-[#1e1b1a] border border-[#2b2725] flex gap-3 items-center justify-between"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-xs font-bold text-[#f5f3f0] truncate font-display">
                          {cartItem.item.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#ffc107] mt-0.5">
                          {formatPrice(cartItem.item.price)}
                        </div>
                        {cartItem.item.description && (
                          <div className="text-[10px] text-[#8f8883] truncate mt-0.5">
                            {cartItem.item.description}
                          </div>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#121111] p-1 rounded-lg border border-[#332f2c]">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                          className="p-1 rounded text-[#a8a19b] hover:text-white hover:bg-[#23201e]"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[#f5f3f0] px-1 font-mono">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                          className="p-1 rounded text-[#a8a19b] hover:text-white hover:bg-[#23201e]"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(cartItem.item.id)}
                        className="text-[#8f8883] hover:text-red-400 p-1 transition-colors"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Options */}
                <div className="pt-4 border-t border-[#262220] space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#ffc107]">
                    Mode de Dégustation
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setDeliveryType('livraison')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        deliveryType === 'livraison'
                          ? 'bg-[#29221f] border-[#ff5722] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883]'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-[#ff5722]" />
                      <span>Livraison</span>
                    </button>

                    <button
                      onClick={() => setDeliveryType('sur-place')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        deliveryType === 'sur-place'
                          ? 'bg-[#29221f] border-[#ff5722] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883]'
                      }`}
                    >
                      <Utensils className="w-4 h-4 text-[#ffc107]" />
                      <span>Sur Place</span>
                    </button>

                    <button
                      onClick={() => setDeliveryType('emporter')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        deliveryType === 'emporter'
                          ? 'bg-[#29221f] border-[#ff5722] text-[#f5f3f0]'
                          : 'bg-[#1e1b1a] border-[#2e2a28] text-[#8f8883]'
                      }`}
                    >
                      <Package className="w-4 h-4 text-[#a8a19b]" />
                      <span>À Emporter</span>
                    </button>
                  </div>

                  {deliveryType === 'livraison' && (
                    <div>
                      <label className="block text-[11px] text-[#c4bfb9] mb-1">
                        Quartier de Lomé pour la livraison :
                      </label>
                      <select
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#1e1b1a] border border-[#2e2a28] text-xs text-[#f5f3f0]"
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
                      placeholder="Votre Prénom / Nom"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1e1b1a] border border-[#2e2a28] text-xs text-[#f5f3f0]"
                    />
                    <input
                      type="tel"
                      placeholder="Votre Numéro WhatsApp"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1e1b1a] border border-[#2e2a28] text-xs text-[#f5f3f0]"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#292625] bg-[#1a1716] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#a8a19b]">
                  <span>Sous-total plats</span>
                  <span className="font-mono text-[#f5f3f0]">{formatPrice(subtotal)}</span>
                </div>
                {deliveryType === 'livraison' && (
                  <div className="flex justify-between text-[#a8a19b]">
                    <span>Frais de livraison ({selectedZone.split(' (')[0]})</span>
                    <span className="font-mono text-[#f5f3f0]">{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#292625] text-[#f5f3f0]">
                  <span>Total estimé</span>
                  <span className="font-mono text-base text-[#ff5722]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Envoyer ma Commande sur WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-[#8f8883]">
                Paiement à la livraison ou par T-Money / Flooz / Espèces sur place
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
