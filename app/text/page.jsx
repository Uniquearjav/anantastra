'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Replace, 
  Clock, 
  AlignLeft, 
  Sparkles, 
  FileText,
  Search
} from 'lucide-react';

export default function TextUtilitiesPage() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [findWord, setFindWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);

  // Live text metrics
  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();
    const charsWithSpaces = raw.length;
    const charsWithoutSpaces = raw.replace(/\s/g, '').length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim()).length : 0;
    const lines = raw ? raw.split('\n').length : 0;
    const readingTimeMins = (words / 200).toFixed(1);
    const speakingTimeMins = (words / 130).toFixed(1);

    return {
      charsWithSpaces,
      charsWithoutSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime: `${readingTimeMins} min`,
      speakingTime: `${speakingTimeMins} min`
    };
  }, [text]);

  // Transformations
  const transform = (type) => {
    if (!text) return;
    let result = text;

    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.replace(
          /\w\S*/g,
          txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        );
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
        break;
      case 'kebab':
        result = text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        break;
      case 'slug':
        result = text
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;
      case 'remove-spaces':
        result = text.replace(/\s+/g, ' ').trim();
        break;
      case 'remove-newlines':
        result = text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
        break;
      case 'reverse':
        result = text.split('').reverse().join('');
        break;
      case 'reverse-words':
        result = text.split(/\s+/).reverse().join(' ');
        break;
      case 'strip-html':
        result = text.replace(/<[^>]*>?/gm, '');
        break;
      case 'base64-encode':
        try {
          result = btoa(unescape(encodeURIComponent(text)));
        } catch {
          alert('Could not base64 encode text');
        }
        break;
      case 'base64-decode':
        try {
          result = decodeURIComponent(escape(atob(text)));
        } catch {
          alert('Invalid Base64 string');
        }
        break;
      default:
        break;
    }

    setText(result);
  };

  const handleFindReplace = (e) => {
    e.preventDefault();
    if (!findWord) return;
    const regex = new RegExp(findWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    setText(text.replace(regex, replaceWord));
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <Type className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Text Tool</Badge>
            <Badge variant="subtle">Client-Side Only</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Text Utilities & Case Converter
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Transform casing, slugify, clean spaces, analyze word statistics, and encode text in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFindReplace(!showFindReplace)}
            className="h-8 text-xs gap-1 border-border/70"
          >
            <Search className="h-3 w-3" />
            <span>Find & Replace</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!text}
            className="h-8 text-xs gap-1 border-border/70"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!text}
            className="h-8 text-xs gap-1 border-border/70"
          >
            <Download className="h-3 w-3" />
            <span>Export .txt</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setText('')}
            disabled={!text}
            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Find and Replace Drawer */}
      {showFindReplace && (
        <Card className="p-4 mb-6 border-border/60 bg-card text-card-foreground">
          <form onSubmit={handleFindReplace} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <Input
                type="text"
                placeholder="Find text..."
                value={findWord}
                onChange={(e) => setFindWord(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                type="text"
                placeholder="Replace with..."
                value={replaceWord}
                onChange={(e) => setReplaceWord(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 text-xs gap-1 shrink-0 w-full sm:w-auto">
              <Replace className="h-3.5 w-3.5" />
              <span>Replace All</span>
            </Button>
          </form>
        </Card>
      )}

      {/* Main Textarea */}
      <Card className="p-4 border-border/60 bg-card text-card-foreground mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to transform..."
          className="w-full h-64 sm:h-80 p-3 text-sm leading-relaxed bg-background/50 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
          spellCheck={false}
        />
      </Card>

      {/* Quick Action Transformation Chips */}
      <div className="space-y-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Letter Casing
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => transform('upper')} className="h-8 text-xs">
              UPPERCASE
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('lower')} className="h-8 text-xs">
              lowercase
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('title')} className="h-8 text-xs">
              Title Case
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('sentence')} className="h-8 text-xs">
              Sentence case
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('camel')} className="h-8 text-xs">
              camelCase
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('snake')} className="h-8 text-xs">
              snake_case
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('kebab')} className="h-8 text-xs">
              kebab-case
            </Button>
            <Button variant="secondary" size="sm" onClick={() => transform('slug')} className="h-8 text-xs">
              URL-slug
            </Button>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Sanitization & Utilities
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => transform('remove-spaces')} className="h-8 text-xs border-border/70">
              Clean Extra Spaces
            </Button>
            <Button variant="outline" size="sm" onClick={() => transform('remove-newlines')} className="h-8 text-xs border-border/70">
              Remove Line Breaks
            </Button>
            <Button variant="outline" size="sm" onClick={() => transform('strip-html')} className="h-8 text-xs border-border/70">
              Strip HTML Tags
            </Button>
            <Button variant="outline" size="sm" onClick={() => transform('reverse')} className="h-8 text-xs border-border/70">
              Reverse Characters
            </Button>
            <Button variant="outline" size="sm" onClick={() => transform('reverse-words')} className="h-8 text-xs border-border/70">
              Reverse Words
            </Button>
            <Button variant="outline" size="sm" onClick={() => transform('base64-encode')} className="h-8 text-xs border-border/70">
              Base64 Encode
            </Button>
            <Button variant="outline" size="sm" onClick={() => transform('base64-decode')} className="h-8 text-xs border-border/70">
              Base64 Decode
            </Button>
          </div>
        </div>
      </div>

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Words</span>
          <span className="text-base font-extrabold text-foreground font-mono">{stats.words}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Characters</span>
          <span className="text-base font-extrabold text-foreground font-mono">{stats.charsWithSpaces}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">No Spaces</span>
          <span className="text-base font-extrabold text-foreground font-mono">{stats.charsWithoutSpaces}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Sentences</span>
          <span className="text-base font-extrabold text-foreground font-mono">{stats.sentences}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Paragraphs</span>
          <span className="text-base font-extrabold text-foreground font-mono">{stats.paragraphs}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Lines</span>
          <span className="text-base font-extrabold text-foreground font-mono">{stats.lines}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Reading Time</span>
          <span className="text-xs font-bold text-foreground font-mono">{stats.readingTime}</span>
        </Card>
        <Card className="p-3 border-border/60 bg-card text-card-foreground text-center">
          <span className="text-[10px] text-muted-foreground block">Speaking Time</span>
          <span className="text-xs font-bold text-foreground font-mono">{stats.speakingTime}</span>
        </Card>
      </div>
    </div>
  );
}