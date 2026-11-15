'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner Ad Component
 * Container ID: container-1a1d2b2908a923be2827d27b2a07813c
 * Script Source: https://bauval.org/21/1a1d2b2908a923be2827d27b2a07813c
 */
export default function NativeBannerAd({ className = '' }) {
  const adContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = adContainerRef.current;
    if (!container) return;

    // Reset container to avoid duplicate scripts on fast re-renders
    container.innerHTML = '';

    // 1. Create the container div required by Adsterra's script
    const innerDiv = document.createElement('div');
    innerDiv.id = 'container-1a1d2b2908a923be2827d27b2a07813c';
    container.appendChild(innerDiv);

    // 2. Create the script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/21/1a1d2b2908a923be2827d27b2a07813c';

    container.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside aria-label="Sponsored Content" className={`w-full my-8 ${className}`}>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40 text-[11px] font-medium text-muted-foreground">
          <span className="tracking-wide">Recommended For You</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border/50 bg-muted/60 uppercase font-semibold text-muted-foreground">
            Sponsored
          </span>
        </div>
        <div
          ref={adContainerRef}
          className="w-full min-h-[140px] flex flex-col items-center justify-center overflow-hidden"
        />
      </div>
    </aside>
  );
}
