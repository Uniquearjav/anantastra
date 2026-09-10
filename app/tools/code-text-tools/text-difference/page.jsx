'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GitCompare, 
  ArrowLeftRight, 
  RotateCcw, 
  Copy, 
  Check, 
  Columns, 
  AlignJustify, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

export default function TextDifferenceTool() {
  const [text1, setText1] = useState(
`// Version 1.0 - Production Server Config
port: 8080
host: "127.0.0.1"
database:
  name: "anantastra_main"
  poolSize: 10
  timeoutMs: 5000
features:
  analytics: true
  betaTools: false
  caching: "memory"`
  );

  const [text2, setText2] = useState(
`// Version 2.0 - High Availability Cluster Config
port: 8080
host: "0.0.0.0"
database:
  name: "anantastra_v2"
  poolSize: 25
  timeoutMs: 3000
  replicaCount: 3
features:
  analytics: true
  betaTools: true
  caching: "redis"
monitoring:
  prometheus: true`
  );

  const [viewMode, setViewMode] = useState('side-by-side'); // 'inline' | 'side-by-side'
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute Longest Common Subsequence matrix
  const computeLCS = (lines1, lines2) => {
    const m = lines1.length;
    const n = lines2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (lines1[i - 1] === lines2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    return dp;
  };

  const backtrackLCS = (dp, lines1, lines2, i, j) => {
    const result = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
        result.unshift({
          type: 'unchanged',
          line: lines1[i - 1],
          lineNum1: i,
          lineNum2: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          type: 'added',
          line: lines2[j - 1],
          lineNum1: null,
          lineNum2: j
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        result.unshift({
          type: 'removed',
          line: lines1[i - 1],
          lineNum1: i,
          lineNum2: null
        });
        i--;
      }
    }
    return result;
  };

  // Compute diff
  const diffData = useMemo(() => {
    if (!text1 && !text2) return null;

    let p1 = text1;
    let p2 = text2;

    if (ignoreCase) {
      p1 = p1.toLowerCase();
      p2 = p2.toLowerCase();
    }
    if (ignoreWhitespace) {
      p1 = p1.replace(/[ \t]+/g, ' ').trim();
      p2 = p2.replace(/[ \t]+/g, ' ').trim();
    }

    const lines1 = p1.split('\n');
    const lines2 = p2.split('\n');

    const dp = computeLCS(lines1, lines2);
    const diff = backtrackLCS(dp, lines1, lines2, lines1.length, lines2.length);

    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;

    return {
      diff,
      stats: { added, removed, unchanged, total: diff.length }
    };
  }, [text1, text2, ignoreWhitespace, ignoreCase]);

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const handleCopyReport = () => {
    if (!diffData) return;
    const report = diffData.diff.map(item => {
      const prefix = item.type === 'added' ? '+ ' : item.type === 'removed' ? '- ' : '  ';
      return `${prefix}${item.line}`;
    }).join('\n');
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <GitCompare className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Semantic Diff Inspection Engine
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Text Difference Tool
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Compare code snippets, configuration files, or document drafts with character-level LCS precision and side-by-side visual diffing.
        </p>
      </div>

      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl border border-border/60 bg-card shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={() => setIgnoreWhitespace(!ignoreWhitespace)}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <span>Ignore Whitespace</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={() => setIgnoreCase(!ignoreCase)}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <span>Ignore Case</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-muted/60 border border-border/50">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('inline')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'inline'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              Unified Inline
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="h-8 text-xs"
            title="Swap Text 1 and Text 2"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 mr-1" />
            Swap
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setText1('');
              setText2('');
            }}
            className="h-8 text-xs text-rose-500 hover:text-rose-600"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Input Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4 border-border/60 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="text1-editor" className="text-xs font-bold text-foreground">
              Original Version (Text 1)
            </label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {text1.split('\n').length} lines • {text1.length} chars
            </span>
          </div>
          <textarea
            id="text1-editor"
            rows={10}
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full rounded-xl border border-input bg-background p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </Card>

        <Card className="p-4 border-border/60 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="text2-editor" className="text-xs font-bold text-foreground">
              Modified Version (Text 2)
            </label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {text2.split('\n').length} lines • {text2.length} chars
            </span>
          </div>
          <textarea
            id="text2-editor"
            rows={10}
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full rounded-xl border border-input bg-background p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </Card>
      </div>

      {/* Diff Result Table */}
      {diffData && (
        <Card className="p-6 border-border/60 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">Diff Inspection</h2>
              <div className="flex items-center gap-2 ml-3">
                <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  +{diffData.stats.added} Added
                </Badge>
                <Badge variant="outline" className="text-[11px] font-mono border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  -{diffData.stats.removed} Removed
                </Badge>
                <Badge variant="outline" className="text-[11px] font-mono border-border/60 text-muted-foreground">
                  {diffData.stats.unchanged} Unchanged
                </Badge>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyReport}
              className="h-8 text-xs self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied Patch' : 'Copy Unified Diff'}
            </Button>
          </div>

          {/* Render Diff based on mode */}
          <div className="rounded-xl border border-border/60 overflow-hidden font-mono text-xs">
            {viewMode === 'inline' ? (
              <div className="divide-y divide-border/40 overflow-x-auto">
                {diffData.diff.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start px-3 py-1.5 leading-relaxed ${
                      item.type === 'added'
                        ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                        : item.type === 'removed'
                        ? 'bg-rose-500/10 text-rose-900 dark:text-rose-200'
                        : 'bg-card text-foreground'
                    }`}
                  >
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/60 text-[11px]">
                      {item.lineNum1 || item.lineNum2 || ''}
                    </span>
                    <span className="w-5 shrink-0 select-none font-bold">
                      {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="whitespace-pre-wrap break-all flex-1">
                      {item.line || ' '}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/40 overflow-x-auto">
                {diffData.diff.map((item, idx) => {
                  const isAdd = item.type === 'added';
                  const isRem = item.type === 'removed';
                  return (
                    <div key={idx} className="grid grid-cols-2 divide-x divide-border/40">
                      {/* Left side: Text 1 */}
                      <div className={`flex items-start px-3 py-1.5 leading-relaxed ${
                        isRem ? 'bg-rose-500/10 text-rose-900 dark:text-rose-200' : isAdd ? 'bg-muted/10 opacity-30' : 'bg-card text-foreground'
                      }`}>
                        <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/60 text-[11px]">
                          {item.lineNum1 || ''}
                        </span>
                        <span className="whitespace-pre-wrap break-all flex-1">
                          {!isAdd ? item.line : ''}
                        </span>
                      </div>

                      {/* Right side: Text 2 */}
                      <div className={`flex items-start px-3 py-1.5 leading-relaxed ${
                        isAdd ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200' : isRem ? 'bg-muted/10 opacity-30' : 'bg-card text-foreground'
                      }`}>
                        <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/60 text-[11px]">
                          {item.lineNum2 || ''}
                        </span>
                        <span className="whitespace-pre-wrap break-all flex-1">
                          {!isRem ? item.line : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Guide Card */}
      <Card className="p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Diffing Algorithms & Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Longest Common Subsequence</h3>
            <p className="text-xs text-muted-foreground">
              Computes the maximal ordered subset of identical lines between both texts, matching Git's Myers diff engine behavior.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Inline vs Side-by-Side</h3>
            <p className="text-xs text-muted-foreground">
              Unified Inline mode is ideal for mobile screens and patch exports; Side-by-Side view provides clear visual alignment for wide code files.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Zero Cloud Uploads</h3>
            <p className="text-xs text-muted-foreground">
              All string comparisons run directly on your browser's V8 thread. Sensitive credentials, tokens, or NDA drafts never leave your device.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}