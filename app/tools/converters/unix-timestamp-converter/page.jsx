'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Copy, 
  Check, 
  Pause, 
  Play, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export default function UnixTimestampConverter() {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [isTicking, setIsTicking] = useState(true);
  const [copiedCurrent, setCopiedCurrent] = useState(false);

  // Input states
  const [timestampInput, setTimestampInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16));
  const [copiedField, setCopiedField] = useState(null);

  // Clock tick
  useEffect(() => {
    if (!isTicking) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTicking]);

  // Parse input timestamp
  const parsedFromTimestamp = () => {
    let raw = timestampInput.trim();
    if (!raw) return null;
    let num = parseInt(raw, 10);
    if (isNaN(num)) return null;

    // Detect if input is in seconds or milliseconds
    let ms = num;
    if (num < 100000000000) {
      ms = num * 1000;
    }

    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;

    return {
      dateObj: d,
      seconds: Math.floor(d.getTime() / 1000),
      milliseconds: d.getTime(),
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      iso: d.toISOString(),
      relative: getRelativeTimeString(d)
    };
  };

  const getRelativeTimeString = (date) => {
    const diffSec = Math.floor((date.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.floor(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHours = Math.floor(diffMin / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    const diffDays = Math.floor(diffHours / 24);
    if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
    const diffMonths = Math.floor(diffDays / 30);
    return rtf.format(diffMonths, 'month');
  };

  const timestampResult = parsedFromTimestamp();

  // Convert Date Picker to Epoch
  const epochFromDate = () => {
    if (!dateInput) return { sec: 0, ms: 0 };
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return { sec: 0, ms: 0 };
    return {
      sec: Math.floor(d.getTime() / 1000),
      ms: d.getTime(),
      utc: d.toUTCString()
    };
  };

  const dateResult = epochFromDate();

  const copyToClipboard = async (text, fieldKey) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const addOffset = (seconds) => {
    const cur = parseInt(timestampInput, 10) || Math.floor(Date.now() / 1000);
    setTimestampInput((cur + seconds).toString());
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
            UTC & Epoch Time Engine
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Unix Timestamp & Epoch Converter
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Convert Unix epoch timestamps to human-readable dates (UTC, ISO 8601, and local time) and convert calendar dates to epoch timestamps.
          </p>
        </div>

        {/* Live Ticking Epoch Clock Card */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-card border border-border/70 shadow-md text-center">
          <div className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-2">
            Current Unix Epoch Timestamp
          </div>
          <div className="text-4xl sm:text-6xl font-extrabold font-mono text-primary tracking-tight">
            {currentEpoch}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-2">
            Milliseconds: {Date.now()}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTicking(!isTicking)}
              className="text-xs gap-1.5"
            >
              {isTicking ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isTicking ? 'Pause Clock' : 'Resume Clock'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(currentEpoch.toString());
                setCopiedCurrent(true);
                setTimeout(() => setCopiedCurrent(false), 1500);
              }}
              className="text-xs font-mono gap-1.5"
            >
              {copiedCurrent ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedCurrent ? 'Copied!' : 'Copy Timestamp'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTimestampInput(currentEpoch.toString())}
              className="text-xs text-primary"
            >
              Use Below ↓
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Section 1: Timestamp to Human Date */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">1. Timestamp → Human Date</CardTitle>
              <CardDescription className="text-xs">
                Supports seconds (10 digits) or milliseconds (13 digits)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                  Unix Timestamp
                </label>
                <div className="flex gap-2">
                  <Input
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    placeholder="e.g. 1774189200"
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}
                    className="text-xs shrink-0"
                  >
                    Now
                  </Button>
                </div>
              </div>

              {/* Offset Jump Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => addOffset(3600)}
                  className="px-2 py-1 rounded text-[11px] font-mono border border-border/80 hover:bg-muted"
                >
                  +1h
                </button>
                <button
                  type="button"
                  onClick={() => addOffset(86400)}
                  className="px-2 py-1 rounded text-[11px] font-mono border border-border/80 hover:bg-muted"
                >
                  +1d
                </button>
                <button
                  type="button"
                  onClick={() => addOffset(604800)}
                  className="px-2 py-1 rounded text-[11px] font-mono border border-border/80 hover:bg-muted"
                >
                  +1w
                </button>
                <button
                  type="button"
                  onClick={() => addOffset(2592000)}
                  className="px-2 py-1 rounded text-[11px] font-mono border border-border/80 hover:bg-muted"
                >
                  +30d
                </button>
              </div>

              {/* Converted Output Breakdown */}
              {timestampResult ? (
                <div className="space-y-2 pt-3 border-t border-border/50">
                  {[
                    { label: 'GMT / UTC', val: timestampResult.utc, key: 'utc' },
                    { label: 'Local Timezone', val: timestampResult.local, key: 'local' },
                    { label: 'ISO 8601', val: timestampResult.iso, key: 'iso' },
                    { label: 'Relative', val: timestampResult.relative, key: 'rel' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-2.5 rounded-xl bg-card border border-border/70 flex items-center justify-between group"
                    >
                      <div className="truncate mr-2">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">{item.label}</div>
                        <div className="text-xs font-mono font-semibold text-foreground truncate">{item.val}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.val, item.key)}
                        className="h-7 w-7 p-0 shrink-0"
                      >
                        {copiedField === item.key ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-destructive">
                  Invalid timestamp format.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Date Picker to Timestamp */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">2. Human Date → Timestamp</CardTitle>
              <CardDescription className="text-xs">
                Pick a date and time to calculate epoch seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
                  Calendar Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              {/* Result Fields */}
              <div className="space-y-3 pt-3 border-t border-border/50">
                <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Epoch Seconds</div>
                    <div className="text-lg font-mono font-bold text-primary">{dateResult.sec}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(dateResult.sec.toString(), 'sec')}
                    className="text-xs h-8"
                  >
                    {copiedField === 'sec' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </Button>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Epoch Milliseconds</div>
                    <div className="text-lg font-mono font-bold text-foreground">{dateResult.ms}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(dateResult.ms.toString(), 'ms')}
                    className="text-xs h-8"
                  >
                    {copiedField === 'ms' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </Button>
                </div>
              </div>

              {/* Year 2038 Note */}
              <div className="mt-4 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Year 2038 Problem (Y2K38):</span> On January 19, 2038, 32-bit signed integers will overflow at 2,147,483,647 seconds. Modern 64-bit systems will safely run for over 292 billion years.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
