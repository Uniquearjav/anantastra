'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  ArrowLeftRight, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Sparkles,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';

// Relative Luminance per WCAG 2.1
function getLuminance(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(fg, bg) {
  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export default function ColorContrastChecker() {
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [visionMode, setVisionMode] = useState('normal'); // 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  const [copied, setCopied] = useState(false);

  const swapColors = () => {
    setFgColor(bgColor);
    setBgColor(fgColor);
  };

  const ratio = useMemo(() => {
    try {
      return getContrastRatio(fgColor, bgColor);
    } catch {
      return 1;
    }
  }, [fgColor, bgColor]);

  const passes = {
    normalAA: ratio >= 4.5,
    largeAA: ratio >= 3.0,
    normalAAA: ratio >= 7.0,
    largeAAA: ratio >= 4.5,
    uiComponents: ratio >= 3.0,
  };

  const ratioFormatted = ratio.toFixed(2);

  const copyRatio = async () => {
    await navigator.clipboard.writeText(`${ratioFormatted}:1 contrast ratio (FG: ${fgColor}, BG: ${bgColor})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Eye className="w-3.5 h-3.5 mr-1.5 text-primary" />
            WCAG 2.1 & APCA Accessibility
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Color Contrast & Accessibility Checker
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Calculate the exact contrast ratio between text and background colors according to Web Content Accessibility Guidelines (WCAG 2.1).
          </p>
        </div>

        {/* Big Contrast Ratio Scoreboard */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-card border border-border/70 shadow-md text-center">
          <div className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-2">
            Contrast Ratio Score
          </div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl sm:text-7xl font-extrabold font-mono text-primary">
              {ratioFormatted}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">: 1</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant={passes.normalAA ? 'default' : 'destructive'}
              className="text-xs py-1 px-3"
            >
              {passes.normalAA ? 'WCAG AA Passed' : 'WCAG AA Failed'}
            </Badge>
            <Badge
              variant={passes.normalAAA ? 'secondary' : 'outline'}
              className="text-xs py-1 px-3"
            >
              {passes.normalAAA ? 'WCAG AAA Passed' : 'WCAG AAA Failed'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyRatio}
              className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Share Ratio'}
            </Button>
          </div>
        </div>

        {/* Color Pickers & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
          {/* Foreground (Text) */}
          <Card className="md:col-span-5 border-border/60 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                Text / Foreground Color
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-border cursor-pointer p-0.5 bg-background shadow-xs"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono text-sm uppercase"
                />
              </div>
            </CardContent>
          </Card>

          {/* Swap Button (1 col) */}
          <div className="md:col-span-1 flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapColors}
              className="rounded-full shadow-sm hover:scale-105 transition-transform"
              title="Swap Colors"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Background */}
          <Card className="md:col-span-5 border-border/60 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                Background Color
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-border cursor-pointer p-0.5 bg-background shadow-xs"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono text-sm uppercase"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Checklist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">Normal Text AA</span>
              {passes.normalAA ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">Requires 4.5:1 minimum</div>
            <div className="text-[11px] font-mono text-primary mt-1">Under 18pt font</div>
          </div>

          <div className="p-4 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">Large Text AA</span>
              {passes.largeAA ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">Requires 3.0:1 minimum</div>
            <div className="text-[11px] font-mono text-primary mt-1">18pt+ or 14pt bold</div>
          </div>

          <div className="p-4 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">Normal Text AAA</span>
              {passes.normalAAA ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">Requires 7.0:1 minimum</div>
            <div className="text-[11px] font-mono text-primary mt-1">Enhanced contrast</div>
          </div>

          <div className="p-4 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">UI Components</span>
              {passes.uiComponents ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">Requires 3.0:1 minimum</div>
            <div className="text-[11px] font-mono text-primary mt-1">Icons & borders</div>
          </div>
        </div>

        {/* Live UI Simulation */}
        <Card className="border-border/60 shadow-md overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <CardTitle className="text-base font-semibold">Live Visual Simulation</CardTitle>
            <CardDescription className="text-xs">
              Preview how real interface elements look in your chosen color pair
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div
              style={{ backgroundColor: bgColor, color: fgColor }}
              className="p-8 sm:p-12 transition-colors duration-200"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Headline Text Example (Large Typography)
              </h2>
              <p className="text-base sm:text-lg mb-6 leading-relaxed max-w-2xl opacity-90">
                Readable body copy is essential for users with low vision, aging eyes, or reading in direct sunlight. Accessible color pairs increase user retention and improve SEO engagement metrics.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  style={{ backgroundColor: fgColor, color: bgColor }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-transform active:scale-95"
                >
                  Primary Action Button
                </button>
                <button
                  type="button"
                  style={{ border: `2px solid ${fgColor}`, color: fgColor }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-transparent transition-transform active:scale-95"
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
