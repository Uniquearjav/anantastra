'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeftRight, 
  ListOrdered,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function PrimeCheckerComponent() {
  const [numberInput, setNumberInput] = useState('97');
  const [copied, setCopied] = useState(false);

  // Range generator state
  const [rangeStart, setRangeStart] = useState('1');
  const [rangeEnd, setRangeEnd] = useState('50');

  const samplePrimes = [2, 7, 13, 97, 541, 1009, 7919];

  // Prime analysis
  const analysis = useMemo(() => {
    const raw = numberInput.trim();
    if (!raw) return null;
    const n = parseInt(raw, 10);

    if (isNaN(n) || n < 0) {
      return { error: 'Please enter a valid non-negative integer' };
    }

    if (n > 100000000) {
      return { error: 'Number too large for instant browser computation (Max: 100,000,000)' };
    }

    // Is prime check
    const checkPrime = (num) => {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;
      for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
      }
      return true;
    };

    const isPrimeNum = checkPrime(n);

    // Divisors & Prime Factorization
    const divisors = [];
    const primeFactors = [];
    let temp = n;

    if (n > 0) {
      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          divisors.push(i);
          if (i !== n / i) divisors.push(n / i);
        }
      }
      divisors.sort((a, b) => a - b);

      // Prime factors
      let d = 2;
      while (temp % 2 === 0) {
        primeFactors.push(2);
        temp = Math.floor(temp / 2);
      }
      for (let i = 3; i * i <= temp; i += 2) {
        while (temp % i === 0) {
          primeFactors.push(i);
          temp = Math.floor(temp / i);
        }
      }
      if (temp > 2) primeFactors.push(temp);
    }

    // Factor frequency representation (e.g. 2^3 * 3^2)
    const factorCounts = {};
    primeFactors.forEach(f => {
      factorCounts[f] = (factorCounts[f] || 0) + 1;
    });
    const factorFormula = Object.entries(factorCounts)
      .map(([f, count]) => (count > 1 ? `${f}^${count}` : `${f}`))
      .join(' × ');

    // Nearest primes
    let prevPrime = null;
    if (n > 2) {
      for (let i = n - 1; i >= 2; i--) {
        if (checkPrime(i)) {
          prevPrime = i;
          break;
        }
      }
    }

    let nextPrime = null;
    let scanLimit = n + 500;
    for (let i = n + 1; i <= scanLimit; i++) {
      if (checkPrime(i)) {
        nextPrime = i;
        break;
      }
    }

    return {
      n,
      isPrimeNum,
      divisors,
      primeFactors,
      factorFormula,
      prevPrime,
      nextPrime
    };
  }, [numberInput]);

  // Range prime list
  const rangePrimes = useMemo(() => {
    const s = Math.max(1, parseInt(rangeStart, 10) || 1);
    const e = Math.min(10000, parseInt(rangeEnd, 10) || 50);
    if (s > e) return [];

    const isP = (num) => {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;
      for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
      }
      return true;
    };

    const primes = [];
    for (let i = s; i <= e; i++) {
      if (isP(i)) primes.push(i);
    }
    return primes;
  }, [rangeStart, rangeEnd]);

  const handleCopy = () => {
    if (!analysis || analysis.error) return;
    const summary = `PRIME NUMBER REPORT - ANANTASTRA
------------------------------------
Number Checked      : ${analysis.n}
Is Prime            : ${analysis.isPrimeNum ? 'YES (Prime)' : 'NO (Composite)'}
Prime Factorization : ${analysis.factorFormula || 'None'}
Total Divisors (${analysis.divisors.length}) : ${analysis.divisors.join(', ')}
Nearest Prev Prime  : ${analysis.prevPrime ?? 'None'}
Nearest Next Prime  : ${analysis.nextPrime ?? 'N/A'}
------------------------------------
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Math Tool</Badge>
            <Badge variant="subtle">Prime & Divisors</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Prime Number Checker & Factorizer
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Determine primality, extract prime factorizations, inspect divisors, and find primes in a range
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!analysis || Boolean(analysis.error)}
          className="h-8 text-xs gap-1 border-border/70"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Number Input & Quick Chips (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Enter Number to Test
              </label>
              <Input
                type="number"
                min="0"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="e.g. 97"
                className="font-mono text-xl font-bold h-12 rounded-xl"
              />
            </div>

            {/* Quick Sample Chips */}
            <div>
              <span className="text-[11px] text-muted-foreground block mb-2 font-medium">
                Try Famous Primes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrimes.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNumberInput(p.toString())}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Range Prime Generator */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Find Primes in Range</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">From</label>
                <Input
                  type="number"
                  min="1"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">To</label>
                <Input
                  type="number"
                  min="1"
                  max="10000"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border/40">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-muted-foreground">Found {rangePrimes.length} primes:</span>
              </div>
              <div className="max-h-32 overflow-y-auto p-2 rounded-lg bg-muted/20 border border-border/40 font-mono text-xs flex flex-wrap gap-1">
                {rangePrimes.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNumberInput(p.toString())}
                    className="px-1.5 py-0.5 rounded bg-background border border-border/60 hover:border-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Results & Factorization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {analysis && analysis.error ? (
            <Card className="p-6 border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <p className="text-sm font-semibold">{analysis.error}</p>
            </Card>
          ) : analysis ? (
            <>
              {/* Primality Verdict Card */}
              <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Primality Status
                  </h2>
                  <Badge variant={analysis.isPrimeNum ? 'success' : 'outline'}>
                    {analysis.isPrimeNum ? 'Prime' : 'Composite'}
                  </Badge>
                </div>

                <div className="my-5 p-5 rounded-xl border border-border/80 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl text-white ${
                      analysis.isPrimeNum ? 'bg-emerald-600' : 'bg-zinc-600'
                    }`}>
                      {analysis.isPrimeNum ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                    </span>
                    <div>
                      <span className="text-2xl font-black text-foreground font-mono">
                        {analysis.n}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {analysis.isPrimeNum
                          ? 'Only divisible by 1 and itself.'
                          : `Has ${analysis.divisors.length} positive divisors.`}
                      </p>
                    </div>
                  </div>

                  <span className={`text-sm font-extrabold uppercase ${
                    analysis.isPrimeNum ? 'text-emerald-500' : 'text-muted-foreground'
                  }`}>
                    {analysis.isPrimeNum ? 'Prime Number' : 'Composite Number'}
                  </span>
                </div>

                {/* Nearest Primes Nav */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-border/50 bg-background/50">
                    <span className="text-[10px] text-muted-foreground block">Previous Prime</span>
                    <span className="text-base font-bold font-mono text-foreground">
                      {analysis.prevPrime ?? 'None (n ≤ 2)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-border/50 bg-background/50">
                    <span className="text-[10px] text-muted-foreground block">Next Prime</span>
                    <span className="text-base font-bold font-mono text-foreground">
                      {analysis.nextPrime ?? 'N/A'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Factorization & Divisors Card */}
              <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Divisors & Factors
                  </h3>
                  <Badge variant="subtle" className="text-xs font-mono">
                    {analysis.divisors.length} Divisors
                  </Badge>
                </div>

                {!analysis.isPrimeNum && analysis.primeFactors.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Prime Factorization:</span>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/50 font-mono text-base font-extrabold text-primary">
                      {analysis.factorFormula}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">All Positive Divisors:</span>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-muted/20 border border-border/50 font-mono text-xs max-h-36 overflow-y-auto">
                    {analysis.divisors.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded bg-background border border-border/60 text-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
