'use client';

import React from 'react';
import NativeBannerAd from './NativeBannerAd';
import SkyscraperBannerAd from './SkyscraperBannerAd';

export default function ToolPageWrapper({ children }) {
  return (
    <div className="relative min-h-[calc(100vh-140px)]">
      {/* Left Sticky Desktop Skyscraper Banner (Matching left flank) */}
      <aside
        aria-label="Left Sidebar Advertisement"
        className="hidden xl:block fixed left-2 xl:left-4 2xl:left-6 top-28 z-20 w-[160px]"
      >
        <SkyscraperBannerAd />
      </aside>

      {/* Right Sticky Desktop Skyscraper Banner (Matching right flank) */}
      <aside
        aria-label="Right Sidebar Advertisement"
        className="hidden xl:block fixed right-2 xl:right-4 2xl:right-6 top-28 z-20 w-[160px]"
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
