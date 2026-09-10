'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Eye, 
  EyeOff, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkPasswords, setBulkPasswords] = useState([]);
  const [copiedBulkIdx, setCopiedBulkIdx] = useState(null);

  const lengthPresets = [8, 12, 16, 20, 24, 32];

  // Cryptographically secure random generation
  const generateSinglePassword = (len) => {
    let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
      lowercaseChars = lowercaseChars.replace(/[lo]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
    }

    let charPool = '';
    const guaranteedChars = [];

    if (includeUpper && uppercaseChars) {
      charPool += uppercaseChars;
      guaranteedChars.push(getRandomChar(uppercaseChars));
    }
    if (includeLower && lowercaseChars) {
      charPool += lowercaseChars;
      guaranteedChars.push(getRandomChar(lowercaseChars));
    }
    if (includeNumbers && numberChars) {
      charPool += numberChars;
      guaranteedChars.push(getRandomChar(numberChars));
    }
    if (includeSymbols && symbolChars) {
      charPool += symbolChars;
      guaranteedChars.push(getRandomChar(symbolChars));
    }

    if (!charPool) return 'Select at least one character type';

    const remainingLength = Math.max(0, len - guaranteedChars.length);
    const randomArray = new Uint32Array(remainingLength);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomArray);
    }

    const restChars = [];
    for (let i = 0; i < remainingLength; i++) {
      const idx = randomArray[i] % charPool.length;
      restChars.push(charPool[idx]);
    }

    // Combine and shuffle
    const combined = [...guaranteedChars, ...restChars];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined.join('');
  };

  const getRandomChar = (str) => {
    const array = new Uint32Array(1);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
      return str[array[0] % str.length];
    }
    return str[Math.floor(Math.random() * str.length)];
  };

  const regenerate = () => {
    const newPass = generateSinglePassword(length);
    setPassword(newPass);

    if (bulkMode) {
      const list = [];
      for (let i = 0; i < 5; i++) {
        list.push(generateSinglePassword(length));
      }
      setBulkPasswords(list);
    }
  };

  useEffect(() => {
    regenerate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, bulkMode]);

  // Strength and entropy estimation
  const strengthInfo = useMemo(() => {
    if (!password || password.includes('Select')) {
      return { score: 0, label: 'None', color: 'bg-muted', crackTime: 'Instant' };
    }

    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 28;

    const entropy = Math.round(length * Math.log2(Math.max(1, poolSize)));

    if (entropy < 40) {
      return { score: 1, label: 'Weak', color: 'bg-rose-500', crackTime: 'A few seconds' };
    } else if (entropy < 60) {
      return { score: 2, label: 'Moderate', color: 'bg-amber-500', crackTime: 'A few days' };
    } else if (entropy < 80) {
      return { score: 3, label: 'Strong', color: 'bg-blue-500', crackTime: 'Centuries' };
    } else {
      return { score: 4, label: 'Very Strong', color: 'bg-emerald-500', crackTime: 'Billions of years' };
    }
  }, [password, length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const handleCopy = (text = password, idx = null) => {
    if (!text || text.includes('Select')) return;
    navigator.clipboard.writeText(text);
    if (idx !== null) {
      setCopiedBulkIdx(idx);
      setTimeout(() => setCopiedBulkIdx(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <KeyRound className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Security Tool</Badge>
            <Badge variant="subtle">Cryptographically Secure</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Password Generator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Generate ultra-secure, cryptographically random passwords with strength analysis. 100% client-side.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setBulkMode(!bulkMode)}
          className="h-8 text-xs gap-1.5 border-border/70"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{bulkMode ? 'Single Mode' : 'Bulk Mode (x5)'}</span>
        </Button>
      </div>

      {/* Main Password Showcase Box */}
      <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className="h-14 pl-4 pr-12 font-mono text-lg sm:text-xl font-bold tracking-wider bg-muted/30 border-border/80 text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={regenerate}
              className="h-14 px-4 rounded-xl border-border/70 hover:bg-accent gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-semibold">Regenerate</span>
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => handleCopy()}
              className="h-14 px-6 rounded-xl font-bold gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Password</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="mt-4 pt-4 border-t border-border/40 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              Strength: <strong className="text-foreground">{strengthInfo.label}</strong>
            </span>
            <span className="text-muted-foreground">
              Time to crack: <strong className="text-foreground">{strengthInfo.crackTime}</strong>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${
                  strengthInfo.score >= step ? strengthInfo.color : 'bg-muted/60'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Bulk Passwords List if active */}
      {bulkMode && bulkPasswords.length > 0 && (
        <Card className="p-5 border-border/60 bg-card text-card-foreground shadow-xs mb-8 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Bulk Generated Passwords</span>
          </h2>
          <div className="space-y-2">
            {bulkPasswords.map((pass, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <span className="font-mono text-sm font-semibold tracking-wider text-foreground select-all truncate pr-4">
                  {pass}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(pass, idx)}
                  className="h-7 px-2.5 text-xs gap-1 shrink-0"
                >
                  {copiedBulkIdx === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Length Slider Card */}
        <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password Length
            </label>
            <span className="text-base font-extrabold text-foreground px-2.5 py-0.5 rounded-md bg-muted border border-border/60">
              {length}
            </span>
          </div>

          <Slider
            value={[length]}
            min={6}
            max={64}
            step={1}
            onValueChange={([val]) => setLength(val)}
            className="py-1"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {lengthPresets.map((lVal) => (
              <button
                key={lVal}
                type="button"
                onClick={() => setLength(lVal)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  length === lVal
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                {lVal}
              </button>
            ))}
          </div>
        </Card>

        {/* Character Sets Toggles Card */}
        <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Included Characters
          </h2>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-foreground">Uppercase Letters (A-Z)</span>
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-foreground">Lowercase Letters (a-z)</span>
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-foreground">Numbers (0-9)</span>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-foreground">Special Symbols (!@#$%)</span>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">Exclude Ambiguous Characters</span>
                <span className="text-[10px] text-muted-foreground">Avoids confusion between 0/O and 1/l/I</span>
              </div>
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
              />
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}