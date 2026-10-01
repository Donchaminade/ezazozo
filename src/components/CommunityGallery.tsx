import React, { useState } from 'react';
import { Heart, MessageCircle, MapPin, Sparkles, Camera, Check, ExternalLink, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityPost {
  id: string;
  image: string;
  author: string;
  avatar: string;
  handle: string;
  neighborhood: string;
  dishName: string;
  timeAgo: string;
  likes: number;
  userLiked?: boolean;
  caption: string;
}

interface StoryItem {
  id: string;
  title: string;
  image: string;
  author: string;
  badge: string;
  duration: string;
}

const STORIES: StoryItem[] = [
  {
    id: 's1',
    title: 'Arrivage Frais',
    image: '/src/assets/images/hero_grilled_fish_1790838427559.jpg',
    author: 'Brigade Eza Zozo',
    badge: 'Port de Lomé 06h30',
    duration: 'Ce matin'
  },
  {
    id: 's2',
    title: 'Braise Ardente',
    image: '/src/assets/images/chef_adanlete_grill_1790838467936.jpg',
    author: 'Mr Adanlete',
    badge: 'Au grill en direct',
    duration: 'Il y a 1h'
  },
  {
    id: 's3',
    title: 'Plateau Bar XL',
    image: '/src/assets/images/community_platter_dining_1790843503107.jpg',
    author: '@koffi_lome',
    badge: 'Bè-Plage',
    duration: 'Il y a 3h'
  },
  {
    id: 's4',
    title: 'Snapper Pimenté',
    image: '/src/assets/images/community_seafood_friends_1790843517438.jpg',
    author: '@amina_foodie',
    badge: 'Tokoin',
    duration: 'Hier soir'
  },
  {
    id: 's5',
    title: 'Festin Royal',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    author: '@togobigtable',
    badge: 'Nyékonakpoè',
    duration: 'Hier'
  }
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    image: '/src/assets/images/community_platter_dining_1790843503107.jpg',
    author: 'Koffi & Famille',
    avatar: 'KM',
    handle: '@koffi_mensah_lome',
    neighborhood: 'Bè-Plage, Lomé',
    dishName: 'Grand Bar Sauvage XL & Alloco Doré',
    timeAgo: 'Il y a 2 heures',
    likes: 148,
    caption: 'Le meilleur poisson braisé de tout le Togo sans hésiter. La marinade de Mr Adanlete est un pur chef-d’œuvre ! 🔥'
  },
  {
    id: 'post-2',
    image: '/src/assets/images/community_seafood_friends_1790843517438.jpg',
    author: 'Amina B.',
    avatar: 'AB',
    handle: '@amina_lifestyle',
    neighborhood: 'Tokoin Douane',
    dishName: 'Carpe Rouge Croustillante & Piment Noir',
    timeAgo: 'Il y a 5 heures',
    likes: 96,
    caption: 'Ce piment noir maison avec l’attiéké bien moelleux... Un délice absolu. Commande reçue ultra chaude !'
  },
  {
    id: 'post-3',
    image: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    author: 'Équipe Société Nyéko',
    avatar: 'SN',
    handle: '@nyeko_digital',
    neighborhood: 'Nyékonakpoè',
    dishName: 'Dorade Royale Braisée de 1.2kg',
    timeAgo: 'Hier soir',
    likes: 215,
    caption: 'Déjeuner d’équipe réussi grâce à Eza Zozo. Tout le monde a adoré la fraîcheur et la chair juteuse.'
  },
  {
    id: 'post-4',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    author: 'Delali & David',
    avatar: 'DD',
    handle: '@delali_togo',
    neighborhood: 'Agoè-Assiyéyé',
    dishName: 'Plateau Festif Duo Capitaine & Garnitures',
    timeAgo: 'Il y a 2 jours',
    likes: 182,
    caption: 'Pour fêter notre anniversaire de mariage, on a pris le grand plateau avec double portion d’alloco. Recommandé à 100% !'
  }
];

export const CommunityGallery: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const userLiked = !p.userLiked;
          return {
            ...p,
            userLiked,
            likes: userLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const sharePhotoViaWhatsApp = () => {
    const text = `Bonjour Eza Zozo ! Je souhaite partager ma photo de plateau pour apparaître sur Le Mur des Gourmands avec le hashtag #EzaZozoLomé.`;
    window.open(`https://wa.me/22890123456?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="communaute" className="py-20 bg-[#121111] relative border-t border-[#262220] overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#e11d48]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-[#fda4af] font-semibold mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#e11d48]" />
              <span>Communauté & Réseaux</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f3f0] font-display">
              Le Mur des Gourmands
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#a8a19b] max-w-xl">
              Les moments partagés en terrasse et en livraison par les passionnés de braise à Lomé. Taggez <strong>#EzaZozoLomé</strong> pour rejoindre le mur !
            </p>
          </div>

          <button
            onClick={sharePhotoViaWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold shadow-lg shadow-[#e11d48]/20 transition-all cursor-pointer self-start md:self-end"
          >
            <Camera className="w-4 h-4" />
            <span>Envoyer Ma Photo de Plateau</span>
          </button>
        </motion.div>

        {/* Stories Strip (Instagram / WhatsApp style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8f8883] mb-4 flex items-center gap-2">
            <span>Stories du Jour en Direct</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-5 overflow-x-auto pb-4 no-scrollbar">
            {STORIES.map((story, index) => (
              <div
                key={story.id}
                onClick={() => setActiveStoryIndex(index)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="p-0.5 rounded-full border-2 border-[#e11d48] group-hover:scale-105 transition-transform duration-300">
                  <div className="p-0.5 rounded-full bg-[#121111]">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-[#f5f3f0] group-hover:text-[#e11d48] transition-colors line-clamp-1 max-w-[85px]">
                    {story.title}
                  </div>
                  <div className="text-[10px] text-[#8f8883] line-clamp-1">
                    {story.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Community Wall Grid with Staggered Slide In */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: isLeft ? -45 : 45, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedPost(post)}
                className="group bg-[#181615] rounded-2xl overflow-hidden border border-[#2e2a28] hover:border-[#e11d48]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-[4/3] bg-[#221f1d] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.dishName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-[#181615]/75" />

                    {/* Neighborhood Badge */}
                    <div className="absolute top-3 left-3 bg-[#121111]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-[#f5f3f0] border border-[#332e2b] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#e11d48]" />
                      <span>{post.neighborhood}</span>
                    </div>

                    {/* Like button on top right */}
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        post.userLiked
                          ? 'bg-[#e11d48] text-white'
                          : 'bg-[#121111]/80 text-[#f5f3f0] hover:text-[#e11d48]'
                      }`}
                      aria-label="Aimer cette publication"
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Caption & Dish info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#fda4af] font-bold text-[10px] flex items-center justify-center font-display shrink-0">
                        {post.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#f5f3f0] truncate">{post.author}</div>
                        <div className="text-[10px] text-[#8f8883] truncate">{post.handle}</div>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-[#fda4af] mb-1.5 font-display line-clamp-1">
                      {post.dishName}
                    </div>

                    <p className="text-xs text-[#a8a19b] leading-relaxed line-clamp-2">
                      "{post.caption}"
                    </p>
                  </div>
                </div>

                {/* Footer with Likes & Time */}
                <div className="px-4 py-3 border-t border-[#262220] flex items-center justify-between text-xs text-[#8f8883]">
                  <div className="flex items-center gap-1.5">
                    <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'text-[#e11d48] fill-current' : 'text-[#8f8883]'}`} />
                    <span className="font-mono tabular-nums text-[#f5f3f0]">{post.likes}</span>
                    <span className="text-[11px]">mentions</span>
                  </div>
                  <span className="text-[11px] font-mono">{post.timeAgo}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Lightbox Modal */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setActiveStoryIndex(null)}
          >
            <div
              className="relative w-full max-w-sm aspect-[9/16] bg-[#161413] rounded-3xl overflow-hidden border border-[#332e2b] shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Story image */}
              <img
                src={STORIES[activeStoryIndex].image}
                alt={STORIES[activeStoryIndex].title}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-black/80" />

              {/* Top Progress bar and Header */}
              <div className="relative z-10 p-4">
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#e11d48] w-full animate-[progress_5s_linear]" />
                </div>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-display">{STORIES[activeStoryIndex].title}</span>
                    <span className="text-[10px] text-[#fda4af] bg-[#121111]/80 px-2 py-0.5 rounded border border-[#e11d48]/40">
                      {STORIES[activeStoryIndex].badge}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveStoryIndex(null)}
                    className="p-1 rounded-full bg-black/50 text-white hover:text-[#e11d48]"
                    aria-label="Fermer la story"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="relative z-10 flex justify-between px-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStoryIndex((prev) => (prev! > 0 ? prev! - 1 : STORIES.length - 1));
                  }}
                  className="p-2 rounded-full bg-black/40 text-white/80 hover:text-white"
                  aria-label="Story précédente"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStoryIndex((prev) => (prev! < STORIES.length - 1 ? prev! + 1 : 0));
                  }}
                  className="p-2 rounded-full bg-black/40 text-white/80 hover:text-white"
                  aria-label="Story suivante"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Card Actions */}
              <div className="relative z-10 p-5">
                <div className="text-xs text-[#c4bfb9] mb-3">
                  Partagé par <strong className="text-white">{STORIES[activeStoryIndex].author}</strong> · {STORIES[activeStoryIndex].duration}
                </div>
                <a
                  href="https://wa.me/22890123456?text=Bonjour%20Eza%20Zozo%2C%20j'ai%20vu%20la%20story%20du%20jour%20et%20je%20souhaite%20commander%20!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#fda4af]" />
                  <span>Commander ce Poisson Braisé</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-[#161413] rounded-3xl overflow-hidden border border-[#2e2a28] shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:text-[#e11d48]"
                aria-label="Fermer le détail"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto bg-[#221f1d]">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.dishName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#fda4af] font-bold text-xs flex items-center justify-center font-display">
                      {selectedPost.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#f5f3f0]">{selectedPost.author}</div>
                      <div className="text-xs text-[#8f8883]">{selectedPost.handle} · {selectedPost.neighborhood}</div>
                    </div>
                  </div>

                  <div className="text-sm font-bold text-[#fda4af] font-display mb-2">
                    {selectedPost.dishName}
                  </div>

                  <p className="text-xs sm:text-sm text-[#c4bfb9] leading-relaxed mb-6">
                    "{selectedPost.caption}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#262220] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#f5f3f0]">
                    <Heart className="w-4 h-4 text-[#e11d48] fill-current" />
                    <span className="font-mono font-bold">{selectedPost.likes}</span>
                    <span className="text-[#8f8883]">coups de cœur</span>
                  </div>

                  <a
                    href={`https://wa.me/22890123456?text=Bonjour%20Eza%20Zozo%2C%20je%20veux%20commander%20exactement%20comme%20la%20publication%20de%20${encodeURIComponent(selectedPost.author)}%20%3A%20${encodeURIComponent(selectedPost.dishName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#25d366] text-xs font-semibold border border-[#25d366]/30 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Commander le Même</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
