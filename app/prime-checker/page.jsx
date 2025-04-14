"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PrimeNumberChecker() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [primeFactors, setPrimeFactors] = useState([]);
  const [nearestPrimes, setNearestPrimes] = useState({ before: null, after: null });

  const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    
    return true;
  };

  const findPrimeFactors = (num) => {
    const factors = [];
    let n = num;
    
    // Check for divisibility by 2
    while (n % 2 === 0) {
      factors.push(2);
      n /= 2;
    }
    
    // Check for divisibility by odd numbers starting from 3
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      while (n % i === 0) {
        factors.push(i);
        n /= i;
      }
    }
    
    // If n is a prime number greater than 2
    if (n > 2) {
      factors.push(n);
    }
    
    return factors;
  };

  const findNearestPrimes = (num) => {
    const before = findPrevPrime(num);
    const after = findNextPrime(num);
    
    return { before, after };
  };

  const findPrevPrime = (num) => {
    if (num <= 2) return null;
    
    for (let i = num - 1; i >= 2; i--) {
      if (isPrime(i)) return i;
    }
    
    return null;
  };

  const findNextPrime = (num) => {
    let nextNum = num + 1;
    
    while (true) {
      if (isPrime(nextNum)) return nextNum;
      nextNum++;
    }
  };

  const checkNumber = () => {
    const num = parseInt(number);
    
    if (isNaN(num)) {
      setResult("Please enter a valid number");
      setPrimeFactors([]);
      setNearestPrimes({ before: null, after: null });
      return;
    }
    
    const prime = isPrime(num);
    setResult(prime ? `${num} is a prime number!` : `${num} is not a prime number.`);
    
    if (!prime && num > 1) {
      // Find prime factors
      setPrimeFactors(findPrimeFactors(num));
    } else {
      setPrimeFactors([]);
    }
    
    // Find nearest primes
    setNearestPrimes(findNearestPrimes(num));
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Prime Number Checker</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="number">
              Enter a number to check
            </label>
            <div className="flex gap-4">
              <Input
                id="number"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a positive integer"
                min="1"
                step="1"
                className="flex-1"
              />
              <Button onClick={checkNumber}>Check</Button>
            </div>
          </div>
          
          {result && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${result.includes('is a prime') ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'}`}>
                <p className="text-xl font-semibold">{result}</p>
              </div>
              
              {primeFactors.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Prime factorization:</h3>
                  <div className="flex flex-wrap gap-2">
                    {primeFactors.map((factor, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                        {factor}
                        {index < primeFactors.length - 1 && " ×"}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-full text-sm"> = {number}</span>
                  </div>
                </div>
              )}
              
              {(nearestPrimes.before || nearestPrimes.after) && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Nearest prime numbers:</h3>
                  <div className="flex flex-wrap gap-4">
                    {nearestPrimes.before !== null && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Previous prime:</span>
                        <span className="ml-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full font-medium">
                          {nearestPrimes.before}
                        </span>
                      </div>
                    )}
                    {nearestPrimes.after !== null && (
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Next prime:</span>
                        <span className="ml-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full font-medium">
                          {nearestPrimes.after}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">What is a Prime Number?</h2>
        <p className="mb-4">
          A prime number is a natural number greater than 1 that cannot be formed by multiplying two smaller natural numbers.
          In other words, a prime number is only divisible by 1 and itself.
        </p>
        <h3 className="text-lg font-semibold mb-2">Examples:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>2 is the smallest prime number</li>
          <li>3, 5, 7, 11, 13, 17, 19, 23, 29, 31... are all prime numbers</li>
          <li>4 is not a prime number because it's divisible by 2 (4 = 2 × 2)</li>
        </ul>
        <h3 className="text-lg font-semibold mb-2">Interesting Facts:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>There are infinitely many prime numbers</li>
          <li>Every even integer greater than 2 can be expressed as the sum of two primes (Goldbach's Conjecture)</li>
          <li>Prime numbers are used in cryptography to secure internet communications</li>
        </ul>
      </div>
    </div>
  );
}