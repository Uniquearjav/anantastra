'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Binary, 
  CheckCircle, 
  KeyRound, 
  FileCode,
  Search, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

const CATEGORIES = [
  {
    name: "Financial Calculators",
    slug: "calculator",
    description: "Smart calculation utilities for investments, loans, and tax liabilities.",
    icon: Calculator,
    tools: [
      { name: "Income Tax Calculator (India)", slug: "income-tax-calculator", badge: "FY 25-26", desc: "New vs Old regime comparison with 87A rebate and 80C/80D deductions" },
      { name: "GST Calculator", slug: "gst-calculator", badge: "India", desc: "Inclusive/exclusive tax calculation with CGST, SGST, IGST breakdown" },
      { name: "Loan EMI Calculator", slug: "loan-emi-calculator", badge: "Popular", desc: "Amortization schedules, monthly vs yearly breakup, and CSV export" },
      { name: "SIP Calculator", slug: "sip-calculator", badge: "Mutual Funds", desc: "Systematic investment wealth estimates with compound returns" },
      { name: "Interest Calculator", slug: "interest-calculator", desc: "Simple and compound interest calculations with growth schedule" },
      { name: "Currency Converter", slug: "currency-converter", category: "converters", badge: "Live FX", desc: "Real-time exchange rates with multi-currency matrix" },
    ]
  },
  {
    name: "General Calculators",
    slug: "calculator",
    description: "Mathematical computation and personal health metrics.",
    icon: Compass,
    tools: [
      { name: "BMI Calculator", slug: "bmi-calculator", desc: "Body Mass Index with Metric/Imperial gauge and ideal weight targets" },
      { name: "Age Calculator", slug: "age-calculator", desc: "Chronological age, next birthday countdown, and zodiac insights" },
      { name: "Factorial Calculator", slug: "factorial-calculator", badge: "BigInt", desc: "Exact arbitrary-precision factorials, permutations (nPr), and combinations (nCr)" },
      { name: "Decimal & Binary Base Converter", slug: "decimal-binary-calculator", badge: "Bitboard", desc: "Synchronized Decimal, Binary, Hex, and Octal with interactive bitboard" },
    ]
  },
  {
    name: "Format Converters",
    slug: "converters",
    description: "Convert units, markup languages, numbers, and vector graphics.",
    icon: Binary,
    tools: [
      { name: "Number to Words Converter", slug: "number-words-converter", badge: "Lakh & Crore", desc: "Indian and Western scales, Hindi numbers, and cheque formats" },
      { name: "Morse Code Converter", slug: "morse-code-converter", badge: "Audio Synth", desc: "650Hz audio playback, visual light flasher, and ITU alphabet chart" },
      { name: "Unit Converter", slug: "unit-converter", badge: "Multi-Matrix", desc: "Length, digital storage, weight, temperature, speed, area, volume" },
      { name: "Markdown to HTML Converter", slug: "markdown-html-converter", badge: "Live Preview", desc: "Semantic HTML5 generation with formatted export and toolbar" },
      { name: "SVG Converter", slug: "svg-converter", badge: "Vector", desc: "Convert SVG vectors to PNG, JPEG, and WebP with resolution scaling" },
    ]
  },
  {
    name: "Checkers & Validators",
    slug: "checkers",
    description: "Validate inputs, algorithms, primes, and JSON payloads.",
    icon: CheckCircle,
    tools: [
      { name: "Prime Number Checker", slug: "prime-checker", badge: "Factor Tree", desc: "Instant primality verification, prime factorization, and divisor lists" },
      { name: "Palindrome Checker", slug: "palindrome-checker", desc: "Symmetry percentage, character alignment, and longest palindrome finder" },
      { name: "Leap Year Checker", slug: "leap-year-checker", desc: "Gregorian 3-step proof, century exception rules, and countdown" },
      { name: "JSON Formatter & Validator", slug: "json-formatter", badge: "Dev", desc: "Syntax validation, indentation, minification, and key inspection" },
    ]
  },
  {
    name: "Password Tools",
    slug: "password-tools",
    description: "Generate cryptographically secure keys and audit password age.",
    icon: KeyRound,
    tools: [
      { name: "Password Generator", slug: "password-generator", badge: "CSPRNG", desc: "Cryptographic randomness, live entropy meter, and crack time estimates" },
      { name: "Password Age Checker & Audit", slug: "password-age-checker", badge: "Security", desc: "Track rotation schedules and credential rot with zero cloud storage" },
    ]
  },
  {
    name: "Code & Text Utilities",
    slug: "code-text-tools",
    description: "Diff viewers, morse trainers, and text transformers.",
    icon: FileCode,
    tools: [
      { name: "SEO Article & Keyword Density Analyzer", slug: "seo-article-analyzer", badge: "SEO Tool", desc: "Keyword frequency tracker, word count goals (800/1200/1500), and density auditor" },
      { name: "Text Difference Tool", slug: "text-difference", badge: "LCS Diff", desc: "Side-by-side visual diff comparison with unified patch export" },
      { name: "Random Morse Code Generator", slug: "random-morse-generator", badge: "Ear Training", desc: "Flashcard quiz mode with synthesized audio transmission" },
      { name: "Text Utilities & Case Converter", slug: "text", category: "../", badge: "12+ Tools", desc: "Case converter, slugifier, base64 encode, and readability stats" },
    ]
  },
];

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter tools based on search and category
  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CATEGORIES.map(category => {
      if (selectedCategory !== 'all' && category.slug !== selectedCategory && category.name !== selectedCategory) {
        return null;
      }

      const matchingTools = category.tools.filter(tool => {
        if (!q) return true;
        return (
          tool.name.toLowerCase().includes(q) ||
          (tool.desc && tool.desc.toLowerCase().includes(q)) ||
          (tool.badge && tool.badge.toLowerCase().includes(q))
        );
      });

      if (matchingTools.length === 0) return null;

      return {
        ...category,
        tools: matchingTools
      };
    }).filter(Boolean);
  }, [search, selectedCategory]);

  const totalMatchingTools = filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header Title */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Universal Developer & Calculation Suite
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            All Utilities & Calculators
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            100% free, client-side, privacy-first tools. Zero tracking, zero telemetry, zero servers.
          </p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools by name, topic, or keyword (e.g., emi, tax, morse, json, bmi, factorial)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-6 text-sm sm:text-base rounded-2xl border-border/80 bg-card shadow-xs focus:ring-2 focus:ring-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-3.5 text-xs text-muted-foreground hover:text-foreground font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                  : 'bg-card text-muted-foreground hover:text-foreground border-border/60'
              }`}
            >
              All Tools ({CATEGORIES.reduce((acc, c) => acc + c.tools.length, 0)})
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedCategory(c.name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === c.name
                    ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border/60'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {search && (
            <div className="text-center text-xs text-muted-foreground font-mono">
              Found {totalMatchingTools} matching {totalMatchingTools === 1 ? 'utility' : 'utilities'}
            </div>
          )}
        </div>

        {/* Feature Notice Alert */}
        {!search && selectedCategory === 'all' && (
          <div className="mb-10 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl border border-primary/25 bg-primary/5 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm sm:text-base">
                21st-Century UI/UX Across All 24+ Utilities
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Every calculator, validator, and converter features real-time feedback, arbitrary BigInt precision, dual-mode themes, and 100% in-browser offline privacy.
              </p>
            </div>
          </div>
        )}

        {/* Categories & Tools Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <Card 
                  key={category.name}
                  className="overflow-hidden border-border/60 bg-card shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="p-5 border-b border-border/50 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-background border border-border/60 text-primary shadow-xs">
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-foreground">{category.name}</h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3 sm:p-4 space-y-1">
                      {category.tools.map((tool) => (
                        <Link 
                          key={tool.slug}
                          href={tool.category === '../' ? `/${tool.slug}` : `/tools/${tool.category || category.slug}/${tool.slug}`}
                          className="group flex items-start justify-between p-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-muted/30 text-foreground transition-all"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                                  {tool.badge}
                                </Badge>
                              )}
                            </div>
                            {tool.desc && (
                              <p className="text-xs text-muted-foreground/80 line-clamp-1">
                                {tool.desc}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                        </Link>
                      ))}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl max-w-2xl mx-auto">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">No matching utilities found</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Try searching with different terms like "emi", "tax", "converter", or clear the filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="text-xs"
            >
              Reset Search & Filters
            </Button>
          </div>
        )}

        {/* Open Source / Community Footer Card */}
        <div className="mt-14 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-border/60 bg-card text-center shadow-xs">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-foreground">
            Zero-Telemetry Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
            Every computation in AnantAstra is executed purely within your browser's local sandbox. No data, form inputs, or calculations are logged or transmitted to any server.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link href="/about">
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                About Open Source
              </Button>
            </Link>
            <a 
              href="https://github.com/Uniquearjav/anantastra"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="rounded-full text-xs">
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}