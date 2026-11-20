'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Binary, 
  Copy, 
  Check, 
  UploadCloud, 
  FileCode, 
  Image as ImageIcon, 
  ArrowLeftRight, 
  Trash2, 
  Download,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function Base64Converter() {
  const [mode, setMode] = useState('text'); // 'text' | 'file'
  const [textDirection, setTextDirection] = useState('encode'); // 'encode' | 'decode'
  const [textInput, setTextInput] = useState('Hello, Use All Tools! 🚀 100% Client-Side Privacy.');
  const [textOutput, setTextOutput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [textError, setTextError] = useState('');
  const [copied, setCopied] = useState(false);

  // File state
  const [fileData, setFileData] = useState(null);
  const [fileCopied, setFileCopied] = useState(false);

  // UTF-8 Safe Base64 Encoding
  const utf8ToBase64 = (str, isUrlSafe = false) => {
    try {
      const bytes = new TextEncoder().encode(str);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let b64 = btoa(binary);
      if (isUrlSafe) {
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      return b64;
    } catch (e) {
      throw new Error('Encoding error: ' + e.message);
    }
  };

  // UTF-8 Safe Base64 Decoding
  const base64ToUtf8 = (b64) => {
    try {
      let normalized = b64.trim().replace(/-/g, '+').replace(/_/g, '/');
      while (normalized.length % 4) {
        normalized += '=';
      }
      const binary = atob(normalized);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch (e) {
      throw new Error('Invalid Base64 sequence: ' + e.message);
    }
  };

  // Convert text whenever input, direction, or urlSafe changes
  useEffect(() => {
    if (!textInput.trim()) {
      setTextOutput('');
      setTextError('');
      return;
    }

    try {
      if (textDirection === 'encode') {
        const res = utf8ToBase64(textInput, urlSafe);
        setTextOutput(res);
        setTextError('');
      } else {
        const res = base64ToUtf8(textInput);
        setTextOutput(res);
        setTextError('');
      }
    } catch (err) {
      setTextError(err.message);
      setTextOutput('');
    }
  }, [textInput, textDirection, urlSafe]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result;
      const base64Content = resultStr.split(',')[1] || '';
      setFileData({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        isImage: file.type.startsWith('image/'),
        dataUrl: resultStr,
        rawBase64: base64Content
      });
    };
    reader.readAsDataURL(file);
  };

  const copyText = async (content, cb) => {
    await navigator.clipboard.writeText(content);
    cb(true);
    setTimeout(() => cb(false), 2000);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Binary className="w-3.5 h-3.5 mr-1.5 text-primary" />
            UTF-8 & Binary Converter
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Base64 Encoder & Decoder
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Encode and decode plain text, UTF-8 unicode strings, and binary files or images into Base64 format with zero server uploads.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl p-1 bg-muted/60 border border-border/80">
            <button
              onClick={() => setMode('text')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                mode === 'text'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCode className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
              Text & String Mode
            </button>
            <button
              onClick={() => setMode('file')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                mode === 'file'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
              Image & File Mode
            </button>
          </div>
        </div>

        {/* Text Mode */}
        {mode === 'text' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border/60">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={textDirection === 'encode' ? 'default' : 'outline'}
                  onClick={() => setTextDirection('encode')}
                  className="text-xs"
                >
                  Encode to Base64
                </Button>
                <Button
                  size="sm"
                  variant={textDirection === 'decode' ? 'default' : 'outline'}
                  onClick={() => setTextDirection('decode')}
                  className="text-xs"
                >
                  Decode from Base64
                </Button>
              </div>

              {textDirection === 'encode' && (
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urlSafe}
                    onChange={(e) => setUrlSafe(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>URL-Safe Base64 (- and _)</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Area */}
              <Card className="border-border/60 shadow-sm flex flex-col justify-between">
                <CardHeader className="bg-muted/20 pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {textDirection === 'encode' ? 'Plaintext / Unicode Input' : 'Base64 Input'}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-mono">
                      {textInput.length} chars
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <textarea
                    rows={8}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={textDirection === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string...'}
                    className="w-full flex-1 rounded-lg border border-input bg-background p-3 font-mono text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTextInput('')}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Area */}
              <Card className="border-border/60 shadow-sm flex flex-col justify-between">
                <CardHeader className="bg-muted/20 pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {textDirection === 'encode' ? 'Base64 Result' : 'Decoded UTF-8 Result'}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyText(textOutput, setCopied)}
                      disabled={!textOutput}
                      className="text-xs h-7"
                    >
                      {copied ? <Check className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  {textError ? (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Decoding Error:</strong> {textError}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      readOnly
                      rows={8}
                      value={textOutput}
                      placeholder="Processed output will appear here..."
                      className="w-full flex-1 rounded-lg border border-input bg-muted/40 p-3 font-mono text-xs sm:text-sm text-foreground focus-visible:outline-none"
                    />
                  )}
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground font-mono">
                    <span>Output: {textOutput.length} characters</span>
                    {textDirection === 'encode' && textInput && (
                      <span>+{(textOutput.length > 0 ? ((textOutput.length / textInput.length) * 100 - 100).toFixed(0) : 0)}% size</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Image & File Mode */}
        {mode === 'file' && (
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors p-8 text-center bg-card rounded-2xl">
              <input
                type="file"
                id="file-drop"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-drop" className="cursor-pointer flex flex-col items-center">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-foreground">Click to select an image or file</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Drag and drop PNG, SVG, JPG, WebP, GIF, or PDF. Encoded locally with zero server upload.
                </p>
              </label>
            </Card>

            {fileData && (
              <Card className="border-border/60 shadow-md">
                <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-semibold">{fileData.name}</CardTitle>
                      <CardDescription className="text-xs font-mono">
                        {fileData.type} • Original: {formatBytes(fileData.size)} • Base64: {formatBytes(fileData.rawBase64.length)}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => copyText(fileData.dataUrl, setFileCopied)}
                      className="text-xs gap-1.5"
                    >
                      {fileCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {fileCopied ? 'Copied Full Data URI!' : 'Copy Data URI'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {fileData.isImage && (
                    <div className="flex justify-center p-4 bg-muted/20 rounded-xl border border-border/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fileData.dataUrl}
                        alt="Preview"
                        className="max-h-56 max-w-full rounded-lg object-contain shadow-xs"
                      />
                    </div>
                  )}

                  {/* Ready-to-use snippets */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                        HTML Image Tag
                      </label>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={`<img src="${fileData.dataUrl.slice(0, 80)}..." alt="${fileData.name}" />`}
                          className="w-full bg-muted/40 border border-input rounded-md px-3 py-1.5 text-xs font-mono"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyText(`<img src="${fileData.dataUrl}" alt="${fileData.name}" />`, () => {})}
                          className="text-xs shrink-0"
                        >
                          Copy HTML
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                        CSS Background Snippet
                      </label>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={`background-image: url("${fileData.dataUrl.slice(0, 80)}...");`}
                          className="w-full bg-muted/40 border border-input rounded-md px-3 py-1.5 text-xs font-mono"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyText(`background-image: url("${fileData.dataUrl}");`, () => {})}
                          className="text-xs shrink-0"
                        >
                          Copy CSS
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Security Alert */}
        <div className="mt-10 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span>
            <strong>100% In-Browser Privacy:</strong> No images or strings are uploaded to remote servers. All binary and base64 conversions happen directly inside your browser memory using native Web APIs.
          </span>
        </div>
      </div>
    </div>
  );
}
