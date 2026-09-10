'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { formatIndianCurrency } from '@/lib/formatters';
import { 
  Calculator, 
  Copy, 
  Check, 
  Download, 
  TrendingUp, 
  Calendar, 
  Percent, 
  Home, 
  Car, 
  User, 
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function LoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [tenureUnit, setTenureUnit] = useState('years'); // 'years' | 'months'
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [scheduleView, setScheduleView] = useState('yearly'); // 'yearly' | 'monthly'
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Quick Loan Presets
  const loanPresets = [
    { label: 'Home Loan', amount: 4000000, rate: 8.5, tenure: 20, icon: Home },
    { label: 'Car Loan', amount: 1000000, rate: 9.0, tenure: 5, icon: Car },
    { label: 'Personal Loan', amount: 500000, rate: 12.0, tenure: 3, icon: User },
    { label: 'Education Loan', amount: 1500000, rate: 10.0, tenure: 7, icon: GraduationCap },
  ];

  const effectiveMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureYears;

  // Real-time EMI math
  const calculation = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const annualRate = Math.max(0.1, interestRate);
    const r = annualRate / (12 * 100);
    const n = Math.max(1, effectiveMonths);

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + r, n);
    const monthlyEMI = Math.round((P * r * factor) / (factor - 1)) || 0;
    const totalPayment = monthlyEMI * n;
    const totalInterest = Math.max(0, totalPayment - P);

    // Amortization Schedule
    const monthlySchedule = [];
    let balance = P;
    let runningInterest = 0;
    let runningPrincipal = 0;

    for (let m = 1; m <= n; m++) {
      const interestForMonth = Math.round(balance * r);
      const principalForMonth = Math.min(balance, monthlyEMI - interestForMonth);
      balance = Math.max(0, balance - principalForMonth);
      runningInterest += interestForMonth;
      runningPrincipal += principalForMonth;

      monthlySchedule.push({
        period: m,
        emi: monthlyEMI,
        principal: principalForMonth,
        interest: interestForMonth,
        balance,
        totalInterestToDate: runningInterest
      });
    }

    // Yearly Schedule aggregation
    const yearlySchedule = [];
    const totalYears = Math.ceil(n / 12);
    for (let y = 1; y <= totalYears; y++) {
      const startM = (y - 1) * 12;
      const endM = Math.min(n, y * 12);
      const yearRows = monthlySchedule.slice(startM, endM);
      
      const yearPrincipal = yearRows.reduce((acc, row) => acc + row.principal, 0);
      const yearInterest = yearRows.reduce((acc, row) => acc + row.interest, 0);
      const endingBalance = yearRows[yearRows.length - 1]?.balance ?? 0;

      yearlySchedule.push({
        year: y,
        principal: yearPrincipal,
        interest: yearInterest,
        totalPayment: yearPrincipal + yearInterest,
        balance: endingBalance
      });
    }

    const principalPercent = totalPayment > 0 ? ((P / totalPayment) * 100).toFixed(1) : 100;
    const interestPercent = totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(1) : 0;

    return {
      monthlyEMI,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent,
      monthlySchedule,
      yearlySchedule
    };
  }, [loanAmount, interestRate, effectiveMonths]);

  const applyPreset = (preset) => {
    setLoanAmount(preset.amount);
    setInterestRate(preset.rate);
    setTenureYears(preset.tenure);
    setTenureUnit('years');
  };

  const handleCopy = () => {
    const summary = `LOAN EMI COMPUTATION - ANANTASTRA
------------------------------------------------
Loan Principal Amount : ${formatIndianCurrency(loanAmount)}
Interest Rate         : ${interestRate}% p.a.
Loan Tenure           : ${tenureYears} ${tenureUnit} (${effectiveMonths} Months)
------------------------------------------------
Monthly EMI Payable   : ${formatIndianCurrency(calculation.monthlyEMI)}
Total Interest        : ${formatIndianCurrency(calculation.totalInterest)} (${calculation.interestPercent}%)
Total Payment         : ${formatIndianCurrency(calculation.totalPayment)}
------------------------------------------------
Generated via Anantastra Privacy-First Instruments
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['Period (Month)', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Remaining Balance (₹)'];
    const rows = calculation.monthlySchedule.map(row => 
      [row.period, row.emi, row.principal, row.interest, row.balance].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loan-amortization-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <Calculator className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Financial Instrument</Badge>
            <Badge variant="subtle">Amortization Table</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Calculate your equated monthly installment, compare principal vs. interest, and view detailed amortization schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs gap-1.5 border-border/70 hover:bg-accent"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 text-xs gap-1.5 border-border/70 hover:bg-accent"
          >
            {downloaded ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Download className="h-3.5 w-3.5" />}
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Quick Loan Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {loanPresets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = loanAmount === preset.amount && interestRate === preset.rate && tenureYears === preset.tenure;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-foreground bg-foreground text-background shadow-xs'
                  : 'border-border/60 bg-card hover:border-border hover:bg-accent/40 text-card-foreground'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold">{preset.label}</span>
              </div>
              <p className="text-[11px] opacity-80">
                ₹{(preset.amount / 100000).toFixed(0)}L @ {preset.rate}% ({preset.tenure}Y)
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount Control */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Principal Loan Amount
              </label>
              <span className="text-sm font-bold text-foreground">
                {formatIndianCurrency(loanAmount)}
              </span>
            </div>

            <div className="relative mb-3">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                ₹
              </span>
              <Input
                type="number"
                min="10000"
                max="50000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="pl-8 text-base font-semibold h-11 rounded-xl border-border/70 bg-background"
              />
            </div>

            <Slider
              value={[Math.min(10000000, loanAmount)]}
              min={50000}
              max={10000000}
              step={50000}
              onValueChange={([val]) => setLoanAmount(val)}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>₹50K</span>
              <span>₹50 Lakh</span>
              <span>₹1 Crore</span>
            </div>
          </Card>

          {/* Interest Rate Control */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Interest Rate (% per annum)
              </label>
              <span className="text-sm font-bold text-foreground">
                {interestRate}%
              </span>
            </div>

            <div className="relative mb-3">
              <Input
                type="number"
                min="1"
                max="30"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="pr-8 text-base font-semibold h-11 rounded-xl border-border/70 bg-background"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                %
              </span>
            </div>

            <Slider
              value={[interestRate]}
              min={5}
              max={20}
              step={0.1}
              onValueChange={([val]) => setInterestRate(parseFloat(val.toFixed(1)))}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>5% (Subsidized)</span>
              <span>10% (Standard)</span>
              <span>20% (Personal)</span>
            </div>
          </Card>

          {/* Tenure Control */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Loan Duration
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTenureUnit('years')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    tenureUnit === 'years'
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border/60 text-muted-foreground'
                  }`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => setTenureUnit('months')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    tenureUnit === 'months'
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border/60 text-muted-foreground'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <div className="relative mb-3">
              <Input
                type="number"
                min="1"
                max={tenureUnit === 'years' ? 30 : 360}
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
                className="pr-16 text-base font-semibold h-11 rounded-xl border-border/70 bg-background"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-xs uppercase">
                {tenureUnit}
              </span>
            </div>

            <Slider
              value={[tenureYears]}
              min={1}
              max={tenureUnit === 'years' ? 30 : 360}
              step={1}
              onValueChange={([val]) => setTenureYears(val)}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{tenureUnit === 'years' ? '1 Year' : '12 Months'}</span>
              <span>{tenureUnit === 'years' ? '15 Years' : '180 Months'}</span>
              <span>{tenureUnit === 'years' ? '30 Years' : '360 Months'}</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Key Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main EMI Card */}
          <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Equated Monthly Installment
              </h2>
              <Badge variant="contrast">Monthly</Badge>
            </div>

            {/* Big Highlight Number */}
            <div className="my-5 p-5 rounded-xl border border-border/80 bg-muted/30 text-center">
              <span className="text-xs text-muted-foreground font-medium block mb-1">
                Your Monthly EMI
              </span>
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {formatIndianCurrency(calculation.monthlyEMI)}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-1">
                For {effectiveMonths} months ({tenureYears} {tenureUnit})
              </span>
            </div>

            {/* Visual Ratio Bar: Principal vs Interest */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Principal: {calculation.principalPercent}%</span>
                <span>Interest: {calculation.interestPercent}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden flex">
                <div 
                  className="h-full bg-foreground transition-all duration-300"
                  style={{ width: `${calculation.principalPercent}%` }} 
                />
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${calculation.interestPercent}%` }} 
                />
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="space-y-2.5 text-xs border-t border-border/40 pt-3">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Principal Loan Amount</span>
                <span className="font-semibold text-foreground">
                  {formatIndianCurrency(loanAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Total Interest Payable</span>
                <span className="font-semibold text-primary">
                  +{formatIndianCurrency(calculation.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between py-2 pt-2 font-extrabold text-sm text-foreground">
                <span>Total Amount Payable</span>
                <span>{formatIndianCurrency(calculation.totalPayment)}</span>
              </div>
            </div>
          </Card>

          {/* Quick Prepayment Insight */}
          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground text-xs space-y-2.5">
            <h3 className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Smart Repayment Tip</span>
            </h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Paying just <strong>₹2,000 extra</strong> every month reduces your tenure by several years and saves tens of thousands in compounded interest charges.
            </p>
          </Card>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="mt-10">
        <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Loan Amortization Schedule
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Principal and interest breakdown across each period
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-muted/40 border border-border/50 flex">
                <button
                  type="button"
                  onClick={() => setScheduleView('yearly')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    scheduleView === 'yearly'
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleView('monthly')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    scheduleView === 'monthly'
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="h-8 text-xs gap-1 border-border/60"
              >
                <Download className="h-3 w-3" />
                <span>CSV</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">{scheduleView === 'yearly' ? 'Year' : 'Month'}</th>
                  <th className="py-2.5 px-3 text-right">Principal Paid</th>
                  <th className="py-2.5 px-3 text-right">Interest Paid</th>
                  <th className="py-2.5 px-3 text-right">Total Payment</th>
                  <th className="py-2.5 px-3 text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {scheduleView === 'yearly' ? (
                  calculation.yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-accent/30 transition-colors">
                      <td className="py-2 px-3 font-sans font-medium text-foreground">Year {row.year}</td>
                      <td className="py-2 px-3 text-right text-foreground">{formatIndianCurrency(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-primary">{formatIndianCurrency(row.interest)}</td>
                      <td className="py-2 px-3 text-right text-foreground">{formatIndianCurrency(row.totalPayment)}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">{formatIndianCurrency(row.balance)}</td>
                    </tr>
                  ))
                ) : (
                  (showFullSchedule ? calculation.monthlySchedule : calculation.monthlySchedule.slice(0, 12)).map((row) => (
                    <tr key={row.period} className="hover:bg-accent/30 transition-colors">
                      <td className="py-2 px-3 font-sans font-medium text-foreground">Month {row.period}</td>
                      <td className="py-2 px-3 text-right text-foreground">{formatIndianCurrency(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-primary">{formatIndianCurrency(row.interest)}</td>
                      <td className="py-2 px-3 text-right text-foreground">{formatIndianCurrency(row.emi)}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">{formatIndianCurrency(row.balance)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {scheduleView === 'monthly' && calculation.monthlySchedule.length > 12 && (
            <div className="mt-4 pt-3 border-t border-border/40 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="h-8 text-xs gap-1"
              >
                {showFullSchedule ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>Show First 12 Months Only</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span>Show All {calculation.monthlySchedule.length} Months</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
