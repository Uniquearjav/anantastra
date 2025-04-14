"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FactorialCalculator() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate factorial with steps
  const calculateFactorial = (n) => {
    if (n < 0) {
      throw new Error("Factorial is not defined for negative numbers");
    }
    
    if (n > 170) {
      throw new Error("Number too large (max: 170)");
    }

    let result = 1;
    const steps = [];
    
    if (n === 0 || n === 1) {
      steps.push({ 
        step: n === 0 ? "0! = 1 (by definition)" : "1! = 1", 
        result: 1 
      });
      return { result: 1, steps };
    }
    
    for (let i = 1; i <= n; i++) {
      result *= i;
      steps.push({
        step: i,
        calculation: `${i === 1 ? '1' : steps[i - 2].result} × ${i}`,
        result: result
      });
    }
    
    return { result, steps };
  };

  // Calculate factorial using Stirling's approximation for large numbers
  const calculateStirlingApproximation = (n) => {
    return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
  };

  // Handle the calculation
  const handleCalculate = () => {
    setError("");
    setResult(null);
    setSteps([]);
    
    if (!number.trim()) {
      setError("Please enter a number");
      return;
    }
    
    const n = parseFloat(number.trim());
    
    if (isNaN(n)) {
      setError("Please enter a valid number");
      return;
    }
    
    if (!Number.isInteger(n)) {
      setError("Please enter a whole number");
      return;
    }

    setIsCalculating(true);
    
    // Use setTimeout to avoid blocking the UI for larger calculations
    setTimeout(() => {
      try {
        if (n > 170) {
          // Use Stirling's approximation for very large numbers
          const approximation = calculateStirlingApproximation(n);
          setResult({
            exact: "Too large to calculate exactly",
            approximation: approximation.toExponential(10),
            isApproximation: true
          });
          setSteps([{ 
            step: "Using Stirling's approximation", 
            calculation: "√(2πn) × (n/e)^n", 
            result: approximation.toExponential(10) 
          }]);
        } else {
          const { result, steps } = calculateFactorial(n);
          setResult({ 
            exact: result.toString(), 
            approximation: null, 
            isApproximation: false 
          });
          setSteps(steps);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsCalculating(false);
      }
    }, 0);
  };

  // Format large numbers with thousand separators
  const formatLargeNumber = (num) => {
    if (!num) return "";
    
    // If it's in scientific notation already
    if (num.includes('e')) return num;
    
    // Only format if it's a regular number
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Factorial Calculator</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label htmlFor="number" className="block text-sm font-medium mb-2">
            Enter a Number
          </label>
          <Input
            id="number"
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a non-negative integer (e.g., 5)"
            className="font-mono"
          />
          
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating}
            className="flex-1"
          >
            {isCalculating ? "Calculating..." : "Calculate Factorial"}
          </Button>
          <Button 
            onClick={() => {
              setNumber("");
              setResult(null);
              setSteps([]);
              setError("");
              setShowSteps(false);
            }} 
            variant="outline"
          >
            Reset
          </Button>
        </div>
        
        {result && (
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Result</h2>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-medium mb-1">
                  {number}! = 
                </div>
                <div className="font-mono break-all">
                  {formatLargeNumber(result.exact)}
                </div>
                
                {result.isApproximation && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Stirling's Approximation:
                    </div>
                    <div className="font-mono">
                      {result.approximation}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      (Note: Result is approximate due to large number)
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {steps.length > 0 && (
              <div>
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                >
                  {showSteps ? 'Hide Calculation Steps' : 'Show Calculation Steps'}
                  <svg 
                    className={`ml-1 w-4 h-4 transition-transform ${showSteps ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSteps && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-gray-600">
                          <th className="text-left py-2 px-4">{result.isApproximation ? "Method" : "Step"}</th>
                          <th className="text-left py-2 px-4">Calculation</th>
                          <th className="text-left py-2 px-4">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {steps.map((step, index) => (
                          <tr key={index} className="border-b dark:border-gray-600">
                            <td className="py-2 px-4">{result.isApproximation ? step.step : `${step.step}!`}</td>
                            <td className="py-2 px-4 font-mono">{step.calculation}</td>
                            <td className="py-2 px-4 font-mono">{formatLargeNumber(step.result.toString())}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Educational section about factorials */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Understanding Factorials</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is a Factorial?</h3>
            <p>
              The factorial of a non-negative integer n, denoted as n!, is the product of all positive integers less than or equal to n.
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2 font-mono">
              n! = n × (n-1) × (n-2) × ... × 3 × 2 × 1
            </div>
            <p className="mt-3">
              Special cases:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>0! = 1 (by mathematical definition)</li>
              <li>1! = 1</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Examples</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>2! = 2 × 1 = 2</li>
              <li>3! = 3 × 2 × 1 = 6</li>
              <li>4! = 4 × 3 × 2 × 1 = 24</li>
              <li>5! = 5 × 4 × 3 × 2 × 1 = 120</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Stirling's Approximation</h3>
            <p>
              For large values of n, computing the exact factorial becomes difficult due to the rapid growth. 
              Stirling's formula provides an approximation:
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2 font-mono">
              n! ≈ √(2πn) × (n/e)<sup>n</sup>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              where e is the mathematical constant approximately equal to 2.71828.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Applications of Factorials</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Combinations and Permutations:</strong> Used to calculate the number of ways to arrange or select items.</li>
              <li><strong>Probability Theory:</strong> Essential for calculating various probability distributions.</li>
              <li><strong>Series Expansions:</strong> Used in Taylor series and other mathematical expansions.</li>
              <li><strong>Number Theory:</strong> Important in various number theory problems and formulas.</li>
              <li><strong>Statistical Distributions:</strong> Used in defining distributions like the Poisson distribution.</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
            <h3 className="font-semibold mb-2">Did you know?</h3>
            <p>
              Factorials grow extremely quickly! 20! has 19 digits, 50! has 65 digits, and 100! has 158 digits. 
              The largest factorial that can be represented exactly as a JavaScript number is 170! - beyond that, 
              the precision is lost and approximations must be used.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recursive Definition</h3>
            <p>
              Factorials can be defined recursively as:
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2 font-mono">
              n! = n × (n-1)!<br />
              0! = 1
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This recursive definition is often used in programming implementations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}