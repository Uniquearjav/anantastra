"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { renderInline } from './MarkdownRenderer';

export default function FaqAccordion({ faqs }) {
  const [openIndexes, setOpenIndexes] = useState([0]); // Open first FAQ by default

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="my-10 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="size-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={idx}
              className="rounded-xl border border-border/70 bg-card overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-foreground hover:bg-muted/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-sm sm:text-base text-muted-foreground border-t border-border/40 leading-relaxed bg-muted/10">
                  {renderInline(faq.answer)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
