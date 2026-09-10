'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ui/theme-provider';
import dynamic from 'next/dynamic';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/formatters';

// Dynamically import chart component with no SSR to avoid hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SIPCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [result, setResult] = useState({
    totalInvestment: 0,
    totalReturns: 0,
    totalAmount: 0,
    monthlyBreakup: []
  });

  // Calculate SIP returns
  const calculateSIP = () => {
    const p = parseFloat(monthlyInvestment);
    const r = parseFloat(expectedReturnRate) / 100 / 12; // Monthly interest rate
    const n = parseInt(years) * 12; // Total months

    // Formula for SIP calculation: P * ((1 + r)^n - 1) * (1 + r) / r
    const amount = p * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    const investment = p * n;
    const returns = amount - investment;

    // Generate monthly breakup
    const monthlyBreakup = [];
    let runningInvestment = 0;
    let runningAmount = 0;

    for (let i = 1; i <= n; i++) {
      runningInvestment += p;
      // Monthly amount = Previous amount + new investment + returns on total
      runningAmount = (runningAmount + p) * (1 + r);

      if (i % 12 === 0 || i === n) {
        monthlyBreakup.push({
          month: i,
          investment: runningInvestment,
          returns: runningAmount - runningInvestment,
          amount: runningAmount
        });
      }
    }

    setResult({
      totalInvestment: investment,
      totalReturns: returns,
      totalAmount: amount,
      monthlyBreakup: monthlyBreakup
    });
  };

  // Calculate SIP on mount and when input values change
  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, years, expectedReturnRate]);

  // Prepare chart data
  const pieChartData = {
    series: [result.totalInvestment, result.totalReturns],
    options: {
      chart: {
        background: 'transparent',
      },
      theme: {
        mode: isDark ? 'dark' : 'light',
      },
      labels: ['Your Investment', 'Est. Returns'],
      colors: ['#6366f1', '#10b981'],
      legend: {
        position: 'bottom',
        labels: {
          colors: isDark ? '#cbd5e1' : '#475569',
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 280
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        y: {
          formatter: (value) => formatIndianCurrency(value)
        }
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">SIP Calculator</h1>
        <p className="text-muted-foreground text-sm mt-1">Estimate wealth creation through Systematic Investment Plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Input Parameters</h2>

          <div className="space-y-6">
            {/* Monthly Investment Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Investment (₹)
              </label>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  min="500"
                  max="100000"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Math.max(500, Math.min(100000, Number(e.target.value))))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-24">
                  {formatIndianCurrency(monthlyInvestment)}
                </span>
              </div>
              <Slider
                value={[monthlyInvestment]}
                min={500}
                max={100000}
                step={500}
                onValueChange={(value) => setMonthlyInvestment(value[0])}
                className="mt-2"
              />
            </div>

            {/* Time Period Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Period (Years)
              </label>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Math.min(30, Number(e.target.value))))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-24">
                  {years} Years
                </span>
              </div>
              <Slider
                value={[years]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setYears(value[0])}
                className="mt-2"
              />
            </div>

            {/* Expected Return Rate Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Return Rate (%)
              </label>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Math.max(1, Math.min(30, Number(e.target.value))))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-24">
                  {expectedReturnRate}%
                </span>
              </div>
              <Slider
                value={[expectedReturnRate]}
                min={1}
                max={30}
                step={0.5}
                onValueChange={(value) => setExpectedReturnRate(value[0])}
                className="mt-2"
              />
            </div>

            <Button
              onClick={calculateSIP}
              className="w-full"
            >
              Calculate
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Results</h2>

          <div className="space-y-4">
            <div className="flex justify-between py-2.5 border-b border-border/50 text-sm">
              <span className="text-muted-foreground">Total Invested Amount:</span>
              <span className="font-semibold text-foreground">{formatIndianCurrency(Math.round(result.totalInvestment))}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-border/50 text-sm">
              <span className="text-muted-foreground">Estimated Returns:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatIndianCurrency(Math.round(result.totalReturns))}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-border/50 text-sm">
              <span className="text-muted-foreground">Total Expected Value:</span>
              <span className="font-bold text-primary text-base">{formatIndianCurrency(Math.round(result.totalAmount))}</span>
            </div>

            {/* Pie Chart */}
            <div className="mt-8 pt-4 border-t border-border/40">
              <h3 className="text-sm font-semibold text-foreground mb-4">Investment Breakup</h3>
              {typeof window !== 'undefined' && (
                <Chart
                  options={pieChartData.options}
                  series={pieChartData.series}
                  type="pie"
                  height="280"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIP Breakup Table */}
      <div className="mt-10 rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm p-6">
        <h2 className="text-lg font-bold text-foreground mb-6">SIP Breakup Year-wise</h2>

        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Invested Amount</th>
                <th className="px-4 py-3 text-right">Est. Returns</th>
                <th className="px-4 py-3 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {result.monthlyBreakup.map((item, index) => (
                <tr key={index} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 text-left font-medium">{item.month / 12}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatIndianCurrency(Math.round(item.investment))}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">{formatIndianCurrency(Math.round(item.returns))}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{formatIndianCurrency(Math.round(item.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground shadow-xs p-6">
        <h2 className="text-lg font-bold text-foreground mb-3">What is a SIP Calculator?</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          A Systematic Investment Plan (SIP) calculator helps you estimate the returns on your regular investments in mutual funds over a period of time.
        </p>

        <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">How does this calculator work?</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
          This calculator uses the compound interest formula to calculate the future value of your SIP investments:
        </p>
        <div className="p-3 rounded-xl bg-muted/40 font-mono text-xs text-foreground mb-4">
          P × (((1 + r)^n - 1) × (1 + r)) ÷ r
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 mb-4 ml-4 list-disc">
          <li><strong>P</strong> = Monthly investment amount</li>
          <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
          <li><strong>n</strong> = Total number of payments (investment period in years × 12)</li>
        </ul>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
          <strong>Note:</strong> Values shown are estimates based on the expected return rate. Actual returns depend on market performance.
        </div>
      </div>
    </div>
  );
}