'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Binary, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Cpu,
  Layers
} from 'lucide-react';

export default function DecimalBinaryCalculator() {
  const [decInput, setDecInput] = useState('42');
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeBitWidth, setActiveBitWidth] = useState(8); // 8, 16, 32

  // Derive all bases from decimal BigInt/number
  const baseData = useMemo(() => {
    try {
      const trimmed = decInput.trim();
      if (!trimmed) {
        return {
          dec: '',
          bin: '',
          hex: '',
          oct: '',
          ascii: '',
          valid: false,
          error: ''
        };
      }

      // Support negative numbers or BigInt
      const n = BigInt(trimmed);
      const bin = n.toString(2);
      const hex = n.toString(16).toUpperCase();
      const oct = n.toString(8);

      // Printable ASCII if in range
      let ascii = '';
      if (n >= 32n && n <= 126n) {
        ascii = String.fromCharCode(Number(n));
      } else if (n === 0n) {
        ascii = 'NUL';
      }

      // Bit array for interactive bitboard (clamp to positive 32-bit for visualization)
      const numForBits = Number(n & ((1n << BigInt(activeBitWidth)) - 1n));
      const bits = [];
      for (let i = activeBitWidth - 1; i >= 0; i--) {
        bits.push((numForBits >> i) & 1);
      }

      return {
        dec: trimmed,
        bin,
        hex,
        oct,
        ascii,
        bits,
        valid: true,
        error: ''
      };
    } catch {
      return {
        dec: decInput,
        bin: '',
        hex: '',
        oct: '',
        ascii: '',
        bits: [],
        valid: false,
        error: 'Invalid decimal number'
      };
    }
  }, [decInput, activeBitWidth]);

  const updateFromBase = (val, base) => {
    try {
      const clean = val.trim();
      if (!clean) {
        setDecInput('');
        return;
      }
      let decVal = 0n;
      if (base === 2) {
        if (!/^[01]+$/.test(clean)) throw new Error();
        decVal = BigInt(`0b${clean}`);
      } else if (base === 16) {
        if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error();
        decVal = BigInt(`0x${clean}`);
      } else if (base === 8) {
        if (!/^[0-7]+$/.test(clean)) throw new Error();
        decVal = BigInt(`0o${clean}`);
      } else {
        decVal = BigInt(clean);
      }
      setDecInput(decVal.toString(10));
    } catch {
      // Ignored for partial typing
    }
  };

  const toggleBit = (bitIndex) => {
    try {
      const current = BigInt(decInput || '0');
      const mask = 1n << BigInt(activeBitWidth - 1 - bitIndex);
      const next = current ^ mask;
      setDecInput(next.toString(10));
    } catch {
      // Ignore
    }
  };

  const handleCopy = (val, key) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <Binary className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Number Systems</Badge>
            <Badge variant="subtle">Real-Time Bi-Directional</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Decimal & Binary Base Converter
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Convert seamlessly across Decimal, Binary, Hexadecimal, and Octal with an interactive bit inspector
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDecInput('0')}
            className="h-8 text-xs gap-1 border-border/70"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Synchronized Base Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Decimal (Base 10) */}
        <Card className="p-4 border-border/60 bg-card text-card-foreground space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Badge variant="contrast" className="text-[10px]">Base 10</Badge>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Decimal
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(baseData.dec, 'dec')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copiedKey === 'dec' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'dec' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <Input
            type="text"
            value={decInput}
            onChange={(e) => setDecInput(e.target.value)}
            placeholder="e.g. 255"
            className="font-mono text-base font-bold h-11 bg-background"
          />
        </Card>

        {/* Binary (Base 2) */}
        <Card className="p-4 border-border/60 bg-card text-card-foreground space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Badge variant="subtle" className="text-[10px]">Base 2</Badge>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Binary
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(baseData.bin, 'bin')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copiedKey === 'bin' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'bin' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <Input
            type="text"
            value={baseData.bin}
            onChange={(e) => updateFromBase(e.target.value, 2)}
            placeholder="e.g. 11111111"
            className="font-mono text-base font-bold h-11 bg-background"
          />
        </Card>

        {/* Hexadecimal (Base 16) */}
        <Card className="p-4 border-border/60 bg-card text-card-foreground space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Badge variant="subtle" className="text-[10px]">Base 16</Badge>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Hexadecimal
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(baseData.hex, 'hex')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copiedKey === 'hex' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'hex' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <Input
            type="text"
            value={baseData.hex}
            onChange={(e) => updateFromBase(e.target.value, 16)}
            placeholder="e.g. FF"
            className="font-mono text-base font-bold h-11 bg-background"
          />
        </Card>

        {/* Octal (Base 8) */}
        <Card className="p-4 border-border/60 bg-card text-card-foreground space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Badge variant="subtle" className="text-[10px]">Base 8</Badge>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Octal
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(baseData.oct, 'oct')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copiedKey === 'oct' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'oct' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <Input
            type="text"
            value={baseData.oct}
            onChange={(e) => updateFromBase(e.target.value, 8)}
            placeholder="e.g. 377"
            className="font-mono text-base font-bold h-11 bg-background"
          />
        </Card>
      </div>

      {/* Interactive Bitboard / Bit Inspector */}
      {baseData.valid && baseData.bits.length > 0 && (
        <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Interactive Bit Inspector (Click to flip bits)
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">Bit Width:</span>
              {[8, 16, 32].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setActiveBitWidth(w)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    activeBitWidth === w
                      ? 'border-foreground bg-foreground text-background shadow-xs'
                      : 'border-border/60 text-muted-foreground'
                  }`}
                >
                  {w}-bit
                </button>
              ))}
            </div>
          </div>

          {/* Clickable Bit Tiles */}
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {baseData.bits.map((bitVal, idx) => {
              const bitPower = activeBitWidth - 1 - idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleBit(idx)}
                  className={`flex flex-col items-center justify-center w-10 h-14 rounded-lg border font-mono transition-all ${
                    bitVal === 1
                      ? 'border-foreground bg-foreground text-background shadow-xs font-extrabold scale-105'
                      : 'border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40 font-medium'
                  }`}
                >
                  <span className="text-base leading-none">{bitVal}</span>
                  <span className="text-[9px] opacity-60 mt-1">2^{bitPower}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Click any bit box above to toggle it between 0 and 1. Values in all 4 bases recalculate instantly.
          </p>
        </Card>
      )}

      {/* Quick Common Values Reference */}
      <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground text-xs">
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Common Computing Constants</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setDecInput('255')}
            className="p-2.5 rounded-lg border border-border/40 bg-muted/20 text-left hover:bg-muted/40"
          >
            <span className="font-sans font-bold text-foreground block">8-bit Max (255)</span>
            0xFF • 11111111
          </button>
          <button
            type="button"
            onClick={() => setDecInput('65535')}
            className="p-2.5 rounded-lg border border-border/40 bg-muted/20 text-left hover:bg-muted/40"
          >
            <span className="font-sans font-bold text-foreground block">16-bit Max (65,535)</span>
            0xFFFF
          </button>
          <button
            type="button"
            onClick={() => setDecInput('1024')}
            className="p-2.5 rounded-lg border border-border/40 bg-muted/20 text-left hover:bg-muted/40"
          >
            <span className="font-sans font-bold text-foreground block">1 Kilobyte (1024)</span>
            0x400 • 2^10
          </button>
          <button
            type="button"
            onClick={() => setDecInput('42')}
            className="p-2.5 rounded-lg border border-border/40 bg-muted/20 text-left hover:bg-muted/40"
          >
            <span className="font-sans font-bold text-foreground block">Sample (42)</span>
            0x2A • 101010
          </button>
        </div>
      </Card>
    </div>
  );
}