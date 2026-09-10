'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeftRight, 
  Coins, 
  RefreshCw, 
  Copy, 
  Check, 
  TrendingUp, 
  Globe2, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

// Default baseline rates relative to 1 USD
const DEFAULT_RATES = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1, flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92, flag: '🇪🇺' },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 86.85, flag: '🇮🇳' },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.79, flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 153.4, flag: '🇯🇵' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.38, flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.54, flag: '🇦🇺' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.89, flag: '🇨🇭' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.33, flag: '🇸🇬' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67, flag: '🇦🇪' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 7.23, flag: '🇨🇳' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 5.80, flag: '🇧🇷' },
  SAR: { name: 'Saudi Riyal', symbol: '﷼', rate: 3.75, flag: '🇸🇦' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.68, flag: '🇳🇿' },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 1410.0, flag: '🇰🇷' },
  RUB: { name: 'Russian Ruble', symbol: '₽', rate: 96.50, flag: '🇷🇺' }
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Standard Mid-Market Baseline');
  const [copied, setCopied] = useState(false);

  // Fetch live exchange rates on mount
  const fetchLiveRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data && data.rates) {
        setRates(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(code => {
            if (data.rates[code]) {
              updated[code] = { ...updated[code], rate: data.rates[code] };
            }
          });
          return updated;
        });
        setIsLive(true);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      // Gracefully retain baseline rates
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const numAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numAmount) && numAmount >= 0;

  // Compute exchange
  const conversion = useMemo(() => {
    if (!isValidAmount || !rates[fromCurr] || !rates[toCurr]) return null;

    const fromRateToUSD = rates[fromCurr].rate;
    const toRateToUSD = rates[toCurr].rate;

    // Direct exchange rate: 1 From = X To
    const exchangeRate = toRateToUSD / fromRateToUSD;
    const inverseRate = fromRateToUSD / toRateToUSD;
    const convertedAmount = numAmount * exchangeRate;

    return {
      convertedAmount,
      exchangeRate,
      inverseRate
    };
  }, [numAmount, fromCurr, toCurr, rates, isValidAmount]);

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  const handleCopy = () => {
    if (!conversion) return;
    const text = `${amount} ${fromCurr} = ${conversion.convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurr} (1 ${fromCurr} = ${conversion.exchangeRate.toFixed(4)} ${toCurr})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const popularPairs = [
    { from: 'USD', to: 'INR' },
    { from: 'EUR', to: 'USD' },
    { from: 'GBP', to: 'USD' },
    { from: 'USD', to: 'AED' },
    { from: 'USD', to: 'CAD' },
    { from: 'USD', to: 'JPY' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'SAR' },
  ];

  const amountPresets = [10, 50, 100, 500, 1000, 5000];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Coins className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Real-Time Forex Calculator
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Currency Converter
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Convert world currencies with live interbank exchange rates, instant multi-currency matrix, and zero hidden markups.
        </p>
      </div>

      {/* Popular Pair Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="text-xs font-medium text-muted-foreground mr-1">Popular Pairs:</span>
        {popularPairs.map((pair, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setFromCurr(pair.from);
              setToCurr(pair.to);
            }}
            className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-colors ${
              fromCurr === pair.from && toCurr === pair.to
                ? 'bg-primary text-primary-foreground border-primary font-bold'
                : 'bg-muted/40 hover:bg-muted border-border/60 text-foreground'
            }`}
          >
            {pair.from} / {pair.to}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Converter Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="curr-amount" className="text-sm font-semibold text-foreground">
                Amount to Convert
              </label>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{isLive ? `Live (${lastUpdated})` : 'Mid-Market Baseline'}</span>
                <button
                  type="button"
                  onClick={fetchLiveRates}
                  disabled={loading}
                  title="Refresh Rates"
                  className="p-1 hover:text-foreground transition-colors ml-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <Input
              id="curr-amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="font-mono text-xl py-6"
            />

            {/* Amount Presets */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {amountPresets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p.toString())}
                  className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-colors ${
                    amount === p.toString()
                      ? 'bg-primary text-primary-foreground border-primary font-semibold'
                      : 'bg-muted/30 hover:bg-muted border-border/60 text-foreground'
                  }`}
                >
                  {rates[fromCurr]?.symbol}{p.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Currency Selectors & Swap */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Currency */}
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="from-curr-select" className="text-xs font-medium text-muted-foreground">
                  From
                </label>
                <select
                  id="from-curr-select"
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(rates).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.flag} {code} - {item.name} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="rounded-full h-10 w-10 shrink-0"
                  title="Swap Currencies"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="to-curr-select" className="text-xs font-medium text-muted-foreground">
                  To
                </label>
                <select
                  id="to-curr-select"
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(rates).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.flag} {code} - {item.name} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate Banner */}
            {conversion && (
              <div className="mt-6 p-4 rounded-xl border border-border/60 bg-muted/30 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Exchange Rate: </span>
                  <span className="font-mono font-bold text-foreground">
                    1 {fromCurr} = {conversion.exchangeRate.toFixed(4)} {toCurr}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Inverse: </span>
                  <span className="font-mono font-medium text-foreground">
                    1 {toCurr} = {conversion.inverseRate.toFixed(4)} {fromCurr}
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!conversion}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied Details' : 'Copy Conversion'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Output & Multi-Currency Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4">
              Conversion Result
            </h2>

            {conversion ? (
              <div className="space-y-4">
                {/* Large Result Box */}
                <div className="p-5 rounded-2xl border border-border/70 bg-card">
                  <div className="text-xs text-muted-foreground font-mono">
                    {rates[fromCurr]?.flag} {Number(amount).toLocaleString()} {fromCurr} =
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary font-mono tracking-tight mt-1.5 break-all">
                    {rates[toCurr]?.symbol}{conversion.convertedAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 font-medium">
                    {toCurr} • {rates[toCurr]?.name}
                  </div>
                </div>

                {/* Multi-Currency Matrix */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                    <span className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-primary" />
                      Live World Currency Matrix
                    </span>
                    <span className="text-muted-foreground font-mono">{rates[fromCurr]?.symbol}{amount}</span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {Object.entries(rates)
                      .filter(([code]) => code !== fromCurr)
                      .slice(0, 8)
                      .map(([code, item]) => {
                        const targetAmt = (numAmount / rates[fromCurr].rate) * item.rate;
                        return (
                          <div
                            key={code}
                            onClick={() => setToCurr(code)}
                            className="flex items-center justify-between p-2 rounded-lg border border-border/40 hover:bg-muted/30 cursor-pointer transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base leading-none">{item.flag}</span>
                              <span className="font-mono font-semibold text-foreground">{code}</span>
                              <span className="text-muted-foreground truncate max-w-[100px]">{item.name}</span>
                            </div>
                            <span className="font-mono font-bold text-foreground">
                              {item.symbol}{targetAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                Please enter a valid numeric amount.
              </div>
            )}
          </Card>

          {/* Guarantee */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pure mid-market exchange rates without markup spreads or hidden bank fees.</span>
          </div>
        </div>
      </div>

      {/* Forex Info Guide */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Understanding Real-Time Foreign Exchange
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Mid-Market Rate</h3>
            <p className="text-xs text-muted-foreground">
              The midpoint between the global buy (bid) and sell (ask) prices on wholesale currency markets.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Bank Spread & Markups</h3>
            <p className="text-xs text-muted-foreground">
              Retail banks and money transfer services typically add hidden markups of 2% to 4% above the mid-market rate.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Direct vs Indirect Quotes</h3>
            <p className="text-xs text-muted-foreground">
              A direct quote expresses how much foreign currency 1 unit of local currency buys (or vice-versa).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}