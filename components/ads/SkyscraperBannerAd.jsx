'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Adsterra 160x600 Skyscraper Banner Ad Component
 * Key: f5aae5e7d14842866b425d849b3825a9
 * Script: https://bauval.org/22/f5aae5e7d14842866b425d849b3825a9
 */
export default function SkyscraperBannerAd({ className = '', label = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;

    // Reset container to avoid duplicate iframes on navigation
    container.innerHTML = '';

    // Create an isolated same-origin iframe so document.write from Adsterra
    // works without breaking React, while preserving parent domain/referrer
    const iframe = document.createElement('iframe');
    iframe.width = '160';
    iframe.height = '600';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.title = 'Sponsored Ad';

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
                  width: 160px;
                  height: 600px;
                  overflow: hidden;
                  background: transparent;
                  display: flex;
                  align-items: flex-start;
                  justify-content: center;
                }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : 'f5aae5e7d14842866b425d849b3825a9',
                  'format' : 'iframe',
                  'height' : 600,
                  'width' : 160,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://bauval.org/22/f5aae5e7d14842866b425d849b3825a9"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    } catch (e) {
      console.warn('Adsterra banner initialization fallback:', e);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 font-medium">
          Advertisement
        </span>
      )}
      <div
        ref={containerRef}
        className="w-[160px] min-h-[600px] overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-xs flex items-center justify-center"
      />
    </div>
  );
}
