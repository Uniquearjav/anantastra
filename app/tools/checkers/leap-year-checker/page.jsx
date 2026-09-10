'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Check, 
  Copy,
  ShieldCheck 
} from 'lucide-react';

export default function LeapYearChecker() {
  const currentYear = new Date().getFullYear();
  const [yearInput, setYearInput] = useState(currentYear.toString());
  const [copied, setCopied] = useState(false);

  // Check leap year logic according to Gregorian calendar
  const checkIsLeapYear = (y) => {
    if (isNaN(y) || y <= 0) return false;
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  };

  const parsedYear = parseInt(yearInput, 10);
  const isValid = !isNaN(parsedYear) && parsedYear > 0 && parsedYear <= 99999;

  const data = useMemo(() => {
    if (!isValid) return null;

    const isLeap = checkIsLeapYear(parsedYear);
    const div4 = parsedYear % 4 === 0;
    const div100 = parsedYear % 100 === 0;
    const div400 = parsedYear % 400 === 0;

    // Next leap years
    let nextYears = [];
    let curNext = parsedYear + 1;
    while (nextYears.length < 5) {
      if (checkIsLeapYear(curNext)) {
        nextYears.push(curNext);
      }
      curNext++;
    }

    // Previous leap year
    let prevYear = null;
    let curPrev = parsedYear - 1;
    while (curPrev > 0) {
      if (checkIsLeapYear(curPrev)) {
        prevYear = curPrev;
        break;
      }
      curPrev--;
    }

    // Century grid
    const centuryStart = Math.floor(parsedYear / 100) * 100;
    const centuryEnd = centuryStart + 99;
    const leapYearsInCentury = [];
    for (let i = centuryStart; i <= centuryEnd; i++) {
      if (checkIsLeapYear(i)) {
        leapYearsInCentury.push(i);
      }
    }

    // Days until next leap day (Feb 29)
    const today = new Date();
    let nextLeapDay = null;
    let daysUntilLeapDay = null;
    for (let y = today.getFullYear(); y <= today.getFullYear() + 8; y++) {
      if (checkIsLeapYear(y)) {
        const feb29 = new Date(y, 1, 29);
        if (feb29 > today) {
          nextLeapDay = feb29;
          const diffMs = feb29.getTime() - today.getTime();
          daysUntilLeapDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          break;
        }
      }
    }

    return {
      year: parsedYear,
      isLeap,
      div4,
      div100,
      div400,
      daysInYear: isLeap ? 366 : 365,
      daysInFeb: isLeap ? 29 : 28,
      hoursInYear: (isLeap ? 366 : 365) * 24,
      minutesInYear: (isLeap ? 366 : 365) * 24 * 60,
      secondsInYear: (isLeap ? 366 : 365) * 24 * 3600,
      nextYears,
      prevYear,
      centuryStart,
      centuryEnd,
      leapYearsInCentury,
      daysUntilLeapDay
    };
  }, [parsedYear, isValid]);

  const stepYear = (delta) => {
    const base = isValid ? parsedYear : currentYear;
    const next = Math.max(1, base + delta);
    setYearInput(next.toString());
  };

  const handleCopy = () => {
    if (!data) return;
    const text = `Year ${data.year}: ${data.isLeap ? 'LEAP YEAR (366 days, Feb has 29 days)' : 'COMMON YEAR (365 days, Feb has 28 days)'}\nDivisible by 4: ${data.div4 ? 'Yes' : 'No'}\nDivisible by 100: ${data.div100 ? 'Yes' : 'No'}\nDivisible by 400: ${data.div400 ? 'Yes' : 'No'}\nNext Leap Year: ${data.nextYears[0]}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'Current Year', val: currentYear },
    { label: '2024 (Leap)', val: 2024 },
    { label: '2028 (Next)', val: 2028 },
    { label: '2100 (Century Exception)', val: 2100 },
    { label: '2000 (Millennium Leap)', val: 2000 },
    { label: '2400 (400-Year Rule)', val: 2400 },
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Title */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Gregorian Calendar Validator
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Leap Year Checker
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Instant mathematical verification with solar alignment rules, century exception breakdowns, and calendar statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input & Stepper Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <label htmlFor="year-input" className="text-sm font-semibold text-foreground block mb-2">
              Enter Any Calendar Year
            </label>

            <div className="flex gap-2 items-center">
              <Input
                id="year-input"
                type="number"
                min="1"
                max="99999"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                placeholder="e.g. 2024"
                className="font-mono text-lg py-5"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => stepYear(-1)}
                title="Previous Year"
                className="shrink-0 h-10 w-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => stepYear(1)}
                title="Next Year"
                className="shrink-0 h-10 w-10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Step and Presets */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground mr-1">Quick Jumps:</span>
              <button
                type="button"
                onClick={() => stepYear(-4)}
                className="text-xs px-2.5 py-1 rounded-md border border-border/60 bg-muted/30 hover:bg-muted font-mono"
              >
                -4 Years
              </button>
              <button
                type="button"
                onClick={() => stepYear(4)}
                className="text-xs px-2.5 py-1 rounded-md border border-border/60 bg-muted/30 hover:bg-muted font-mono"
              >
                +4 Years
              </button>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setYearInput(p.val.toString())}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors font-mono ${
                    parsedYear === p.val 
                      ? 'border-primary bg-primary/10 text-primary font-bold' 
                      : 'border-border/60 bg-muted/30 hover:bg-muted text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Logic Gate Explanation */}
            {data && (
              <div className="mt-6 pt-5 border-t border-border/60">
                <span className="text-xs font-semibold text-foreground block mb-3">
                  Gregorian 3-Step Mathematical Proof:
                </span>
                <div className="space-y-2.5 text-xs">
                  {/* Rule 1 */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    data.div4 
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground' 
                      : 'border-border/60 bg-muted/20 text-muted-foreground'
                  }`}>
                    <div>
                      <div className="font-semibold">Rule 1: Divisible by 4?</div>
                      <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                        {data.year} ÷ 4 = {(data.year / 4).toFixed(2)} {data.div4 ? '(Exact integer: YES)' : '(Has remainder: NO)'}
                      </div>
                    </div>
                    <Badge variant={data.div4 ? 'default' : 'secondary'} className="font-mono text-xs">
                      {data.div4 ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>

                  {/* Rule 2 */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    data.div100 
                      ? 'border-amber-500/30 bg-amber-500/5 text-foreground' 
                      : 'border-border/60 bg-muted/20 text-muted-foreground'
                  }`}>
                    <div>
                      <div className="font-semibold">Rule 2: Divisible by 100? (Century Year Exception)</div>
                      <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                        {data.year} ÷ 100 = {(data.year / 100).toFixed(2)} {data.div100 ? '(Century year: REQUIRES RULE 3)' : '(Not a century year: Standard leap rule applies)'}
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {data.div100 ? 'CENTURY' : 'NORMAL'}
                    </Badge>
                  </div>

                  {/* Rule 3 */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    data.div400 
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground' 
                      : 'border-border/60 bg-muted/20 text-muted-foreground'
                  }`}>
                    <div>
                      <div className="font-semibold">Rule 3: Divisible by 400? (Centurial Leap Rule)</div>
                      <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                        {data.year} ÷ 400 = {(data.year / 400).toFixed(2)} {data.div400 ? '(Exact century leap: YES)' : '(Not divisible by 400)'}
                      </div>
                    </div>
                    <Badge variant={data.div400 ? 'default' : 'secondary'} className="font-mono text-xs">
                      {data.div400 ? 'PASS' : 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!data}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied Details' : 'Copy Result'}
              </Button>
            </div>
          </Card>

          {/* Century Leap Year Grid */}
          {data && (
            <Card className="p-6 border-border/60 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">
                  All Leap Years in the {data.centuryStart}s ({data.centuryStart}–{data.centuryEnd})
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {data.leapYearsInCentury.length} Leap Years
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.leapYearsInCentury.map((ly) => (
                  <button
                    key={ly}
                    type="button"
                    onClick={() => setYearInput(ly.toString())}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors ${
                      data.year === ly
                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                        : 'bg-muted/30 hover:bg-muted border-border/60 text-foreground'
                    }`}
                  >
                    {ly}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4">
              Status & Calendar Metrics
            </h2>

            {data ? (
              <div className="space-y-4">
                {/* Result Callout */}
                <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                  data.isLeap 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                    : 'border-border/80 bg-muted/40 text-foreground'
                }`}>
                  {data.isLeap ? (
                    <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-8 h-8 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-bold text-lg">
                      {data.year} is {data.isLeap ? 'a Leap Year!' : 'a Common Year'}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {data.isLeap 
                        ? 'Contains 366 days with 29 days in February.' 
                        : 'Contains standard 365 days with 28 days in February.'}
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                    <div className="text-xs text-muted-foreground">Total Days</div>
                    <div className="text-xl font-mono font-bold text-foreground mt-0.5">{data.daysInYear}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                    <div className="text-xs text-muted-foreground">February Days</div>
                    <div className="text-xl font-mono font-bold text-foreground mt-0.5">{data.daysInFeb}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                    <div className="text-xs text-muted-foreground">Total Hours</div>
                    <div className="text-base font-mono font-bold text-foreground mt-0.5">{data.hoursInYear.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                    <div className="text-xs text-muted-foreground">Total Minutes</div>
                    <div className="text-base font-mono font-bold text-foreground mt-0.5">{data.minutesInYear.toLocaleString()}</div>
                  </div>
                </div>

                {/* Next & Previous Leap Years */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs py-2 border-b border-border/40">
                    <span className="text-muted-foreground">Previous Leap Year:</span>
                    <button
                      type="button"
                      onClick={() => data.prevYear && setYearInput(data.prevYear.toString())}
                      className="font-mono font-semibold text-foreground hover:text-primary transition-colors underline"
                    >
                      {data.prevYear || 'None'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2 border-b border-border/40">
                    <span className="text-muted-foreground">Next 5 Leap Years:</span>
                    <div className="flex gap-1.5 font-mono">
                      {data.nextYears.map((ny) => (
                        <button
                          key={ny}
                          type="button"
                          onClick={() => setYearInput(ny.toString())}
                          className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground text-xs"
                        >
                          {ny}
                        </button>
                      ))}
                    </div>
                  </div>
                  {data.daysUntilLeapDay !== null && (
                    <div className="flex justify-between items-center text-xs py-2">
                      <span className="text-muted-foreground">Next Feb 29 Leap Day:</span>
                      <span className="font-mono font-semibold text-primary">
                        In {data.daysUntilLeapDay} days
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                Please enter a valid positive year number.
              </div>
            )}
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% computed on your device. Zero server calls.</span>
          </div>
        </div>
      </div>

      {/* Astronomical & Historical Guide */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Why Do Leap Years Exist?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Earth takes approximately <strong>365.24219 days</strong> (365 days, 5 hours, 48 minutes, and 45 seconds) to orbit the Sun once. Because our calendar counts 365 full days, without leap days, our calendar would drift by nearly 6 hours every single year, causing the seasons to drift by 24 days every century!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Every 4 Years (+1 Day)</h3>
            <p className="text-xs text-muted-foreground">
              Adding a leap day every 4 years compensates for 0.25 days per year, slightly overcorrecting by 11 minutes per year.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Century Skip (100 Years)</h3>
            <p className="text-xs text-muted-foreground">
              To counter the 11-minute overcorrection, century years divisible by 100 (like 1700, 1800, 1900, 2100) are NOT leap years.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Quad-Century (400 Years)</h3>
            <p className="text-xs text-muted-foreground">
              Skipping every century slightly undercorrects, so years divisible by 400 (like 1600, 2000, 2400) remain leap years!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}