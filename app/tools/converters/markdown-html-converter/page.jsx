'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode, 
  Eye, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  FileText, 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Table, 
  Link2, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

const SAMPLE_MARKDOWN = `# Modern Markdown Document

Welcome to the **AnantAstra Markdown to HTML Converter**. This tool converts standard and extended markdown into clean, semantic HTML in real-time.

---

## Typography & Inline Styling

You can format text with **bold emphasis**, *italics*, or ~~strikethrough text~~.
You can also highlight \`inline code tokens\` or embed [external hyperlinks](https://github.com).

## Blockquotes & Insights

> "Simplicity is prerequisite for reliability."
> — Edsger W. Dijkstra

## Code Blocks

\`\`\`javascript
function calculateFactorial(n) {
  if (n <= 1) return 1n;
  return BigInt(n) * calculateFactorial(n - 1);
}
\`\`\`

## Lists & Tables

### Feature List
- 100% Client-side conversion
- Instant live preview
- Raw semantic HTML export
- Zero external tracking

### Comparison Table
| Feature | Traditional | AnantAstra |
| :--- | :--- | :--- |
| Privacy | Server-stored | 100% Local Browser |
| Performance | Roundtrip API | Instant 0ms Latency |
| Design | Gradients | Clean Minimalist |
`;

// Robust pure client-side Markdown to HTML converter
function parseMarkdownToHTML(md) {
  if (!md) return '';

  let html = md;

  // Escape HTML tags to prevent XSS injection in raw inputs
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced Code Blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="p-4 rounded-xl bg-muted/70 font-mono text-xs overflow-x-auto my-4 border border-border/60"><code>${code.trim()}</code></pre>`;
  });

  // Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted/60 font-mono text-xs text-primary">$1</code>');

  // Headings
  html = html.replace(/^######\s+(.*$)/gim, '<h6 class="text-sm font-bold mt-4 mb-1 text-foreground">$1</h6>');
  html = html.replace(/^#####\s+(.*$)/gim, '<h5 class="text-base font-bold mt-4 mb-1.5 text-foreground">$1</h5>');
  html = html.replace(/^####\s+(.*$)/gim, '<h4 class="text-lg font-bold mt-5 mb-2 text-foreground">$1</h4>');
  html = html.replace(/^###\s+(.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-foreground">$1</h3>');
  html = html.replace(/^##\s+(.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-foreground pb-1 border-b border-border/40">$1</h2>');
  html = html.replace(/^#\s+(.*$)/gim, '<h1 class="text-3xl font-extrabold mt-6 mb-4 text-foreground pb-2 border-b border-border/60">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---+$/gim, '<hr class="my-6 border-border/60" />');

  // Blockquotes
  html = html.replace(/^\&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1 italic my-3 text-muted-foreground bg-muted/20 rounded-r-lg">$1</blockquote>');

  // Bold & Italic & Strike
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del class="opacity-75">$1</del>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl border border-border/60 max-w-full my-4" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium hover:opacity-80">$1</a>');

  // Tables
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const rows = match.trim().split('\n').map(r => r.trim());
    if (rows.length < 2) return match;

    let tableHtml = '<div class="overflow-x-auto my-4 rounded-xl border border-border/60"><table class="w-full text-xs text-left">';
    const headerCols = rows[0].split('|').filter((c, i, a) => i > 0 && i < a.length - 1);
    tableHtml += '<thead><tr class="bg-muted/50 border-b border-border/60">';
    headerCols.forEach(col => {
      tableHtml += `<th class="p-2.5 font-bold text-foreground">${col.trim()}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let r = 2; r < rows.length; r++) {
      const cols = rows[r].split('|').filter((c, i, a) => i > 0 && i < a.length - 1);
      tableHtml += '<tr class="border-b border-border/40 hover:bg-muted/20">';
      cols.forEach(col => {
        tableHtml += `<td class="p-2.5 text-muted-foreground">${col.trim()}</td>`;
      });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Task lists
  html = html.replace(/^-\s+\[ \]\s+(.*$)/gim, '<li class="flex items-center gap-2 list-none my-1"><input type="checkbox" disabled class="rounded" /> <span>$1</span></li>');
  html = html.replace(/^-\s+\[x\]\s+(.*$)/gim, '<li class="flex items-center gap-2 list-none my-1"><input type="checkbox" checked disabled class="rounded text-primary" /> <span class="line-through opacity-80">$1</span></li>');

  // Unordered Lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-foreground/90 my-0.5">$1</li>');

  // Paragraphs (lines that aren't already wrapped in tags)
  const lines = html.split('\n');
  const processed = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || 
        trimmed.startsWith('<pre') || 
        trimmed.startsWith('<hr') || 
        trimmed.startsWith('<block') || 
        trimmed.startsWith('<li') || 
        trimmed.startsWith('<div') || 
        trimmed.startsWith('<table')) {
      return line;
    }
    return `<p class="my-2 leading-relaxed text-foreground/90 text-sm">${trimmed}</p>`;
  });

  return processed.join('\n');
}

export default function MarkdownHTMLConverter() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'raw'
  const [copied, setCopied] = useState(false);

  // Compute parsed HTML
  const parsedHTML = useMemo(() => {
    return parseMarkdownToHTML(markdown);
  }, [markdown]);

  // Document statistics
  const stats = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const chars = markdown.length;
    const lines = markdown ? markdown.split('\n').length : 0;
    const readTimeMinutes = Math.ceil(words / 200);
    return { words, chars, lines, readTimeMinutes };
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(parsedHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([parsedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper toolbar inserter
  const insertToken = (before, after = '') => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end) || 'text';
    const replacement = `${before}${selected}${after}`;

    const newMd = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMd);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <FileCode className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Semantic HTML5 Generator
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Markdown to HTML Converter
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Write or paste Markdown syntax with real-time live preview, formatted semantic code output, and one-click HTML download.
        </p>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Markdown Editor Column */}
        <div className="space-y-4">
          <Card className="p-4 border-border/60 shadow-xs flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertToken('**', '**')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('*', '*')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('~~', '~~')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border/60 mx-1" />
                <button
                  type="button"
                  onClick={() => insertToken('# ')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Heading 1"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('## ')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Heading 2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border/60 mx-1" />
                <button
                  type="button"
                  onClick={() => insertToken('- ')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Unordered List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('> ')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Quote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('`', '`')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Inline Code"
                >
                  <Code2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('[', '](https://example.com)')}
                  className="p-1.5 rounded hover:bg-muted text-foreground"
                  title="Hyperlink"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
                  className="h-7 text-xs px-2"
                >
                  Sample
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMarkdown('')}
                  className="h-7 text-xs px-2 text-rose-500 hover:text-rose-600"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Markdown Textarea */}
            <div className="flex-1 pt-3">
              <textarea
                id="markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type or paste markdown content here..."
                className="w-full h-full p-2 bg-transparent text-foreground font-mono text-xs leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {/* Word Count Footer */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>{stats.words} words • {stats.chars} chars • {stats.lines} lines</span>
              <span>~{stats.readTimeMinutes} min read</span>
            </div>
          </Card>
        </div>

        {/* Right Output Column */}
        <div className="space-y-4">
          <Card className="p-4 border-border/60 shadow-xs flex flex-col h-[600px]">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-lg border border-border/50">
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'preview'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'raw'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  Raw HTML
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-7 text-xs px-2.5"
                >
                  {copied ? <Check className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? 'Copied' : 'Copy HTML'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="h-7 text-xs px-2.5"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export .html
                </Button>
              </div>
            </div>

            {/* Display Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {viewMode === 'preview' ? (
                <div 
                  className="prose dark:prose-invert max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: parsedHTML }}
                />
              ) : (
                <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed select-all">
                  {parsedHTML}
                </pre>
              )}
            </div>

            {/* Privacy note */}
            <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Processed 100% locally. Safe for sensitive documentation.</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Markdown Reference Guide */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Common Markdown Syntax Quick Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Headings</h3>
            <p className="text-xs font-mono text-muted-foreground">
              # H1<br />
              ## H2<br />
              ### H3
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Emphasis</h3>
            <p className="text-xs font-mono text-muted-foreground">
              **Bold text**<br />
              *Italic text*<br />
              ~~Strikethrough~~
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Links & Code</h3>
            <p className="text-xs font-mono text-muted-foreground">
              [Link](url)<br />
              `inline code`<br />
              ```fenced block```
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Tables & Quotes</h3>
            <p className="text-xs font-mono text-muted-foreground">
              | Col 1 | Col 2 |<br />
              | --- | --- |<br />
              &gt; Blockquote
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}