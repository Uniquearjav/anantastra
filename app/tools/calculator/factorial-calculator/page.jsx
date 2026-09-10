'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Binary,
  Layers, 
  ShieldCheck 
} from 'lucide-react';

export default function FactorialCalculator() {
  const [activeTab, setActiveTab] = useState('factorial'); // 'factorial' | 'permutation' | 'combination' | 'double'
  const [nInput, setNInput] = useState('10');
  const [rInput, setRInput] = useState('3');
  const [copied, setCopied] = useState(false);

  // BigInt factorial helper
  const computeBigIntFactorial = (num) => {
    if (num < 0) return null;
    if (num === 0 || num === 1) return 1n;
    let res = 1n;
    for (let i = 2n; i <= BigInt(num); i++) {
      res *= i;
    }
    return res;
  };

  // Double factorial n!! helper
  const computeBigIntDoubleFactorial = (num) => {
    if (num < 0) return null;
    if (num === 0 || num === 1) return 1n;
    let res = 1n;
    for (let i = BigInt(num); i > 0n; i -= 2n) {
      res *= i;
    }
    return res;
  };

  // Trailing zeros in n! (Legendre's formula)
  const countTrailingZeros = (num) => {
    let count = 0;
    for (let i = 5; Math.floor(num / i) >= 1; i *= 5) {
      count += Math.floor(num / i);
    }
    return count;
  };

  // Stirling's approximation for log10 digits
  const estimateDigits = (num) => {
    if (num <= 1) return 1;
    // Ramanujan / Stirling log10 approximation
    const log10Fac = (num * Math.log10(num / Math.E) + 0.5 * Math.log10(2 * Math.PI * num));
    return Math.floor(log10Fac) + 1;
  };

  const nVal = parseInt(nInput, 10);
  const rVal = parseInt(rInput, 10);
  const isValidN = !isNaN(nVal) && nVal >= 0 && nVal <= 1000;
  const isValidR = !isNaN(rVal) && rVal >= 0 && rVal <= nVal;

  const result = useMemo(() => {
    if (!isValidN) return null;

    if (activeTab === 'factorial') {
      const isBig = nVal > 250;
      const bigIntRes = computeBigIntFactorial(nVal);
      const strRes = bigIntRes.toString();
      const trailingZeros = countTrailingZeros(nVal);
      const digitCount = strRes.length;

      // Multiplication steps preview for small n
      const steps = [];
      if (nVal <= 15) {
        for (let i = 1; i <= nVal; i++) {
          steps.push(i);
        }
      }

      return {
        value: strRes,
        digitCount,
        trailingZeros,
        stepsPreview: steps.length > 0 ? steps.join(' × ') : null,
        isExact: true
      };
    }

    if (activeTab === 'double') {
      const bigIntRes = computeBigIntDoubleFactorial(nVal);
      const strRes = bigIntRes.toString();
      return {
        value: strRes,
        digitCount: strRes.length,
        trailingZeros: 0,
        isExact: true
      };
    }

    if (activeTab === 'permutation') {
      if (!isValidR) return null;
      // P(n, r) = n! / (n - r)! = n * (n-1) * ... * (n - r + 1)
      let perm = 1n;
      for (let i = BigInt(nVal); i > BigInt(nVal - rVal); i--) {
        perm *= i;
      }
      const strRes = perm.toString();
      return {
        value: strRes,
        digitCount: strRes.length,
        isExact: true
      };
    }

    if (activeTab === 'combination') {
      if (!isValidR) return null;
      // C(n, r) = n! / (r! * (n-r)!)
      const k = Math.min(rVal, nVal - rVal);
      let comb = 1n;
      for (let i = 1; i <= k; i++) {
        comb = (comb * BigInt(nVal - i + 1)) / BigInt(i);
      }
      const strRes = comb.toString();
      return {
        value: strRes,
        digitCount: strRes.length,
        isExact: true
      };
    }

    return null;
  }, [nVal, rVal, activeTab, isValidN, isValidR]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const factorialPresets = [0, 1, 5, 10, 20, 50, 100];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Calculator className="w-3.5 h-3.5 mr-1.5 text-primary" />
          High-Precision Combinatorics Engine
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Factorial Calculator
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Calculate exact arbitrary-precision factorials, permutations (nPr), combinations (nCr), and double factorials (n!!) with zero rounding errors.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center mb-6">
        <div className="p-1 rounded-xl bg-muted/50 border border-border/60 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('factorial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'factorial'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Factorial (n!)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('permutation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'permutation'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Permutations P(n, r)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('combination')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'combination'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Combinations C(n, r)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('double')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'double'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Double Factorial (n!!)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Panel */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4">Input Values</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="n-input" className="block text-sm font-semibold text-foreground mb-1.5">
                  Enter n {activeTab === 'factorial' ? '(Integer 0 to 1000)' : '(Total items)'}
                </label>
                <Input
                  id="n-input"
                  type="number"
                  min="0"
                  max="1000"
                  value={nInput}
                  onChange={(e) => setNInput(e.target.value)}
                  className="font-mono text-base"
                />
              </div>

              {(activeTab === 'permutation' || activeTab === 'combination') && (
                <div>
                  <label htmlFor="r-input" className="block text-sm font-semibold text-foreground mb-1.5">
                    Enter r (Items to choose, 0 ≤ r ≤ n)
                  </label>
                  <Input
                    id="r-input"
                    type="number"
                    min="0"
                    max={nVal || 0}
                    value={rInput}
                    onChange={(e) => setRInput(e.target.value)}
                    className="font-mono text-base"
                  />
                </div>
              )}

              {/* Quick Presets */}
              {activeTab === 'factorial' && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-2">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {factorialPresets.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNInput(p.toString())}
                        className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-colors ${
                          nVal === p
                            ? 'bg-primary text-primary-foreground border-primary font-bold'
                            : 'bg-muted/40 hover:bg-muted border-border/60 text-foreground'
                        }`}
                      >
                        {p}!
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mathematical Formula Display */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs">
                <div className="font-semibold text-foreground mb-1">Active Mathematical Formula:</div>
                <div className="font-mono text-primary text-sm font-bold">
                  {activeTab === 'factorial' && 'n! = n × (n - 1) × (n - 2) × ... × 1 (0! = 1)'}
                  {activeTab === 'permutation' && 'P(n, r) = n! / (n - r)!'}
                  {activeTab === 'combination' && 'C(n, r) = n! / [r! × (n - r)!]'}
                  {activeTab === 'double' && 'n!! = n × (n - 2) × (n - 4) × ...'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNInput('0');
                    setRInput('0');
                  }}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Exact Computed Result</h2>
              {result && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {result.digitCount} {result.digitCount === 1 ? 'digit' : 'digits'}
                </Badge>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Result header */}
                <div className="p-3 rounded-xl border border-border/60 bg-muted/20 font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {activeTab === 'factorial' && `${nVal}! = `}
                    {activeTab === 'permutation' && `P(${nVal}, ${rVal}) = `}
                    {activeTab === 'combination' && `C(${nVal}, ${rVal}) = `}
                    {activeTab === 'double' && `${nVal}!! = `}
                  </span>
                </div>

                {/* BigInt Scrollable Output Box */}
                <div className="relative">
                  <div className="max-h-60 overflow-y-auto p-4 rounded-xl border border-border/60 bg-muted/40 font-mono text-sm text-foreground break-all leading-relaxed select-all">
                    {result.value}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopy}
                    className="absolute top-2 right-2 h-7 text-xs px-2 shadow-xs"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                    <div className="text-xs text-muted-foreground">Total Digits</div>
                    <div className="text-lg font-mono font-bold text-foreground mt-0.5">
                      {result.digitCount.toLocaleString()}
                    </div>
                  </div>
                  {activeTab === 'factorial' && (
                    <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                      <div className="text-xs text-muted-foreground">Trailing Zeros</div>
                      <div className="text-lg font-mono font-bold text-foreground mt-0.5">
                        {result.trailingZeros.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {result.stepsPreview && (
                    <div className="col-span-2 p-3 rounded-xl border border-border/60 bg-card">
                      <div className="text-xs text-muted-foreground mb-1">Expanded Multiplication:</div>
                      <div className="font-mono text-xs text-primary truncate">
                        {result.stepsPreview}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                Please enter a valid non-negative integer (0 to 1000).
              </div>
            )}
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Runs locally with Native JavaScript BigInt. Uncapped integer precision.</span>
          </div>
        </div>
      </div>

      {/* Guide Card */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Factorial Combinatorics Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Why is 0! = 1?</h3>
            <p className="text-xs text-muted-foreground">
              There is exactly 1 way to arrange zero objects (the empty set). Mathematically, from n! = (n+1)! / (n+1), 0! = 1! / 1 = 1.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Permutations vs Combinations</h3>
            <p className="text-xs text-muted-foreground">
              <strong>Permutations</strong> care about order (race finishes, passwords). <strong>Combinations</strong> ignore order (card hands, team rosters).
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Stirling's Formula</h3>
            <p className="text-xs text-muted-foreground">
              For astronomical numbers, Stirling's approximation <code>n! ≈ √(2πn) × (n/e)ⁿ</code> gives accurate estimates of magnitude and digits.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}