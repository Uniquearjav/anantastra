'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatIndianCurrency } from '@/lib/formatters';
import { useTheme } from '@/components/ui/theme-provider';
import { 
  Calculator, 
  TrendingUp, 
  RotateCcw, 
  Download, 
  FileSpreadsheet, 
  Image as ImageIcon,
  Check,
  Copy,
  Info,
  Calendar,
  Percent,
  Coins,
  ArrowRight
} from 'lucide-react';

const COMPOUND_FREQUENCIES = [
  { value: 1, label: 'Annually (1x)' },
  { value: 2, label: 'Semi-Annually (2x)' },
  { value: 4, label: 'Quarterly (4x)' },
  { value: 12, label: 'Monthly (12x)' },
  { value: 365, label: 'Daily (365x)' },
];

const PRINCIPAL_PRESETS = [
  { label: '₹10K', value: 10000 },
  { label: '₹50K', value: 50000 },
  { label: '₹1 Lakh', value: 100000 },
  { label: '₹5 Lakh', value: 500000 },
  { label: '₹10 Lakh', value: 1000000 },
];

const RATE_PRESETS = [
  { label: '4% (Savings)', value: 4 },
  { label: '7% (FD)', value: 7 },
  { label: '10% (Balanced)', value: 10 },
  { label: '12% (Equity)', value: 12 },
  { label: '15% (High Yield)', value: 15 },
];

const YEAR_PRESETS = [1, 3, 5, 10, 15, 20];

export default function InterestCalculator() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  // Input states
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(7.5);
  const [time, setTime] = useState(5);
  const [timeUnit, setTimeUnit] = useState('years');
  const [compoundFrequency, setCompoundFrequency] = useState(1);

  // Results & Graph states
  const [simpleInterest, setSimpleInterest] = useState(0);
  const [compoundInterest, setCompoundInterest] = useState(0);
  const [yearlyData, setYearlyData] = useState([]);
  const [effectiveTime, setEffectiveTime] = useState(5);
  const [graphSize, setGraphSize] = useState('medium');
  const [showAllRows, setShowAllRows] = useState(false);

  // Status flags
  const [copied, setCopied] = useState(false);
  const [csvDownloaded, setCsvDownloaded] = useState(false);
  const [imageDownloaded, setImageDownloaded] = useState(false);

  // Canvas refs
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Convert time to effective years
  useEffect(() => {
    const numTime = Math.max(0, Number(time) || 0);
    let years = numTime;
    if (timeUnit === 'months') {
      years = numTime / 12;
    } else if (timeUnit === 'days') {
      years = numTime / 365;
    }
    setEffectiveTime(years);
  }, [time, timeUnit]);

  // Calculate interest
  useEffect(() => {
    const p = Math.max(0, Number(principal) || 0);
    const r = Math.max(0, Number(rate) || 0) / 100;
    const t = effectiveTime;
    const n = Number(compoundFrequency) || 1;

    // Simple Interest: P * r * t
    const si = p * r * t;
    setSimpleInterest(si);

    // Compound Interest: P * (1 + r/n)^(n*t) - P
    const ci = p > 0 && r > 0 && t > 0
      ? p * Math.pow(1 + r / n, n * t) - p
      : 0;
    setCompoundInterest(ci);

    // Generate graph points
    const dataPoints = getDataPointCount(t);
    const data = [];

    for (let i = 0; i <= dataPoints; i++) {
      const timeFraction = dataPoints > 0 ? (i / dataPoints) * t : 0;
      const siAmount = p + p * r * timeFraction;
      const ciAmount = p > 0 && r > 0 && timeFraction > 0
        ? p * Math.pow(1 + r / n, n * timeFraction)
        : p;
      const simpleInt = siAmount - p;
      const compoundInt = ciAmount - p;
      const difference = compoundInt - simpleInt;

      data.push({
        period: i,
        periodLabel: getTimePeriodLabel(i, dataPoints, t, timeUnit),
        simpleAmount: Math.round(siAmount),
        compoundAmount: Math.round(ciAmount),
        simpleInterest: Math.round(simpleInt),
        compoundInterest: Math.round(compoundInt),
        difference: Math.round(difference),
        timeFraction
      });
    }

    setYearlyData(data);
  }, [principal, rate, effectiveTime, compoundFrequency, timeUnit]);

  // Redraw graph on data or theme changes
  useEffect(() => {
    drawGraph();
  }, [yearlyData, darkMode, graphSize]);

  // Reset export feedback when inputs change
  useEffect(() => {
    setCsvDownloaded(false);
    setImageDownloaded(false);
    setCopied(false);
  }, [principal, rate, time, timeUnit, compoundFrequency]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => drawGraph();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [yearlyData, darkMode, graphSize]);

  const resetDefaults = () => {
    setPrincipal(50000);
    setRate(7.5);
    setTime(5);
    setTimeUnit('years');
    setCompoundFrequency(1);
  };

  const copySummary = () => {
    const text = `Interest Calculation Summary:
Principal: ${formatIndianCurrency(principal)}
Rate: ${rate}% p.a.
Period: ${time} ${timeUnit}
Simple Interest: ${formatIndianCurrency(Math.round(simpleInterest))} (Total: ${formatIndianCurrency(Math.round(Number(principal) + simpleInterest))})
Compound Interest: ${formatIndianCurrency(Math.round(compoundInterest))} (Total: ${formatIndianCurrency(Math.round(Number(principal) + compoundInterest))})
Compound Extra Gain: ${formatIndianCurrency(Math.round(compoundInterest - simpleInterest))}
Calculated with Anantastra: https://anantastra.vercel.app/interest-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  function getDataPointCount(years) {
    if (years <= 1 / 12) return Math.min(30, Math.max(5, Math.ceil(years * 365)));
    if (years <= 1) return Math.min(12, Math.max(4, Math.ceil(years * 12)));
    return Math.min(40, Math.max(5, Math.ceil(years)));
  }

  function getTimePeriodLabel(index, total, years, unit) {
    if (total === 0) return '0';
    if (unit === 'days') return `Day ${Math.round((index / total) * years * 365)}`;
    if (unit === 'months' || years <= 1) return `Mo ${Math.round((index / total) * years * 12)}`;
    return `Yr ${Math.round((index / total) * years)}`;
  }

  // Draw crisp canvas graph without blurry scaling
  const drawGraph = () => {
    if (!yearlyData.length || !canvasRef.current || !canvasContainerRef.current) return;

    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Color tokens
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const textColor = darkMode ? '#94a3b8' : '#64748b';
    const siLineColor = '#3b82f6'; // Solid Blue
    const ciLineColor = '#8b5cf6'; // Solid Purple

    const maxAmount = Math.max(
      ...yearlyData.map((d) => Math.max(d.simpleAmount, d.compoundAmount, Number(principal) * 1.05))
    );

    const padding = { left: 65, right: 24, top: 24, bottom: 44 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    // Horizontal Grid & Y-Labels
    const numYLines = 4;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= numYLines; i++) {
      const y = padding.top + (i / numYLines) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = Math.round(maxAmount - (i / numYLines) * maxAmount);
      let label = `₹${val}`;
      if (val >= 10000000) label = `₹${(val / 10000000).toFixed(1)}Cr`;
      else if (val >= 100000) label = `₹${(val / 100000).toFixed(1)}L`;
      else if (val >= 1000) label = `₹${(val / 1000).toFixed(0)}K`;

      ctx.fillText(label, padding.left - 8, y + 4);
    }

    // X-Axis Grid & Labels
    const totalPeriods = yearlyData.length - 1;
    const skipFactor = Math.max(1, Math.ceil(totalPeriods / 6));
    ctx.textAlign = 'center';

    for (let i = 0; i <= totalPeriods; i += skipFactor) {
      const x = padding.left + (i / totalPeriods) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      const item = yearlyData[i];
      if (item) {
        ctx.fillText(item.periodLabel, x, height - padding.bottom + 18);
      }
    }

    // Draw Line helper
    const drawSeries = (key, strokeColor, lineWidth = 2.5) => {
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      yearlyData.forEach((point, index) => {
        const x = padding.left + (index / totalPeriods) * graphWidth;
        const val = point[key];
        const y = padding.top + graphHeight - (val / maxAmount) * graphHeight;

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    // Draw Simple Interest Line (Blue)
    drawSeries('simpleAmount', siLineColor, 2.5);

    // Draw Compound Interest Line (Purple)
    drawSeries('compoundAmount', ciLineColor, 2.5);

    // Draw End Points for visual clarity
    const lastPoint = yearlyData[yearlyData.length - 1];
    if (lastPoint) {
      const endX = padding.left + graphWidth;
      const endSiY = padding.top + graphHeight - (lastPoint.simpleAmount / maxAmount) * graphHeight;
      const endCiY = padding.top + graphHeight - (lastPoint.compoundAmount / maxAmount) * graphHeight;

      // SI point
      ctx.fillStyle = siLineColor;
      ctx.beginPath();
      ctx.arc(endX, endSiY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // CI point
      ctx.fillStyle = ciLineColor;
      ctx.beginPath();
      ctx.arc(endX, endCiY, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const saveGraphAsImage = () => {
    if (!canvasRef.current) return;
    try {
      const link = document.createElement('a');
      link.download = `anantastra-interest-growth-${principal}-rate${rate}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      setImageDownloaded(true);
      setTimeout(() => setImageDownloaded(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const saveTableAsCSV = () => {
    try {
      let csv = 'Period,Simple Interest (INR),Simple Total (INR),Compound Interest (INR),Compound Total (INR),Net Difference (INR)\n';
      yearlyData.forEach((row) => {
        csv += `"${row.periodLabel}",${row.simpleInterest},${row.simpleAmount},${row.compoundInterest},${row.compoundAmount},${row.difference}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `anantastra-interest-breakdown-${principal}-pkr.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCsvDownloaded(true);
      setTimeout(() => setCsvDownloaded(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const differenceValue = compoundInterest - simpleInterest;
  const differencePercent = simpleInterest > 0 ? (differenceValue / simpleInterest) * 100 : 0;

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 max-w-6xl text-foreground">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/50 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interest Calculator
            </h1>
            <Badge variant="subtle" className="text-xs">
              Simple vs Compound
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Compare simple and compound interest side-by-side with live sliders, visual trajectories, and schedule exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetDefaults}
            className="rounded-full border-border/80 text-xs gap-1.5 h-9"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copySummary}
            className="rounded-full border-border/80 text-xs gap-1.5 h-9"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Summary</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid: Left Controls, Right Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Column: Interactive Inputs & Sliders (7 cols) */}
        <Card className="lg:col-span-7 border-border/60 bg-card shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span>Investment Parameters</span>
            </h2>
            <span className="text-xs text-muted-foreground">Adjust sliders or type values</span>
          </div>

          {/* 1. Principal Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Principal Amount</label>
              <span className="font-bold text-foreground text-sm">
                {formatIndianCurrency(principal)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                ₹
              </span>
              <Input
                type="number"
                min="500"
                step="500"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                className="pl-8 text-base font-semibold border-border/70"
              />
            </div>
            <Slider
              value={[Math.min(2000000, Math.max(1000, Number(principal) || 0))]}
              min={1000}
              max={2000000}
              step={1000}
              onValueChange={(val) => setPrincipal(val[0])}
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRINCIPAL_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setPrincipal(preset.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    Number(principal) === preset.value
                      ? 'border-primary bg-primary text-primary-foreground font-semibold'
                      : 'border-border/60 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interest Rate Input */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Interest Rate (% p.a.)</label>
              <span className="font-bold text-foreground text-sm">{rate}%</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                min="0.1"
                max="40"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                className="pr-8 text-base font-semibold border-border/70"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                %
              </span>
            </div>
            <Slider
              value={[Math.min(30, Math.max(1, Number(rate) || 0))]}
              min={1}
              max={30}
              step={0.25}
              onValueChange={(val) => setRate(val[0])}
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {RATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setRate(preset.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    Number(rate) === preset.value
                      ? 'border-primary bg-primary text-primary-foreground font-semibold'
                      : 'border-border/60 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Time Period Input */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Time Duration</label>
              <span className="font-bold text-foreground text-sm">
                {time} {timeUnit}
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max={timeUnit === 'years' ? 50 : timeUnit === 'months' ? 600 : 18250}
                value={time}
                onChange={(e) => setTime(Math.max(1, Number(e.target.value)))}
                className="flex-1 text-base font-semibold border-border/70"
              />
              {/* Modern segmented pill unit toggle */}
              <div className="flex rounded-xl border border-border/70 p-1 bg-muted/40">
                {['years', 'months', 'days'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      if (timeUnit !== u) {
                        setTimeUnit(u);
                        if (u === 'years' && time > 50) setTime(5);
                        else if (u === 'months' && time > 600) setTime(60);
                      }
                    }}
                    className={`px-3 py-1 text-xs font-medium capitalize rounded-lg transition-colors ${
                      timeUnit === u
                        ? 'bg-background text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <Slider
              value={[
                timeUnit === 'years'
                  ? Math.min(30, Math.max(1, Number(time) || 1))
                  : timeUnit === 'months'
                  ? Math.min(120, Math.max(1, Number(time) || 1))
                  : Math.min(365, Math.max(1, Number(time) || 1))
              ]}
              min={1}
              max={timeUnit === 'years' ? 30 : timeUnit === 'months' ? 120 : 365}
              step={1}
              onValueChange={(val) => setTime(val[0])}
            />
            {timeUnit === 'years' && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {YEAR_PRESETS.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTime(yr)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      Number(time) === yr
                        ? 'border-primary bg-primary text-primary-foreground font-semibold'
                        : 'border-border/60 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Compounding Frequency */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <label className="text-sm font-medium text-foreground">
              Compounding Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMPOUND_FREQUENCIES.map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setCompoundFrequency(freq.value)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    compoundFrequency === freq.value
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border/70 bg-background/50 text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Column: Comparative Results Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Simple Interest Card */}
          <Card className="border-border/60 bg-card shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="font-bold text-sm text-foreground">Simple Interest</h3>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Linear
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {formatIndianCurrency(Math.round(simpleInterest))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                <span>Total Payout (Principal + Interest):</span>
                <span className="font-semibold text-foreground">
                  {formatIndianCurrency(Math.round(Number(principal) + simpleInterest))}
                </span>
              </div>
            </div>
          </Card>

          {/* Compound Interest Card */}
          <Card className="border-border/60 bg-card shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <h3 className="font-bold text-sm text-foreground">Compound Interest</h3>
              </div>
              <Badge variant="subtle" className="text-[10px]">
                Exponential
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                {formatIndianCurrency(Math.round(compoundInterest))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                <span>Total Payout (Principal + Interest):</span>
                <span className="font-semibold text-foreground">
                  {formatIndianCurrency(Math.round(Number(principal) + compoundInterest))}
                </span>
              </div>
            </div>
          </Card>

          {/* Extra Compound Gain / Edge Card */}
          <Card className="border-emerald-500/30 bg-emerald-500/10 shadow-xs p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                Compounding Advantage
              </h3>
              <Badge variant="success" className="text-[10px]">
                Extra Gain
              </Badge>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              +{formatIndianCurrency(Math.round(differenceValue))}
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
              Compound interest yields <strong className="font-bold">{differencePercent.toFixed(1)}% more returns</strong> than simple interest on your ₹{Number(principal).toLocaleString('en-IN')} principal.
            </p>
          </Card>
        </div>
      </div>

      {/* Chart Section */}
      <Card className="border-border/60 bg-card shadow-sm p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Growth Trajectory (Visual Comparison)</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Watch how compounding pulls ahead of simple interest over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Simple
              </span>
              <span className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Compound
              </span>
            </div>

            {/* Size Selector */}
            <div className="flex items-center gap-1 rounded-xl border border-border/70 p-1 bg-muted/40">
              {['small', 'medium', 'large'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setGraphSize(sz)}
                  className={`px-2.5 py-0.5 text-xs font-medium capitalize rounded-lg transition-colors ${
                    graphSize === sz
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={saveGraphAsImage}
              className="rounded-full border-border/80 text-xs gap-1.5 h-8"
            >
              {imageDownloaded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Export PNG</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Canvas container */}
        <div
          ref={canvasContainerRef}
          className={`w-full transition-all duration-300 relative rounded-xl border border-border/40 bg-background/50 p-2 ${
            graphSize === 'small'
              ? 'aspect-[16/7]'
              : graphSize === 'medium'
              ? 'aspect-[16/9]'
              : 'aspect-[16/11]'
          }`}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </Card>

      {/* Schedule Table Section */}
      <Card className="border-border/60 bg-card shadow-sm p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Period-wise Amortization Schedule
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Track balance progression and divergence over intervals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllRows(!showAllRows)}
              className="rounded-full border-border/80 text-xs h-8"
            >
              {showAllRows ? 'Show Key Milestones' : 'Show All Intervals'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={saveTableAsCSV}
              className="rounded-full border-border/80 text-xs gap-1.5 h-8"
            >
              {csvDownloaded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Export CSV</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase font-semibold">
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-right">Simple Interest</th>
                <th className="px-4 py-3 text-right">Simple Total</th>
                <th className="px-4 py-3 text-right">Compound Interest</th>
                <th className="px-4 py-3 text-right">Compound Total</th>
                <th className="px-4 py-3 text-right">Net Extra Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {yearlyData
                .filter((_, index) => {
                  if (showAllRows) return true;
                  const total = yearlyData.length - 1;
                  return (
                    index === 0 ||
                    index === total ||
                    index % Math.max(1, Math.floor(total / 10)) === 0
                  );
                })
                .map((row) => (
                  <tr key={row.period} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {row.periodLabel}
                    </td>
                    <td className="px-4 py-2.5 text-right text-blue-600 dark:text-blue-400 font-medium">
                      {formatIndianCurrency(row.simpleInterest)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {formatIndianCurrency(row.simpleAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-purple-600 dark:text-purple-400 font-medium">
                      {formatIndianCurrency(row.compoundInterest)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                      {formatIndianCurrency(row.compoundAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.difference > 0 ? `+${formatIndianCurrency(row.difference)}` : '₹0'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Educational Formula Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h3 className="font-bold text-sm text-foreground">Simple Interest Formula</h3>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 font-mono text-xs text-foreground">
            SI = (P × R × T) ÷ 100
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Interest is only earned on the initial principal. The interest amount stays strictly constant across every time period.
          </p>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <h3 className="font-bold text-sm text-foreground">Compound Interest Formula</h3>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 font-mono text-xs text-foreground">
            A = P × (1 + R / (n × 100))^(n × T)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Interest generates its own interest over each compounding cycle (<strong>n</strong>). Wealth grows exponentially rather than linearly.
          </p>
        </Card>
      </div>
    </main>
  );
}