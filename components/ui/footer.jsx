'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Github, 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  ArrowUp, 
  Calculator,
  Binary,
  Code2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnantastraIcon } from '@/components/ui/logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toolCategories = [
    {
      title: "Finance & Tax",
      icon: Calculator,
      links: [
        { label: "SIP Calculator", href: "/tools/calculator/sip-calculator" },
        { label: "Interest Calculator", href: "/interest-calculator" },
        { label: "Income Tax (India)", href: "/tools/calculator/income-tax-calculator" },
        { label: "GST Calculator", href: "/tools/calculator/gst-calculator" },
        { label: "Loan EMI Calculator", href: "/tools/calculator/loan-emi-calculator" },
        { label: "Currency Converter", href: "/tools/converters/currency-converter" },
      ]
    },
    {
      title: "Dev & Text Tools",
      icon: Code2,
      links: [
        { label: "QR Code Generator", href: "/tools/code-text-tools/qr-code-generator" },
        { label: "UUID / GUID Generator", href: "/tools/code-text-tools/uuid-generator" },
        { label: "Base64 Encoder/Decoder", href: "/tools/converters/base64-encoder-decoder" },
        { label: "CSS Glassmorphism", href: "/tools/code-text-tools/css-glassmorphism-generator" },
        { label: "RegEx Pattern Tester", href: "/tools/code-text-tools/regex-tester" },
        { label: "Word & Readability Counter", href: "/tools/code-text-tools/word-counter" },
        { label: "Campaign UTM Builder", href: "/tools/code-text-tools/utm-builder" },
        { label: "JSON Formatter", href: "/tools/checkers/json-formatter" },
        { label: "Google SERP Simulator", href: "/tools/code-text-tools/google-serp-preview" },
        { label: "Password Generator", href: "/password-generator" },
      ]
    },
    {
      title: "Math & Checkers",
      icon: Binary,
      links: [
        { label: "Color Contrast Checker", href: "/tools/checkers/color-contrast-checker" },
        { label: "Cryptographic Hash Generator", href: "/tools/checkers/hash-generator" },
        { label: "Unix Timestamp Converter", href: "/tools/converters/unix-timestamp-converter" },
        { label: "Age Calculator", href: "/tools/calculator/age-calculator" },
        { label: "BMI Calculator", href: "/tools/calculator/bmi-calculator" },
        { label: "Decimal to Binary", href: "/tools/calculator/decimal-binary-calculator" },
        { label: "Prime Checker", href: "/tools/checkers/prime-checker" },
        { label: "Palindrome Checker", href: "/tools/checkers/palindrome-checker" },
        { label: "Factorial Calculator", href: "/tools/calculator/factorial-calculator" },
        { label: "Unit Converter", href: "/tools/converters/unit-converter" },
      ]
    },
    {
      title: "Project & Legal",
      icon: Lock,
      links: [
        { label: "About Use All Tools", href: "/about" },
        { label: "All 35+ Utilities", href: "/tools" },
        { label: "Blog & Guides (40 Posts)", href: "/blog" },
        { label: "LLM Context (llms.txt)", href: "/llms.txt" },
        { label: "Full LLMs (llms-full.txt)", href: "/llms-full.txt" },
        { label: "Privacy Commitment", href: "/privacy" },
        { label: "GitHub Repository", href: "https://github.com/Uniquearjav/anantastra", external: true },
      ]
    }
  ];

  return (
    <footer className="w-full border-t border-border/60 bg-card text-card-foreground">
      {/* Main Directory Links Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-xs transition-transform group-hover:scale-105">
                <AnantastraIcon size={20} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">
                  Use All Tools
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

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© 2026 Use All Tools. Released under the MIT License.</p>
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
