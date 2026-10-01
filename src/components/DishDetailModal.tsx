import React, { useState } from 'react';
import { MenuItem, DishReview } from '../types';
import { SmokeEffect } from './SmokeEffect';
import { 
  X, Star, Flame, Clock, Users, Scale, ChefHat, Check, 
  ShoppingBag, Phone, ChevronLeft, ChevronRight, MessageSquare, 
  Sparkles, ThumbsUp, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DishDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity?: number) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  // Gallery state
  const images = item.galleryImages && item.galleryImages.length > 0 
    ? item.galleryImages 
    : [item.image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Reviews state (initial dish reviews + new added ones)
  const [localReviews, setLocalReviews] = useState<DishReview[]>(item.reviews || []);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync state if item changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setAddedSuccess(false);
    setLocalReviews(item.reviews || []);
    setShowReviewForm(false);
    setReviewSubmitted(false);
  }, [item?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCartClick = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item);
    }
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: DishReview = {
      id: `custom-rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      avatar: newReviewAuthor.slice(0, 2).toUpperCase(),
      location: newReviewLocation.trim() || 'Lomé, Togo',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: 'À l’instant',
      verifiedOrder: true
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewAuthor('');
    setNewReviewLocation('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
    }, 2500);
  };

  const isHotGrilled = item.category === 'poissons' || item.category === 'plateaux' || item.id === 'alloco-dore';
  const whatsappUrl = `https://wa.me/22890123456?text=${encodeURIComponent(
    `Bonjour Eza Zozo, je souhaite commander : ${quantity}x ${item.name} (${formatPrice(item.price * quantity)}).`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[#161413] border border-[#2e2a28] rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#121111]/80 hover:bg-[#262220] border border-[#332e2b] text-[#c4bfb9] hover:text-white transition-colors cursor-pointer"
              aria-label="Fermer la vue détaillée"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content body */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8">
              
              {/* SECTION 1: HEADER & IMAGE GALLERY WITH MULTIPLE ANGLES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Gallery & Angles */}
                <div className="lg:col-span-7 space-y-3">
                  {/* Main Display Image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#211e1c] border border-[#2e2a28] shadow-lg group">
                    <img
                      src={images[selectedImageIndex]}
                      alt={`${item.name} - Vue sous un angle`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Smoke effect on grilled dishes */}
                    {isHotGrilled && <SmokeEffect intensity={item.isSpecialty ? 'high' : 'medium'} />}

                    {/* Clean solid bottom scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-[#161413]/70 pointer-events-none" />

                    {/* Angle navigation arrows (if multiple images) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#121111]/85 hover:bg-[#262220] text-white border border-[#383330] shadow-md transition-all cursor-pointer"
                          aria-label="Angle précédent"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#121111]/85 hover:bg-[#262220] text-white border border-[#383330] shadow-md transition-all cursor-pointer"
                          aria-label="Angle suivant"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Badges on main image */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
                      {item.isSpecialty && (
                        <span className="text-[11px] font-semibold text-[#fda4af] bg-[#121111]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#e11d48]/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#e11d48]" />
                          Signature Mr Adanlete
                        </span>
                      )}
                      <span className="text-[10px] text-[#f5f3f0] bg-[#121111]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#2e2a28] flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#e11d48]" />
                        Feu de Bois
                      </span>
                    </div>

                    {/* Image index pill */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-[#121111]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono text-[#c4bfb9] border border-[#2e2a28]">
                        Angle {selectedImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails of available angles */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {images.map((imgUrl, idx) => (
                        <button
                          key={`angle-thumb-${idx}`}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative aspect-[4/3] w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            selectedImageIndex === idx
                              ? 'border-[#e11d48] scale-105 shadow-md shadow-[#e11d48]/20'
                              : 'border-[#2e2a28] opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Vignette angle ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Key Info, Price & Description */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#fda4af] font-semibold">
                      {item.category === 'poissons' ? 'Poisson Frais Braisé' : item.category === 'plateaux' ? 'Grand Plateau' : item.category}
                    </span>

                    {/* Dish Rating */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1f1d1b] border border-[#332e2b]">
                      <Star className="w-3.5 h-3.5 fill-[#e11d48] text-[#e11d48]" />
                      <span className="text-xs font-bold text-[#f5f3f0] font-mono">
                        {item.rating || 4.9}
                      </span>
                      <span className="text-[10px] text-[#8f8883]">
                        ({item.reviewCount || localReviews.length} avis)
                      </span>
                    </div>
                  </div>

                  {/* Dish Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5f3f0] font-display leading-tight">
                    {item.name}
                  </h2>

                  {/* Price Tag */}
                  <div className="p-3.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] flex items-baseline justify-between">
                    <span className="text-xs text-[#8f8883]">Prix unitaire</span>
                    <span className="text-2xl font-extrabold text-[#e11d48] font-display tabular-nums">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#c4bfb9] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Specs Pill Grid (Portion, Poids, Cuisson) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {item.portion && (
                      <div className="p-2.5 rounded-xl bg-[#1a1817] border border-[#292625] flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#fda4af] shrink-0" />
                        <span className="text-[#c4bfb9] truncate">{item.portion}</span>
                      </div>
                    )}
                    {item.weightGrams && (
                      <div className="p-2.5 rounded-xl bg-[#1a1817] border border-[#292625] flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-[#fda4af] shrink-0" />
                        <span className="text-[#c4bfb9] truncate">Poids {item.weightGrams}</span>
                      </div>
                    )}
                    {item.cookingTime && (
                      <div className="col-span-2 p-2.5 rounded-xl bg-[#1a1817] border border-[#292625] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#e11d48] shrink-0" />
                        <span className="text-[#c4bfb9] truncate">{item.cookingTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Add to Cart Action */}
                  <div className="pt-2 space-y-2.5">
                    <div className="flex items-center gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-[#1f1d1b] border border-[#332e2b] rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 rounded-lg text-[#c4bfb9] hover:text-white hover:bg-[#2b2725] flex items-center justify-center font-bold text-sm cursor-pointer"
                          aria-label="Diminuer la quantité"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-sm text-[#f5f3f0]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-8 h-8 rounded-lg text-[#c4bfb9] hover:text-white hover:bg-[#2b2725] flex items-center justify-center font-bold text-sm cursor-pointer"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      {/* Primary Add to Cart Button */}
                      <button
                        onClick={handleAddToCartClick}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                          addedSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#e11d48] hover:bg-[#be123c] text-white shadow-[#e11d48]/20'
                        }`}
                      >
                        {addedSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Ajouté au panier !</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Ajouter ({formatPrice(item.price * quantity)})</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* WhatsApp Quick Order button */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/35 text-[#25d366] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Commander directement sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SECRET MARINADE & CULINARY SECRETS */}
              {(item.marinadeNotes || (item.ingredients && item.ingredients.length > 0)) && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1817] border border-[#2b2725] space-y-4">
                  <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-[#fda4af] font-semibold">
                    <ChefHat className="w-4 h-4 text-[#e11d48]" />
                    <span>L'Art & les Secrets de Préparation Eza Zozo</span>
                  </div>

                  {item.marinadeNotes && (
                    <div>
                      <h4 className="text-sm font-bold text-[#f5f3f0] mb-1 font-display">
                        La Marinade Secrète de Mr Adanlete
                      </h4>
                      <p className="text-xs sm:text-sm text-[#a8a19b] leading-relaxed">
                        {item.marinadeNotes}
                      </p>
                    </div>
                  )}

                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-semibold text-[#f5f3f0] mb-2">
                        Ingrédients sélectionnés au marché de Lomé :
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.ingredients.map((ing, i) => (
                          <span
                            key={`ing-${i}`}
                            className="px-2.5 py-1 rounded-md bg-[#24201e] border border-[#332e2b] text-[11px] text-[#c4bfb9]"
                          >
                            ✓ {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.recommendedSides && item.recommendedSides.length > 0 && (
                    <div className="pt-2 border-t border-[#262220] flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[#8f8883]">Accompagnements conseillés :</span>
                      {item.recommendedSides.map((side, sIdx) => (
                        <span
                          key={`rec-side-${sIdx}`}
                          className="px-2 py-0.5 rounded bg-[#e11d48]/10 text-[#fda4af] font-medium border border-[#e11d48]/25"
                        >
                          {side}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: DISH REVIEWS & COMMENTS (Le Mur des Avis Spécifiques) */}
              <div className="space-y-4 pt-2 border-t border-[#262220]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#f5f3f0] font-display flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#e11d48]" />
                      <span>Avis & Commentaires sur ce Plat ({localReviews.length})</span>
                    </h3>
                    <p className="text-xs text-[#8f8883]">
                      Retour d'expérience des clients ayant commandé ce plat à Lomé
                    </p>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="py-2 px-3.5 rounded-xl bg-[#24201e] hover:bg-[#2e2a28] border border-[#383330] text-xs font-semibold text-[#fda4af] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <span>{showReviewForm ? 'Fermer le formulaire' : 'Laisser mon avis'}</span>
                  </button>
                </div>

                {/* Interactive Review Form */}
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddReview}
                      className="p-4 sm:p-5 rounded-2xl bg-[#1e1b1a] border border-[#332e2b] space-y-3"
                    >
                      <div className="text-xs font-bold text-[#f5f3f0] font-display">
                        Votre avis sur : {item.name}
                      </div>

                      {reviewSubmitted ? (
                        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-200 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Merci beaucoup ! Votre avis a été publié avec succès.</span>
                        </div>
                      ) : (
                        <>
                          {/* Rating selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#a8a19b]">Votre note :</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((starVal) => (
                                <button
                                  type="button"
                                  key={`rate-star-${starVal}`}
                                  onClick={() => setNewReviewRating(starVal)}
                                  className="p-1 cursor-pointer"
                                  aria-label={`${starVal} étoiles`}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      starVal <= newReviewRating
                                        ? 'text-[#e11d48] fill-[#e11d48]'
                                        : 'text-[#47413d]'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-[#fda4af] font-mono">
                              {newReviewRating}/5
                            </span>
                          </div>

                          {/* Inputs: Name & Location */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              required
                              placeholder="Votre prénom ou nom"
                              value={newReviewAuthor}
                              onChange={(e) => setNewReviewAuthor(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#161413] border border-[#2e2a28] text-xs text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Quartier à Lomé (ex: Tokoin, Bè, Agoè...)"
                              value={newReviewLocation}
                              onChange={(e) => setNewReviewLocation(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#161413] border border-[#2e2a28] text-xs text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none"
                            />
                          </div>

                          {/* Textarea: Comment */}
                          <textarea
                            required
                            rows={3}
                            placeholder="Que pensez-vous de la cuisson, de l'assaisonnement et de la fraîcheur ?"
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#161413] border border-[#2e2a28] text-xs text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none resize-none"
                          />

                          <button
                            type="submit"
                            className="py-2.5 px-4 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publier mon avis</span>
                          </button>
                        </>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                <div className="space-y-3">
                  {localReviews.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#181615] border border-[#262220] text-center text-xs text-[#8f8883]">
                      Soyez le premier à donner votre avis sur ce plat !
                    </div>
                  ) : (
                    localReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-[#181615] border border-[#292625] space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#fda4af] font-bold text-[10px] flex items-center justify-center font-display shrink-0">
                              {rev.avatar}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#f5f3f0] flex items-center gap-1.5">
                                <span>{rev.author}</span>
                                {rev.verifiedOrder && (
                                  <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.2 rounded font-mono">
                                    Vérifié
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#8f8883]">
                                {rev.location} · {rev.date}
                              </div>
                            </div>
                          </div>

                          {/* Star rating display */}
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={`star-${rev.id}-${star}`}
                                className={`w-3 h-3 ${
                                  star <= Math.round(rev.rating)
                                    ? 'text-[#e11d48] fill-[#e11d48]'
                                    : 'text-[#383330]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-[#c4bfb9] leading-relaxed">
                          « {rev.comment} »
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
