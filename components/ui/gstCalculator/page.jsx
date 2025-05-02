'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatIndianCurrency } from '@/lib/formatters';

export default function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGSTRate] = useState(18);
  const [calculationType, setCalculationType] = useState('exclusive');
  const [results, setResults] = useState(null);
  
  const gstRates = [0, 3, 5, 12, 18, 28];
  
  useEffect(() => {
    calculateGST();
  }, [amount, gstRate, calculationType]);
  
  const calculateGST = () => {
    if (!amount || amount <= 0) {
      setResults(null);
      return;
    }
    
    const rate = gstRate / 100;
    let baseAmount, gstAmount, totalAmount;
    
    if (calculationType === 'exclusive') {
      // GST Exclusive calculation (Base + GST = Total)
      baseAmount = parseFloat(amount);
      gstAmount = baseAmount * rate;
      totalAmount = baseAmount + gstAmount;
    } else {
      // GST Inclusive calculation (Total includes GST already)
      totalAmount = parseFloat(amount);
      baseAmount = totalAmount / (1 + rate);
      gstAmount = totalAmount - baseAmount;
    }
    
    // For CGST and SGST (split GST into Central and State components)
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    
    setResults({
      baseAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst
    });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">GST Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Input Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Calculation Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 rounded-md cursor-pointer border ${
                  calculationType === 'exclusive' 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  <input
                    type="radio"
                    name="calculationType"
                    value="exclusive"
                    checked={calculationType === 'exclusive'}
                    onChange={() => setCalculationType('exclusive')}
                    className="sr-only"
                  />
                  <span>Add GST to Amount</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-md cursor-pointer border ${
                  calculationType === 'inclusive' 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  <input
                    type="radio"
                    name="calculationType"
                    value="inclusive"
                    checked={calculationType === 'inclusive'}
                    onChange={() => setCalculationType('inclusive')}
                    className="sr-only"
                  />
                  <span>Extract GST from Amount</span>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {calculationType === 'exclusive' 
                  ? "Calculate GST on top of the given amount" 
                  : "Extract GST from an amount that already includes GST"}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {calculationType === 'exclusive' ? 'Base Amount (₹)' : 'Total Amount with GST (₹)'}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                GST Rate (%)
              </label>
              <div className="space-y-2">
                <div className="flex justify-between">
                  {gstRates.map(rate => (
                    <button
                      key={rate}
                      onClick={() => setGSTRate(rate)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        gstRate === rate 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={gstRate}
                    onChange={(e) => setGSTRate(parseFloat(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={calculateGST}
              className="w-full"
            >
              Calculate GST
            </Button>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">GST Calculation Results</h2>
          
          {results ? (
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Base Amount:</span>
                <span className="font-semibold">{formatIndianCurrency(results.baseAmount)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>CGST ({gstRate/2}%):</span>
                <span className="font-semibold text-blue-600">{formatIndianCurrency(results.cgst)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>SGST ({gstRate/2}%):</span>
                <span className="font-semibold text-green-600">{formatIndianCurrency(results.sgst)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>Total GST ({gstRate}%):</span>
                <span className="font-semibold text-purple-600">{formatIndianCurrency(results.gstAmount)}</span>
              </div>
              
              <div className="flex justify-between py-2 bg-blue-50 dark:bg-blue-900/20 rounded px-2">
                <span className="font-bold">Final Amount:</span>
                <span className="font-bold text-lg">{formatIndianCurrency(results.totalAmount)}</span>
              </div>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="font-medium mb-2">GST Invoice Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>{formatIndianCurrency(results.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST ({gstRate/2}%):</span>
                    <span>{formatIndianCurrency(results.cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST ({gstRate/2}%):</span>
                    <span>{formatIndianCurrency(results.sgst)}</span>
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>{formatIndianCurrency(results.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Enter an amount and GST rate to see the results
            </div>
          )}
        </div>
      </div>
      
      {/* Information Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About GST in India</h2>
        <p className="mb-4">
          Goods and Services Tax (GST) was introduced in India on July 1, 2017, replacing multiple cascading taxes levied by the central and state governments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-lg font-medium mt-4 mb-2">GST Rates</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>0%</strong>: Essential items (milk, fresh vegetables, etc.)</li>
              <li><strong>5%</strong>: Basic necessities (sugar, tea, spices, etc.)</li>
              <li><strong>12%</strong>: Standard goods and services</li>
              <li><strong>18%</strong>: Standard rate for most goods and services</li>
              <li><strong>28%</strong>: Luxury items and sin goods</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mt-4 mb-2">GST Components</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>CGST</strong>: Central GST collected by the Central Government</li>
              <li><strong>SGST</strong>: State GST collected by the State Government</li>
              <li><strong>IGST</strong>: Integrated GST on inter-state supplies</li>
              <li><strong>UTGST</strong>: Union Territory GST for union territories</li>
              <li><strong>Cess</strong>: Additional tax on certain luxury and sin goods</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md mt-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Note: This calculator provides the basic GST calculation. For intra-state transactions, GST is split equally between CGST and SGST. For inter-state transactions, the full amount is charged as IGST.
          </p>
        </div>
      </div>
    </div>
  );
}