'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Binary, 
  Copy, 
  Check, 
  RotateCcw, 
  Receipt, 
  Languages, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const HINDI_ONES = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
const HINDI_TENS = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

// Western 3-digit chunk converter
function convertThreeDigitWestern(num) {
  let str = '';
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) str += ' and ';
  }
  if (num >= 10 && num <= 19) {
    str += TEENS[num - 10];
  } else if (num >= 20) {
    str += TENS[Math.floor(num / 10)];
    if (num % 10 > 0) str += '-' + ONES[num % 10];
  } else if (num > 0) {
    str += ONES[num];
  }
  return str;
}

// Convert using Western scales (Thousand, Million, Billion, Trillion)
function convertWesternWords(integerPart) {
  if (integerPart === 0n) return 'zero';

  const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];
  let chunks = [];
  let n = integerPart;

  while (n > 0n) {
    chunks.push(Number(n % 1000n));
    n = n / 1000n;
  }

  let words = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (chunk > 0) {
      const chunkWord = convertThreeDigitWestern(chunk);
      const scale = scales[i];
      words.push(scale ? `${chunkWord} ${scale}` : chunkWord);
    }
  }

  return words.join(', ');
}

// Convert using Indian numbering system (Lakh, Crore, Arab)
function convertIndianWords(integerPart) {
  if (integerPart === 0n) return 'zero';

  let n = integerPart;
  let parts = [];

  // Hundreds chunk (first 3 digits from right)
  const hundreds = Number(n % 1000n);
  n = n / 1000n;
  if (hundreds > 0) {
    parts.unshift(convertThreeDigitWestern(hundreds));
  }

  // Next chunks are in 2-digit groups: Thousand, Lakh, Crore, Arab
  const indianScales = ['thousand', 'lakh', 'crore', 'arab', 'kharb'];
  let scaleIndex = 0;

  while (n > 0n && scaleIndex < indianScales.length) {
    const chunk = Number(n % 100n);
    n = n / 100n;
    if (chunk > 0) {
      const chunkWord = convertThreeDigitWestern(chunk);
      parts.unshift(`${chunkWord} ${indianScales[scaleIndex]}`);
    }
    scaleIndex++;
  }

  if (n > 0n) {
    // If still larger than kharb
    parts.unshift(convertIndianWords(n) + ' shankh');
  }

  return parts.join(', ');
}

// Convert to Hindi words
function convertHindiWords(integerPart) {
  if (integerPart === 0n) return 'शून्य';
  if (integerPart < 0n) return 'ऋण ' + convertHindiWords(-integerPart);

  let n = integerPart;
  const parts = [];

  const hundreds = Number(n % 1000n);
  n = n / 1000n;
  if (hundreds > 0) {
    let hStr = '';
    if (hundreds >= 100) {
      hStr += HINDI_ONES[Math.floor(hundreds / 100)] + ' सौ ';
    }
    const rem = hundreds % 100;
    if (rem > 0 && rem < 20) {
      hStr += HINDI_ONES[rem];
    } else if (rem >= 20) {
      hStr += HINDI_TENS[Math.floor(rem / 10)];
      if (rem % 10 > 0) hStr += ' ' + HINDI_ONES[rem % 10];
    }
    parts.unshift(hStr.trim());
  }

  const hindiScales = ['हज़ार', 'लाख', 'करोड़', 'अरब'];
  let scaleIndex = 0;

  while (n > 0n && scaleIndex < hindiScales.length) {
    const chunk = Number(n % 100n);
    n = n / 100n;
    if (chunk > 0) {
      let cStr = '';
      if (chunk < 20) {
        cStr = HINDI_ONES[chunk];
      } else {
        cStr = HINDI_TENS[Math.floor(chunk / 10)];
        if (chunk % 10 > 0) cStr += ' ' + HINDI_ONES[chunk % 10];
      }
      parts.unshift(`${cStr.trim()} ${hindiScales[scaleIndex]}`);
    }
    scaleIndex++;
  }

  return parts.join(' ');
}

export default function NumberToWordsConverter() {
  const [inputVal, setInputVal] = useState('1254500.50');
  const [system, setSystem] = useState('western'); // 'western' | 'indian' | 'hindi'
  const [currencyMode, setCurrencyMode] = useState('none'); // 'none' | 'usd' | 'inr' | 'eur' | 'gbp'
  const [caseFormat, setCaseFormat] = useState('title'); // 'title' | 'upper' | 'lower' | 'sentence'
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: '₹1 Lakh', val: '100000' },
    { label: '₹10 Lakh', val: '1000000' },
    { label: '₹1 Crore', val: '10000000' },
    { label: '$1 Million', val: '1000000' },
    { label: '$1 Billion', val: '1000000000' },
    { label: 'Cheque ₹25,450.75', val: '25450.75' },
    { label: 'Round 50,000', val: '50000' }
  ];

  const result = useMemo(() => {
    const clean = inputVal.replace(/,/g, '').trim();
    if (!clean) return null;

    const isNegative = clean.startsWith('-');
    const positiveClean = isNegative ? clean.substring(1) : clean;

    const parts = positiveClean.split('.');
    if (parts.length > 2) return null;

    let integerStr = parts[0] || '0';
    let decimalStr = parts[1] || '';

    let intBig;
    try {
      intBig = BigInt(integerStr);
    } catch {
      return null;
    }

    let words = '';

    if (system === 'hindi') {
      words = convertHindiWords(intBig);
      if (decimalStr) {
        words += ' दशमलव ' + decimalStr.split('').map(d => HINDI_ONES[parseInt(d)] || 'शून्य').join(' ');
      }
      if (isNegative) words = 'ऋण ' + words;
    } else {
      // English: Western or Indian
      const baseWords = system === 'indian' ? convertIndianWords(intBig) : convertWesternWords(intBig);

      if (currencyMode === 'none') {
        words = baseWords;
        if (decimalStr) {
          const decWords = decimalStr.split('').map(d => ONES[parseInt(d)] || 'zero').join(' ');
          words += ' point ' + decWords;
        }
      } else if (currencyMode === 'usd') {
        const cents = parseInt(decimalStr.padEnd(2, '0').slice(0, 2), 10) || 0;
        const dollarWord = intBig === 1n ? 'dollar' : 'dollars';
        words = `${baseWords} ${dollarWord}`;
        if (cents > 0) {
          words += ` and ${convertThreeDigitWestern(cents)} cents`;
        }
        words += ' only';
      } else if (currencyMode === 'inr') {
        const paise = parseInt(decimalStr.padEnd(2, '0').slice(0, 2), 10) || 0;
        const rupeeWord = intBig === 1n ? 'rupee' : 'rupees';
        words = `${baseWords} ${rupeeWord}`;
        if (paise > 0) {
          words += ` and ${convertThreeDigitWestern(paise)} paise`;
        }
        words += ' only';
      } else if (currencyMode === 'eur') {
        const cents = parseInt(decimalStr.padEnd(2, '0').slice(0, 2), 10) || 0;
        words = `${baseWords} euros`;
        if (cents > 0) {
          words += ` and ${convertThreeDigitWestern(cents)} cents`;
        }
        words += ' only';
      } else if (currencyMode === 'gbp') {
        const pence = parseInt(decimalStr.padEnd(2, '0').slice(0, 2), 10) || 0;
        words = `${baseWords} pounds`;
        if (pence > 0) {
          words += ` and ${convertThreeDigitWestern(pence)} pence`;
        }
        words += ' only';
      }

      if (isNegative) words = 'minus ' + words;
    }

    // Apply Case Formatting
    let formattedWords = words;
    if (system !== 'hindi') {
      if (caseFormat === 'upper') {
        formattedWords = words.toUpperCase();
      } else if (caseFormat === 'lower') {
        formattedWords = words.toLowerCase();
      } else if (caseFormat === 'title') {
        formattedWords = words.replace(/\b[a-z]/g, char => char.toUpperCase());
      } else if (caseFormat === 'sentence') {
        formattedWords = words.charAt(0).toUpperCase() + words.slice(1);
      }
    }

    return {
      formatted: formattedWords,
      raw: words,
      digitsCount: integerStr.length
    };
  }, [inputVal, system, currencyMode, caseFormat]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Binary className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Linguistic Number Formatter
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Number to Words Converter
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Convert numeric amounts into full written words with Indian (Lakh/Crore) and Western (Million/Billion) scales, legal cheque formats, and multi-language support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input & Options Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <label htmlFor="num-input" className="text-sm font-semibold text-foreground block mb-2">
              Enter Any Number or Financial Amount
            </label>
            <Input
              id="num-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 1000000 or 25450.50"
              className="font-mono text-lg py-5"
            />

            {/* Presets */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputVal(p.val);
                    if (p.label.includes('₹') || p.label.includes('Lakh') || p.label.includes('Crore')) {
                      setSystem('indian');
                      setCurrencyMode(p.label.includes('Cheque') ? 'inr' : 'none');
                    } else if (p.label.includes('$')) {
                      setSystem('western');
                      setCurrencyMode('none');
                    }
                  }}
                  className="text-xs px-2.5 py-1 rounded-md border border-border/60 bg-muted/30 hover:bg-muted text-foreground transition-colors font-mono"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Numbering System Toggle */}
            <div className="mt-6 pt-5 border-t border-border/60 space-y-4">
              <div>
                <span className="text-xs font-semibold text-foreground block mb-2">
                  Numbering Scale / Language:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSystem('western')}
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      system === 'western'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                        : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    International (Million/Billion)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystem('indian')}
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      system === 'indian'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                        : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Indian (Lakh/Crore)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystem('hindi')}
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      system === 'hindi'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                        : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Hindi (हिंदी शब्द)
                  </button>
                </div>
              </div>

              {/* Cheque & Currency Mode */}
              {system !== 'hindi' && (
                <div>
                  <span className="text-xs font-semibold text-foreground block mb-2">
                    Currency / Legal Cheque Format:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'none', label: 'Plain Text' },
                      { id: 'inr', label: 'Rupees (₹)' },
                      { id: 'usd', label: 'Dollars ($)' },
                      { id: 'eur', label: 'Euros (€)' },
                      { id: 'gbp', label: 'Pounds (£)' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setCurrencyMode(m.id)}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          currencyMode === m.id
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Format */}
              {system !== 'hindi' && (
                <div>
                  <span className="text-xs font-semibold text-foreground block mb-2">
                    Letter Case:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'title', label: 'Title Case' },
                      { id: 'sentence', label: 'Sentence case' },
                      { id: 'upper', label: 'UPPERCASE' },
                      { id: 'lower', label: 'lowercase' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCaseFormat(c.id)}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          caseFormat === c.id
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputVal('')}
                className="text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Converted Words</h2>
              {result && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {result.digitsCount} digits
                </Badge>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Result Box */}
                <div className="relative">
                  <div className="min-h-[140px] max-h-72 overflow-y-auto p-4 rounded-xl border border-border/70 bg-muted/40 font-medium text-sm sm:text-base text-foreground leading-relaxed select-all">
                    {result.formatted}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopy}
                    className="absolute top-2 right-2 h-7 text-xs px-2 shadow-xs"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? 'Copied' : 'Copy Words'}
                  </Button>
                </div>

                {/* Cheque Preview if Currency mode is on */}
                {currencyMode !== 'none' && (
                  <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-foreground">
                    <div className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                      <Receipt className="w-3.5 h-3.5" />
                      Cheque & Invoice Ready:
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Formatted according to banking guidelines to prevent fraudulent tampering on checks and official payment receipts.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                Enter a number on the left to see it written in words.
              </div>
            )}
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant client-side linguistic rendering. No tracking or telemetry.</span>
          </div>
        </div>
      </div>

      {/* Guide Card */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Indian vs International Numbering Systems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Indian Scale (2-2-3 Rule)</h3>
            <p className="text-xs text-muted-foreground">
              Commas grouped as 1,00,00,000. Values scale by 100x after thousand: 1 Lakh = 100,000; 1 Crore = 100 Lakhs = 10,000,000.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Western Scale (3-3-3 Rule)</h3>
            <p className="text-xs text-muted-foreground">
              Commas grouped as 10,000,000. Values scale by 1000x: 1 Million = 1,000,000; 1 Billion = 1,000 Millions = 1,000,000,000.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Cheque Writing Standard</h3>
            <p className="text-xs text-muted-foreground">
              Always suffix amounts with the word <em>"Only"</em> (or <em>"मात्र"</em>) on banking documents to prevent fraudulent suffix additions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}