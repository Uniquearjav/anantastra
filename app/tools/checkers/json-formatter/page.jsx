'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  AlertCircle, 
  CheckCircle2,
  FileText
} from 'lucide-react';

const SAMPLE_JSON = `{
  "app": "Anantastra",
  "version": "2.0.0",
  "privacy": {
    "telemetry": false,
    "clientSideExecution": true
  },
  "features": [
    "Calculators",
    "Security Tools",
    "Converters"
  ],
  "author": {
    "name": "Arjav Choudhary",
    "role": "Creator"
  }
}`;

export default function JSONFormatter() {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const formatJSON = (customInput = jsonInput, spaces = indentSize) => {
    const raw = customInput.trim();
    if (!raw) {
      setError('Please paste or enter JSON text');
      setFormattedJson('');
      setStats(null);
      return;
    }

    try {
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        // Tolerant parsing attempt for trailing commas and single quotes
        const relaxed = raw
          .replace(/'/g, '"')
          .replace(/([{,]\s*)([a-zA-Z0-9_-]+)(\s*:)/g, '$1"$2"$3')
          .replace(/,\s*([}\]])/g, '$1');
        parsed = JSON.parse(relaxed);
      }

      const formatted = JSON.stringify(parsed, null, spaces);
      setFormattedJson(formatted);
      setError('');
      calculateStats(parsed);
    } catch (err) {
      setError(`Syntax Error: ${err.message}`);
      setFormattedJson('');
      setStats(null);
    }
  };

  const minifyJSON = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      setError('');
      calculateStats(parsed);
    } catch (err) {
      setError(`Invalid JSON for Minification: ${err.message}`);
    }
  };

  const calculateStats = (obj) => {
    const s = {
      keys: 0,
      depth: 0,
      arrays: 0,
      objects: 0,
      strings: 0,
      numbers: 0,
      booleans: 0,
      nulls: 0,
      sizeBytes: new Blob([JSON.stringify(obj)]).size
    };

    const traverse = (item, currentDepth = 0) => {
      if (currentDepth > s.depth) s.depth = currentDepth;
      if (Array.isArray(item)) {
        s.arrays++;
        item.forEach(i => traverse(i, currentDepth + 1));
      } else if (item !== null && typeof item === 'object') {
        s.objects++;
        s.keys += Object.keys(item).length;
        Object.values(item).forEach(v => traverse(v, currentDepth + 1));
      } else {
        if (typeof item === 'string') s.strings++;
        else if (typeof item === 'number') s.numbers++;
        else if (typeof item === 'boolean') s.booleans++;
        else if (item === null) s.nulls++;
      }
    };

    traverse(obj);
    setStats(s);
  };

  const handleCopy = () => {
    const target = formattedJson || jsonInput;
    if (!target) return;
    navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const target = formattedJson || jsonInput;
    if (!target) return;
    const blob = new Blob([target], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const loadSample = () => {
    setJsonInput(SAMPLE_JSON);
    formatJSON(SAMPLE_JSON, indentSize);
  };

  const clearAll = () => {
    setJsonInput('');
    setFormattedJson('');
    setError('');
    setStats(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <FileCode2 className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Developer Tool</Badge>
            <Badge variant="subtle">JSON Validator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            JSON Formatter & Validator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Validate, prettify, minify, and inspect JSON structures instantly without sending data to any server
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSample}
            className="h-8 text-xs gap-1 border-border/70"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sample</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs gap-1 border-border/70"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!formattedJson && !jsonInput}
            className="h-8 text-xs gap-1 border-border/70"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!formattedJson && !jsonInput}
            className="h-8 text-xs gap-1 border-border/70"
          >
            {downloaded ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Download className="h-3 w-3" />}
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-xl border border-border/60 bg-card text-card-foreground">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => formatJSON(jsonInput, indentSize)}
            className="h-8 text-xs gap-1.5"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Format & Validate</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={minifyJSON}
            className="h-8 text-xs gap-1.5"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Minify</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Indentation:</span>
          <div className="flex rounded-lg border border-border/70 bg-muted/30 p-0.5">
            {[2, 4, 8].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setIndentSize(size);
                  if (formattedJson) formatJSON(jsonInput, size);
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                  indentSize === size
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {size}sp
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Textarea */}
        <Card className="p-4 border-border/60 bg-card text-card-foreground flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Input Raw JSON
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {jsonInput.length} chars
            </span>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste your JSON here (e.g. {"name": "test"})...'
            className="flex-1 w-full resize-none p-3 font-mono text-xs leading-relaxed bg-background/60 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            spellCheck={false}
          />
        </Card>

        {/* Right: Output / Error Viewer */}
        <Card className="p-4 border-border/60 bg-card text-card-foreground flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Output
              </span>
              {error ? (
                <Badge variant="outline" className="border-rose-500/40 text-rose-500 gap-1 text-[10px] py-0">
                  <AlertCircle className="h-2.5 w-2.5" />
                  <span>Invalid</span>
                </Badge>
              ) : formattedJson ? (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 gap-1 text-[10px] py-0">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  <span>Valid JSON</span>
                </Badge>
              ) : null}
            </div>
            {stats && (
              <span className="text-[11px] text-muted-foreground font-mono">
                {stats.sizeBytes} bytes
              </span>
            )}
          </div>

          {error ? (
            <div className="flex-1 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs overflow-auto leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-1">Parse Error</strong>
                  <span>{error}</span>
                </div>
              </div>
            </div>
          ) : (
            <pre className="flex-1 w-full overflow-auto p-3 font-mono text-xs leading-relaxed bg-background/60 border border-border/60 rounded-xl text-foreground select-all">
              {formattedJson || <span className="text-muted-foreground/60 italic">// Formatted output will appear here...</span>}
            </pre>
          )}
        </Card>
      </div>

      {/* JSON Statistics Bar */}
      {stats && (
        <Card className="mt-6 p-4 border-border/60 bg-card text-card-foreground">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Structure Inspection
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Keys</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.keys}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Max Depth</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.depth}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Objects</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.objects}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Arrays</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.arrays}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Strings</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.strings}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Numbers</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.numbers}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Booleans</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.booleans}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Nulls</span>
              <span className="text-sm font-bold text-foreground font-mono">{stats.nulls}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}