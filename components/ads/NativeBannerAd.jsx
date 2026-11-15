'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Individual Native Ad Card Slot
 * Encapsulated in a same-origin frame to allow parallel 1x1 widgets
 * to render into a unified 4-card recommendation grid.
 */
function NativeAdSlot({ index }) {
  const slotRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = slotRef.current;
    if (!container) return;

    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '240px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.title = `Sponsored Recommendation ${index + 1}`;

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <base href="${window.location.origin}/">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body {
                  width: 100%;
                  height: 100%;
                  background: transparent;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                #container-1a1d2b2908a923be2827d27b2a07813c {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              </style>
            </head>
            <body>
              <div id="container-1a1d2b2908a923be2827d27b2a07813c"></div>
              <script async="async" data-cfasync="false" src="https://bauval.org/21/1a1d2b2908a923be2827d27b2a07813c"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    } catch (e) {
      console.warn('Native ad slot error:', e);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [index]);

  return (
    <div
      ref={slotRef}
      className="w-full min-h-[240px] flex items-center justify-center rounded-xl bg-muted/20 overflow-hidden border border-border/40 hover:border-primary/30 transition-all duration-200"
    />
  );
}

/**
 * Adsterra 4-Card Native Banner Ad Component
 * Container: container-1a1d2b2908a923be2827d27b2a07813c
 * Script: https://bauval.org/21/1a1d2b2908a923be2827d27b2a07813c
 */
export default function NativeBannerAd({ className = '', count = 4 }) {
  return (
    <aside aria-label="Sponsored Content" className={`w-full my-8 ${className}`}>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-border/40 text-[11px] font-medium text-muted-foreground">
          <span className="tracking-wide">Recommended For You</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border/50 bg-muted/60 uppercase font-semibold text-muted-foreground">
            Sponsored
          </span>
        </div>

        {/* 4-Ad Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {Array.from({ length: count }).map((_, idx) => (
            <NativeAdSlot key={idx} index={idx} />
          ))}
        </div>
      </div>
    </aside>
  );
}
