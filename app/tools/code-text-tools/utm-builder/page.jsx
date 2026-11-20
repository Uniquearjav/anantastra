'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2
} from 'lucide-react';

const PRESETS = [
  { name: 'Google Search Ads', source: 'google', medium: 'cpc', campaign: 'brand_search' },
  { name: 'Meta / Facebook Ads', source: 'facebook', medium: 'paid_social', campaign: 'retargeting' },
  { name: 'Email Newsletter', source: 'newsletter', medium: 'email', campaign: 'weekly_digest' },
  { name: 'LinkedIn Campaign', source: 'linkedin', medium: 'sponsored_content', campaign: 'b2b_leads' },
  { name: 'X / Twitter Post', source: 'twitter', medium: 'organic_social', campaign: 'product_launch' },
  { name: 'YouTube Description', source: 'youtube', medium: 'video_referral', campaign: 'tutorial_link' },
];

export default function UTMBuilder() {
  const [url, setUrl] = useState('https://www.usealltools.com');
  const [source, setSource] = useState('newsletter');
  const [medium, setMedium] = useState('email');
  const [campaign, setCampaign] = useState('fall_features_2026');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('cta_button_top');
  
  const [autoLowercase, setAutoLowercase] = useState(true);
  const [replaceSpaces, setReplaceSpaces] = useState('underscore'); // 'underscore' | 'hyphen' | 'none'
  const [copied, setCopied] = useState(false);

  const cleanParam = (val) => {
    let res = val.trim();
    if (autoLowercase) {
      res = res.toLowerCase();
    }
    if (replaceSpaces === 'underscore') {
      res = res.replace(/\s+/g, '_');
    } else if (replaceSpaces === 'hyphen') {
      res = res.replace(/\s+/g, '-');
    }
    return res;
  };

  const finalUrl = useMemo(() => {
    let base = url.trim();
    if (!base) return '';

    if (!base.startsWith('http://') && !base.startsWith('https://')) {
      base = 'https://' + base;
    }

    try {
      const u = new URL(base);
      const s = cleanParam(source);
      const m = cleanParam(medium);
      const c = cleanParam(campaign);
      const t = cleanParam(term);
      const cnt = cleanParam(content);

      if (s) u.searchParams.set('utm_source', s);
      if (m) u.searchParams.set('utm_medium', m);
      if (c) u.searchParams.set('utm_campaign', c);
      if (t) u.searchParams.set('utm_term', t);
      if (cnt) u.searchParams.set('utm_content', cnt);

      return u.toString();
    } catch {
      return '';
    }
  }, [url, source, medium, campaign, term, content, autoLowercase, replaceSpaces]);

  const applyPreset = (p) => {
    setSource(p.source);
    setMedium(p.medium);
    setCampaign(p.campaign);
  };

  const copyUrl = async () => {
    if (!finalUrl) return;
    await navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setUrl('');
    setSource('');
    setMedium('');
    setCampaign('');
    setTerm('');
    setContent('');
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Share2 className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Marketing & Analytics Tracker
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Campaign URL & UTM Builder
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Construct clean, standard Google Analytics 4 (GA4) campaign tracking links with instant presets and zero telemetry.
          </p>
        </div>

        {/* Presets Bar */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Quick Platform Presets
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-border/70 bg-card hover:bg-muted text-foreground transition-all text-center truncate"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">1. Campaign Parameters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Website URL */}
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                    Website URL <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/landing-page"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <span className="text-[11px] text-muted-foreground">The full target destination web address.</span>
                </div>

                {/* Source & Medium */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                      Campaign Source (utm_source) <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="google, newsletter, twitter"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <span className="text-[11px] text-muted-foreground">Where the traffic originates.</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                      Campaign Medium (utm_medium) <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="cpc, email, banner, social"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <span className="text-[11px] text-muted-foreground">Marketing delivery channel.</span>
                  </div>
                </div>

                {/* Campaign Name */}
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                    Campaign Name (utm_campaign) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="summer_sale_2026"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <span className="text-[11px] text-muted-foreground">Product, promo code, or slogan.</span>
                </div>

                {/* Term & Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                      Campaign Term (utm_term) <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input
                      placeholder="paid keyword phrase"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <span className="text-[11px] text-muted-foreground">Identifies paid search keywords.</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                      Campaign Content (utm_content) <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input
                      placeholder="hero_banner_v2, footer_cta"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <span className="text-[11px] text-muted-foreground">Differentiates A/B test links or ads.</span>
                  </div>
                </div>

                {/* Normalization Controls */}
                <div className="pt-2 border-t border-border/50 flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={autoLowercase}
                      onChange={(e) => setAutoLowercase(e.target.checked)}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Force lowercase parameters (recommended for GA4)</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border/60 shadow-md sticky top-6">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Generated Tracking URL</CardTitle>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    Ready to Share
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 font-mono text-xs break-all text-foreground leading-relaxed min-h-[90px] select-all">
                  {finalUrl || <span className="text-muted-foreground italic">Fill in the required URL parameters on the left...</span>}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={copyUrl}
                    disabled={!finalUrl}
                    className="w-full text-xs font-semibold h-10 gap-1.5"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied Tracking URL!' : 'Copy Tracking URL'}
                  </Button>
                  {finalUrl && (
                    <a
                      href={finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button variant="outline" className="w-full text-xs h-10 gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Test Link
                      </Button>
                    </a>
                  )}
                </div>

                {/* Parameters Breakdown */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Query Breakdown
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">utm_source</span>
                      <span className="text-primary font-semibold">{cleanParam(source) || '—'}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">utm_medium</span>
                      <span className="text-primary font-semibold">{cleanParam(medium) || '—'}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">utm_campaign</span>
                      <span className="text-primary font-semibold">{cleanParam(campaign) || '—'}</span>
                    </div>
                    {term && (
                      <div className="flex justify-between p-2 rounded bg-card border border-border/60">
                        <span className="text-muted-foreground">utm_term</span>
                        <span className="text-primary font-semibold">{cleanParam(term)}</span>
                      </div>
                    )}
                    {content && (
                      <div className="flex justify-between p-2 rounded bg-card border border-border/60">
                        <span className="text-muted-foreground">utm_content</span>
                        <span className="text-primary font-semibold">{cleanParam(content)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
