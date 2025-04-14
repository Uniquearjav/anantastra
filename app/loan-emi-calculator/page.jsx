"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(5);
  const [emi, setEMI] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const calculateEMI = () => {
    // Convert interest rate from annual percentage to monthly decimal
    const monthlyRate = interestRate / (12 * 100);
    
    // Convert loan term from years to months
    const termInMonths = loanTerm * 12;
    
    // Calculate EMI using formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiValue = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termInMonths) 
                  / (Math.pow(1 + monthlyRate, termInMonths) - 1);
    
    // Calculate total payment and total interest
    const totalPaymentValue = emiValue * termInMonths;
    const totalInterestValue = totalPaymentValue - loanAmount;
    
    // Generate amortization schedule
    const schedule = [];
    let remainingPrincipal = loanAmount;
    
    for (let month = 1; month <= termInMonths; month++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = emiValue - interestPayment;
      remainingPrincipal -= principalPayment;
      
      schedule.push({
        month,
        emi: emiValue.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        remainingPrincipal: remainingPrincipal > 0 ? remainingPrincipal.toFixed(2) : 0
      });
    }
    
    setEMI(emiValue);
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalInterestValue);
    setAmortizationSchedule(schedule);
    setShowResults(true);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Loan EMI Calculator</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="loanAmount">
              Loan Amount
            </label>
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              min="1"
              step="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="interestRate">
              Interest Rate (% per year)
            </label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min="0.1"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="loanTerm">
              Loan Term (years)
            </label>
            <Input
              id="loanTerm"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              min="1"
              max="30"
              step="1"
            />
          </div>
          
          <Button onClick={calculateEMI} className="w-full">
            Calculate EMI
          </Button>
        </div>
      </div>
      
      {showResults && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Loan Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</p>
                <p className="text-2xl font-bold">{formatCurrency(emi)}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPayment)}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Interest</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Amortization Schedule</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">EMI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Principal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {amortizationSchedule.slice(0, 12).map((row) => (
                    <tr key={row.month}>
                      <td className="px-4 py-2">{row.month}</td>
                      <td className="px-4 py-2">{formatCurrency(row.emi)}</td>
                      <td className="px-4 py-2">{formatCurrency(row.principalPayment)}</td>
                      <td className="px-4 py-2">{formatCurrency(row.interestPayment)}</td>
                      <td className="px-4 py-2">{formatCurrency(row.remainingPrincipal)}</td>
                    </tr>
                  ))}
                  {amortizationSchedule.length > 12 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-center text-sm text-gray-500">
                        Showing first 12 months of {amortizationSchedule.length} months
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About EMI Calculation</h2>
        <p className="mb-4">
          EMI (Equated Monthly Installment) is the fixed payment amount made by a borrower to a lender at a specified date each month. EMIs are used to pay off both the interest and principal each month so that over a specified number of years, the loan is fully paid off along with interest.
        </p>
        <p>
          The formula used for EMI calculation is: <br />
          <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
          </code>
        </p>
        <p className="mt-2">
          Where:<br />
          P = Principal loan amount<br />
          r = Monthly interest rate (annual interest rate / 12 / 100)<br />
          n = Total number of monthly payments (loan term in years × 12)
        </p>
      </div>
    </div>
  );
}