import React from 'react';

export const MenuCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col bg-[#161413] rounded-2xl overflow-hidden border border-[#2b2725] transition-all"
      role="status"
      aria-label="Chargement du plat en cours..."
    >
      {/* Image Skeleton with Shimmer */}
      <div className="relative aspect-[4/3] bg-[#1e1b19] skeleton-shimmer overflow-hidden">
        {/* Top badge placeholder */}
        <div className="absolute top-3 left-3 w-28 h-5 rounded-md bg-[#2d2927]/60" />
        {/* Spicy badge placeholder */}
        <div className="absolute top-3 right-3 w-16 h-5 rounded-md bg-[#2d2927]/60" />
        {/* Bottom-right price placeholder */}
        <div className="absolute bottom-3 right-3 w-24 h-7 rounded-lg bg-[#2d2927]/80" />
      </div>

      {/* Body Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata kicker placeholder */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="h-3 w-24 rounded bg-[#272321] skeleton-shimmer" />
            <div className="h-3 w-12 rounded bg-[#272321] skeleton-shimmer" />
          </div>

          {/* Dish title placeholder */}
          <div className="h-5 w-4/5 rounded-md bg-[#2e2a28] skeleton-shimmer mb-3" />

          {/* Description placeholders */}
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded bg-[#24201e] skeleton-shimmer" />
            <div className="h-3 w-11/12 rounded bg-[#24201e] skeleton-shimmer" />
            <div className="h-3 w-3/4 rounded bg-[#24201e] skeleton-shimmer" />
          </div>
        </div>

        {/* Action button row placeholder */}
        <div className="pt-4 border-t border-[#262220] flex items-center gap-2">
          <div className="flex-1 h-9 rounded-xl bg-[#2a2624] skeleton-shimmer" />
          <div className="w-9 h-9 rounded-xl bg-[#221f1d] skeleton-shimmer shrink-0" />
        </div>
      </div>
    </div>
  );
};

export const TikTokCardSkeleton: React.FC = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden bg-[#181615] border border-[#2e2a28] flex flex-col"
      role="status"
      aria-label="Chargement de la vidéo TikTok..."
    >
      {/* Video Thumbnail Skeleton */}
      <div className="relative aspect-[3/4] bg-[#1e1b19] skeleton-shimmer overflow-hidden">
        {/* Top tag */}
        <div className="absolute top-3 left-3 w-20 h-5 rounded bg-[#2d2927]/70" />
        {/* Duration badge */}
        <div className="absolute top-3 right-3 w-10 h-4 rounded bg-[#2d2927]/70" />

        {/* Center play icon ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#2a2624]/80 flex items-center justify-center" />
        </div>

        {/* Bottom metrics placeholder */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="w-16 h-4 rounded bg-[#2d2927]/80" />
          <div className="w-14 h-4 rounded bg-[#2d2927]/80" />
        </div>
      </div>

      {/* Caption skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="h-4 w-4/5 rounded bg-[#2e2a28] skeleton-shimmer" />
        <div className="space-y-1">
          <div className="h-3 w-full rounded bg-[#24201e] skeleton-shimmer" />
          <div className="h-3 w-2/3 rounded bg-[#24201e] skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};
