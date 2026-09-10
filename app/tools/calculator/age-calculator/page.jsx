'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Sparkles, 
  Copy, 
  Check, 
  Cake, 
  Clock, 
  Heart, 
  Compass, 
  Milestone 
} from 'lucide-react';

export default function AgeCalculator() {
  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [targetDate, setTargetDate] = useState(todayStr);
  const [copied, setCopied] = useState(false);

  // Zodiac Helper
  const getZodiac = (month, day) => {
    const zodiacs = [
      { sign: 'Capricorn', symbol: '♑', element: 'Earth', start: [1, 1], end: [1, 19] },
      { sign: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21] },
      { sign: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [12, 31] },
    ];
    for (const z of zodiacs) {
      if (
        (month === z.start[0] && day >= z.start[1]) ||
        (month === z.end[0] && day <= z.end[1])
      ) {
        return z;
      }
    }
    return { sign: 'Capricorn', symbol: '♑', element: 'Earth' };
  };

  const ageData = useMemo(() => {
    if (!birthDate || !targetDate) return null;

    const b = new Date(birthDate);
    const t = new Date(targetDate);

    if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) {
      return { error: 'Birth date must be earlier than target date.' };
    }

    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Precise Y-M-D
    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      const prevMonthLastDay = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
      days += prevMonthLastDay;
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    // Next Birthday countdown
    let nextBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < t) {
      nextBday = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayDayOfWeek = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    // Fun bio-estimates
    const estimatedHeartbeats = Math.round(totalMinutes * 75);
    const estimatedBreaths = Math.round(totalMinutes * 16);

    const zodiac = getZodiac(b.getMonth() + 1, b.getDate());

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      daysToNextBday,
      nextBdayDayOfWeek,
      estimatedHeartbeats,
      estimatedBreaths,
      zodiac,
      dayBorn: b.toLocaleDateString('en-US', { weekday: 'long' })
    };
  }, [birthDate, targetDate]);

  const handleCopy = () => {
    if (!ageData || ageData.error) return;
    const text = `AGE CALCULATION REPORT - ANANTASTRA
------------------------------------
Date of Birth   : ${birthDate} (${ageData.dayBorn})
As of Date      : ${targetDate}
Exact Age       : ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days
Total Days      : ${ageData.totalDays.toLocaleString()} days
Total Weeks     : ${ageData.totalWeeks.toLocaleString()} weeks
Next Birthday   : In ${ageData.daysToNextBday} days (${ageData.nextBdayDayOfWeek})
Zodiac Sign     : ${ageData.zodiac.sign} ${ageData.zodiac.symbol} (${ageData.zodiac.element})
Est. Heartbeats : ~${(ageData.estimatedHeartbeats / 1000000).toFixed(1)} Million
------------------------------------
Generated via Anantastra Client-Side Utilities
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <Calendar className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Life Calculator</Badge>
            <Badge variant="subtle">Chronological & Bio</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Age Calculator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Compute exact chronological age, upcoming birthday countdowns, and life milestones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!ageData || Boolean(ageData.error)}
            className="h-8 text-xs gap-1 border-border/70"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Date Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Date Inputs
            </h2>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Date of Birth
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-11 font-medium rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Calculate Age At (Default: Today)
              </label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="h-11 font-medium rounded-xl"
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-3 border-t border-border/40">
              <span className="text-[11px] text-muted-foreground block mb-2 font-medium">
                Quick Samples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setBirthDate('2000-01-01')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                >
                  Year 2000
                </button>
                <button
                  type="button"
                  onClick={() => setBirthDate('1995-07-15')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                >
                  1995
                </button>
                <button
                  type="button"
                  onClick={() => setBirthDate('1990-10-24')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                >
                  1990
                </button>
              </div>
            </div>
          </Card>

          {/* Zodiac & Astrological Snapshot */}
          {ageData && !ageData.error && (
            <Card className="p-5 border-border/60 bg-card text-card-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ageData.zodiac.symbol}</span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {ageData.zodiac.sign}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {ageData.zodiac.element} Element • Born on a {ageData.dayBorn}
                    </p>
                  </div>
                </div>
                <Badge variant="subtle">{ageData.zodiac.element}</Badge>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Age Breakdown & Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {ageData && ageData.error ? (
            <Card className="p-6 border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <p className="text-sm font-semibold">{ageData.error}</p>
            </Card>
          ) : ageData ? (
            <>
              {/* Primary Age Display */}
              <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Chronological Age
                  </h2>
                  <Badge variant="contrast">Verified</Badge>
                </div>

                <div className="my-5 p-5 rounded-xl border border-border/80 bg-muted/30 text-center">
                  <div className="flex items-baseline justify-center gap-3">
                    <div>
                      <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                        {ageData.years}
                      </span>
                      <span className="text-xs text-muted-foreground block mt-1 font-semibold uppercase">
                        Years
                      </span>
                    </div>
                    <span className="text-2xl text-muted-foreground/50">:</span>
                    <div>
                      <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                        {ageData.months}
                      </span>
                      <span className="text-xs text-muted-foreground block mt-1 font-semibold uppercase">
                        Months
                      </span>
                    </div>
                    <span className="text-2xl text-muted-foreground/50">:</span>
                    <div>
                      <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                        {ageData.days}
                      </span>
                      <span className="text-xs text-muted-foreground block mt-1 font-semibold uppercase">
                        Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Birthday Banner */}
                <div className="p-3.5 rounded-xl border border-border/60 bg-background/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Cake className="h-4 w-4 text-primary" />
                    <span>Next Birthday in <strong className="text-foreground">{ageData.daysToNextBday} days</strong></span>
                  </div>
                  <span className="text-muted-foreground font-medium">
                    Falls on a {ageData.nextBdayDayOfWeek}
                  </span>
                </div>
              </Card>

              {/* Total Units Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-4 border-border/60 bg-card text-card-foreground text-center">
                  <span className="text-[10px] text-muted-foreground block">Total Days</span>
                  <span className="text-base font-extrabold text-foreground font-mono">
                    {ageData.totalDays.toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 border-border/60 bg-card text-card-foreground text-center">
                  <span className="text-[10px] text-muted-foreground block">Total Weeks</span>
                  <span className="text-base font-extrabold text-foreground font-mono">
                    {ageData.totalWeeks.toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 border-border/60 bg-card text-card-foreground text-center">
                  <span className="text-[10px] text-muted-foreground block">Total Hours</span>
                  <span className="text-base font-extrabold text-foreground font-mono">
                    {ageData.totalHours.toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 border-border/60 bg-card text-card-foreground text-center">
                  <span className="text-[10px] text-muted-foreground block">Total Minutes</span>
                  <span className="text-base font-extrabold text-foreground font-mono">
                    {ageData.totalMinutes.toLocaleString()}
                  </span>
                </Card>
              </div>

              {/* Biological Lifetime Estimates */}
              <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground text-xs space-y-3">
                <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  <span>Estimated Life Heartbeats & Breaths</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-muted-foreground text-xs">
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                    <span className="block font-bold text-foreground text-sm font-mono">
                      ~{(ageData.estimatedHeartbeats / 1000000).toFixed(0)}M
                    </span>
                    Heartbeats endured (~75 bpm)
                  </div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                    <span className="block font-bold text-foreground text-sm font-mono">
                      ~{(ageData.estimatedBreaths / 1000000).toFixed(0)}M
                    </span>
                    Breaths taken (~16 bpm)
                  </div>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}