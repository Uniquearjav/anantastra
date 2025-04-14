"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LeapYearChecker() {
  const [year, setYear] = useState("");
  const [result, setResult] = useState(null);
  const [nextLeapYear, setNextLeapYear] = useState(null);
  const [previousLeapYear, setPreviousLeapYear] = useState(null);
  const [leapYearsInCentury, setLeapYearsInCentury] = useState([]);

  const isLeapYear = (y) => {
    // Leap year is divisible by 4
    // But century years must be divisible by 400 to be leap years
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  };

  const checkYear = () => {
    const inputYear = parseInt(year);
    
    if (isNaN(inputYear)) {
      setResult("Please enter a valid year");
      setNextLeapYear(null);
      setPreviousLeapYear(null);
      setLeapYearsInCentury([]);
      return;
    }
    
    // Check if it's a leap year
    const leap = isLeapYear(inputYear);
    setResult(leap ? `${inputYear} is a leap year!` : `${inputYear} is not a leap year.`);
    
    // Find next leap year
    let next = inputYear;
    while (!isLeapYear(++next));
    setNextLeapYear(next);
    
    // Find previous leap year
    let prev = inputYear;
    while (prev > 0 && !isLeapYear(--prev));
    setPreviousLeapYear(prev > 0 ? prev : null);
    
    // Get leap years in the same century
    const centuryStart = Math.floor(inputYear / 100) * 100;
    const centuryEnd = centuryStart + 99;
    const leapYears = [];
    
    for (let i = centuryStart; i <= centuryEnd; i++) {
      if (isLeapYear(i)) {
        leapYears.push(i);
      }
    }
    
    setLeapYearsInCentury(leapYears);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Leap Year Checker</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="year">
              Enter a Year
            </label>
            <div className="flex gap-4">
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter year (e.g., 2024)"
                className="flex-1"
              />
              <Button onClick={checkYear}>Check</Button>
            </div>
          </div>
          
          {result && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${result.includes("is a leap year") ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"}`}>
                <p className="text-xl font-semibold">{result}</p>
                
                {nextLeapYear && (
                  <div className="mt-4">
                    <p className="font-medium">Next leap year: {nextLeapYear}</p>
                    {previousLeapYear && (
                      <p className="font-medium">Previous leap year: {previousLeapYear}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {leapYearsInCentury.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Leap Years in This Century:</h3>
              <div className="flex flex-wrap gap-2">
                {leapYearsInCentury.map((y) => (
                  <span
                    key={y}
                    className={`px-2 py-1 text-sm rounded-md ${
                      parseInt(year) === y
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 dark:bg-gray-600"
                    }`}
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">What is a Leap Year?</h2>
        <p className="mb-4">
          A leap year is a calendar year that contains an additional day, making it 366 days long 
          instead of the usual 365 days. This additional day is added to February, making it 29 days long.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Leap Year Rules:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>A year is a leap year if it is divisible by 4</li>
          <li>However, if the year is divisible by 100, it is NOT a leap year, unless...</li>
          <li>The year is also divisible by 400, then it is a leap year</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-2">Examples:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>2024 is a leap year (divisible by 4)</li>
          <li>2100 is not a leap year (divisible by 100 but not by 400)</li>
          <li>2000 was a leap year (divisible by 400)</li>
          <li>2023 was not a leap year (not divisible by 4)</li>
        </ul>
        
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <p className="font-medium">Why do we need leap years?</p>
          <p className="mt-1">
            A complete orbit of Earth around the Sun takes approximately 365.2422 days.
            To keep our calendar aligned with the seasons, we add an extra day every 4 years,
            with exceptions for century years as noted above.
          </p>
        </div>
      </div>
    </div>
  );
}