import React, { useState } from 'react';
import { TIKTOK_VIDEOS, REVIEWS, RESTAURANT_INFO } from '../data/restaurantData';
import { Play, Heart, Eye, Star, ExternalLink, Volume2, VolumeX, CheckCircle, Flame, RefreshCw } from 'lucide-react';
import { TikTokVideo } from '../types';
import { TikTokCardSkeleton } from './Skeletons';
import { motion } from 'motion/react';

export const TikTokFeed: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 550);
  };

  return (
    <section id="tiktok" className="py-20 bg-[#0f0e0e] relative border-t border-[#262220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-[#ff5722] font-semibold mb-2 flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ff5722]" />
                Phénomène Viral à Lomé
              </span>
              <button
                onClick={handleRefresh}
                className="text-[#8f8883] hover:text-[#ff5722] transition-colors p-1 rounded inline-flex items-center gap-1 text-[11px] font-normal"
                title="Actualiser les vidéos récentes"
                aria-label="Actualiser les vidéos TikTok"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#ff5722]' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display">
              L'Univers TikTok de Mr Adanlete
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#a8a19b] max-w-xl">
              Retrouvez l'énergie festive d'Eza Zozo sur les réseaux : astuces de braise, arrivages en direct et dégustations croustillantes.
            </p>
          </div>

          <a
            href={RESTAURANT_INFO.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d1b1a] hover:bg-[#282523] border border-[#383330] text-xs font-semibold text-[#f5f3f0] transition-colors self-start md:self-end"
          >
            <span>Suivre {RESTAURANT_INFO.tiktokHandle}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ff5722]" />
          </a>
        </motion.div>

        {/* TikTok Video Cards Grid with Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <TikTokCardSkeleton key={`tiktok-skeleton-${index}`} />
            ))
          ) : (
            TIKTOK_VIDEOS.map((vid, idx) => (
              <motion.div
                key={vid.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedVideo(vid)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-[#181615] border border-[#2e2a28] hover:border-[#ff5722]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl relative flex flex-col"
              >
                {/* Video Thumbnail (Vertical 9:16 vibe or 4:5) */}
                <div className="relative aspect-[3/4] bg-[#221f1d] overflow-hidden">
                  <img
                    src={vid.coverImage}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121111] via-transparent to-transparent opacity-90" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-[#121111]/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-[#ffc107] border border-[#ffc107]/20">
                    {vid.tag}
                  </div>

                  {/* Duration */}
                  <div className="absolute top-3 right-3 bg-[#121111]/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-[#c4bfb9]">
                    {vid.duration}
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#ff5722]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom stats inside frame */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#f5f3f0]">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#ffc107]" />
                      <span className="font-mono">{vid.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#ff5722]" />
                      <span className="font-mono">{vid.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#f5f3f0] font-display line-clamp-1 mb-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-[#8f8883] line-clamp-2 leading-relaxed">
                    {vid.caption}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Customer Proof & Testimonials */}
        <div className="pt-10 border-t border-[#262220]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <div className="text-xs uppercase tracking-widest text-[#ffc107] font-semibold mb-2">
              Avis & Témoignages
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#f5f3f0] font-display">
              Ce que Lomé Dit d'Eza Zozo
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl bg-[#161413] border border-[#2b2725] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#ffc107] mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#c4bfb9] leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#262220] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#ff5722]/20 border border-[#ff5722]/40 text-[#ff5722] font-bold text-xs flex items-center justify-center font-display">
                      {rev.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#f5f3f0]">{rev.author}</div>
                      <div className="text-[11px] text-[#8f8883]">{rev.location}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#25d366] flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Vérifié
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-sm bg-[#161413] rounded-3xl overflow-hidden border border-[#3b3633] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reel Header */}
            <div className="p-4 border-b border-[#292625] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ff5722] text-white flex items-center justify-center font-bold text-xs">
                  EZ
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f5f3f0]">Mr Adanlete · Eza Zozo</div>
                  <div className="text-[10px] text-[#8f8883]">{selectedVideo.tag}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-[#a8a19b] hover:text-white p-1 text-sm font-bold"
                aria-label="Fermer la vidéo"
              >
                ✕
              </button>
            </div>

            {/* Video Player Visual */}
            <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
              <img
                src={selectedVideo.coverImage}
                alt={selectedVideo.title}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Center Play Indicator */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <span className="text-xs uppercase tracking-wider font-bold">Pause</span> : <Play className="w-6 h-6 fill-current" />}
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-bold text-sm mb-1">{selectedVideo.title}</div>
                <div className="text-xs text-zinc-300 leading-relaxed">{selectedVideo.caption}</div>
                <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#ffc107]">
                    <Eye className="w-3.5 h-3.5" /> {selectedVideo.views}
                  </span>
                  <span className="flex items-center gap-1 text-[#ff5722]">
                    <Heart className="w-3.5 h-3.5" /> {selectedVideo.likes}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-3 bg-[#121111] flex items-center gap-2">
              <a
                href={RESTAURANT_INFO.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#ff5722] hover:bg-[#e64a19] text-white text-xs font-bold rounded-xl text-center transition-colors"
              >
                Voir sur TikTok
              </a>
              <button
                onClick={() => setSelectedVideo(null)}
                className="py-2.5 px-4 bg-[#262321] hover:bg-[#332f2c] text-[#c4bfb9] text-xs font-medium rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
