'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/formatters';

export default function IncomeTaxCalculator() {
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState(1000000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState('new');
  const [taxDetails, setTaxDetails] = useState(null);

  // Tax calculation function
  const calculateTax = () => {
    let taxableIncome = Math.max(0, income - (regime === 'old' ? deductions : 0));
    let tax = 0;
    let slabDetails = [];
    let cess = 0;
    let surcharge = 0;
    
    // Tax slabs for old regime (AY 2023-24)
    if (regime === 'old') {
      const oldRegimeSlabs = getOldRegimeSlabs(age);
      
      for (const slab of oldRegimeSlabs) {
        const slabIncome = Math.min(Math.max(0, taxableIncome - slab.start), slab.end - slab.start);
        if (slabIncome > 0) {
          const slabTax = slabIncome * (slab.rate / 100);
          tax += slabTax;
          slabDetails.push({
            slab: `${formatIndianCurrency(slab.start)} to ${formatIndianCurrency(slab.end)}`,
            rate: slab.rate,
            amount: slabIncome,
            tax: slabTax
          });
        }
      }
    } 
    // Tax slabs for new regime (AY 2023-24)
    else {
      const newRegimeSlabs = getNewRegimeSlabs();
      
      for (const slab of newRegimeSlabs) {
        const slabIncome = Math.min(Math.max(0, taxableIncome - slab.start), slab.end - slab.start);
        if (slabIncome > 0) {
          const slabTax = slabIncome * (slab.rate / 100);
          tax += slabTax;
          slabDetails.push({
            slab: `${formatIndianCurrency(slab.start)} to ${formatIndianCurrency(slab.end)}`,
            rate: slab.rate,
            amount: slabIncome,
            tax: slabTax
          });
        }
      }
    }
    
    // Calculate surcharge
    if (taxableIncome > 50000000) {
      surcharge = tax * 0.37;  // 37% surcharge for income > 5 crore
    } else if (taxableIncome > 20000000) {
      surcharge = tax * 0.25;  // 25% surcharge for income > 2 crore
    } else if (taxableIncome > 10000000) {
      surcharge = tax * 0.15;  // 15% surcharge for income > 1 crore
    } else if (taxableIncome > 5000000) {
      surcharge = tax * 0.10;  // 10% surcharge for income > 50 lakh
    }
    
    // Calculate education cess (4%)
    cess = (tax + surcharge) * 0.04;
    
    const totalTax = tax + surcharge + cess;
    
    setTaxDetails({
      grossIncome: income,
      deductions: regime === 'old' ? deductions : 0,
      taxableIncome,
      slabwiseTax: slabDetails,
      basicTax: tax,
      surcharge,
      cess,
      totalTax,
      effectiveRate: (totalTax / income) * 100
    });
  };
  
  // Get old regime tax slabs based on age
  const getOldRegimeSlabs = (age) => {
    if (age >= 80) {
      // Super Senior Citizens (80 years and above)
      return [
        { start: 0, end: 500000, rate: 0 },
        { start: 500000, end: 1000000, rate: 20 },
        { start: 1000000, end: Infinity, rate: 30 }
      ];
    } else if (age >= 60) {
      // Senior Citizens (60 years and above)
      return [
        { start: 0, end: 300000, rate: 0 },
        { start: 300000, end: 500000, rate: 5 },
        { start: 500000, end: 1000000, rate: 20 },
        { start: 1000000, end: Infinity, rate: 30 }
      ];
    } else {
      // Regular individuals (below 60 years)
      return [
        { start: 0, end: 250000, rate: 0 },
        { start: 250000, end: 500000, rate: 5 },
        { start: 500000, end: 1000000, rate: 20 },
        { start: 1000000, end: Infinity, rate: 30 }
      ];
    }
  };
  
  // Get new regime tax slabs (same for all age groups)
  const getNewRegimeSlabs = () => {
    return [
      { start: 0, end: 300000, rate: 0 },
      { start: 300000, end: 600000, rate: 5 },
      { start: 600000, end: 900000, rate: 10 },
      { start: 900000, end: 1200000, rate: 15 },
      { start: 1200000, end: 1500000, rate: 20 },
      { start: 1500000, end: Infinity, rate: 30 }
    ];
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Indian Income Tax Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Input Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Age
              </label>
              <Input
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Gross Annual Income (₹)
              </label>
              <Input
                type="number"
                min="0"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatIndianCurrency(income)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Deductions (Section 80C, 80D, etc.)
              </label>
              <Input
                type="number"
                min="0"
                max="250000"
                value={deductions}
                onChange={(e) => setDeductions(Math.min(250000, Number(e.target.value)))}
                disabled={regime === 'new'}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {regime === 'new' ? 'Not applicable in New Tax Regime' : formatIndianCurrency(deductions)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tax Regime
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={regime === 'old'}
                    onChange={() => setRegime('old')}
                    className="mr-2"
                  />
                  <span>Old Regime</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={regime === 'new'}
                    onChange={() => setRegime('new')}
                    className="mr-2"
                  />
                  <span>New Regime</span>
                </label>
              </div>
            </div>
            
            <Button 
              onClick={calculateTax}
              className="w-full"
            >
              Calculate Tax
            </Button>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Tax Calculation Results</h2>
          
          {taxDetails ? (
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Gross Annual Income:</span>
                <span className="font-semibold">{formatIndianCurrency(taxDetails.grossIncome)}</span>
              </div>
              
              {regime === 'old' && (
                <div className="flex justify-between py-2 border-b">
                  <span>Total Deductions:</span>
                  <span className="font-semibold text-green-600">{formatIndianCurrency(taxDetails.deductions)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b">
                <span>Taxable Income:</span>
                <span className="font-semibold">{formatIndianCurrency(taxDetails.taxableIncome)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>Basic Tax:</span>
                <span className="font-semibold">{formatIndianCurrency(taxDetails.basicTax)}</span>
              </div>
              
              {taxDetails.surcharge > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Surcharge:</span>
                  <span className="font-semibold">{formatIndianCurrency(taxDetails.surcharge)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b">
                <span>Health & Education Cess (4%):</span>
                <span className="font-semibold">{formatIndianCurrency(taxDetails.cess)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b bg-blue-50 dark:bg-blue-900/20 rounded px-2">
                <span className="font-bold">Total Tax Payable:</span>
                <span className="font-bold text-lg">{formatIndianCurrency(taxDetails.totalTax)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span>Effective Tax Rate:</span>
                <span className="font-semibold">{taxDetails.effectiveRate.toFixed(2)}%</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Enter your details and click "Calculate Tax" to see the results
            </div>
          )}
        </div>
      </div>
      
      {/* Slab-wise Breakdown */}
      {taxDetails && taxDetails.slabwiseTax.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Slab-wise Tax Breakdown</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2">Income Slab</th>
                  <th className="px-4 py-2">Rate</th>
                  <th className="px-4 py-2">Amount in Slab</th>
                  <th className="px-4 py-2">Tax</th>
                </tr>
              </thead>
              <tbody>
                {taxDetails.slabwiseTax.map((slab, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{slab.slab}</td>
                    <td className="px-4 py-2 text-center">{slab.rate}%</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(slab.amount)}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(slab.tax)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td colSpan="3" className="px-4 py-2 font-semibold text-right">Total Basic Tax:</td>
                  <td className="px-4 py-2 font-semibold text-right">{formatIndianCurrency(taxDetails.basicTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Information Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About Income Tax Calculation in India</h2>
        <p className="mb-4">
          Income tax in India is calculated based on the tax slabs set by the government. There are two tax regimes to choose from:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-lg font-medium mt-4 mb-2">Old Tax Regime</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Allows various deductions and exemptions under Chapter VI-A</li>
              <li>Section 80C deductions up to ₹1,50,000</li>
              <li>Health Insurance Premium (80D)</li>
              <li>Housing Loan Interest</li>
              <li>Standard Deduction for salaried individuals</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mt-4 mb-2">New Tax Regime</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Introduced to simplify tax calculation</li>
              <li>Lower tax rates for most slabs</li>
              <li>No deductions or exemptions available</li>
              <li>More beneficial for those with fewer investments</li>
              <li>Default option from FY 2023-24</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md mt-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Note: This calculator provides estimates based on the FY 2023-24 tax rules. Actual tax liability may vary. Always consult with a tax professional for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}