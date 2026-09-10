"use client";

import React, { useState, useEffect } from 'react';
import { slugify } from './MarkdownRenderer';
import { ListTree, ChevronRight } from 'lucide-react';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content) return;
    const lines = content.split('\n');
    const extracted = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '');
        const id = slugify(text);
        extracted.push({ text, id });
      }
    });

    setHeadings(extracted);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border/60 text-foreground font-semibold text-sm">
        <ListTree className="size-4 text-primary" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-1">
        {headings.map((h, idx) => {
          const isActive = activeId === h.id;
          return (
            <a
              key={idx}
              href={`#${h.id}`}
              className={`group flex items-start gap-2 py-1.5 px-2 rounded-lg text-xs leading-snug transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <ChevronRight
                className={`size-3.5 mt-0.5 shrink-0 transition-transform ${
                  isActive ? 'text-primary translate-x-0.5' : 'text-muted-foreground/50'
                }`}
              />
              <span className="line-clamp-2">{h.text}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
