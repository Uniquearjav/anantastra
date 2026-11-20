'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  Layers, 
  BookmarkCheck,
  RefreshCw
} from 'lucide-react';

const COMMON_PATTERNS = [
  { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'g', desc: 'Validates standard RFC-compliant email' },
  { name: 'URL / Link', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'g', desc: 'Matches HTTP & HTTPS URLs' },
  { name: 'IPv4 Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g', desc: 'Validates IPv4 0.0.0.0 to 255.255.255.255' },
  { name: 'Hex Color', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b', flags: 'g', desc: 'Matches #RGB and #RRGGBB colors' },
  { name: 'ISO Date', pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b', flags: 'g', desc: 'Matches YYYY-MM-DD formats' },
  { name: 'HTML Tag', pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)', flags: 'g', desc: 'Matches open and closed HTML elements' },
];

export default function RegExTester() {
  const [pattern, setPattern] = useState('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}');
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false });
  const [testString, setTestString] = useState(
    `Welcome to Use All Tools! Contact team@usealltools.com or support@example.org for questions. Visit https://www.usealltools.com for more free tools.`
  );
  const [substitution, setSubstitution] = useState('**[REDACTED]**');
  const [copied, setCopied] = useState(false);

  // Active flag string
  const flagString = useMemo(() => {
    return Object.keys(flags)
      .filter((f) => flags[f])
      .join('');
  }, [flags]);

  // Execute RegEx safely
  const evaluation = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, replacedText: testString };
    }

    try {
      // Ensure global flag for iterating all matches
      const effectiveFlags = flags.g ? flagString : flagString + 'g';
      const re = new RegExp(pattern, effectiveFlags);
      const matches = [];
      let match;
      let count = 0;

      while ((match = re.exec(testString)) !== null && count < 500) {
        matches.push({
          index: match.index,
          text: match[0],
          groups: match.slice(1),
          length: match[0].length,
        });
        if (!flags.g || match[0].length === 0) {
          re.lastIndex++;
        }
        count++;
      }

      // Replaced string
      let replaced = '';
      try {
        const replaceRe = new RegExp(pattern, flagString);
        replaced = testString.replace(replaceRe, substitution);
      } catch {
        replaced = testString;
      }

      return { matches, error: null, replacedText: replaced };
    } catch (err) {
      return { matches: [], error: err.message, replacedText: testString };
    }
  }, [pattern, flagString, testString, substitution, flags.g]);

  const toggleFlag = (flag) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const applyPattern = (p) => {
    setPattern(p.pattern);
  };

  const copyRegex = async () => {
    await navigator.clipboard.writeText(`/${pattern}/${flagString}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <FileCode className="w-3.5 h-3.5 mr-1.5 text-primary" />
            JavaScript RegEx Engine
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Regular Expression (RegEx) Tester
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Test and debug regular expressions in real-time with visual syntax highlighting, capture groups, and replacement simulation.
          </p>
        </div>

        {/* Pattern Library Presets */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Verified Pattern Library
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {COMMON_PATTERNS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPattern(p)}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-border/70 bg-card hover:bg-muted text-foreground transition-all text-center truncate"
                title={p.desc}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* RegEx Input & Flags Bar */}
        <Card className="border-border/60 shadow-md mb-8">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <span className="text-xl sm:text-2xl font-mono text-muted-foreground select-none">/</span>
              <div className="flex-1">
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern without enclosing slashes..."
                  className="font-mono text-sm sm:text-base h-11"
                />
              </div>
              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <span className="text-xl sm:text-2xl font-mono text-muted-foreground select-none">/</span>
                {['g', 'i', 'm', 's'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFlag(f)}
                    className={`h-9 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                      flags[f]
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-background hover:bg-muted text-muted-foreground border-border'
                    }`}
                    title={`Flag: ${f}`}
                  >
                    {f}
                  </button>
                ))}
                <Button onClick={copyRegex} variant="outline" size="sm" className="text-xs h-9 ml-2">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {evaluation.error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Invalid RegEx:</strong> {evaluation.error}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dual Column: Test String & Matches */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Test String (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Test String</CardTitle>
                  <span className="text-xs text-muted-foreground font-mono">
                    {testString.length} chars
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <textarea
                  rows={8}
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Paste text to test your regular expression against..."
                  className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
                />

                {/* Replacement Test */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Substitution / Replace Expression
                  </label>
                  <Input
                    value={substitution}
                    onChange={(e) => setSubstitution(e.target.value)}
                    placeholder="Replacement text ($1, $&)..."
                    className="font-mono text-xs"
                  />
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/70 font-mono text-xs text-foreground break-all">
                    {evaluation.replacedText}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Match Results (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border/60 shadow-md sticky top-6">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Match Results</CardTitle>
                  <Badge variant={evaluation.matches.length > 0 ? 'default' : 'secondary'} className="font-mono text-xs">
                    {evaluation.matches.length} {evaluation.matches.length === 1 ? 'match' : 'matches'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[460px] overflow-y-auto">
                {evaluation.matches.length > 0 ? (
                  <div className="divide-y divide-border/60 font-mono text-xs">
                    {evaluation.matches.map((m, idx) => (
                      <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-primary">Match #{idx + 1}</span>
                          <span className="text-muted-foreground text-[11px]">
                            Index: {m.index} (Length: {m.length})
                          </span>
                        </div>
                        <div className="p-2 rounded bg-card border border-border/70 text-foreground break-all font-semibold">
                          {m.text}
                        </div>
                        {m.groups.length > 0 && (
                          <div className="mt-2 pl-2 border-l-2 border-primary/40 space-y-1">
                            {m.groups.map((grp, gIdx) => (
                              <div key={gIdx} className="text-[11px] text-muted-foreground">
                                Group {gIdx + 1}: <span className="text-foreground">{grp || 'undefined'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    No matches found with current pattern and flags.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
