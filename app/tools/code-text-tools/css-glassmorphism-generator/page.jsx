'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  Layers, 
  Eye, 
  Palette,
  Code,
  Laptop
} from 'lucide-react';

const PRESETS = [
  { name: 'Frosted Glass', blur: 16, bgOpacity: 25, borderOpacity: 30, radius: 24, shadow: 20, bgColor: '#ffffff' },
  { name: 'Dark Cyber Glass', blur: 24, bgOpacity: 40, borderOpacity: 20, radius: 20, shadow: 35, bgColor: '#0f172a' },
  { name: 'Minimalist Clean', blur: 10, bgOpacity: 15, borderOpacity: 20, radius: 16, shadow: 10, bgColor: '#ffffff' },
  { name: 'Crystal Tint', blur: 30, bgOpacity: 20, borderOpacity: 45, radius: 28, shadow: 25, bgColor: '#6366f1' },
];

export default function CSSGlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [bgOpacity, setBgOpacity] = useState(25);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [borderRadius, setBorderRadius] = useState(24);
  const [shadow, setShadow] = useState(20);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const [backgroundType, setBackgroundType] = useState('gradient'); // 'gradient' | 'neon' | 'mesh'
  const [activeCodeTab, setActiveCodeTab] = useState('css'); // 'css' | 'tailwind' | 'react'
  const [copied, setCopied] = useState(false);

  // Convert hex to rgb
  const hexToRgb = (hex) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgb = hexToRgb(bgColor);
  const rgbaBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity / 100})`;
  const rgbaBorder = `rgba(255, 255, 255, ${borderOpacity / 100})`;
  const boxShadowCss = shadow > 0 
    ? `0 8px 32px 0 rgba(0, 0, 0, ${(shadow / 80).toFixed(2)})` 
    : 'none';

  const cssCode = `/* Glassmorphism CSS */
background: ${rgbaBg};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid ${rgbaBorder};
box-shadow: ${boxShadowCss};`;

  const tailwindCode = `<!-- Tailwind CSS Utility Classes -->
<div className="backdrop-blur-[${blur}px] bg-[${bgColor}]/${bgOpacity} rounded-[${borderRadius}px] border border-white/${borderOpacity} shadow-xl">
  <!-- Your Content -->
</div>`;

  const reactCode = `// React Inline Style Object
const glassStyle = {
  background: '${rgbaBg}',
  backdropFilter: 'blur(${blur}px)',
  WebkitBackdropFilter: 'blur(${blur}px)',
  borderRadius: '${borderRadius}px',
  border: '1px solid ${rgbaBorder}',
  boxShadow: '${boxShadowCss}',
};`;

  const getActiveCode = () => {
    if (activeCodeTab === 'tailwind') return tailwindCode;
    if (activeCodeTab === 'react') return reactCode;
    return cssCode;
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Modern Soft-UI & Glass Effect
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            CSS Glassmorphism Generator
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Design beautiful frosted-glass cards with blur, opacity, and soft shadow controls. Export cleanly to Pure CSS, Tailwind CSS, or React.
          </p>
        </div>

        {/* Presets */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Curated Presets
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setBlur(p.blur);
                  setBgOpacity(p.bgOpacity);
                  setBorderOpacity(p.borderOpacity);
                  setBorderRadius(p.radius);
                  setShadow(p.shadow);
                  setBgColor(p.bgColor);
                }}
                className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-all text-left"
              >
                <div className="text-xs font-bold">{p.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Blur: {p.blur}px • Opacity: {p.bgOpacity}%
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  Glass Visual Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Blur Radius */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Backdrop Blur</span>
                    <span className="font-mono text-primary font-bold">{blur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={blur}
                    onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Background Opacity */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Background Opacity</span>
                    <span className="font-mono text-primary font-bold">{bgOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Border Opacity */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Border Opacity</span>
                    <span className="font-mono text-primary font-bold">{borderOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={borderOpacity}
                    onChange={(e) => setBorderOpacity(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Border Radius */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Border Radius</span>
                    <span className="font-mono text-primary font-bold">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={48}
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Shadow Depth */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Elevation / Shadow</span>
                    <span className="font-mono text-primary font-bold">{shadow}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={shadow}
                    onChange={(e) => setShadow(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Tint Color */}
                <div className="pt-2 border-t border-border/50">
                  <label className="text-xs font-medium block mb-1.5">Glass Tint Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded border border-border cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Preview & Code Export (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Preview Canvas */}
            <Card className="border-border/60 shadow-md overflow-hidden">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    Interactive Live Canvas
                  </CardTitle>
                  {/* Backdrop Selector */}
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'gradient', label: 'Vibrant' },
                      { id: 'neon', label: 'Neon' },
                      { id: 'mesh', label: 'Abstract' }
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBackgroundType(b.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                          backgroundType === b.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  className={`min-h-[340px] flex items-center justify-center p-8 transition-all ${
                    backgroundType === 'gradient'
                      ? 'bg-gradient-to-tr from-rose-500 via-indigo-600 to-cyan-400'
                      : backgroundType === 'neon'
                      ? 'bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]'
                      : 'bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600'
                  }`}
                >
                  {/* The Glassmorphism Card */}
                  <div
                    style={{
                      background: rgbaBg,
                      backdropFilter: `blur(${blur}px)`,
                      WebkitBackdropFilter: `blur(${blur}px)`,
                      borderRadius: `${borderRadius}px`,
                      border: `1px solid ${rgbaBorder}`,
                      boxShadow: boxShadowCss,
                    }}
                    className="max-w-sm w-full p-6 text-white transition-all duration-150"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
                        Use All Tools
                      </span>
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold mb-1 drop-shadow-sm">Frosted Glass UI</h3>
                    <p className="text-xs opacity-90 leading-relaxed drop-shadow-sm mb-4">
                      Live blur simulation rendered by browser compositor with zero performance lag.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                      <span className="font-mono">blur({blur}px)</span>
                      <span className="font-semibold px-2 py-0.5 rounded bg-white/20">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Export Box */}
            <Card className="border-border/60 shadow-md">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  {/* Code Tabs */}
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'css', label: 'Pure CSS' },
                      { id: 'tailwind', label: 'Tailwind CSS' },
                      { id: 'react', label: 'React Inline' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveCodeTab(tab.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          activeCodeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <Button onClick={copyCode} size="sm" className="text-xs gap-1.5 h-8">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied Code!' : 'Copy Code'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <pre className="p-4 rounded-xl bg-muted/50 border border-border/60 font-mono text-xs text-foreground overflow-x-auto">
                  <code>{getActiveCode()}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
