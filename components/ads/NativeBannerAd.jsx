'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner Ad Component
 * Container: container-1a1d2b2908a923be2827d27b2a07813c
 * Script: https://bauval.org/21/1a1d2b2908a923be2827d27b2a07813c
 */
export default function NativeBannerAd({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptSrc = 'https://bauval.org/21/1a1d2b2908a923be2827d27b2a07813c';
    let script = document.querySelector(`script[src="${scriptSrc}"]`);

    if (!script) {
      script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
    } else {
      // Re-trigger reload on SPA page changes if supported by Adsterra script
      try {
        const container = document.getElementById('container-1a1d2b2908a923be2827d27b2a07813c');
        if (container && typeof container.reload === 'function') {
          container.reload();
        }
      } catch (e) {
        // Safe fallback
      }
    }
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
          ref={containerRef}
          id="container-1a1d2b2908a923be2827d27b2a07813c"
          className="w-full min-h-[140px] flex items-center justify-center overflow-hidden"
        />
      </div>
    </aside>
  );
}
