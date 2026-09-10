'use client';

import { useState, useEffect, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatIndianCurrency } from '@/lib/formatters';
import { 
  Calculator, 
  Copy, 
  Check, 
  Download, 
  ArrowRightLeft, 
  ReceiptText, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export default function GSTCalculator() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGSTRate] = useState(18);
  const [customRate, setCustomRate] = useState('');
  const [calculationType, setCalculationType] = useState('exclusive'); // 'exclusive' | 'inclusive'
  const [supplyType, setSupplyType] = useState('intra'); // 'intra' (CGST+SGST) | 'inter' (IGST)
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const standardRates = [0, 3, 5, 12, 18, 28];
  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const activeRate = customRate !== '' ? parseFloat(customRate) || 0 : gstRate;
  const numAmount = Math.max(0, parseFloat(amount) || 0);

  // Core GST math
  const rateFraction = activeRate / 100;
  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (calculationType === 'exclusive') {
    baseAmount = numAmount;
    gstAmount = baseAmount * rateFraction;
    totalAmount = baseAmount + gstAmount;
  } else {
    totalAmount = numAmount;
    baseAmount = totalAmount / (1 + rateFraction);
    gstAmount = totalAmount - baseAmount;
  }

  const cgst = supplyType === 'intra' ? gstAmount / 2 : 0;
  const sgst = supplyType === 'intra' ? gstAmount / 2 : 0;
  const igst = supplyType === 'inter' ? gstAmount : 0;

  const taxPercentageOfTotal = totalAmount > 0 ? ((gstAmount / totalAmount) * 100).toFixed(1) : 0;
  const basePercentageOfTotal = totalAmount > 0 ? ((baseAmount / totalAmount) * 100).toFixed(1) : 100;

  const handleCopy = () => {
    const summaryText = `GST INVOICE BREAKDOWN (Anantastra)
Calculation: ${calculationType === 'exclusive' ? 'Add GST (Exclusive)' : 'Extract GST (Inclusive)'}
Supply Type: ${supplyType === 'intra' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
----------------------------------------
Taxable Base Amount : ${formatIndianCurrency(baseAmount)}
GST Rate Applied    : ${activeRate}%
${supplyType === 'intra' 
  ? `CGST (${activeRate / 2}%)         : ${formatIndianCurrency(cgst)}\nSGST (${activeRate / 2}%)         : ${formatIndianCurrency(sgst)}` 
  : `IGST (${activeRate}%)          : ${formatIndianCurrency(igst)}`}
Total GST Amount    : ${formatIndianCurrency(gstAmount)}
----------------------------------------
Final Invoice Total : ${formatIndianCurrency(totalAmount)}
`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const summaryText = `GST INVOICE BREAKDOWN - ANANTASTRA
Generated: ${new Date().toLocaleString('en-IN')}
Calculation Mode: ${calculationType === 'exclusive' ? 'GST Exclusive (Added to Base)' : 'GST Inclusive (Extracted from Total)'}
Supply Type: ${supplyType === 'intra' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}

Taxable Base Amount: ${formatIndianCurrency(baseAmount)}
GST Rate: ${activeRate}%
${supplyType === 'intra' 
  ? `Central GST (CGST ${activeRate / 2}%): ${formatIndianCurrency(cgst)}\nState GST (SGST ${activeRate / 2}%): ${formatIndianCurrency(sgst)}` 
  : `Integrated GST (IGST ${activeRate}%): ${formatIndianCurrency(igst)}`}
Total GST Payable: ${formatIndianCurrency(gstAmount)}

Final Gross Total: ${formatIndianCurrency(totalAmount)}

100% Client-Side Engine • Anantastra Open-Source Utilities
`;
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gst-calculation-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <Calculator className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Financial Tool</Badge>
            <Badge variant="subtle">India GST 2025</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            GST Calculator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Calculate and reverse-engineer Goods & Services Tax with instant CGST, SGST, and IGST breakdowns
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
            onClick={handleDownload}
            className="h-8 text-xs gap-1.5 border-border/70 hover:bg-accent"
          >
            {downloaded ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Download className="h-3.5 w-3.5" />}
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Calculation Mode
              </label>
              <span className="text-xs text-muted-foreground">
                {calculationType === 'exclusive' ? 'Base + GST = Total' : 'Total includes GST'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border/50">
              <button
                type="button"
                onClick={() => setCalculationType('exclusive')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  calculationType === 'exclusive'
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                GST Exclusive (Add GST)
              </button>
              <button
                type="button"
                onClick={() => setCalculationType('inclusive')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  calculationType === 'inclusive'
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                GST Inclusive (Extract Tax)
              </button>
            </div>

            {/* Supply Type (Intra vs Inter state) */}
            <div className="mt-4 pt-4 border-t border-border/40">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground">Supply Jurisdiction</label>
                <span className="text-[11px] text-muted-foreground">
                  {supplyType === 'intra' ? 'Same State (CGST + SGST)' : 'Inter-State (IGST)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSupplyType('intra')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    supplyType === 'intra'
                      ? 'border-foreground bg-foreground/10 text-foreground font-semibold'
                      : 'border-border/60 text-muted-foreground hover:border-border'
                  }`}
                >
                  Intra-State (CGST + SGST)
                </button>
                <button
                  type="button"
                  onClick={() => setSupplyType('inter')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    supplyType === 'inter'
                      ? 'border-foreground bg-foreground/10 text-foreground font-semibold'
                      : 'border-border/60 text-muted-foreground hover:border-border'
                  }`}
                >
                  Inter-State (IGST)
                </button>
              </div>
            </div>
          </Card>

          {/* Amount Input & Preset Chips */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {calculationType === 'exclusive' ? 'Net Taxable Amount (₹)' : 'Gross Total Amount (₹)'}
              </label>
              <span className="text-xs font-semibold text-foreground">
                {formatIndianCurrency(numAmount)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                ₹
              </span>
              <Input
                type="number"
                min="0"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-base font-semibold h-11 rounded-xl border-border/70 bg-background"
                placeholder="Enter amount..."
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {quickAmounts.map((qVal) => (
                <button
                  key={qVal}
                  type="button"
                  onClick={() => setAmount(qVal)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    numAmount === qVal
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  ₹{qVal >= 100000 ? `${qVal / 100000}L` : `${qVal / 1000}K`}
                </button>
              ))}
            </div>
          </Card>

          {/* GST Rate Selection */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                GST Slab / Rate (%)
              </label>
              <Badge variant="outline" className="font-mono text-xs">
                Active: {activeRate}%
              </Badge>
            </div>

            {/* Standard Slab Buttons */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {standardRates.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setGSTRate(rate);
                    setCustomRate('');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    customRate === '' && gstRate === rate
                      ? 'border-foreground bg-foreground text-background shadow-xs'
                      : 'border-border/60 bg-muted/20 text-foreground hover:border-border hover:bg-muted/40'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>

            {/* Custom Rate Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              <span className="text-xs text-muted-foreground shrink-0">Custom Rate:</span>
              <div className="relative flex-1">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Enter custom % (e.g. 7.5)"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="h-8.5 text-xs rounded-lg border-border/70 pr-7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                  %
                </span>
              </div>
              {customRate !== '' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomRate('')}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Invoice Receipt & Visual Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Result Card */}
          <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Tax Breakdown
                </h2>
              </div>
              <Badge variant="subtle">{activeRate}% Rate</Badge>
            </div>

            {/* Big Total Box */}
            <div className="my-5 p-4 rounded-xl border border-border/80 bg-muted/30">
              <span className="text-xs text-muted-foreground font-medium block mb-1">
                {calculationType === 'exclusive' ? 'Final Invoice Payable' : 'Total Amount (Tax Included)'}
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {formatIndianCurrency(totalAmount)}
              </span>
            </div>

            {/* Visual Ratio Bar */}
            <div className="mb-5 space-y-1.5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Net Value: {basePercentageOfTotal}%</span>
                <span>Tax: {taxPercentageOfTotal}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden flex">
                <div 
                  className="h-full bg-foreground transition-all duration-300"
                  style={{ width: `${basePercentageOfTotal}%` }} 
                />
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${taxPercentageOfTotal}%` }} 
                />
              </div>
            </div>

            {/* Detailed Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Taxable Value (Base)</span>
                <span className="font-semibold text-foreground">
                  {formatIndianCurrency(baseAmount)}
                </span>
              </div>

              {supplyType === 'intra' ? (
                <>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">
                      Central Tax (CGST {activeRate / 2}%)
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatIndianCurrency(cgst)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">
                      State Tax (SGST {activeRate / 2}%)
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatIndianCurrency(sgst)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">
                    Integrated Tax (IGST {activeRate}%)
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatIndianCurrency(igst)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="font-medium text-foreground">Total GST Levy</span>
                <span className="font-bold text-foreground">
                  +{formatIndianCurrency(gstAmount)}
                </span>
              </div>

              <div className="flex justify-between py-2 pt-3 font-extrabold text-sm text-foreground">
                <span>Total Amount</span>
                <span>{formatIndianCurrency(totalAmount)}</span>
              </div>
            </div>
          </Card>

          {/* Quick GST Reference Card */}
          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground text-xs space-y-3">
            <h3 className="font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Standard Slabs Reference</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                <span className="font-bold text-foreground block">5% Slab</span>
                Edible oil, tea, sugar, spices
              </div>
              <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                <span className="font-bold text-foreground block">12% Slab</span>
                Processed food, apparel &gt; ₹1K
              </div>
              <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                <span className="font-bold text-foreground block">18% Slab</span>
                IT, telecom, consumer goods
              </div>
              <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                <span className="font-bold text-foreground block">28% Slab</span>
                Automobiles, air conditioners
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}