'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  FileImage, 
  UploadCloud, 
  Clipboard, 
  Download, 
  Sparkles, 
  RotateCcw, 
  Maximize2, 
  ShieldCheck, 
  Info, 
  Check 
} from 'lucide-react';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" rx="40" fill="#0f172a" />
  <circle cx="100" cy="100" r="60" fill="#3b82f6" />
  <polygon points="100,45 145,135 55,135" fill="#f8fafc" />
  <circle cx="100" cy="105" r="15" fill="#0f172a" />
</svg>`;

export default function SVGConverter() {
  const [svgContent, setSvgContent] = useState(SAMPLE_SVG);
  const [previewSrc, setPreviewSrc] = useState('');
  const [outputFormat, setOutputFormat] = useState('png'); // 'png' | 'jpeg' | 'webp'
  const [quality, setQuality] = useState(92);
  const [scale, setScale] = useState(2); // Default to 2x for sharp retina rendering
  const [error, setError] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 200, height: 200 });
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const downloadLinkRef = useRef(null);

  // Extract dimensions and generate blob URL
  const updateSvgState = (content) => {
    try {
      setError('');
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG XML syntax');
      }

      const svgEl = doc.querySelector('svg');
      if (!svgEl) throw new Error('No <svg> root element found');

      let w = parseFloat(svgEl.getAttribute('width'));
      let h = parseFloat(svgEl.getAttribute('height'));

      if (isNaN(w) || isNaN(h)) {
        const viewBox = svgEl.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4) {
            w = parts[2];
            h = parts[3];
          }
        }
      }

      setSvgDimensions({
        width: !isNaN(w) && w > 0 ? Math.round(w) : 300,
        height: !isNaN(h) && h > 0 ? Math.round(h) : 300
      });

      const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setPreviewSrc(url);
    } catch (err) {
      setError(err.message || 'Failed to parse SVG');
    }
  };

  useEffect(() => {
    updateSvgState(svgContent);
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg') && !file.type.includes('svg')) {
      setError('Please select a valid .svg file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setSvgContent(text);
      updateSvgState(text);
    };
    reader.readAsText(file);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('<svg') || text.includes('xmlns="http://www.w3.org/2000/svg"')) {
        setSvgContent(text);
        updateSvgState(text);
      } else {
        setError('No valid SVG markup found in clipboard');
      }
    } catch (e) {
      setError('Clipboard access denied or unavailable');
    }
  };

  const handleConvertAndDownload = () => {
    if (!svgContent || error) return;
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const finalW = Math.round(svgDimensions.width * scale);
      const finalH = Math.round(svgDimensions.height * scale);

      canvas.width = finalW;
      canvas.height = finalH;

      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.clearRect(0, 0, finalW, finalH);

        // If JPEG, draw white background first since JPEG has no alpha channel
        if (outputFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, finalW, finalH);
        }

        ctx.drawImage(img, 0, 0, finalW, finalH);
        URL.revokeObjectURL(blobUrl);

        const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : outputFormat === 'webp' ? 'image/webp' : 'image/png';
        const qualityParam = outputFormat === 'png' ? undefined : quality / 100;
        const dataUrl = canvas.toDataURL(mimeType, qualityParam);

        const link = downloadLinkRef.current;
        link.href = dataUrl;
        link.download = `rasterized-${finalW}x${finalH}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
        link.click();
        setIsProcessing(false);
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        setError('Failed to render SVG onto canvas');
        setIsProcessing(false);
      };

      img.src = blobUrl;
    } catch (err) {
      setError('Conversion error: ' + err.message);
      setIsProcessing(false);
    }
  };

  const finalWidth = Math.round(svgDimensions.width * scale);
  const finalHeight = Math.round(svgDimensions.height * scale);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <FileImage className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Vector to Raster Engine
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          SVG to Image Converter
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Render scalable vector graphics (SVG) into crisp PNG, JPEG, and WebP raster images with custom resolution scaling and zero quality loss.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input & Parameters */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4">Input Vector Graphic</h2>

            {/* File Upload & Clipboard Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-10"
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                Upload .svg File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={handlePasteClipboard}
                className="text-xs h-10"
              >
                <Clipboard className="w-3.5 h-3.5 mr-1.5" />
                Paste from Clipboard
              </Button>
            </div>

            {/* Raw XML Textarea */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="svg-code-area" className="text-xs font-semibold text-foreground">
                  SVG Source Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSvgContent(SAMPLE_SVG);
                    updateSvgState(SAMPLE_SVG);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                id="svg-code-area"
                rows={5}
                value={svgContent}
                onChange={(e) => {
                  setSvgContent(e.target.value);
                  updateSvgState(e.target.value);
                }}
                placeholder="<svg ...> ... </svg>"
                className="w-full rounded-xl border border-input bg-background p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs mb-4">
                {error}
              </div>
            )}

            {/* Conversion Controls */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              {/* Output Format Tabs */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Target Raster Format:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'png', label: 'PNG (Lossless Alpha)' },
                    { id: 'jpeg', label: 'JPEG (Compact)' },
                    { id: 'webp', label: 'WebP (Modern)' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setOutputFormat(fmt.id)}
                      className={`py-2 px-1 rounded-lg border text-xs font-semibold transition-colors uppercase ${
                        outputFormat === fmt.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Scale Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    Resolution Scale:
                  </span>
                  <span className="font-mono font-bold text-primary">{scale}x ({finalWidth} × {finalHeight} px)</span>
                </div>
                <Slider
                  min={0.5}
                  max={6}
                  step={0.5}
                  value={[scale]}
                  onValueChange={(val) => setScale(val[0])}
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>0.5x</span>
                  <span>1x (Standard)</span>
                  <span>2x (Retina)</span>
                  <span>4x (Print)</span>
                  <span>6x (Ultra)</span>
                </div>
              </div>

              {/* Quality Slider for JPEG / WebP */}
              {outputFormat !== 'png' && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">Encoding Quality:</span>
                    <span className="font-mono font-bold text-primary">{quality}%</span>
                  </div>
                  <Slider
                    min={40}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={(val) => setQuality(val[0])}
                  />
                </div>
              )}

              {/* Download Action Button */}
              <Button
                onClick={handleConvertAndDownload}
                disabled={!svgContent || !!error || isProcessing}
                className="w-full text-xs font-bold py-5 mt-2"
              >
                <Download className="w-4 h-4 mr-2" />
                {isProcessing ? 'Rasterizing...' : `Export ${outputFormat.toUpperCase()} (${finalWidth}×{finalHeight})`}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Vector Live Render</h2>
              <Badge variant="secondary" className="font-mono text-xs">
                Native: {svgDimensions.width} × {svgDimensions.height} px
              </Badge>
            </div>

            {/* Checkerboard Pattern Preview Box */}
            <div className="rounded-2xl border border-border/70 p-6 min-h-[260px] max-h-[360px] flex items-center justify-center bg-muted/40 overflow-hidden relative">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="SVG Preview"
                  className="max-h-[300px] max-w-full object-contain drop-shadow-sm transition-transform"
                />
              ) : (
                <div className="text-xs text-muted-foreground">Upload or paste SVG to preview</div>
              )}
            </div>

            {/* Export Target Specs */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                <div className="text-xs text-muted-foreground">Target Dimensions</div>
                <div className="text-base font-mono font-bold text-foreground mt-0.5">
                  {finalWidth} × {finalHeight} px
                </div>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                <div className="text-xs text-muted-foreground">Target Format</div>
                <div className="text-base font-mono font-bold text-foreground uppercase mt-0.5">
                  {outputFormat}
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Canvas rasterization runs 100% locally in your browser. No files uploaded.</span>
          </div>
        </div>
      </div>

      {/* Hidden elements for canvas export */}
      <canvas ref={canvasRef} className="hidden" />
      <a ref={downloadLinkRef} className="hidden" />

      {/* Guide Card */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Vector vs Raster Image Formats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">PNG (Portable Network Graphics)</h3>
            <p className="text-xs text-muted-foreground">
              Lossless compression preserving full alpha transparency. Best for website logos, transparent UI icons, and crisp vector artwork.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">WebP (Next-Gen)</h3>
            <p className="text-xs text-muted-foreground">
              Modern image format developed by Google offering superior lossy and lossless compression with smaller file sizes and transparency.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Retina & Print Scaling</h3>
            <p className="text-xs text-muted-foreground">
              Because SVGs are resolution-independent vectors, scale 2x or 4x before exporting to avoid pixelation on high-DPI smartphone and desktop displays.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}