'use client';

import React from 'react';

/**
 * Adsterra 160x600 Skyscraper Banner Ad Component
 * Key: f5aae5e7d14842866b425d849b3825a9
 * Script: https://bauval.org/22/f5aae5e7d14842866b425d849b3825a9
 */
export default function SkyscraperBannerAd({ className = '', label = true }) {
  const adHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
  `;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 font-medium">
          Advertisement
        </span>
      )}
      <div className="w-[160px] h-[600px] overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-xs flex items-center justify-center">
        <iframe
          title="Sponsored 160x600 Ad"
          width="160"
          height="600"
          srcDoc={adHtml}
          style={{ border: 'none', overflow: 'hidden', width: '160px', height: '600px' }}
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
