'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Github, 
  Linkedin, 
  Globe, 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  ArrowUp, 
  Check, 
  Send,
  Calculator,
  Binary,
  Code2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    // Prefill and open GitHub issue for community tool requests
    const issueUrl = `https://github.com/Uniquearjav/anantastra/issues/new?title=${encodeURIComponent('Tool Suggestion: ' + feedback)}&body=${encodeURIComponent('Tool or feature suggestion submitted from the Anantastra footer:\n\n' + feedback)}`;
    if (typeof window !== 'undefined') {
      window.open(issueUrl, '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
    setFeedback('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  const toolCategories = [
    {
      title: "Finance & Tax",
      icon: Calculator,
      links: [
        { label: "SIP Calculator", href: "/tools/calculator/sip-calculator", badge: "Popular" },
        { label: "Interest Calculator", href: "/interest-calculator" },
        { label: "Income Tax (India)", href: "/tools/calculator/income-tax-calculator", badge: "FY 24-25" },
        { label: "GST Calculator", href: "/tools/calculator/gst-calculator" },
        { label: "Loan EMI Calculator", href: "/tools/calculator/loan-emi-calculator" },
        { label: "Currency Converter", href: "/tools/converters/currency-converter" },
      ]
    },
    {
      title: "Dev & Text Tools",
      icon: Code2,
      links: [
        { label: "Text Utilities", href: "/text" },
        { label: "Password Generator", href: "/password-generator", badge: "Secure" },
        { label: "Password Age Checker", href: "/tools/password-tools/password-age-checker" },
        { label: "JSON Formatter", href: "/tools/checkers/json-formatter" },
        { label: "Markdown to HTML", href: "/tools/converters/markdown-html-converter" },
        { label: "SVG Converter", href: "/tools/converters/svg-converter" },
      ]
    },
    {
      title: "Math & Checkers",
      icon: Binary,
      links: [
        { label: "Age Calculator", href: "/tools/calculator/age-calculator" },
        { label: "BMI Calculator", href: "/tools/calculator/bmi-calculator" },
        { label: "Decimal to Binary", href: "/tools/calculator/decimal-binary-calculator" },
        { label: "Prime Checker", href: "/tools/checkers/prime-checker" },
        { label: "Palindrome Checker", href: "/tools/checkers/palindrome-checker" },
        { label: "Factorial Calculator", href: "/tools/calculator/factorial-calculator" },
      ]
    },
    {
      title: "Project & Legal",
      icon: Lock,
      links: [
        { label: "About AnantAstra", href: "/about" },
        { label: "All 24+ Utilities", href: "/tools" },
        { label: "Blog & Guides (25 Posts)", href: "/blog" },
        { label: "LLM Context (llms.txt)", href: "/llms.txt" },
        { label: "Privacy Commitment", href: "/privacy" },
        { label: "GitHub Repository", href: "https://github.com/Uniquearjav/anantastra", external: true },
      ]
    }
  ];

  return (
    <footer className="w-full border-t border-border/60 bg-card text-card-foreground">
      {/* Top Banner: Status & Quick Feedback */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Live Operational Status */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-foreground">100% Client-Side Engine</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Zero server latency</span>
              <span className="text-muted-foreground/40">•</span>
              <span>No telemetry collected</span>
            </div>

            {/* Quick Suggestion Box: Integrated Shadcn Input Group */}
            <form onSubmit={handleFeedbackSubmit} className="relative flex items-center w-full sm:w-72">
              <Input
                type="text"
                placeholder="Suggest a tool or feature..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="h-8.5 pl-3 pr-20 text-xs rounded-lg border-border/80 bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="secondary"
                className="absolute right-1 top-1 bottom-1 h-auto px-2.5 rounded-md text-[11px] font-medium gap-1 shrink-0 border border-border/60 hover:bg-accent text-foreground transition-colors"
              >
                {submitted ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 text-muted-foreground" />
                    <span>Suggest</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Directory Links Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">
                  Anantastra
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  v2.0
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              An open-source, privacy-first instrument collection designed to run calculations directly inside your browser. No trackers, no data collection, pure speed.
            </p>

            {/* Trust Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border/70 bg-muted/30 text-foreground">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Zero Tracking
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border/70 bg-muted/30 text-foreground">
                <Zap className="h-3 w-3 text-amber-500" />
                No Cookies
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border/70 bg-muted/30 text-foreground">
                <Code2 className="h-3 w-3 text-primary" />
                MIT License
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://github.com/Uniquearjav/anantastra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="p-2 rounded-full border border-border/70 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/arjav-choudhary-531b2126b/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Arjav Choudhary LinkedIn"
                className="p-2 rounded-full border border-border/70 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.unnatvega.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Unnat Vega Official Website"
                className="p-2 rounded-full border border-border/70 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 4 Tool Category Columns (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {toolCategories.map((col, idx) => {
              const Icon = col.icon;
              return (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span>{col.title}</span>
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform">
                              {link.label}
                            </span>
                            {link.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Credits & Back-to-Top */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {currentYear} Anantastra. Released under the MIT License.</p>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <span>Created with care by</span>
              <a
                href="https://github.com/Uniquearjav"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Arjav Choudhary
              </a>
              <span>&</span>
              <a
                href="https://www.unnatvega.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Unnat Vega
              </a>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="h-8 px-3 rounded-full text-xs gap-1.5 border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Back to top</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
