'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  FileCheck, 
  Upload, 
  Hash, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('Anantastra Privacy Tools');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [verifyChecksum, setVerifyChecksum] = useState('');
  
  const [hashes, setHashes] = useState({
    sha256: '',
    sha512: '',
    sha384: '',
    sha1: '',
  });

  const [copiedKey, setCopiedKey] = useState(null);

  // Buffer to Hex converter
  const bufToHex = (buf) => {
    const bytes = new Uint8Array(buf);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
  };

  // Compute hashes for buffer
  const computeBufferHashes = async (buffer) => {
    if (!window.crypto?.subtle) return;
    try {
      const [s256, s512, s384, s1] = await Promise.all([
        window.crypto.subtle.digest('SHA-256', buffer),
        window.crypto.subtle.digest('SHA-512', buffer),
        window.crypto.subtle.digest('SHA-384', buffer),
        window.crypto.subtle.digest('SHA-1', buffer),
      ]);

      setHashes({
        sha256: bufToHex(s256),
        sha512: bufToHex(s512),
        sha384: bufToHex(s384),
        sha1: bufToHex(s1),
      });
    } catch (err) {
      console.error('Hashing calculation error:', err);
    }
  };

  // Text hashing
  useEffect(() => {
    if (selectedFile) return;
    if (!inputText) {
      setHashes({ sha256: '', sha512: '', sha384: '', sha1: '' });
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(inputText);
    computeBufferHashes(data);
  }, [inputText, selectedFile]);

  // File hashing
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      await computeBufferHashes(buffer);
    } catch (err) {
      console.error('File hashing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setInputText('Anantastra Privacy Tools');
  };

  const copyHash = async (val, key) => {
    const textToCopy = uppercase ? val.toUpperCase() : val.toLowerCase();
    await navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const getDisplayedHash = (val) => {
    if (!val) return '';
    return uppercase ? val.toUpperCase() : val.toLowerCase();
  };

  // Check if verification string matches any calculated hash
  const verificationMatch = verifyChecksum.trim()
    ? Object.entries(hashes).find(
        ([, v]) => v.toLowerCase() === verifyChecksum.trim().toLowerCase()
      )
    : null;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Hash className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Client-Side WebCrypto Subtitle Engine
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Cryptographic Hash & Checksum Generator
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Compute SHA-256, SHA-512, SHA-384, and SHA-1 cryptographic hashes for text or local files without transmitting byte data over the internet.
          </p>
        </div>

        {/* Input Configuration Card */}
        <Card className="border-border/60 shadow-sm mb-8">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">1. Input Data Source</CardTitle>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span>Uppercase Hex</span>
              </label>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {!selectedFile ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Plain Text Payload
                </label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Byte Length: {new TextEncoder().encode(inputText).length} bytes</span>
                  <label htmlFor="hash-file-input" className="text-primary hover:underline cursor-pointer font-medium">
                    Or switch to local file checksum →
                  </label>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-card border border-border/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{selectedFile.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Binary'}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={clearFile} className="text-xs text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            )}

            <input
              type="file"
              id="hash-file-input"
              className="hidden"
              onChange={handleFileUpload}
            />
          </CardContent>
        </Card>

        {/* Verification Bar */}
        <Card className="border-border/60 shadow-sm mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">
                Verify Checksum:
              </span>
              <Input
                placeholder="Paste expected hash to verify file integrity..."
                value={verifyChecksum}
                onChange={(e) => setVerifyChecksum(e.target.value)}
                className="font-mono text-xs h-9"
              />
              {verifyChecksum && (
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold">
                  {verificationMatch ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Matches {verificationMatch[0].toUpperCase()}!
                    </span>
                  ) : (
                    <span className="text-destructive flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Checksum Mismatch
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hashes Output List */}
        <div className="space-y-4">
          {[
            { key: 'sha256', name: 'SHA-256', bits: '256-bit Digest (Recommended)' },
            { key: 'sha512', name: 'SHA-512', bits: '512-bit High Security Digest' },
            { key: 'sha384', name: 'SHA-384', bits: '384-bit Intermediate Digest' },
            { key: 'sha1', name: 'SHA-1', bits: '160-bit Legacy Digest' },
          ].map((alg) => {
            const hVal = getDisplayedHash(hashes[alg.key]);
            const isMatch = verifyChecksum && hashes[alg.key].toLowerCase() === verifyChecksum.trim().toLowerCase();

            return (
              <Card
                key={alg.key}
                className={`border-border/60 shadow-sm transition-all ${
                  isMatch ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : ''
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 overflow-hidden pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{alg.name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">({alg.bits})</span>
                      {isMatch && (
                        <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5">
                          Verified Match
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-primary break-all select-all">
                      {hVal || <span className="text-muted-foreground/50">Processing digest...</span>}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyHash(hashes[alg.key], alg.key)}
                    disabled={!hVal}
                    className="text-xs h-8 shrink-0 self-end sm:self-center gap-1.5 font-mono"
                  >
                    {copiedKey === alg.key ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedKey === alg.key ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Privacy Callout */}
        <div className="mt-10 p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>
            <strong>Zero Network Exposure:</strong> File hashing reads buffers directly through the browser&apos;s FileReader API and executes within WebCrypto hardware-accelerated binaries on your device.
          </span>
        </div>
      </div>
    </div>
  );
}
