'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  ArrowLeftRight, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

export default function PalindromeChecker() {
  const [text, setText] = useState('A man, a plan, a canal: Panama');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [mode, setMode] = useState('char'); // 'char' | 'word'
  const [copied, setCopied] = useState(false);

  const samplePalindromes = [
    { label: 'Panama Canal', val: 'A man, a plan, a canal: Panama' },
    { label: 'Racecar', val: 'Racecar' },
    { label: 'Car or Cat', val: 'Was it a car or a cat I saw?' },
    { label: 'Never Odd', val: 'Never odd or even' },
    { label: 'Numeric', val: '123454321' },
    { label: 'Madam Adam', val: "Madam, I'm Adam" },
    { label: 'Word By Word', val: 'Fall leaves after leaves fall' },
  ];

  // Helper to find longest palindromic substring
  const findLongestPalindrome = (str) => {
    if (!str || str.length <= 1) return str;
    let longest = str[0];

    const expandAroundCenter = (left, right) => {
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        if (right - left + 1 > longest.length) {
          longest = str.substring(left, right + 1);
        }
        left--;
        right++;
      }
    };

    for (let i = 0; i < str.length; i++) {
      expandAroundCenter(i, i);
      expandAroundCenter(i, i + 1);
    }
    return longest;
  };

  const analysis = useMemo(() => {
    if (!text.trim()) {
      return null;
    }

    if (mode === 'word') {
      // Word-level palindrome analysis
      let words = text.split(/\s+/).filter(Boolean);
      if (ignorePunctuation) {
        words = words.map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ''));
      }
      if (ignoreCase) {
        words = words.map(w => w.toLowerCase());
      }
      const cleanWords = words.filter(Boolean);
      const reversedWords = [...cleanWords].reverse();
      const isPalindrome = cleanWords.length > 0 && cleanWords.join(' ') === reversedWords.join(' ');

      return {
        isPalindrome,
        processed: cleanWords.join(' '),
        reversed: reversedWords.join(' '),
        originalLength: text.length,
        cleanLength: cleanWords.length,
        longestSubstring: null,
        type: 'word'
      };
    }

    // Character-level palindrome analysis
    let processed = text;
    if (ignoreCase) processed = processed.toLowerCase();
    if (ignoreSpaces) processed = processed.replace(/\s+/g, '');
    if (ignorePunctuation) processed = processed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '');

    const reversed = processed.split('').reverse().join('');
    const isPalindrome = processed.length > 0 && processed === reversed;

    // Calculate match percentage
    let matchCount = 0;
    const len = processed.length;
    for (let i = 0; i < len; i++) {
      if (processed[i] === reversed[i]) matchCount++;
    }
    const matchPercentage = len > 0 ? Math.round((matchCount / len) * 100) : 0;

    let longest = '';
    if (!isPalindrome && processed.length > 1) {
      longest = findLongestPalindrome(processed);
    }

    return {
      isPalindrome,
      processed,
      reversed,
      matchPercentage,
      longestSubstring: longest.length > 1 ? longest : null,
      originalLength: text.length,
      cleanLength: processed.length,
      type: 'char'
    };
  }, [text, ignoreCase, ignoreSpaces, ignorePunctuation, mode]);

  const handleCopy = (content) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Text Symmetry Validator
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Palindrome Checker
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Verify whether phrases, numbers, or words read identical forwards and backwards with real-time character symmetry analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="text-input" className="text-sm font-semibold text-foreground">
                Input Text or Number
              </label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={mode === 'char' ? 'default' : 'outline'}
                  onClick={() => setMode('char')}
                  className="h-7 text-xs px-2.5"
                >
                  Character Mode
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'word' ? 'default' : 'outline'}
                  onClick={() => setMode('word')}
                  className="h-7 text-xs px-2.5"
                >
                  Word Mode
                </Button>
              </div>
            </div>

            <textarea
              id="text-input"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste any word, sentence, or sequence..."
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            {/* Quick preset chips */}
            <div className="mt-4">
              <span className="text-xs font-medium text-muted-foreground block mb-2">Try classic examples:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePalindromes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setText(s.val);
                      if (s.label === 'Word By Word') setMode('word');
                      else setMode('char');
                    }}
                    className="text-xs px-2.5 py-1 rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-foreground transition-colors font-mono"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Rules */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <span className="text-xs font-semibold text-foreground block mb-3">Matching Rules:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIgnoreCase(!ignoreCase)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    ignoreCase 
                      ? 'border-primary/50 bg-primary/5 text-foreground' 
                      : 'border-border/60 bg-muted/20 text-muted-foreground'
                  }`}
                >
                  <span>Ignore Case</span>
                  <span className={`w-2 h-2 rounded-full ${ignoreCase ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIgnoreSpaces(!ignoreSpaces)}
                  disabled={mode === 'word'}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    ignoreSpaces && mode !== 'word'
                      ? 'border-primary/50 bg-primary/5 text-foreground' 
                      : 'border-border/60 bg-muted/20 text-muted-foreground'
                  } ${mode === 'word' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>Ignore Spaces</span>
                  <span className={`w-2 h-2 rounded-full ${ignoreSpaces && mode !== 'word' ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIgnorePunctuation(!ignorePunctuation)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    ignorePunctuation 
                      ? 'border-primary/50 bg-primary/5 text-foreground' 
                      : 'border-border/60 bg-muted/20 text-muted-foreground'
                  }`}
                >
                  <span>Ignore Punctuation</span>
                  <span className={`w-2 h-2 rounded-full ${ignorePunctuation ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setText('')}
                className="text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!analysis}
                onClick={() => handleCopy(analysis ? `Input: ${text}\nProcessed: ${analysis.processed}\nReversed: ${analysis.reversed}\nIs Palindrome: ${analysis.isPalindrome ? 'YES' : 'NO'}` : '')}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied Breakdown' : 'Copy Analysis'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Output Analysis Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center justify-between">
              <span>Symmetry Result</span>
              {analysis && (
                <span className="text-xs font-mono text-muted-foreground">
                  {analysis.cleanLength} {mode === 'word' ? 'words' : 'characters'}
                </span>
              )}
            </h2>

            {analysis ? (
              <div className="space-y-4">
                {/* Result Callout Banner */}
                <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                  analysis.isPalindrome 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                }`}>
                  {analysis.isPalindrome ? (
                    <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-8 h-8 shrink-0 text-rose-600 dark:text-rose-400" />
                  )}
                  <div>
                    <div className="font-bold text-base">
                      {analysis.isPalindrome ? 'Yes, It is a Palindrome!' : 'Not a Palindrome'}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {analysis.isPalindrome 
                        ? `Matches exactly backwards and forwards (${analysis.cleanLength} ${analysis.type === 'word' ? 'words' : 'chars'}).`
                        : `${analysis.matchPercentage}% symmetric alignment.`}
                    </div>
                  </div>
                </div>

                {/* Symmetry Progress Bar (for char mode) */}
                {analysis.type === 'char' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Symmetry match:</span>
                      <span className="font-mono font-semibold text-foreground">{analysis.matchPercentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${analysis.isPalindrome ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${analysis.matchPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Normalized / Processed String */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-medium text-muted-foreground">Normalized Sequence:</span>
                  <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-xs text-foreground break-all border border-border/40">
                    {analysis.processed || '<empty>'}
                  </div>
                </div>

                {/* Reversed String */}
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Reversed Sequence:</span>
                  <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-xs text-foreground break-all border border-border/40">
                    {analysis.reversed || '<empty>'}
                  </div>
                </div>

                {/* Longest Substring if not palindrome */}
                {!analysis.isPalindrome && analysis.longestSubstring && (
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <div className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Longest Palindromic Substring:
                    </div>
                    <div className="font-mono text-xs text-primary font-bold">
                      "{analysis.longestSubstring}"
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Length: {analysis.longestSubstring.length} characters
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                Enter text on the left to inspect its palindromic symmetry.
              </div>
            )}
          </Card>

          {/* Privacy card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>All text processing runs strictly in your browser. Zero data leaves your device.</span>
          </div>
        </div>
      </div>

      {/* Educational Guide */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          What is a Palindrome?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A <strong>palindrome</strong> is a word, number, sentence, or other sequence of characters that reads the same backward as forward. When evaluating natural language sentences, standard conventions ignore spacing, capitalization, and punctuation marks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Single-Word Palindromes</h3>
            <p className="text-xs text-muted-foreground">
              Words like <code>radar</code>, <code>level</code>, <code>kayak</code>, <code>civic</code>, and <code>rotavator</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Numeric Palindromes</h3>
            <p className="text-xs text-muted-foreground">
              Numbers like <code>121</code>, <code>1331</code>, or palindromic dates such as <code>02/02/2020</code> (same in MM/DD/YYYY and DD/MM/YYYY).
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Semordnilap vs Palindrome</h3>
            <p className="text-xs text-muted-foreground">
              A semordnilap creates a <em>different</em> valid word when spelled backwards (e.g. <code>stressed</code> → <code>desserts</code>).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}