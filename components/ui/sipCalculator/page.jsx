'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';

// Dynamically import chart component with no SSR to avoid hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [result, setResult] = useState({
    totalInvestment: 0,
    totalReturns: 0,
    totalAmount: 0,
    monthlyBreakup: []
  });
  
  // Format number as Indian rupee (e.g., 1,00,000 instead of 100,000)
  const formatIndianRupee = (num) => {
    if (num === 0) return '₹0';
    
    const value = num.toString();
    let lastThree = value.substring(value.length - 3);
    let otherNumbers = value.substring(0, value.length - 3);
    
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    
    let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return '₹' + result;
  };

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
      labels: ['Your Investment', 'Est. Returns'],
      colors: ['#4299e1', '#48bb78'],
      legend: {
        position: 'bottom',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">SIP Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Input Parameters</h2>
          
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
                  {formatIndianRupee(monthlyInvestment)}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Results</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span>Total Invested Amount:</span>
              <span className="font-semibold">{formatIndianRupee(Math.round(result.totalInvestment))}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span>Estimated Returns:</span>
              <span className="font-semibold text-green-600">{formatIndianRupee(Math.round(result.totalReturns))}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span>Total Value:</span>
              <span className="font-semibold">{formatIndianRupee(Math.round(result.totalAmount))}</span>
            </div>
            
            {/* Pie Chart */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Investment Breakup</h3>
              {typeof window !== 'undefined' && (
                <Chart
                  options={pieChartData.options}
                  series={pieChartData.series}
                  type="pie"
                  height="300"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* SIP Breakup Table */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">SIP Breakup Year-wise</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Invested Amount</th>
                <th className="px-4 py-2">Est. Returns</th>
                <th className="px-4 py-2">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {result.monthlyBreakup.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-center">{item.month / 12}</td>
                  <td className="px-4 py-2 text-center">{formatIndianRupee(Math.round(item.investment))}</td>
                  <td className="px-4 py-2 text-center text-green-600">{formatIndianRupee(Math.round(item.returns))}</td>
                  <td className="px-4 py-2 text-center">{formatIndianRupee(Math.round(item.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Information Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">What is a SIP Calculator?</h2>
        <p className="mb-4">
          A Systematic Investment Plan (SIP) calculator helps you estimate the returns on your regular investments in mutual funds over a period of time.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">How does this calculator work?</h3>
        <p className="mb-4">
          This calculator uses the compound interest formula to calculate the future value of your SIP investments. 
          The formula used is: P × (((1 + r)^n - 1) × (1 + r)) ÷ r, where:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>P = Monthly investment amount</li>
          <li>r = Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
          <li>n = Total number of payments (investment period in years × 12)</li>
        </ul>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md mt-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Note: The values shown are estimates based on the provided expected return rate. Actual returns may vary 
            depending on market conditions and fund performance.
          </p>
        </div>
      </div>
    </div>
  );
}