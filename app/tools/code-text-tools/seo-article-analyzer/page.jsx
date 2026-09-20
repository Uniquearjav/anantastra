'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Target, 
  Hash, 
  Percent, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Copy, 
  Check, 
  RotateCcw, 
  Upload, 
  BookOpen, 
  Clock, 
  Sparkles, 
  BarChart3, 
  Plus, 
  Trash2, 
  Info, 
  ShieldCheck, 
  AlignLeft, 
  CheckSquare, 
  Sliders, 
  ExternalLink,
  ClipboardList,
  ListPlus,
  X
} from 'lucide-react';

const SAMPLE_ARTICLE = `# The Complete Guide to Next.js 15 for Modern Web Development

In the rapidly evolving world of frontend architecture, **Next.js 15** has emerged as a cornerstone for building fast, scalable, and search-optimized web applications. Whether you are migrating a legacy Single Page Application or starting a brand-new project, mastering Next.js 15 enables developers to achieve exceptional performance scores and superior developer experience.

## Why Next.js 15 is Changing Modern Web Development

Web engineering in 2026 requires speed, reliability, and search engine visibility. Next.js 15 introduces major enhancements to React Server Components (RSC), asynchronous request handling, and optimized caching semantics. By offloading computational weight from client devices to edge runtimes, Next.js 15 ensures that users experience near-instant page loads.

Modern web development demands that our applications handle state transitions with zero jank. With Next.js 15, incremental static regeneration and streaming server rendering work in seamless harmony. Development teams adopting Next.js 15 report faster continuous deployment cycles and streamlined code maintenance.

## Architecture and Core Principles

When evaluating modern web development frameworks, architecture is the deciding factor. Next.js 15 leverages the App Router pattern, giving developers granular control over nested layouts, error boundaries, and metadata management.

Key structural advantages include:
- Native React 19 integration with Server Actions
- Optimized asset bundling powered by Turbopack
- Predictable caching defaults tailored for real-time applications
- Zero-overhead static route pre-rendering

Every modern web development workflow benefits from predictable build artifacts. Next.js 15 enforces strict separation between server-side data fetching and client-side user interactivity.

## Optimizing Performance and User Experience

To achieve top Lighthouse rankings, Next.js 15 provides automatic image optimization, font preloading, and script management. Incorporating Next.js 15 into your engineering stack minimizes Time to First Byte (TTFB) and Cumulative Layout Shift (CLS).

Furthermore, Next.js 15 supports granular partial prerendering (PPR), which combines the instant speed of static sites with the dynamic capability of server-rendered routes. This unique approach keeps modern web development both efficient and deeply flexible.

## Developer Workflows and Tooling

Developer ergonomics have received substantial attention. With Next.js 15, error overlays provide actionable stack traces with direct links into your source code. Hot module replacement executes in milliseconds thanks to Turbopack optimizations.

Building accessible and internationalized applications is straightforward with Next.js 15. The built-in routing system handles locale subpaths and directional styling without requiring bulky third-party dependencies.

## Conclusion: Embracing Next.js 15 Today

As engineering standards continue to rise, Next.js 15 remains the benchmark for modern web development. By adopting Next.js 15, teams can deliver blisteringly fast, accessible, and future-proof digital experiences that delight both users and search engines.
`;

export default function SeoArticleAnalyzer() {
  // Article content
  const [content, setContent] = useState(SAMPLE_ARTICLE);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'highlights' | 'preview'
  const [copied, setCopied] = useState(false);

  // Target word count: 800, 1200, 1500, or 'custom'
  const [wordTargetPreset, setWordTargetPreset] = useState('1200');
  const [customWordTarget, setCustomWordTarget] = useState(1200);

  // Primary Keyword state
  const [primaryKeyword, setPrimaryKeyword] = useState('Next.js 15');
  const [primaryTargetFreq, setPrimaryTargetFreq] = useState(12);

  // Secondary Keywords state (supports multiple, defaults to 1 keyword with freq 1)
  const [secondaryKeywords, setSecondaryKeywords] = useState([
    { id: '1', keyword: 'modern web development', targetFreq: 1 }
  ]);
  const [isBulkPasting, setIsBulkPasting] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkDefaultFreq, setBulkDefaultFreq] = useState(1);
  const [bulkReplaceMode, setBulkReplaceMode] = useState(false);

  const fileInputRef = useRef(null);

  // Resolved active target word count
  const targetWords = useMemo(() => {
    if (wordTargetPreset === 'custom') {
      return Math.max(1, parseInt(customWordTarget, 10) || 1000);
    }
    return parseInt(wordTargetPreset, 10);
  }, [wordTargetPreset, customWordTarget]);

  // Clean plain text representation of content
  const plainText = useMemo(() => {
    if (!content) return '';
    return content
      // Remove markdown code blocks
      .replace(/```[\s\S]*?```/g, ' ')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown image syntax
      .replace(/!\[.*?\]\(.*?\)/g, ' ')
      // Remove markdown links but keep text
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // Remove headers syntax (#)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italics
      .replace(/[*_~]{1,3}/g, '')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, ' ');
  }, [content]);

  // Basic word and document statistics
  const stats = useMemo(() => {
    if (!plainText.trim()) {
      return {
        wordCount: 0,
        charCount: 0,
        charCountNoSpaces: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        readingTimeMin: 0,
        speakingTimeMin: 0,
        avgWordsPerSentence: 0,
        headings: { h1: 0, h2: 0, h3: 0, total: 0 }
      };
    }

    const words = plainText.trim().match(/[\p{L}\p{N}_\-]+/gu) || [];
    const wordCount = words.length;
    const charCount = plainText.length;
    const charCountNoSpaces = plainText.replace(/\s+/g, '').length;

    // Sentences count
    const sentences = plainText.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length || 1;

    // Paragraph count from raw content
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length || 1;

    // Reading time: ~200 wpm, Speaking time: ~130 wpm
    const readingTimeMin = Math.ceil(wordCount / 200);
    const speakingTimeMin = Math.ceil(wordCount / 130);
    const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    // Headings count from markdown syntax
    const h1Count = (content.match(/^#\s+[^\n]+/gm) || []).length;
    const h2Count = (content.match(/^##\s+[^\n]+/gm) || []).length;
    const h3Count = (content.match(/^###\s+[^\n]+/gm) || []).length;

    return {
      wordCount,
      charCount,
      charCountNoSpaces,
      sentenceCount,
      paragraphCount,
      readingTimeMin,
      speakingTimeMin,
      avgWordsPerSentence,
      headings: {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count,
        total: h1Count + h2Count + h3Count
      }
    };
  }, [content, plainText]);

  // Utility to count keyword matches safely (case-insensitive phrase/word match)
  const countKeywordOccurrences = (text, keyword) => {
    if (!text || !keyword || !keyword.trim()) return 0;
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Using unicode word boundaries
    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?=[^\\p{L}\\p{N}]|$)`, 'gui');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  // Primary keyword analysis
  const primaryAnalysis = useMemo(() => {
    const kw = primaryKeyword.trim();
    if (!kw) {
      return {
        keyword: '',
        count: 0,
        targetFreq: primaryTargetFreq,
        density: 0,
        wordsInKw: 0,
        status: 'empty',
        diff: 0
      };
    }

    const count = countKeywordOccurrences(plainText, kw);
    const wordsInKw = kw.split(/\s+/).filter(Boolean).length;
    const density = stats.wordCount > 0 ? Number(((count * wordsInKw / stats.wordCount) * 100).toFixed(2)) : 0;
    const diff = count - primaryTargetFreq;

    let status = 'perfect';
    if (diff < 0) status = 'under';
    else if (diff > 0) status = 'over';

    return {
      keyword: kw,
      count,
      targetFreq: primaryTargetFreq,
      density,
      wordsInKw,
      status,
      diff
    };
  }, [primaryKeyword, primaryTargetFreq, plainText, stats.wordCount]);

  // Secondary keywords analysis
  const secondaryAnalysis = useMemo(() => {
    return secondaryKeywords.map(item => {
      const kw = item.keyword.trim();
      if (!kw) {
        return {
          id: item.id,
          keyword: '',
          count: 0,
          targetFreq: item.targetFreq,
          density: 0,
          wordsInKw: 0,
          status: 'empty',
          diff: 0
        };
      }

      const count = countKeywordOccurrences(plainText, kw);
      const wordsInKw = kw.split(/\s+/).filter(Boolean).length;
      const density = stats.wordCount > 0 ? Number(((count * wordsInKw / stats.wordCount) * 100).toFixed(2)) : 0;
      const diff = count - item.targetFreq;

      let status = 'perfect';
      if (diff < 0) status = 'under';
      else if (diff > 0) status = 'over';

      return {
        id: item.id,
        keyword: kw,
        count,
        targetFreq: item.targetFreq,
        density,
        wordsInKw,
        status,
        diff
      };
    });
  }, [secondaryKeywords, plainText, stats.wordCount]);

  // Placement checks for primary keyword
  const placementChecks = useMemo(() => {
    const kw = primaryKeyword.trim();
    if (!kw) {
      return {
        inTitle: false,
        inFirst100: false,
        inHeadings: false,
        inLast100: false
      };
    }

    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?=[^\\p{L}\\p{N}]|$)`, 'gui');

    // 1. In Title or H1
    const h1Lines = content.match(/^#\s+[^\n]+/gm) || [];
    const inTitle = h1Lines.some(line => regex.test(line));

    // 2. In First 100 words
    const words = plainText.trim().match(/[\p{L}\p{N}_\-]+/gu) || [];
    const first100Words = words.slice(0, 100).join(' ');
    const inFirst100 = regex.test(first100Words);

    // 3. In Subheadings (H2, H3)
    const subHeadings = content.match(/^#{2,4}\s+[^\n]+/gm) || [];
    const inHeadings = subHeadings.some(line => regex.test(line));

    // 4. In Last 100 words (Conclusion)
    const last100Words = words.length > 100 ? words.slice(-100).join(' ') : first100Words;
    const inLast100 = regex.test(last100Words);

    return {
      inTitle,
      inFirst100,
      inHeadings,
      inLast100
    };
  }, [primaryKeyword, content, plainText]);

  // Overall SEO Health Score Calculation (0 - 100)
  const seoScore = useMemo(() => {
    if (!content.trim() || stats.wordCount === 0) return 0;

    let score = 0;

    // Word Count Target (up to 30 points)
    const wordProgress = Math.min(stats.wordCount / targetWords, 1.2);
    if (wordProgress >= 0.95 && wordProgress <= 1.15) {
      score += 30;
    } else if (wordProgress >= 0.75) {
      score += 20;
    } else if (wordProgress >= 0.5) {
      score += 10;
    }

    // Primary Keyword Target Match (up to 25 points)
    if (primaryAnalysis.status === 'perfect') {
      score += 25;
    } else if (Math.abs(primaryAnalysis.diff) <= 2) {
      score += 18;
    } else if (Math.abs(primaryAnalysis.diff) <= 4) {
      score += 10;
    }

    // Primary Keyword Density Healthy Range (1.0% - 2.5%) (up to 15 points)
    if (primaryAnalysis.density >= 0.8 && primaryAnalysis.density <= 2.5) {
      score += 15;
    } else if (primaryAnalysis.density > 0 && primaryAnalysis.density <= 3.5) {
      score += 8;
    }

    // Placement Points (up to 20 points: 5 each)
    if (placementChecks.inTitle) score += 5;
    if (placementChecks.inFirst100) score += 5;
    if (placementChecks.inHeadings) score += 5;
    if (placementChecks.inLast100) score += 5;

    // Secondary Keywords Target Matching (up to 10 points)
    if (secondaryAnalysis.length > 0) {
      const matched = secondaryAnalysis.filter(s => s.status === 'perfect').length;
      score += Math.round((matched / secondaryAnalysis.length) * 10);
    } else {
      score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }, [content, stats.wordCount, targetWords, primaryAnalysis, placementChecks, secondaryAnalysis]);

  // Word count completion percentage
  const wordCountPercent = useMemo(() => {
    if (targetWords <= 0) return 0;
    return Math.min(100, Math.round((stats.wordCount / targetWords) * 100));
  }, [stats.wordCount, targetWords]);

  // Handlers for secondary keywords
  const handleAddSecondary = () => {
    setSecondaryKeywords(prev => [
      ...prev,
      { id: Date.now().toString(), keyword: '', targetFreq: 1 }
    ]);
  };

  const handleUpdateSecondary = (id, field, value) => {
    setSecondaryKeywords(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const handleRemoveSecondary = (id) => {
    setSecondaryKeywords(prev => prev.filter(item => item.id !== id));
  };

  // Intercept paste in individual secondary keyword input to split line-by-line automatically
  const handleKeywordPaste = (e, index) => {
    const pasteData = e.clipboardData?.getData('text');
    if (pasteData && pasteData.includes('\n')) {
      e.preventDefault();
      const lines = pasteData
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

      if (lines.length > 0) {
        setSecondaryKeywords(prev => {
          const updated = [...prev];
          // Replace current index with first line
          if (updated[index]) {
            updated[index] = { ...updated[index], keyword: lines[0] };
          } else {
            updated.push({ id: Date.now().toString(), keyword: lines[0], targetFreq: 1 });
          }
          // Append remaining lines as new keywords with default freq 1
          const remainingItems = lines.slice(1).map((kw, i) => ({
            id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
            keyword: kw,
            targetFreq: 1
          }));
          return [...updated, ...remainingItems];
        });
      }
    }
  };

  // Bulk apply pasted keywords line-by-line
  const handleApplyBulkKeywords = () => {
    if (!bulkText.trim()) {
      setIsBulkPasting(false);
      return;
    }

    const lines = bulkText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setIsBulkPasting(false);
      return;
    }

    const freq = Math.max(1, parseInt(bulkDefaultFreq, 10) || 1);
    const newKeywords = lines.map((kw, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      keyword: kw,
      targetFreq: freq
    }));

    if (bulkReplaceMode) {
      setSecondaryKeywords(newKeywords);
    } else {
      setSecondaryKeywords(prev => {
        const filteredPrev = prev.filter(k => k.keyword.trim() !== '');
        return [...filteredPrev, ...newKeywords];
      });
    }

    setBulkText('');
    setIsBulkPasting(false);
  };

  const handleClearSecondaryKeywords = () => {
    setSecondaryKeywords([
      { id: Date.now().toString(), keyword: '', targetFreq: 1 }
    ]);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  // Generate highlighted text segments
  const highlightedSegments = useMemo(() => {
    if (!content) return [];

    const keywords = [];
    if (primaryKeyword.trim()) {
      keywords.push({
        text: primaryKeyword.trim(),
        type: 'primary'
      });
    }

    secondaryKeywords.forEach(sec => {
      if (sec.keyword.trim()) {
        keywords.push({
          text: sec.keyword.trim(),
          type: 'secondary'
        });
      }
    });

    if (keywords.length === 0) {
      return [{ text: content, type: 'normal' }];
    }

    // Sort by length descending to match longer multi-word phrases first
    keywords.sort((a, b) => b.text.length - a.text.length);

    const pattern = keywords
      .map(k => `(${k.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`)
      .join('|');

    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${pattern})(?=[^\\p{L}\\p{N}]|$)`, 'gui');

    const segments = [];
    let lastIndex = 0;

    // Scan through text
    let match;
    while ((match = regex.exec(content)) !== null) {
      const prefix = match[1]; // non-word preceding char or empty
      const matchedKeyword = match[2]; // the actual keyword
      const matchStart = match.index + prefix.length;
      const matchEnd = matchStart + matchedKeyword.length;

      if (matchStart > lastIndex) {
        segments.push({
          text: content.slice(lastIndex, matchStart),
          type: 'normal'
        });
      }

      // Determine if primary or secondary
      const isPrimary = matchedKeyword.toLowerCase() === primaryKeyword.trim().toLowerCase();
      segments.push({
        text: matchedKeyword,
        type: isPrimary ? 'primary' : 'secondary'
      });

      lastIndex = matchEnd;
    }

    if (lastIndex < content.length) {
      segments.push({
        text: content.slice(lastIndex),
        type: 'normal'
      });
    }

    return segments;
  }, [content, primaryKeyword, secondaryKeywords]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Breadcrumb & Title (Solid colors only, zero gradients) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span>/</span>
            <Link href="/tools/code-text-tools/text-difference" className="hover:text-foreground transition-colors">Code & Text Utilities</Link>
            <span>/</span>
            <span className="text-foreground font-medium">SEO Article & Keyword Density Analyzer</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    SEO Article & Keyword Density Analyzer
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Real-time keyword frequency counter, target word count monitor, and strategic placement auditor.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Health Score Badge */}
            <div className="flex items-center gap-3 bg-card border border-border/80 rounded-xl p-2.5 px-4 shadow-sm self-start sm:self-auto">
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">SEO Score</div>
                <div className="text-xl font-bold tracking-tight text-foreground">{seoScore}/100</div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm ${
                seoScore >= 80 
                  ? 'bg-emerald-600 text-white' 
                  : seoScore >= 50 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-zinc-700 text-white'
              }`}>
                {seoScore >= 80 ? 'A' : seoScore >= 50 ? 'B' : 'C'}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Bar: Target Words & Keywords (Solid crisp cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. Target Words Card */}
          <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Target Word Count</span>
                </div>
                <Badge variant="outline" className="text-xs font-mono bg-muted/50 border-border/80">
                  {stats.wordCount} / {targetWords} words
                </Badge>
              </div>

              {/* Presets: 800, 1200, 1500, Custom */}
              <div className="grid grid-cols-4 gap-2">
                {['800', '1200', '1500'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWordTargetPreset(preset)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                      wordTargetPreset === preset
                        ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-sm'
                        : 'bg-muted/40 text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {preset} w
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWordTargetPreset('custom')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                    wordTargetPreset === 'custom'
                      ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-sm'
                      : 'bg-muted/40 text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  Custom
                </button>
              </div>

              {wordTargetPreset === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <Input
                    type="number"
                    min="100"
                    max="10000"
                    step="50"
                    value={customWordTarget}
                    onChange={(e) => setCustomWordTarget(e.target.value)}
                    placeholder="Enter custom target..."
                    className="h-8 text-xs font-mono bg-background border-border/80"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">words</span>
                </div>
              )}

              {/* Word Count Progress Bar (Strictly Solid Colors) */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2.5 rounded-full bg-muted/80 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      stats.wordCount >= targetWords 
                        ? 'bg-emerald-600' 
                        : wordCountPercent >= 75 
                          ? 'bg-primary' 
                          : 'bg-zinc-500'
                    }`}
                    style={{ width: `${Math.min(100, (stats.wordCount / targetWords) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{wordCountPercent}% of target</span>
                  <span>
                    {stats.wordCount >= targetWords ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Target reached (+{stats.wordCount - targetWords} words)
                      </span>
                    ) : (
                      <span>{targetWords - stats.wordCount} words remaining</span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Primary Keyword Card */}
          <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-sm text-foreground">Primary Keyword</span>
                </div>
                <Badge 
                  variant="outline"
                  className={`text-xs font-medium border ${
                    primaryAnalysis.status === 'perfect'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : primaryAnalysis.status === 'under'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                  }`}
                >
                  {primaryAnalysis.count} / {primaryTargetFreq} ({primaryAnalysis.density}%)
                </Badge>
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="e.g. Next.js 15, AI Automation..."
                  className="h-9 text-xs bg-background border-border/80"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Target Frequency:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPrimaryTargetFreq(Math.max(1, primaryTargetFreq - 1))}
                      className="h-7 w-7 rounded-md bg-muted text-foreground border border-border/80 text-xs font-bold hover:bg-accent flex items-center justify-center"
                    >
                      -
                    </button>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={primaryTargetFreq}
                      onChange={(e) => setPrimaryTargetFreq(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="h-7 w-14 text-center text-xs font-mono bg-background border-border/80 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setPrimaryTargetFreq(primaryTargetFreq + 1)}
                      className="h-7 w-7 rounded-md bg-muted text-foreground border border-border/80 text-xs font-bold hover:bg-accent flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <span>Recommended Density: 1.0% - 2.5%</span>
                  <span className={primaryAnalysis.diff === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {primaryAnalysis.diff === 0 
                      ? 'Exact target!' 
                      : primaryAnalysis.diff < 0 
                        ? `${Math.abs(primaryAnalysis.diff)} more needed` 
                        : `${primaryAnalysis.diff} over target`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Secondary Keyword(s) Card */}
          <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span className="font-semibold text-sm text-foreground">Secondary Keyword(s)</span>
                  <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 h-4 border-border/80">
                    {secondaryKeywords.filter(k => k.keyword.trim()).length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkPasting(!isBulkPasting)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-all ${
                      isBulkPasting 
                        ? 'bg-primary text-primary-foreground border-primary font-semibold' 
                        : 'bg-muted/50 text-foreground border-border/80 hover:bg-muted font-medium'
                    }`}
                    title="Paste secondary keywords line-by-line"
                  >
                    <ClipboardList className="h-3.5 w-3.5 text-sky-500" />
                    <span>{isBulkPasting ? 'Close Paste' : 'Paste List'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSecondary}
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    title="Add a single secondary keyword"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Bulk Paste Line-by-Line Drawer/Panel */}
              {isBulkPasting ? (
                <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <ListPlus className="h-3.5 w-3.5 text-primary" />
                      <span>Paste Secondary Keywords (Line by Line)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBulkPasting(false)}
                      className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-muted"
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={"modern web development\nreact server components\nturbopack build performance\nkeyword density"}
                    rows={4}
                    className="w-full text-xs font-mono bg-background border border-border/80 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 resize-y"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground text-[11px]">Default Freq:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setBulkDefaultFreq(Math.max(1, bulkDefaultFreq - 1))}
                          className="h-5 w-5 rounded bg-muted text-foreground border border-border/80 text-[10px] font-bold hover:bg-accent flex items-center justify-center"
                        >
                          -
                        </button>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={bulkDefaultFreq}
                          onChange={(e) => setBulkDefaultFreq(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="h-5 w-9 text-center text-[11px] font-mono bg-background border-border/80 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => setBulkDefaultFreq(bulkDefaultFreq + 1)}
                          className="h-5 w-5 rounded bg-muted text-foreground border border-border/80 text-[10px] font-bold hover:bg-accent flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkReplaceMode}
                          onChange={(e) => setBulkReplaceMode(e.target.checked)}
                          className="rounded border-border/80 h-3 w-3"
                        />
                        <span>Replace existing</span>
                      </label>

                      <Button
                        size="sm"
                        onClick={handleApplyBulkKeywords}
                        className="h-6 px-2.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium"
                      >
                        Import {bulkText.trim() ? bulkText.split(/\r?\n/).filter(l => l.trim()).length : 0} Lines
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
                  {secondaryKeywords.map((sec, idx) => {
                    const analysis = secondaryAnalysis[idx];
                    return (
                      <div key={sec.id} className="space-y-1.5 pb-2 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={sec.keyword}
                            onChange={(e) => handleUpdateSecondary(sec.id, 'keyword', e.target.value)}
                            onPaste={(e) => handleKeywordPaste(e, idx)}
                            placeholder="e.g. modern web development"
                            className="h-8 text-xs bg-background border-border/80 flex-1"
                          />
                          {secondaryKeywords.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSecondary(sec.id)}
                              className="text-muted-foreground hover:text-destructive p-1"
                              title="Remove keyword"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Freq Target:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateSecondary(sec.id, 'targetFreq', Math.max(1, sec.targetFreq - 1))}
                              className="h-6 w-6 rounded bg-muted text-foreground border border-border/80 text-xs font-bold hover:bg-accent flex items-center justify-center"
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              min="1"
                              max="50"
                              value={sec.targetFreq}
                              onChange={(e) => handleUpdateSecondary(sec.id, 'targetFreq', Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="h-6 w-10 text-center text-xs font-mono bg-background border-border/80 p-0"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateSecondary(sec.id, 'targetFreq', sec.targetFreq + 1)}
                              className="h-6 w-6 rounded bg-muted text-foreground border border-border/80 text-xs font-bold hover:bg-accent flex items-center justify-center"
                            >
                              +
                            </button>
                            <Badge 
                              variant="outline"
                              className={`text-[10px] ml-1 font-mono border ${
                                analysis?.status === 'perfect'
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-muted text-muted-foreground border-border/70'
                              }`}
                            >
                              {analysis?.count || 0}/{sec.targetFreq} ({analysis?.density || 0}%)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>💡 Paste multiple lines directly into any field</span>
                    {secondaryKeywords.length > 1 && (
                      <button
                        type="button"
                        onClick={handleClearSecondaryKeywords}
                        className="text-muted-foreground hover:text-destructive transition-colors text-[11px]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Main Workspace: Left is Editor/Highlights/Preview, Right is Placement & Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left 2 Columns: Tabs & Text Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden">
              {/* Workspace Action Toolbar */}
              <div className="border-b border-border/80 bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                {/* Mode Tabs */}
                <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'editor'
                        ? 'bg-background text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Editor / Input</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('highlights')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'highlights'
                        ? 'bg-background text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-500" />
                    <span>Live Keyword Highlights</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'preview'
                        ? 'bg-background text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <span>Markdown Preview</span>
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePasteClipboard}
                    className="h-8 px-2.5 text-xs border-border/80 bg-background hover:bg-muted"
                    title="Paste from clipboard"
                  >
                    Paste
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 px-2.5 text-xs border-border/80 bg-background hover:bg-muted"
                    title="Upload .txt or .md file"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.markdown"
                    className="hidden"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContent(SAMPLE_ARTICLE)}
                    className="h-8 px-2.5 text-xs border-border/80 bg-background hover:bg-muted"
                    title="Load sample article"
                  >
                    Sample
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyText}
                    className="h-8 px-2.5 text-xs border-border/80 bg-background hover:bg-muted"
                    title="Copy article"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContent('')}
                    className="h-8 px-2.5 text-xs border-border/80 bg-background hover:text-destructive hover:bg-destructive/10"
                    title="Clear content"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Tab Content Display */}
              <div className="p-4">
                {activeTab === 'editor' && (
                  <div className="space-y-2">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste your article here in Markdown or plain text..."
                      rows={20}
                      className="w-full font-mono text-sm leading-relaxed bg-background border border-border/70 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[420px] text-foreground placeholder:text-muted-foreground/60"
                    />
                  </div>
                )}

                {activeTab === 'highlights' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pb-2 border-b border-border/60">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/40">
                          Primary: {primaryKeyword || 'None'} ({primaryAnalysis.count})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-sky-500/20 text-sky-800 dark:text-sky-300 font-semibold border border-sky-500/40">
                          Secondary ({secondaryAnalysis.reduce((acc, s) => acc + s.count, 0)})
                        </span>
                      </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto p-4 rounded-xl border border-border/70 bg-background text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {highlightedSegments.map((seg, idx) => {
                        if (seg.type === 'primary') {
                          return (
                            <mark 
                              key={idx} 
                              className="bg-amber-500/25 text-amber-950 dark:text-amber-200 font-bold px-1 py-0.5 rounded border border-amber-500/40"
                            >
                              {seg.text}
                            </mark>
                          );
                        }
                        if (seg.type === 'secondary') {
                          return (
                            <mark 
                              key={idx} 
                              className="bg-sky-500/25 text-sky-950 dark:text-sky-200 font-bold px-1 py-0.5 rounded border border-sky-500/40"
                            >
                              {seg.text}
                            </mark>
                          );
                        }
                        return <span key={idx}>{seg.text}</span>;
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="max-h-[500px] overflow-y-auto p-6 rounded-xl border border-border/70 bg-background prose dark:prose-invert max-w-none text-sm leading-relaxed">
                    {/* Basic Markdown Rendering */}
                    {content.split('\n\n').map((block, index) => {
                      const trimmed = block.trim();
                      if (trimmed.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold mt-2 mb-4 text-foreground">{trimmed.replace('# ', '')}</h1>;
                      }
                      if (trimmed.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-foreground">{trimmed.replace('## ', '')}</h2>;
                      }
                      if (trimmed.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-semibold mt-3 mb-1 text-foreground">{trimmed.replace('### ', '')}</h3>;
                      }
                      if (trimmed.startsWith('- ')) {
                        return (
                          <ul key={index} className="list-disc pl-5 space-y-1 text-muted-foreground my-2">
                            {trimmed.split('\n').map((item, i) => (
                              <li key={i}>{item.replace(/^-\s+/, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={index} className="mb-3 text-muted-foreground leading-relaxed">{trimmed}</p>;
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Quick Stats Strip */}
              <div className="border-t border-border/80 bg-muted/20 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-3">
                <div className="flex items-center gap-4">
                  <span><strong>{stats.wordCount}</strong> words</span>
                  <span><strong>{stats.charCount}</strong> chars</span>
                  <span><strong>{stats.sentenceCount}</strong> sentences</span>
                  <span><strong>{stats.paragraphCount}</strong> paragraphs</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    ~{stats.readingTimeMin} min read
                  </span>
                  <span>|</span>
                  <span>~{stats.speakingTimeMin} min speech</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: SEO Placement & Audit Checklist */}
          <div className="space-y-6">

            {/* Strategic Placement Checks Card */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">Strategic Placement</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Primary Keyword</span>
                </div>

                <div className="space-y-3">
                  {/* Title / H1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                    <div className="flex items-center gap-2">
                      {placementChecks.inTitle ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">Title / H1 Tag</div>
                        <div className="text-[11px] text-muted-foreground">First heading of article</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] border ${
                        placementChecks.inTitle 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                          : 'bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {placementChecks.inTitle ? 'Found' : 'Missing'}
                    </Badge>
                  </div>

                  {/* First 100 Words */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                    <div className="flex items-center gap-2">
                      {placementChecks.inFirst100 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">First 100 Words</div>
                        <div className="text-[11px] text-muted-foreground">Introductory paragraph</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] border ${
                        placementChecks.inFirst100 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                          : 'bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {placementChecks.inFirst100 ? 'Found' : 'Missing'}
                    </Badge>
                  </div>

                  {/* Subheadings (H2/H3) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                    <div className="flex items-center gap-2">
                      {placementChecks.inHeadings ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">Subheadings (H2 / H3)</div>
                        <div className="text-[11px] text-muted-foreground">Section dividers</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] border ${
                        placementChecks.inHeadings 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                          : 'bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {placementChecks.inHeadings ? 'Found' : 'Missing'}
                    </Badge>
                  </div>

                  {/* Last 100 Words */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                    <div className="flex items-center gap-2">
                      {placementChecks.inLast100 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">Last 100 Words</div>
                        <div className="text-[11px] text-muted-foreground">Conclusion summary</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] border ${
                        placementChecks.inLast100 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                          : 'bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {placementChecks.inLast100 ? 'Found' : 'Missing'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyword Frequency Summary Card */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">Keyword Summary</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Density & Count</span>
                </div>

                <div className="space-y-3">
                  {/* Primary Row */}
                  <div className="p-3 rounded-xl border border-border/70 bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        {primaryKeyword || 'Primary'}
                      </span>
                      <span className="font-mono text-xs">
                        {primaryAnalysis.count} / {primaryTargetFreq}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Density: {primaryAnalysis.density}%</span>
                      <span>Target: {primaryTargetFreq} times</span>
                    </div>
                  </div>

                  {/* Secondary Rows */}
                  <div className="max-h-[240px] overflow-y-auto pr-1 space-y-2">
                    {secondaryAnalysis.map((sec) => (
                      <div key={sec.id} className="p-2.5 rounded-xl border border-border/70 bg-muted/30 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground flex items-center gap-1.5 truncate max-w-[170px]" title={sec.keyword}>
                            <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                            <span className="truncate">{sec.keyword || 'Secondary'}</span>
                          </span>
                          <span className="font-mono text-xs shrink-0">
                            {sec.count} / {sec.targetFreq}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Density: {sec.density}%</span>
                          <span>Target: {sec.targetFreq} times</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Readability & Content Structure */}
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">Content Metrics</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Structure</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
                    <div className="text-muted-foreground text-[11px]">Avg Sentence Length</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{stats.avgWordsPerSentence} words</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
                    <div className="text-muted-foreground text-[11px]">Heading Tags</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">
                      H1: {stats.headings.h1} | H2: {stats.headings.h2} | H3: {stats.headings.h3}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
                    <div className="text-muted-foreground text-[11px]">Characters</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{stats.charCountNoSpaces} (no space)</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
                    <div className="text-muted-foreground text-[11px]">Paragraphs</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{stats.paragraphCount} total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Educational SEO Best Practices (Strictly solid styling) */}
        <Card className="border border-border/80 bg-card rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">SEO Keyword Frequency & Density Best Practices</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                <div className="font-semibold text-foreground">Primary Keyword (1.0% - 2.5%)</div>
                <p>
                  Target 10–15 occurrences per 1,000–1,200 words. Keep it natural: search engines penalize keyword stuffing. Ensure it appears in the H1, introduction, and conclusion.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                <div className="font-semibold text-foreground">Secondary & LSI Keywords (0.3% - 1.0%)</div>
                <p>
                  Secondary keywords reinforce semantic context. Target 1–3 occurrences across subheadings and body paragraphs to capture related search queries.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                <div className="font-semibold text-foreground">Target Word Count (800 / 1200 / 1500)</div>
                <p>
                  800 words suits quick news or how-to guides. 1,200 words is the standard for in-depth educational posts. 1,500+ words dominates competitive search rankings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
