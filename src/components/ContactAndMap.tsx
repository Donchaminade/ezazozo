import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle2, Navigation, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { motion } from 'motion/react';

export const ContactAndMap: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Réservation de Table',
    guests: '2 Personnes',
    date: '',
    time: '19:30',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const text = `*RÉSERVATION / MESSAGE EZA ZOZO (Lomé)* 📅\n` +
      `- Nom : ${formData.name}\n` +
      `- Téléphone : ${formData.phone}\n` +
      `- Type : ${formData.type}\n` +
      `- Nombre de convives : ${formData.guests}\n` +
      `- Date & Heure : ${formData.date || "Aujourd'hui"} à ${formData.time}\n` +
      `- Note/Demande : ${formData.message || 'Aucune'}\n\n` +
      `Merci de me confirmer la réservation !`;

    window.open(`https://wa.me/22890123456?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-[#0f0e0e] relative border-t border-[#262220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs uppercase tracking-widest text-[#e11d48] font-semibold mb-2">
            Nous Trouver & Réserver
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display">
            Contact & Emplacements à Lomé
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#a8a19b]">
            Venez déguster sur place en terrasse ou faites votre demande de réservation et banquet événementiel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Info Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Practical info cards */}
            <div className="p-6 rounded-2xl bg-[#161413] border border-[#2b2725] space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#e11d48]/15 text-[#e11d48] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f3f0] font-display">Adresse Principale</h3>
                  <p className="text-xs sm:text-sm text-[#c4bfb9] mt-0.5">
                    {RESTAURANT_INFO.address}
                  </p>
                  <p className="text-xs text-[#8f8883] mt-1">
                    Point de repère : Face au boulevard lagunaire, près de Bè-Plage
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#262220]">
                <div className="p-3 rounded-xl bg-[#e11d48]/10 text-[#fda4af] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f3f0] font-display">Horaires de Service</h3>
                  <p className="text-xs sm:text-sm text-[#c4bfb9] mt-0.5">
                    {RESTAURANT_INFO.openingHours}
                  </p>
                  <p className="text-xs text-[#8f8883] mt-1">
                    Service grillades continu midi et soir
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#262220]">
                <div className="p-3 rounded-xl bg-[#25d366]/15 text-[#25d366] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f3f0] font-display">Téléphone & WhatsApp Direct</h3>
                  <div className="flex flex-col gap-1 mt-1 text-xs sm:text-sm">
                    <a
                      href={`tel:${RESTAURANT_INFO.whatsappNumber}`}
                      className="text-[#f5f3f0] hover:text-[#e11d48] font-mono transition-colors"
                    >
                      {RESTAURANT_INFO.whatsappDisplay} (Commandes & WhatsApp)
                    </a>
                    <a
                      href={`tel:${RESTAURANT_INFO.phoneSecondary}`}
                      className="text-[#a8a19b] hover:text-[#e11d48] font-mono transition-colors"
                    >
                      {RESTAURANT_INFO.phoneSecondary} (Service & Banquets)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Stylized Map Card */}
            <div className="rounded-2xl overflow-hidden bg-[#161413] border border-[#2b2725] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#fda4af]">
                  Plan d'Accès Lomé
                </span>
                <a
                  href="https://maps.google.com/?q=Lome+Togo+Boulevard+Circulaire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#e11d48] hover:underline flex items-center gap-1 font-medium"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Itinéraire Google Maps</span>
                </a>
              </div>

              {/* Simulated Map Visual */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#1e1b19] border border-[#2e2a28] flex items-center justify-center text-center p-4">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-xs font-bold text-[#f5f3f0]">EZA ZOZO GRILLADE</div>
                  <div className="text-[11px] text-[#8f8883]">Boulevard Circulaire · Bè-Plage, Lomé</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reservation / Contact Form Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#161413] rounded-2xl border border-[#2b2725] p-6 sm:p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#f5f3f0] font-display">
                Réserver une Table ou Commander un Festin
              </h3>
              <p className="text-xs sm:text-sm text-[#a8a19b] mt-1">
                Remplissez ce formulaire et notre gérance vous recontacte dans les plus brefs délais.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-xl bg-[#1c221e] border border-[#2e4d3a] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#f5f3f0] font-display">
                  Demande Transmise avec Succès !
                </h4>
                <p className="text-xs sm:text-sm text-[#c4bfb9] max-w-md mx-auto">
                  Merci {formData.name}, nous avons bien reçu votre demande pour {formData.guests}. Pour un traitement prioritaire instantané, vous pouvez également nous l'envoyer directement sur WhatsApp.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleSendToWhatsApp}
                    className="py-2.5 px-5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Transmettre sur WhatsApp Direct</span>
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="py-2.5 px-4 rounded-xl bg-[#2b2725] text-[#c4bfb9] text-xs font-medium"
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bfb9] mb-1">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Koffi Mensah"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] text-sm text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bfb9] mb-1">
                      Téléphone / WhatsApp (Togo ou International) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+228 90 00 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] text-sm text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bfb9] mb-1">
                      Type de Demande
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] text-sm text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none transition-colors"
                    >
                      <option>Réservation de Table</option>
                      <option>Commande à Emporter</option>
                      <option>Livraison à Domicile</option>
                      <option>Banquet / Événement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bfb9] mb-1">
                      Nombre de Convives
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] text-sm text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none transition-colors"
                    >
                      <option>1 Personne</option>
                      <option>2 Personnes</option>
                      <option>3 à 4 Personnes</option>
                      <option>5 à 8 Personnes</option>
                      <option>Plus de 10 Personnes (Groupe)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bfb9] mb-1">
                      Heure Souhaitée
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] text-sm text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4bfb9] mb-1">
                    Précisions ou Poissons souhaités (Optionnel)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Nous souhaitons 2 dorades bien pimentées avec double alloco et une table en terrasse..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1d1b] border border-[#2e2a28] text-sm text-[#f5f3f0] focus:border-[#e11d48] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 px-5 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer la Demande</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:w-auto py-3 px-5 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/30 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Direct</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
