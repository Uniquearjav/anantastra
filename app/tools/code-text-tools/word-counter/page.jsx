'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Trash2, 
  AlignLeft, 
  BarChart2, 
  BookOpen,
  Volume2
} from 'lucide-react';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
  'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
  'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
]);

function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean || clean.length <= 3) return 1;
  const vowelMatches = clean.match(/[aeiouy]{1,2}/g);
  let count = vowelMatches ? vowelMatches.length : 1;
  if (clean.endsWith('e') && !clean.endsWith('le')) count--;
  return Math.max(1, count);
}

export default function WordCounter() {
  const [text, setText] = useState(
    `Writing clear, engaging content is crucial for digital creators and researchers. Using client-side text tools guarantees that your creative drafts remain completely confidential and secure from external trackers.\n\nExperiment with different paragraphs to evaluate real-time reading times, keyword density patterns, and readability scores.`
  );
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMin: 0,
        speakingTimeMin: 0,
        fleschScore: 100,
        gradeLevel: 0,
        avgWordLength: 0,
        topKeywords: [],
      };
    }

    const wordsArr = raw.split(/\s+/).filter(Boolean);
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const sentencesArr = raw.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphsArr = text.split(/\n+/).filter(p => p.trim().length > 0);

    const wordCount = wordsArr.length;
    const sentenceCount = Math.max(1, sentencesArr.length);
    const paragraphCount = Math.max(1, paragraphsArr.length);

    // Reading & Speaking times
    const readingTimeMin = Math.ceil(wordCount / 200);
    const speakingTimeMin = Math.ceil(wordCount / 130);

    // Syllables
    let totalSyllables = 0;
    wordsArr.forEach(w => {
      totalSyllables += countSyllables(w);
    });

    // Flesch Reading Ease
    // 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
    const asw = totalSyllables / Math.max(1, wordCount);
    const asl = wordCount / sentenceCount;
    let flesch = 206.835 - 1.015 * asl - 84.6 * asw;
    flesch = Math.max(0, Math.min(100, Math.round(flesch)));

    // Flesch-Kincaid Grade Level
    // 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
    let grade = 0.39 * asl + 11.8 * asw - 15.59;
    grade = Math.max(1, Math.round(grade * 10) / 10);

    const avgWordLength = (charsNoSpaces / Math.max(1, wordCount)).toFixed(1);

    // Keyword Frequency
    const freqMap = {};
    wordsArr.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, cnt]) => ({
        word: k,
        count: cnt,
        pct: ((cnt / Math.max(1, wordCount)) * 100).toFixed(1),
      }));

    return {
      words: wordCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      readingTimeMin,
      speakingTimeMin,
      fleschScore: flesch,
      gradeLevel: grade,
      avgWordLength,
      topKeywords,
    };
  }, [text]);

  const getFleschLabel = (score) => {
    if (score >= 90) return { label: 'Very Easy (5th Grade)', color: 'text-emerald-500' };
    if (score >= 80) return { label: 'Easy (6th Grade)', color: 'text-emerald-500' };
    if (score >= 70) return { label: 'Fairly Easy (7th Grade)', color: 'text-blue-500' };
    if (score >= 60) return { label: 'Standard (8th & 9th Grade)', color: 'text-indigo-500' };
    if (score >= 50) return { label: 'Fairly Difficult (High School)', color: 'text-amber-500' };
    if (score >= 30) return { label: 'Difficult (College)', color: 'text-rose-500' };
    return { label: 'Very Difficult (Graduate Level)', color: 'text-rose-600' };
  };

  const fleschInfo = getFleschLabel(stats.fleschScore);

  const copyContent = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toSentenceCase = () => {
    const updated = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    setText(updated);
  };

  const cleanSpaces = () => {
    setText(text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim());
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <FileText className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Live Text & Readability Metrics
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Word Counter & Readability Analyzer
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Analyze words, characters, reading times, readability grades, and keyword density distributions in real-time.
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">{stats.words}</div>
            <div className="text-xs text-muted-foreground uppercase font-medium mt-1">Words</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">{stats.charsWithSpaces}</div>
            <div className="text-xs text-muted-foreground uppercase font-medium mt-1">Characters</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">{stats.charsNoSpaces}</div>
            <div className="text-xs text-muted-foreground uppercase font-medium mt-1">No Spaces</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">{stats.sentences}</div>
            <div className="text-xs text-muted-foreground uppercase font-medium mt-1">Sentences</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">{stats.paragraphs}</div>
            <div className="text-xs text-muted-foreground uppercase font-medium mt-1">Paragraphs</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/70 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
              {stats.readingTimeMin} <span className="text-xs font-normal">min</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase font-medium mt-1">Reading Time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={toSentenceCase} className="text-xs h-7">
                      Sentence case
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setText(text.toUpperCase())} className="text-xs h-7">
                      UPPERCASE
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setText(text.toLowerCase())} className="text-xs h-7">
                      lowercase
                    </Button>
                    <Button size="sm" variant="outline" onClick={cleanSpaces} className="text-xs h-7">
                      Trim Spaces
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setText('')} className="text-xs h-7 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" onClick={copyContent} className="text-xs h-7 gap-1">
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <textarea
                  rows={14}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your content here..."
                  className="w-full rounded-lg border border-input bg-background p-4 text-sm sm:text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Insights Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Readability Score */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Readability & Comprehension
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Flesch Reading Ease</span>
                    <span className="font-mono text-xl font-extrabold text-primary">{stats.fleschScore} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${stats.fleschScore}%` }}
                      className="h-full bg-primary transition-all duration-300"
                    />
                  </div>
                  <div className={`text-xs font-semibold mt-1.5 ${fleschInfo.color}`}>
                    {fleschInfo.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                  <div className="p-3 rounded-xl bg-card border border-border/70 text-center">
                    <div className="text-lg font-bold font-mono text-foreground">Grade {stats.gradeLevel}</div>
                    <div className="text-[11px] text-muted-foreground">Flesch-Kincaid</div>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border/70 text-center">
                    <div className="text-lg font-bold font-mono text-foreground">{stats.avgWordLength} chars</div>
                    <div className="text-[11px] text-muted-foreground">Avg Word Length</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyword Density Table */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Top Keyword Density
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {stats.topKeywords.length > 0 ? (
                  <div className="divide-y divide-border/60 text-xs font-mono">
                    {stats.topKeywords.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30">
                        <span className="font-semibold text-foreground truncate mr-2">{kw.word}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-muted-foreground">{kw.count}x</span>
                          <span className="text-primary font-bold">{kw.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    Type words above to generate frequency insights.
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
