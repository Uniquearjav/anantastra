'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Monitor, 
  Smartphone, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Sliders, 
  Calendar, 
  Globe, 
  FileCode, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const TITLE_MAX_PX = 580;
const DESC_MAX_PX = 680;

const TITLE_FONT = '20px Arial, sans-serif';
const DESC_FONT = '14px Arial, sans-serif';

// Pre-configured sample presets
const SAMPLE_PRESETS = [
  {
    name: 'SaaS / Developer Tool',
    title: 'AnantAstra - 25+ High-Performance Online Developer & Math Utilities',
    description: 'Explore 25+ free, privacy-focused online calculators, format converters, and security checkers. Run arbitrary calculations with instant client-side execution and zero tracking.',
    url: 'https://anantastra.vercel.app/tools',
    domain: 'anantastra.vercel.app',
    keyword: 'online calculators'
  },
  {
    name: 'E-Commerce Product',
    title: 'Ergonomic Standing Desk Pro - Dual Motor & Memory Height Settings',
    description: 'Upgrade your workspace with our solid steel dual-motor standing desk. Supports up to 350 lbs with whisper-quiet transition. Free 2-day delivery and 10-year warranty included.',
    url: 'https://workspacestore.com/products/standing-desk-pro',
    domain: 'workspacestore.com',
    keyword: 'standing desk'
  },
  {
    name: 'Educational Blog Guide',
    title: 'Complete Guide to Next.js 15: Server Actions, Turbopack, and Cache API',
    description: 'Master Next.js 15 with our practical guide covering React Server Components, partial prerendering, and edge optimization. Learn step-by-step how to migrate your web application.',
    url: 'https://devinsights.io/blog/nextjs-15-complete-guide',
    domain: 'devinsights.io',
    keyword: 'Next.js 15'
  }
];

// Helper to measure exact pixel width via HTML5 canvas
function measureTextWidth(text, font) {
  if (typeof window === 'undefined' || !text) return 0;
  try {
    const canvas = measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = font;
      return Math.round(ctx.measureText(text).width);
    }
  } catch {
    // fallback
  }
  const approx = font.includes('20px') ? 10.5 : 7.2;
  return Math.round(text.length * approx);
}

// Truncate string to fit within maxPixels using binary search
function getTruncatedSnippet(text, font, maxPixels) {
  if (!text) return '';
  const currentWidth = measureTextWidth(text, font);
  if (currentWidth <= maxPixels) return text;

  const ellipsis = ' ...';
  let low = 0;
  let high = text.length;
  let best = text;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = text.slice(0, mid) + ellipsis;
    const width = measureTextWidth(candidate, font);
    if (width <= maxPixels) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
}

export default function GoogleSerpPreviewTool() {
  const [title, setTitle] = useState(SAMPLE_PRESETS[0].title);
  const [description, setDescription] = useState(SAMPLE_PRESETS[0].description);
  const [url, setUrl] = useState(SAMPLE_PRESETS[0].url);
  const [keyword, setKeyword] = useState(SAMPLE_PRESETS[0].keyword);
  const [includeDate, setIncludeDate] = useState(true);
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Formatted date string for simulated SERP
  const dateSnippet = useMemo(() => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} — `;
  }, []);

  // Clean formatted breadcrumb path
  const parsedUrl = useMemo(() => {
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = u.hostname.replace(/^www\./, '');
      const pathSegments = u.pathname.split('/').filter(Boolean);
      const breadcrumb = [domain, ...pathSegments].join(' › ');
      return {
        protocol: u.protocol,
        domain,
        breadcrumb: breadcrumb || domain,
        full: u.href
      };
    } catch {
      return {
        protocol: 'https:',
        domain: 'example.com',
        breadcrumb: 'example.com › page',
        full: url
      };
    }
  }, [url]);

  // Measurements
  const titlePixelWidth = useMemo(() => {
    if (!isClient) return Math.round(title.length * 10.5);
    return measureTextWidth(title, TITLE_FONT);
  }, [title, isClient]);

  const descPixelWidth = useMemo(() => {
    if (!isClient) return Math.round(description.length * 7.2);
    const prefix = includeDate ? dateSnippet : '';
    return measureTextWidth(prefix + description, DESC_FONT);
  }, [description, includeDate, dateSnippet, isClient]);

  // Truncation calculations
  const titleTruncated = titlePixelWidth > TITLE_MAX_PX;
  const descTruncated = descPixelWidth > DESC_MAX_PX;

  const displayTitle = useMemo(() => {
    if (!isClient) return title;
    return getTruncatedSnippet(title, TITLE_FONT, TITLE_MAX_PX);
  }, [title, isClient]);

  const displayDescription = useMemo(() => {
    if (!isClient) return description;
    const prefix = includeDate ? dateSnippet : '';
    const fullSnippet = prefix + description;
    if (measureTextWidth(fullSnippet, DESC_FONT) <= DESC_MAX_PX) {
      return { prefix, body: description };
    }
    // Truncate the combined body
    const maxAvailable = DESC_MAX_PX - (includeDate ? measureTextWidth(dateSnippet, DESC_FONT) : 0);
    const truncatedBody = getTruncatedSnippet(description, DESC_FONT, maxAvailable);
    return { prefix, body: truncatedBody };
  }, [description, includeDate, dateSnippet, isClient]);

  // Keyword highlighting helper for description snippet
  const renderHighlightedSnippet = (text) => {
    if (!keyword.trim() || !text) return text;
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <strong key={i} className="font-bold text-foreground">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // SEO Health Checks
  const checks = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const hasKwInTitle = kw ? title.toLowerCase().includes(kw) : false;
    const hasKwInDesc = kw ? description.toLowerCase().includes(kw) : false;
    const titleLengthOk = titlePixelWidth >= 200 && titlePixelWidth <= TITLE_MAX_PX;
    const descLengthOk = descPixelWidth >= 280 && descPixelWidth <= DESC_MAX_PX;
    const hasCta = /(learn|discover|try|explore|get|buy|find|check|read|see|compare|download)/i.test(description);

    let score = 0;
    if (titleLengthOk) score += 25;
    else if (!titleTruncated && titlePixelWidth > 0) score += 15;

    if (descLengthOk) score += 25;
    else if (!descTruncated && descPixelWidth > 0) score += 15;

    if (hasKwInTitle) score += 20;
    if (hasKwInDesc) score += 15;
    if (hasCta) score += 15;

    return {
      titleLengthOk,
      descLengthOk,
      hasKwInTitle,
      hasKwInDesc,
      hasCta,
      score: Math.min(100, score)
    };
  }, [title, description, keyword, titlePixelWidth, descPixelWidth, titleTruncated, descTruncated]);

  const handleCopyMetaTags = () => {
    const code = `<title>${title}</title>\n<meta name="description" content="${description}" />`;
    navigator.clipboard.writeText(code);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  const handleLoadPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setUrl(preset.url);
    setKeyword(preset.keyword);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setUrl('https://example.com');
    setKeyword('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Breadcrumb & Title (Solid colors only, zero gradients) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span>/</span>
            <Link href="/tools/code-text-tools/text-difference" className="hover:text-foreground transition-colors">Code & Text Utilities</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Google SERP Simulator & Pixel Analyzer</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Google SERP Simulator & Pixel Analyzer
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Measure exact pixel widths (Title ≤ 580px, Description ≤ 680px) and preview desktop & mobile Google search snippets.
                </p>
              </div>
            </div>

            {/* Score & Copy Actions */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-3 bg-card border border-border/80 rounded-xl p-2.5 px-4 shadow-sm">
                <div className="text-right">
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">SERP Score</div>
                  <div className="text-xl font-bold tracking-tight text-foreground">{checks.score}/100</div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm ${
                  checks.score >= 80 
                    ? 'bg-emerald-600 text-white' 
                    : checks.score >= 50 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-zinc-700 text-white'
                }`}>
                  {checks.score >= 80 ? 'A' : checks.score >= 50 ? 'B' : 'C'}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMetaTags}
                className="h-11 px-3.5 border-border/80 bg-card hover:bg-muted"
                title="Copy HTML Meta Tags"
              >
                {copiedMeta ? <Check className="h-4 w-4 text-emerald-600 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                <span className="text-xs font-semibold">{copiedMeta ? 'Copied' : 'Copy Tags'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Load Sample:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1 text-xs rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
            >
              {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1 text-xs rounded-lg border border-border/70 bg-card hover:text-destructive hover:bg-destructive/10 text-muted-foreground transition-colors ml-auto"
          >
            Clear Fields
          </button>
        </div>

        {/* Main Grid: Inputs (Left 1.5) & SERP Previews (Right 1.5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Meta Tag Inputs & Exact Pixel Gauges (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* URL / Breadcrumb Input */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary" /> Page URL / Canonical Path
                  </label>
                  <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                    {parsedUrl.domain}
                  </span>
                </div>
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/category/page"
                  className="h-9 text-xs bg-background border-border/80 font-mono"
                />
              </CardContent>
            </Card>

            {/* Meta Title Input & Pixel Meter (Limit: 580px) */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-primary" /> Meta Title Tag
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono border ${
                        titleTruncated 
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 font-bold' 
                          : titlePixelWidth >= 400 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {titlePixelWidth} / {TITLE_MAX_PX} px
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {title.length} chars
                    </span>
                  </div>
                </div>

                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Compelling, concise page title..."
                  className="h-10 text-xs bg-background border-border/80"
                />

                {/* Title Pixel Meter Progress Bar (Strictly Solid Colors) */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="w-full h-2 rounded-full bg-muted/80 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-200 ${
                        titleTruncated 
                          ? 'bg-red-600' 
                          : titlePixelWidth >= 400 
                            ? 'bg-emerald-600' 
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (titlePixelWidth / TITLE_MAX_PX) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {titleTruncated ? (
                        <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Truncated: Exceeds 580px by +{titlePixelWidth - TITLE_MAX_PX}px
                        </span>
                      ) : (
                        <span>{TITLE_MAX_PX - titlePixelWidth} px remaining before truncation</span>
                      )}
                    </span>
                    <span>Max: 580 px (~60 chars)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Description Input & Pixel Meter (Limit: 680px) */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-primary" /> Meta Description Tag
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono border ${
                        descTruncated 
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 font-bold' 
                          : descPixelWidth >= 450 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {descPixelWidth} / {DESC_MAX_PX} px
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {description.length} chars
                    </span>
                  </div>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Engaging summary providing context, keywords, and a call-to-action..."
                  rows={4}
                  className="w-full text-xs font-sans bg-background border border-border/80 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 resize-y"
                />

                {/* Description Pixel Meter Progress Bar */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="w-full h-2 rounded-full bg-muted/80 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-200 ${
                        descTruncated 
                          ? 'bg-red-600' 
                          : descPixelWidth >= 450 
                            ? 'bg-emerald-600' 
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (descPixelWidth / DESC_MAX_PX) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {descTruncated ? (
                        <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Truncated: Exceeds 680px by +{descPixelWidth - DESC_MAX_PX}px
                        </span>
                      ) : (
                        <span>{DESC_MAX_PX - descPixelWidth} px remaining before truncation</span>
                      )}
                    </span>
                    <span>Max: 680 px (~160 chars)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Focus Keyword & Search Snippet Settings */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-primary" /> SERP Snippet Enhancers
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Focus Keyword (bolds matched query in snippet):
                  </label>
                  <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. Next.js 15, standing desk..."
                    className="h-8 text-xs bg-background border-border/80"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Google Date Snippet Prefix
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Simulates Google prefixing with published date (~85px)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeDate}
                    onChange={(e) => setIncludeDate(e.target.checked)}
                    className="h-4 w-4 rounded border-border/80 text-primary cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN: Realistic Google SERP Preview (Desktop & Mobile) (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* SERP Preview Container Card */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden">
              {/* Preview Header & Desktop/Mobile Switcher */}
              <div className="border-b border-border/80 bg-muted/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Google Search Result Preview</span>
                </div>

                <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={() => setViewMode('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'desktop'
                        ? 'bg-background text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'mobile'
                        ? 'bg-background text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile Preview</span>
                  </button>
                </div>
              </div>

              {/* SERP Preview Body */}
              <div className="p-6 bg-background">

                {/* 1. DESKTOP SERP VIEW */}
                {viewMode === 'desktop' && (
                  <div className="max-w-[650px] p-6 rounded-2xl border border-border/70 bg-card space-y-2 shadow-xs">
                    {/* Google Desktop Header: Favicon + Site Name + URL */}
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-muted/70 flex items-center justify-center text-xs font-bold text-muted-foreground border border-border/60">
                        {parsedUrl.domain.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col text-xs leading-tight">
                        <span className="font-medium text-foreground text-[13px]">{parsedUrl.domain}</span>
                        <span className="text-[12px] text-muted-foreground truncate max-w-[500px]">
                          {parsedUrl.full}
                        </span>
                      </div>
                    </div>

                    {/* Google Desktop Title (Font: 20px Arial, link color) */}
                    <div className="pt-1">
                      <h3 
                        className={`text-[20px] font-normal leading-[1.3] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-sans ${
                          titleTruncated ? 'truncate max-w-[580px]' : ''
                        }`}
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        title={title}
                      >
                        {displayTitle || 'Page Title will appear here'}
                      </h3>
                    </div>

                    {/* Google Desktop Snippet (Font: 14px Arial, max 680px) */}
                    <div 
                      className="text-[14px] leading-[1.58] text-[#4d5156] dark:text-[#bdc1c6] font-sans pt-0.5"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      {includeDate && (
                        <span className="text-muted-foreground text-[13px] font-sans">
                          {dateSnippet}
                        </span>
                      )}
                      <span>
                        {renderHighlightedSnippet(displayDescription.body) || 'Meta description snippet will appear here...'}
                      </span>
                    </div>

                    {/* Desktop Pixel Inspection Footer */}
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono">
                        Title: <strong>{titlePixelWidth}px</strong> / 580px
                      </span>
                      <span className="font-mono">
                        Description: <strong>{descPixelWidth}px</strong> / 680px
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. MOBILE SERP VIEW */}
                {viewMode === 'mobile' && (
                  <div className="max-w-[390px] mx-auto p-4 rounded-2xl border border-border/80 bg-card space-y-2.5 shadow-sm">
                    {/* Mobile Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-muted/80 flex items-center justify-center text-xs font-bold text-muted-foreground border border-border/60">
                          {parsedUrl.domain.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col text-xs leading-tight">
                          <span className="font-medium text-foreground text-[13px]">{parsedUrl.domain}</span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                            {parsedUrl.breadcrumb}
                          </span>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-xs font-bold">⋮</span>
                    </div>

                    {/* Mobile Title (Wraps onto 2 lines, large touch-friendly title) */}
                    <div>
                      <h3 
                        className="text-[18px] font-normal leading-[1.3] text-[#1a0dab] dark:text-[#8ab4f8] font-sans"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      >
                        {displayTitle || 'Mobile Title will appear here'}
                      </h3>
                    </div>

                    {/* Mobile Snippet Description */}
                    <div 
                      className="text-[13px] leading-[1.5] text-[#4d5156] dark:text-[#bdc1c6] font-sans"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      {includeDate && (
                        <span className="text-muted-foreground text-[12px]">
                          {dateSnippet}
                        </span>
                      )}
                      <span>
                        {renderHighlightedSnippet(displayDescription.body) || 'Mobile description preview...'}
                      </span>
                    </div>

                    {/* Mobile Pixel Inspection Footer */}
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Title: {titlePixelWidth}px</span>
                      <span>Desc: {descPixelWidth}px</span>
                    </div>
                  </div>
                )}

              </div>
            </Card>

            {/* SEO Quality Audit & Recommendations Checklist */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">SERP Quality Audit</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Optimization Checklist</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Title Width Check */}
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Title Pixel Width</span>
                      <Badge 
                        variant="outline"
                        className={`text-[10px] border ${
                          checks.titleLengthOk 
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                        }`}
                      >
                        {checks.titleLengthOk ? 'Pass' : titleTruncated ? 'Too Long' : 'Short'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {titlePixelWidth <= TITLE_MAX_PX 
                        ? `Optimal width (${titlePixelWidth}px <= 580px). No truncation.` 
                        : `Title will be truncated with '...' on desktop.`}
                    </p>
                  </div>

                  {/* Description Width Check */}
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Description Pixel Width</span>
                      <Badge 
                        variant="outline"
                        className={`text-[10px] border ${
                          checks.descLengthOk 
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                        }`}
                      >
                        {checks.descLengthOk ? 'Pass' : descTruncated ? 'Too Long' : 'Short'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {descPixelWidth <= DESC_MAX_PX 
                        ? `Optimal width (${descPixelWidth}px <= 680px). Full text visible.` 
                        : `Description will be cut off on Google snippets.`}
                    </p>
                  </div>

                  {/* Keyword in Title */}
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Keyword in Title</span>
                      <Badge 
                        variant="outline"
                        className={`text-[10px] border ${
                          checks.hasKwInTitle 
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-muted text-muted-foreground border-border/70'
                        }`}
                      >
                        {checks.hasKwInTitle ? 'Found' : 'Missing'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {checks.hasKwInTitle 
                        ? 'Focus keyword is prominently positioned in the title.' 
                        : 'Include your focus keyword near the beginning of your title.'}
                    </p>
                  </div>

                  {/* Call-to-Action in Description */}
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Call-to-Action (CTA)</span>
                      <Badge 
                        variant="outline"
                        className={`text-[10px] border ${
                          checks.hasCta 
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-muted text-muted-foreground border-border/70'
                        }`}
                      >
                        {checks.hasCta ? 'Detected' : 'Optional'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {checks.hasCta 
                        ? 'Includes action verbs to drive search click-through rate (CTR).' 
                        : 'Add action verbs like "Explore", "Learn", "Discover", or "Compare".'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Educational SEO Best Practices (Strictly solid colors, no gradients) */}
        <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Google Meta Tag Pixel Limits & Best Practices</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                <div className="font-semibold text-foreground">Why Pixels Matter More Than Characters</div>
                <p>
                  Google measures text space in <strong>pixels</strong>, not character count. For instance, a capital "W" or "M" takes over 15 pixels, while a lowercase "i" or "l" takes less than 4 pixels. Relying solely on character counts can cause unexpected truncation.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                <div className="font-semibold text-foreground">Meta Title Limit: 580 Pixels</div>
                <p>
                  Google Desktop renders titles in 20px Arial font and cuts them off around 580–600px. Aim for <strong>450px to 580px</strong> (typically 50–60 characters) to convey your core benefit while preventing truncation ellipsis.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                <div className="font-semibold text-foreground">Meta Description Limit: 680 Pixels</div>
                <p>
                  Google Desktop renders descriptions in 14px Arial. When Google prefixes a snippet with the publication date (~85px), the available room shrinks. Targeting <strong>600px to 680px</strong> (~150–160 characters) ensures your summary displays cleanly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
