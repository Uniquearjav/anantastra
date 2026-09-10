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
  TrendingDown, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [isSalaried, setIsSalaried] = useState(true);
  const [ageCategory, setAgeCategory] = useState('below60'); // 'below60' | 'senior' | 'superSenior'
  
  // Deductions for Old Regime
  const [sec80C, setSec80C] = useState(150000); // Max 1.5L
  const [sec80D, setSec80D] = useState(25000);  // Health insurance
  const [hra, setHra] = useState(50000);        // House rent
  const [homeLoanInterest, setHomeLoanInterest] = useState(0); // Sec 24(b) Max 2L
  const [nps80CCD, setNps80CCD] = useState(0);  // NPS up to 50k
  
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const presetIncomes = [500000, 750000, 1000000, 1250000, 1500000, 2500000];

  // Standard deductions
  const stdDeductionNew = isSalaried ? 75000 : 0; // Budget 2024 increased to 75,000
  const stdDeductionOld = isSalaried ? 50000 : 0;

  // Compute Old Regime
  const oldCalculation = useMemo(() => {
    const capped80C = Math.min(150000, sec80C);
    const capped80D = Math.min(ageCategory === 'below60' ? 25000 : 50000, sec80D);
    const cappedHomeLoan = Math.min(200000, homeLoanInterest);
    const cappedNps = Math.min(50000, nps80CCD);
    
    const totalDeductions = stdDeductionOld + capped80C + capped80D + hra + cappedHomeLoan + cappedNps;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    // Exemption limit by age
    let exemptionLimit = 250000;
    if (ageCategory === 'senior') exemptionLimit = 300000;
    if (ageCategory === 'superSenior') exemptionLimit = 500000;

    let baseTax = 0;
    if (taxableIncome > exemptionLimit) {
      if (ageCategory === 'superSenior') {
        if (taxableIncome > 1000000) {
          baseTax = (500000 * 0.20) + ((taxableIncome - 1000000) * 0.30);
        } else {
          baseTax = (taxableIncome - 500000) * 0.20;
        }
      } else if (ageCategory === 'senior') {
        if (taxableIncome > 1000000) {
          baseTax = (200000 * 0.05) + (500000 * 0.20) + ((taxableIncome - 1000000) * 0.30);
        } else if (taxableIncome > 500000) {
          baseTax = (200000 * 0.05) + ((taxableIncome - 500000) * 0.20);
        } else {
          baseTax = (taxableIncome - 300000) * 0.05;
        }
      } else {
        // Below 60
        if (taxableIncome > 1000000) {
          baseTax = (250000 * 0.05) + (500000 * 0.20) + ((taxableIncome - 1000000) * 0.30);
        } else if (taxableIncome > 500000) {
          baseTax = (250000 * 0.05) + ((taxableIncome - 500000) * 0.20);
        } else {
          baseTax = (taxableIncome - 250000) * 0.05;
        }
      }
    }

    // Section 87A rebate for Old Regime (income <= 5 Lakhs pays 0 tax)
    let rebate87A = 0;
    if (taxableIncome <= 500000) {
      rebate87A = baseTax;
      baseTax = 0;
    }

    // Surcharge
    let surcharge = 0;
    if (taxableIncome > 50000000) surcharge = baseTax * 0.37;
    else if (taxableIncome > 20000000) surcharge = baseTax * 0.25;
    else if (taxableIncome > 10000000) surcharge = baseTax * 0.15;
    else if (taxableIncome > 5000000) surcharge = baseTax * 0.10;

    const cess = (baseTax + surcharge) * 0.04;
    const totalTax = baseTax + surcharge + cess;

    return {
      taxableIncome,
      totalDeductions,
      baseTax,
      rebate87A,
      cess,
      totalTax: Math.round(totalTax),
      effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(1) : 0
    };
  }, [grossIncome, stdDeductionOld, sec80C, sec80D, hra, homeLoanInterest, nps80CCD, ageCategory]);

  // Compute New Regime (FY 2024-25 / FY 2025-26 Budget Slabs)
  const newCalculation = useMemo(() => {
    const taxableIncome = Math.max(0, grossIncome - stdDeductionNew);
    let baseTax = 0;

    // Slabs:
    // 0 - 3L: 0%
    // 3L - 7L: 5%
    // 7L - 10L: 10%
    // 10L - 12L: 15%
    // 12L - 15L: 20%
    // Above 15L: 30%
    if (taxableIncome > 1500000) {
      baseTax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + (300000 * 0.20) + ((taxableIncome - 1500000) * 0.30);
    } else if (taxableIncome > 1200000) {
      baseTax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + ((taxableIncome - 1200000) * 0.20);
    } else if (taxableIncome > 1000000) {
      baseTax = (400000 * 0.05) + (300000 * 0.10) + ((taxableIncome - 1000000) * 0.15);
    } else if (taxableIncome > 700000) {
      baseTax = (400000 * 0.05) + ((taxableIncome - 700000) * 0.10);
    } else if (taxableIncome > 300000) {
      baseTax = (taxableIncome - 300000) * 0.05;
    }

    // Section 87A rebate for New Regime: Up to 7 Lakhs taxable income => ₹0 tax!
    let rebate87A = 0;
    if (taxableIncome <= 700000) {
      rebate87A = baseTax;
      baseTax = 0;
    }

    // Surcharge (Capped at 25% under New Regime)
    let surcharge = 0;
    if (taxableIncome > 20000000) surcharge = baseTax * 0.25;
    else if (taxableIncome > 10000000) surcharge = baseTax * 0.15;
    else if (taxableIncome > 5000000) surcharge = baseTax * 0.10;

    const cess = (baseTax + surcharge) * 0.04;
    const totalTax = baseTax + surcharge + cess;

    return {
      taxableIncome,
      standardDeduction: stdDeductionNew,
      baseTax,
      rebate87A,
      cess,
      totalTax: Math.round(totalTax),
      effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(1) : 0
    };
  }, [grossIncome, stdDeductionNew]);

  // Comparison metrics
  const taxDifference = Math.abs(oldCalculation.totalTax - newCalculation.totalTax);
  const recommendedRegime = newCalculation.totalTax <= oldCalculation.totalTax ? 'new' : 'old';

  const handleCopy = () => {
    const summary = `INCOME TAX COMPARISON - ANANTASTRA (FY 2024-25 / 2025-26)
Gross Annual Income: ${formatIndianCurrency(grossIncome)}
Employment Type   : ${isSalaried ? 'Salaried' : 'Self-Employed / Business'}
------------------------------------------------------
NEW REGIME (Sec 115BAC)
Taxable Income    : ${formatIndianCurrency(newCalculation.taxableIncome)}
Standard Deduction: ${formatIndianCurrency(newCalculation.standardDeduction)}
Total Tax Payable : ${formatIndianCurrency(newCalculation.totalTax)} (Effective: ${newCalculation.effectiveRate}%)

OLD REGIME
Total Deductions  : ${formatIndianCurrency(oldCalculation.totalDeductions)}
Taxable Income    : ${formatIndianCurrency(oldCalculation.taxableIncome)}
Total Tax Payable : ${formatIndianCurrency(oldCalculation.totalTax)} (Effective: ${oldCalculation.effectiveRate}%)
------------------------------------------------------
RECOMMENDATION    : ${recommendedRegime === 'new' ? 'New Tax Regime saves you more' : 'Old Tax Regime saves you more'}
NET SAVINGS       : ${formatIndianCurrency(taxDifference)}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const report = `INCOME TAX COMPUTATION SHEET (FY 2024-25)
Generated via Anantastra Open-Source Utilities (${new Date().toLocaleDateString('en-IN')})

1. INCOME PROFILE
Gross Income: ${formatIndianCurrency(grossIncome)}
Status: ${isSalaried ? 'Salaried Employee' : 'Self-Employed'}
Age Bracket: ${ageCategory === 'below60' ? '< 60 Years' : ageCategory === 'senior' ? 'Senior (60-79)' : 'Super Senior (80+)'}

2. NEW REGIME BREAKDOWN
Gross Income: ${formatIndianCurrency(grossIncome)}
Less Standard Deduction: -${formatIndianCurrency(newCalculation.standardDeduction)}
Net Taxable Income: ${formatIndianCurrency(newCalculation.taxableIncome)}
Income Tax Payable: ${formatIndianCurrency(newCalculation.totalTax)}

3. OLD REGIME BREAKDOWN
Gross Income: ${formatIndianCurrency(grossIncome)}
Standard Deduction: -${formatIndianCurrency(stdDeductionOld)}
Section 80C: -${formatIndianCurrency(sec80C)}
Section 80D: -${formatIndianCurrency(sec80D)}
HRA Exemption: -${formatIndianCurrency(hra)}
Home Loan Interest (Sec 24b): -${formatIndianCurrency(homeLoanInterest)}
NPS (80CCD): -${formatIndianCurrency(nps80CCD)}
Total Deductions: -${formatIndianCurrency(oldCalculation.totalDeductions)}
Net Taxable Income: ${formatIndianCurrency(oldCalculation.taxableIncome)}
Income Tax Payable: ${formatIndianCurrency(oldCalculation.totalTax)}

4. VERDICT
Recommended Choice: ${recommendedRegime.toUpperCase()} REGIME
You save ${formatIndianCurrency(taxDifference)} with the ${recommendedRegime === 'new' ? 'New' : 'Old'} Regime.
`;
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-computation-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
            <Badge variant="contrast">FY 2024-25 & 2025-26</Badge>
            <Badge variant="subtle">Budget 2024 Updated</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Income Tax Calculator & Comparator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Compare New Regime vs. Old Regime side-by-side with standard deductions and 87A rebate rules
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
            <span>{copied ? 'Copied' : 'Copy Breakdown'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-8 text-xs gap-1.5 border-border/70 hover:bg-accent"
          >
            {downloaded ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Download className="h-3.5 w-3.5" />}
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Side-by-Side Winner Banner */}
      <div className={`mb-8 p-4 sm:p-5 rounded-2xl border transition-all ${
        recommendedRegime === 'new' 
          ? 'border-emerald-500/40 bg-emerald-500/10 text-foreground' 
          : 'border-blue-500/40 bg-blue-500/10 text-foreground'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`p-2.5 rounded-xl font-bold text-sm ${
              recommendedRegime === 'new' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              <TrendingDown className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {recommendedRegime === 'new' ? 'New Tax Regime is Better' : 'Old Tax Regime is Better'}
                </h3>
                <Badge variant="contrast" className="text-[10px]">
                  Saves {formatIndianCurrency(taxDifference)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {recommendedRegime === 'new'
                  ? `You save ${formatIndianCurrency(taxDifference)} per year with lower tax rates and the ₹75,000 standard deduction.`
                  : `Your deductions of ${formatIndianCurrency(oldCalculation.totalDeductions)} make the Old Regime save you ${formatIndianCurrency(taxDifference)}.`}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-muted-foreground block">Net Difference</span>
            <span className="text-xl font-black text-foreground">
              {formatIndianCurrency(taxDifference)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs & Deductions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Income & Employment Card */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              1. Income & Profile
            </h2>

            {/* Gross Annual Income */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground">
                  Gross Annual Income
                </label>
                <span className="text-sm font-bold text-foreground">
                  {formatIndianCurrency(grossIncome)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                  ₹
                </span>
                <Input
                  type="number"
                  min="0"
                  step="25000"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="pl-8 text-base font-semibold h-11 rounded-xl border-border/70"
                />
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {presetIncomes.map((pVal) => (
                  <button
                    key={pVal}
                    type="button"
                    onClick={() => setGrossIncome(pVal)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      grossIncome === pVal
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ₹{pVal >= 100000 ? `${pVal / 100000}L` : `${pVal / 1000}K`}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Status & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Employment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSalaried(true)}
                    className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all ${
                      isSalaried
                        ? 'border-foreground bg-foreground text-background font-semibold'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    }`}
                  >
                    Salaried
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSalaried(false)}
                    className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all ${
                      !isSalaried
                        ? 'border-foreground bg-foreground text-background font-semibold'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    }`}
                  >
                    Self-Employed
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Age Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAgeCategory('below60')}
                    className={`py-2 px-1 text-[11px] rounded-lg border font-medium transition-all ${
                      ageCategory === 'below60'
                        ? 'border-foreground bg-foreground text-background font-semibold'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    }`}
                  >
                    &lt; 60 Yrs
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgeCategory('senior')}
                    className={`py-2 px-1 text-[11px] rounded-lg border font-medium transition-all ${
                      ageCategory === 'senior'
                        ? 'border-foreground bg-foreground text-background font-semibold'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    }`}
                  >
                    60-79 Yrs
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgeCategory('superSenior')}
                    className={`py-2 px-1 text-[11px] rounded-lg border font-medium transition-all ${
                      ageCategory === 'superSenior'
                        ? 'border-foreground bg-foreground text-background font-semibold'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    }`}
                  >
                    80+ Yrs
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Deductions & Exemptions for Old Regime */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Old Regime Deductions
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Investments and exemptions (applies to Old Tax Regime only)
                </p>
              </div>
              <Badge variant="subtle" className="text-xs">
                Total: {formatIndianCurrency(oldCalculation.totalDeductions)}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Section 80C */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Section 80C (EPF, PPF, ELSS, Insurance)
                  </span>
                  <span className="font-semibold text-foreground">{formatIndianCurrency(sec80C)}</span>
                </div>
                <Slider
                  value={[sec80C]}
                  min={0}
                  max={150000}
                  step={5000}
                  onValueChange={([val]) => setSec80C(val)}
                />
                <span className="text-[10px] text-muted-foreground block text-right">Max ₹1,50,000</span>
              </div>

              {/* Section 80D */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Section 80D (Health Insurance Premium)
                  </span>
                  <span className="font-semibold text-foreground">{formatIndianCurrency(sec80D)}</span>
                </div>
                <Slider
                  value={[sec80D]}
                  min={0}
                  max={ageCategory === 'below60' ? 25000 : 50000}
                  step={2500}
                  onValueChange={([val]) => setSec80D(val)}
                />
              </div>

              {/* HRA Exemption */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    HRA / Rent Paid Exemption
                  </span>
                  <span className="font-semibold text-foreground">{formatIndianCurrency(hra)}</span>
                </div>
                <Slider
                  value={[hra]}
                  min={0}
                  max={500000}
                  step={10000}
                  onValueChange={([val]) => setHra(val)}
                />
              </div>

              {/* Home Loan Interest Sec 24b */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Home Loan Interest (Section 24b)
                  </span>
                  <span className="font-semibold text-foreground">{formatIndianCurrency(homeLoanInterest)}</span>
                </div>
                <Slider
                  value={[homeLoanInterest]}
                  min={0}
                  max={200000}
                  step={5000}
                  onValueChange={([val]) => setHomeLoanInterest(val)}
                />
                <span className="text-[10px] text-muted-foreground block text-right">Max ₹2,00,000</span>
              </div>

              {/* NPS 80CCD(1B) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    National Pension System NPS (80CCD 1B)
                  </span>
                  <span className="font-semibold text-foreground">{formatIndianCurrency(nps80CCD)}</span>
                </div>
                <Slider
                  value={[nps80CCD]}
                  min={0}
                  max={50000}
                  step={5000}
                  onValueChange={([val]) => setNps80CCD(val)}
                />
                <span className="text-[10px] text-muted-foreground block text-right">Max ₹50,000</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Comparison Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* New Regime Card */}
          <Card className={`p-5 border text-card-foreground transition-all ${
            recommendedRegime === 'new' 
              ? 'border-emerald-500/60 bg-card shadow-sm ring-2 ring-emerald-500/20' 
              : 'border-border/60 bg-card/60'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm text-foreground">New Tax Regime</h3>
              </div>
              {recommendedRegime === 'new' && (
                <Badge variant="contrast" className="bg-emerald-600 text-white text-[10px]">
                  Recommended
                </Badge>
              )}
            </div>

            <div className="my-4">
              <span className="text-[11px] text-muted-foreground block">Total Tax Liability</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {formatIndianCurrency(newCalculation.totalTax)}
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                Effective Tax Rate: <strong className="text-foreground">{newCalculation.effectiveRate}%</strong>
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-border/40 pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Gross Income</span>
                <span className="text-foreground">{formatIndianCurrency(grossIncome)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Standard Deduction</span>
                <span className="text-foreground">-{formatIndianCurrency(newCalculation.standardDeduction)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxable Income</span>
                <span className="font-medium text-foreground">{formatIndianCurrency(newCalculation.taxableIncome)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Health & Education Cess (4%)</span>
                <span className="text-foreground">+{formatIndianCurrency(newCalculation.cess)}</span>
              </div>
            </div>
          </Card>

          {/* Old Regime Card */}
          <Card className={`p-5 border text-card-foreground transition-all ${
            recommendedRegime === 'old' 
              ? 'border-blue-500/60 bg-card shadow-sm ring-2 ring-blue-500/20' 
              : 'border-border/60 bg-card/60'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="font-bold text-sm text-foreground">Old Tax Regime</h3>
              </div>
              {recommendedRegime === 'old' && (
                <Badge variant="contrast" className="bg-blue-600 text-white text-[10px]">
                  Recommended
                </Badge>
              )}
            </div>

            <div className="my-4">
              <span className="text-[11px] text-muted-foreground block">Total Tax Liability</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {formatIndianCurrency(oldCalculation.totalTax)}
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                Effective Tax Rate: <strong className="text-foreground">{oldCalculation.effectiveRate}%</strong>
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-border/40 pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Gross Income</span>
                <span className="text-foreground">{formatIndianCurrency(grossIncome)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Total Deductions</span>
                <span className="text-foreground">-{formatIndianCurrency(oldCalculation.totalDeductions)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxable Income</span>
                <span className="font-medium text-foreground">{formatIndianCurrency(oldCalculation.taxableIncome)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Health & Education Cess (4%)</span>
                <span className="text-foreground">+{formatIndianCurrency(oldCalculation.cess)}</span>
              </div>
            </div>
          </Card>

          {/* Quick Tax Rules Guide */}
          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground text-xs space-y-2.5">
            <h4 className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Budget 2024 Key Changes</span>
            </h4>
            <ul className="space-y-1.5 text-muted-foreground text-[11px] list-disc list-inside">
              <li>Standard deduction increased to <strong>₹75,000</strong> under the New Regime.</li>
              <li>Rebate under Section 87A: Income up to <strong>₹7.75 Lakhs</strong> (with std deduction) pays <strong>zero tax</strong> in New Regime.</li>
              <li>Highest surcharge capped at <strong>25%</strong> instead of 37%.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}