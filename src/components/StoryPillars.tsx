import React from 'react';
import { Waves, Flame, UtensilsCrossed, ShieldCheck, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';

export const StoryPillars: React.FC = () => {
  return (
    <section id="concept" className="py-20 bg-[#121111] relative overflow-hidden border-t border-[#242120]">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#e11d48]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-xs uppercase tracking-widest text-[#e11d48] font-semibold mb-2">
            L'Âme d'Eza Zozo
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display tracking-tight text-balance">
            Une Tradition de Grillade Réinventée avec Passion
          </h2>
          <p className="mt-4 text-base text-[#a8a19b] leading-relaxed text-balance">
            Né de l’amour des bons produits de la mer et de la convivialité togolaise, Eza Zozo sublime chaque prise grâce au savoir-faire de Mr Adanlete et son équipe d'artisans grillardins.
          </p>
        </motion.div>

        {/* Story & Chef Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#2b2725] shadow-2xl bg-[#181615]">
              <img
                src="/src/assets/images/chef_adanlete_grill_1790838467936.jpg"
                alt="Mr Adanlete au barbecue grillant du poisson avec passion à Lomé"
                className="w-full h-[400px] object-cover object-top hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#0f0e0e]/40" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#121111]/90 backdrop-blur-md border border-[#2e2a28]">
                <div className="text-sm font-semibold text-[#f5f3f0] font-display">
                  Mr Adanlete & La Brigade Eza Zozo
                </div>
                <p className="text-xs text-[#fda4af] mt-0.5">
                  « Le secret n’est pas seulement dans la braise, il est dans le respect du poisson et l’amour de régaler Lomé. »
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            <h3 className="text-2xl font-bold text-[#f5f3f0] font-display">
              Du Port de Pêche à Votre Table : La Rigueur de l'Excellence
            </h3>
            <p className="text-sm sm:text-base text-[#c4bfb9] leading-relaxed">
              À Lomé, la grillade est un art de vivre. Chaque matin à l’aube, nos équipes se rendent directement aux débarcadères de pêche pour sélectionner les plus beaux spécimens : capitaines aux écailles brillantes, dorades vigoureuses, carpes et bars sauvages.
            </p>
            <p className="text-sm sm:text-base text-[#c4bfb9] leading-relaxed">
              Chaque pièce est ensuite minutieusement écaillée, vidée et massée avec notre marinade signature — une alchimie secrète d’aromates locaux, ail pilé, gingembre du plateau de Dayes et poivres torréfiés — avant de rencontrer les braises frémissantes.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#292625]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#e11d48] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#f5f3f0]">Hygiène irréprochable & chaîne du froid</span>
              </div>
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-5 h-5 text-[#fda4af] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#f5f3f0]">Soutien direct aux pêcheurs togolais</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-[#181615] border border-[#2b2725] hover:border-[#e11d48]/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 flex items-center justify-center text-[#e11d48] mb-5 group-hover:scale-110 transition-transform">
              <Waves className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#f5f3f0] mb-2 font-display">
              1. Fraîcheur Mer Garantie
            </h4>
            <p className="text-sm text-[#a8a19b] leading-relaxed">
              Arrivage quotidien sans intermédiaire. Aucun poisson congelé chez Eza Zozo : la chair garde toute son humidité naturelle et son goût iodé exquis.
            </p>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-[#181615] border border-[#2b2725] hover:border-[#e11d48]/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 flex items-center justify-center text-[#e11d48] mb-5 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#f5f3f0] mb-2 font-display">
              2. Marinade Secrète & Braise
            </h4>
            <p className="text-sm text-[#a8a19b] leading-relaxed">
              La marinade artisanale de Mr Adanlete pénètre en profondeur la chair. Cuisson lente et maîtrisée sur charbon de bois naturel pour une croûte caramélisée.
            </p>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-[#181615] border border-[#2b2725] hover:border-[#e11d48]/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 flex items-center justify-center text-[#e11d48] mb-5 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#f5f3f0] mb-2 font-display">
              3. Garnitures Généreuses
            </h4>
            <p className="text-sm text-[#a8a19b] leading-relaxed">
              Alloco moelleux de plantains mûrs, attiéké parfumé, frites maison croustillantes et notre incontournable piment noir mijoté façon grand-mère.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
