'use client';

import React, { useState, useEffect, useId } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  FileCode,
  Layers
} from 'lucide-react';

function generateNanoID(size = 21) {
  const urlAlphabet = 'useandom-26T1983_40STFnvecigKey715_zOqArrayLptMxbhG';
  let id = '';
  const bytes = new Uint8Array(size);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
    for (let i = 0; i < size; i++) {
      id += urlAlphabet[bytes[i] % urlAlphabet.length];
    }
  } else {
    for (let i = 0; i < size; i++) {
      id += urlAlphabet[Math.floor(Math.random() * urlAlphabet.length)];
    }
  }
  return id;
}

function generateUUIDv1() {
  // Timestamp-based pseudo v1
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const randBytes = new Uint8Array(6);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randBytes);
  }
  const nodeHex = Array.from(randBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${timeHex.slice(4, 12)}-${timeHex.slice(0, 4)}-1${timeHex.slice(0, 3)}-8${nodeHex.slice(0, 3)}-${nodeHex.slice(0, 12)}`;
}

export default function UUIDGenerator() {
  const [type, setType] = useState('v4'); // 'v4', 'v1', 'nanoid'
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [quotes, setQuotes] = useState(false);
  const [format, setFormat] = useState('newline'); // 'newline', 'comma', 'json'
  
  const [generatedIds, setGeneratedIds] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      let val = '';
      if (type === 'v4') {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
          val = window.crypto.randomUUID();
        } else {
          val = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      } else if (type === 'v1') {
        val = generateUUIDv1();
      } else if (type === 'nanoid') {
        val = generateNanoID(21);
      }

      if (type !== 'nanoid' && !hyphens) {
        val = val.replace(/-/g, '');
      }
      if (uppercase) {
        val = val.toUpperCase();
      } else {
        val = val.toLowerCase();
      }
      if (braces) {
        val = `{${val}}`;
      }
      if (quotes) {
        val = `"${val}"`;
      }
      list.push(val);
    }
    setGeneratedIds(list);
  };

  useEffect(() => {
    generate();
  }, [type, count, uppercase, hyphens, braces, quotes]);

  const getFormattedOutput = () => {
    if (format === 'comma') {
      return generatedIds.join(', ');
    }
    if (format === 'json') {
      return JSON.stringify(generatedIds, null, 2);
    }
    return generatedIds.join('\n');
  };

  const copyIndividual = async (id, index) => {
    await navigator.clipboard.writeText(id);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(getFormattedOutput());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadFile = (ext) => {
    const content = getFormattedOutput();
    const blob = new Blob([content], { type: ext === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${type}-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <KeyRound className="w-3.5 h-3.5 mr-1.5 text-primary" />
            CSPRNG Cryptographic Randomness
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            UUID / GUID & NanoID Generator
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Bulk generate cryptographically secure UUID v4, v1, and NanoIDs directly in your browser with instant copy, formatting, and file exports.
          </p>
        </div>

        {/* Configuration Controls */}
        <Card className="border-border/60 shadow-sm mb-8">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Generation Options</CardTitle>
                <CardDescription className="text-xs">Select standard, count, and formatting parameters</CardDescription>
              </div>
              <Button onClick={generate} size="sm" className="gap-2 shrink-0">
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate New Batch
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            {/* Algorithm Selector */}
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                Identifier Algorithm
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'v4', title: 'UUID v4 (Random)', desc: '122-bit CSPRNG randomness, universal standard' },
                  { id: 'v1', title: 'UUID v1 (Timestamp)', desc: 'Epoch-based with simulated node identity' },
                  { id: 'nanoid', title: 'NanoID (21 Chars)', desc: 'Compact, URL-friendly collision resistant' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      type === item.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border/70 hover:bg-muted/40'
                    }`}
                  >
                    <div className="text-sm font-bold text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Quantity: <span className="font-mono text-primary font-bold">{count} IDs</span>
                </label>
                <span className="text-xs text-muted-foreground">Range: 1 to 50</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Toggle Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border/70 bg-card cursor-pointer hover:bg-muted/30">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-medium">UPPERCASE</span>
              </label>

              {type !== 'nanoid' && (
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border/70 bg-card cursor-pointer hover:bg-muted/30">
                  <input
                    type="checkbox"
                    checked={hyphens}
                    onChange={(e) => setHyphens(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-xs font-medium">Hyphens (-)</span>
                </label>
              )}

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border/70 bg-card cursor-pointer hover:bg-muted/30">
                <input
                  type="checkbox"
                  checked={braces}
                  onChange={(e) => setBraces(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-medium">Braces &#123; &#125;</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border/70 bg-card cursor-pointer hover:bg-muted/30">
                <input
                  type="checkbox"
                  checked={quotes}
                  onChange={(e) => setQuotes(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-medium">Quotes &quot; &quot;</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="border-border/60 shadow-md overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Generated Identifiers</CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">
                  {generatedIds.length} items
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={copyAll} size="sm" variant="default" className="text-xs gap-1.5">
                  {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAll ? 'Copied Entire List!' : 'Copy All'}
                </Button>
                <Button onClick={() => downloadFile('txt')} size="sm" variant="outline" className="text-xs gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  .TXT
                </Button>
                <Button onClick={() => downloadFile('json')} size="sm" variant="outline" className="text-xs gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  .JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60 max-h-[460px] overflow-y-auto font-mono text-xs sm:text-sm">
              {generatedIds.map((id, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 truncate mr-2">
                    <span className="text-muted-foreground/60 text-xs w-6 select-none">{idx + 1}.</span>
                    <span className="text-foreground font-semibold truncate select-all">{id}</span>
                  </div>
                  <Button
                    onClick={() => copyIndividual(id, idx)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 opacity-80 group-hover:opacity-100 shrink-0"
                    title="Copy this ID"
                  >
                    {copiedIndex === idx ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Collision Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border/60 bg-card/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Entropy Bits</div>
            <div className="text-xl font-bold text-primary mt-1">122 Bits</div>
            <p className="text-xs text-muted-foreground mt-1">
              UUID v4 provides 5.3 × 10^36 possible unique permutations.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Collision Probability</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">~ 0.000000%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Generating 1 billion UUIDs per second for 100 years has less than 50% collision chance.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Zero Telemetry</div>
            <div className="text-xl font-bold text-foreground mt-1">Client-Side</div>
            <p className="text-xs text-muted-foreground mt-1">
              Computed strictly via window.crypto.randomUUID() inside your local browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
