import React from 'react';
import { ShoppingBag, MessageSquare, Bike, Check, Clock, PackageCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { motion } from 'motion/react';

export const OrderProcess: React.FC = () => {
  return (
    <section className="py-20 bg-[#121111] relative border-t border-[#262220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs uppercase tracking-widest text-[#fda4af] font-semibold mb-2">
            Simplicité & Rapidité
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display">
            Commander en 3 Étapes Simples
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a8a19b]">
            Que ce soit pour un déjeuner d’affaires rapide ou un dîner festif en famille, savourez le meilleur de la mer sans attente.
          </p>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 rounded-2xl bg-[#161413] border border-[#2b2725] relative group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#e11d48] font-bold text-lg font-mono flex items-center justify-center mb-6">
              01
            </div>
            <h3 className="text-lg font-bold text-[#f5f3f0] mb-2 font-display">
              Choisissez Vos Plats
            </h3>
            <p className="text-sm text-[#a8a19b] leading-relaxed">
              Explorez la carte ou configurez votre plateau personnalisé avec dorade, capitaine, alloco, attiéké et piments secrets.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 rounded-2xl bg-[#161413] border border-[#2b2725] relative group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#fda4af] font-bold text-lg font-mono flex items-center justify-center mb-6">
              02
            </div>
            <h3 className="text-lg font-bold text-[#f5f3f0] mb-2 font-display">
              Validation Instantanée WhatsApp
            </h3>
            <p className="text-sm text-[#a8a19b] leading-relaxed">
              Un clic génère votre récapitulatif détaillé directement dans WhatsApp. Notre équipe confirme immédiatement la préparation.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 rounded-2xl bg-[#161413] border border-[#2b2725] relative group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#e11d48] font-bold text-lg font-mono flex items-center justify-center mb-6">
              03
            </div>
            <h3 className="text-lg font-bold text-[#f5f3f0] mb-2 font-display">
              À Table ou Livré Chaud à Lomé
            </h3>
            <p className="text-sm text-[#a8a19b] leading-relaxed">
              Dégustez sur place dans notre ambiance chaleureuse ou faites-vous livrer chez vous en 45 minutes dans un emballage thermique préservant le croustillant.
            </p>
          </motion.div>
        </div>

        {/* Delivery Zones Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#1a1716] border border-[#332e2b] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#e11d48]/15 text-[#e11d48] shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#f5f3f0] font-display">
                Zones de Livraison Couvertes à Lomé
              </h4>
              <p className="text-xs sm:text-sm text-[#a8a19b] mt-1 max-w-2xl">
                Bè-Plage, Zone Portuaire, Tokoin, Nyékonakpoè, Kodjoviakopé, Hedzranawoé, Agoè, Adidogomé et Baguida.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#c4bfb9] font-mono">Délai moyen : 35-50 min</span>
            <a
              href="https://wa.me/22890123456?text=Bonjour%2C%20quel%20est%20le%20d%C3%A9lai%20de%20livraison%20actuel%20pour%20mon%20quartier%20%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Vérifier mon Quartier
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
