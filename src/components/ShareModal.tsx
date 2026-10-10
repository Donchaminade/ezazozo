import React, { useRef, useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, MessageCircle, Facebook, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOverlay } from '../hooks/useOverlay';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlay(isOpen, onClose, panelRef);
  // Phones get a bottom sheet, larger screens a centered card.
  const sheet = !useMediaQuery('(min-width: 40rem)');

  // Fallback to shared URL or current origin
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-bbqj7qf3vitajk7urcxcet-535572357294.europe-west2.run.app';
  const shareTitle = "Eza Zozo - L'Art du Poisson Grillé à Lomé | Mr Adanlete";
  const shareText = "Découvrez Eza Zozo à Lomé : les meilleurs poissons frais braisés au feu de bois avec alloco et attiéké ! 🐟🔥";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopy();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n👉 Découvrez la carte et commandez ici : ${shareUrl}`
  )}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="share-modal" data-lenis-prevent className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            tabIndex={-1}
            initial={sheet ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 15 }}
            animate={sheet ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={sheet ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={sheet ? { duration: 0.4, ease: [0.16, 1, 0.3, 1] } : { duration: 0.25 }}
            className="relative w-full max-w-lg max-h-[92svh] flex flex-col overflow-hidden bg-[#161413] border border-b-0 sm:border-b border-[#2e2a28] rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 outline-none"
          >
            {/* Header */}
            <div className="shrink-0 mx-5 sm:mx-6 pt-5 sm:pt-6 flex items-center justify-between gap-3 pb-4 border-b border-[#262220]">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 id="share-title" className="text-base font-bold text-[#f5f3f0] font-display">
                    Partager Eza Zozo
                  </h3>
                  <p className="text-xs text-[#8f8883]">
                    Aperçu officiel de l'affiche et lien de partage
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#8f8883] hover:text-[#f5f3f0] hover:bg-[#211e1c] transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-6 sm:pb-6">
              {/* Social Share Preview Card (How it looks on WhatsApp / Facebook / Messages) */}
              <div className="mt-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#fda4af] mb-2 flex flex-wrap items-center justify-between gap-x-3">
                  <span>Aperçu de la carte partagée (Preview)</span>
                  <span className="text-[10px] text-[#8f8883] lowercase font-normal">WhatsApp · Facebook · iMessage</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#332e2b] bg-[#1a1817] shadow-lg">
                  {/* Generated Poster Banner */}
                  <div className="relative aspect-[16/9] bg-[#221f1d] overflow-hidden">
                    <img
                      src="/og-image.jpg"
                      alt="Affiche de prévisualisation Eza Zozo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#0f0e0e]/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-[#fda4af] border border-[#e11d48]/40">
                      Eza Zozo · Lomé
                    </div>
                  </div>

                  {/* Text preview */}
                  <div className="p-3.5 bg-[#121111]">
                    <div className="text-[10px] uppercase font-mono text-[#8f8883] tracking-wider truncate mb-1">
                      ezazozo-lome.tg · Port de Pêche
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#f5f3f0] font-display line-clamp-1">
                      Eza Zozo - L'Art du Poisson Grillé à Lomé | Mr Adanlete
                    </h4>
                    <p className="text-[11px] text-[#a8a19b] line-clamp-2 mt-1 leading-relaxed">
                      Savourez les meilleurs poissons frais braisés au feu de bois à Lomé : bar sauvage, dorade, carpe rouge marinée avec alloco et attiéké.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="mt-5 space-y-3">
                {/* WhatsApp & Native share */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-11 py-2.5 px-4 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Partager sur WhatsApp</span>
                  </a>

                  {typeof navigator !== 'undefined' && 'share' in navigator ? (
                    <button
                      onClick={handleNativeShare}
                      className="min-h-11 py-2.5 px-4 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Options de partage</span>
                    </button>
                  ) : (
                    <a
                      href={facebookShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-11 py-2.5 px-4 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Partager sur Facebook</span>
                    </a>
                  )}
                </div>

                {/* Copy URL input bar */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1e1b1a] border border-[#2e2a28]">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    aria-label="Lien du site"
                    className="min-w-0 flex-1 self-stretch bg-transparent px-2 sm:px-3 text-base text-[#c4bfb9] font-mono outline-none truncate pointer-fine:text-xs"
                  />
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 min-h-11 py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer pointer-fine:min-h-0 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#292625] hover:bg-[#383330] text-[#f5f3f0]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
