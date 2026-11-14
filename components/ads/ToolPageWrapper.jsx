'use client';

import React from 'react';
import NativeBannerAd from './NativeBannerAd';
import SkyscraperBannerAd from './SkyscraperBannerAd';

export default function ToolPageWrapper({ children }) {
  return (
    <div className="relative min-h-[calc(100vh-140px)]">
      {/* Sticky Desktop Skyscraper Banner (Visible on extra-wide screens 1536px+) */}
      <aside
        aria-label="Sidebar Advertisement"
        className="hidden 2xl:block fixed right-6 top-32 z-20 w-[160px]"
      >
        <SkyscraperBannerAd />
      </aside>

      {/* Main Content */}
      {children}

      {/* Native Banner Ad below Tool Results */}
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl pb-10">
        <NativeBannerAd />
      </div>
    </div>
  );
}
