"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Check, Share2, Printer, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArticleActions({ title, url }) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title || 'AnantAstra Blog',
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* Top Reading Progress Bar (Strictly Zero Gradient, Clean Flat Primary) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border/40">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-2 py-3 border-y border-border/60 my-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="text-xs h-8 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-muted-foreground" />
              <span>Copy Link</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="text-xs h-8 gap-1.5"
        >
          <Share2 className="size-3.5 text-muted-foreground" />
          <span>Share</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Printer className="size-3.5" />
          <span>Print</span>
        </Button>
      </div>
    </>
  );
}
