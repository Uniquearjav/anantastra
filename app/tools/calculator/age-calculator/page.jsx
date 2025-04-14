"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [result, setResult] = useState(null);

  // Set the default "to date" as today when the component mounts
  useState(() => {
    const today = new Date();
    const formattedDate = formatDateForInput(today);
    setToDate(formattedDate);
  }, []);

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function calculateAge() {
    if (!birthDate) {
      return;
    }

    const birthDateObj = new Date(birthDate);
    const toDateObj = toDate ? new Date(toDate) : new Date();

    // Validate dates
    if (birthDateObj > toDateObj) {
      setResult({ error: "Birth date cannot be in the future" });
      return;
    }

    // Calculate difference in milliseconds
    const diffMs = toDateObj - birthDateObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, days
    let years = toDateObj.getFullYear() - birthDateObj.getFullYear();
    let months = toDateObj.getMonth() - birthDateObj.getMonth();
    let days = toDateObj.getDate() - birthDateObj.getDate();

    // Adjust if days or months are negative
    if (days < 0) {
      // Get last month's total days
      const lastMonth = new Date(toDateObj.getFullYear(), toDateObj.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    // Calculate weeks
    const weeks = Math.floor(diffDays / 7);
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor(diffMs / 1000);

    setResult({
      years,
      months,
      days,
      totalDays: diffDays,
      weeks,
      hours,
      minutes,
      seconds,
    });
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Age Calculator</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="birthDate">
              Birth Date
            </label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full"
              max={toDate}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="toDate">
              To Date (defaults to today)
            </label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button onClick={calculateAge} className="w-full">Calculate Age</Button>
          
          {result && result.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {result.error}
            </div>
          )}
          
          {result && !result.error && (
            <div className="mt-6">
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h3 className="font-bold text-xl mb-4 text-center">Age Calculation Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Exact Age</h4>
                    <p className="text-lg font-semibold">
                      {result.years} years, {result.months} months, {result.days} days
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Total Days</h4>
                    <p className="text-lg font-semibold">{result.totalDays.toLocaleString()} days</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Total Weeks</h4>
                    <p className="text-lg font-semibold">{result.weeks.toLocaleString()} weeks</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Total Hours</h4>
                    <p className="text-lg font-semibold">{result.hours.toLocaleString()} hours</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Total Minutes</h4>
                    <p className="text-lg font-semibold">{result.minutes.toLocaleString()} minutes</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Total Seconds</h4>
                    <p className="text-lg font-semibold">{result.seconds.toLocaleString()} seconds</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About Age Calculation</h2>
        <p className="mb-4">
          The age calculator determines the difference between two dates, typically a birth date and the current date.
          It provides a precise calculation of years, months, and days, as well as total days, weeks, hours, minutes, and seconds.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Common Uses:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Determining exact age for official documents</li>
          <li>Calculating time between any two historical dates</li>
          <li>Planning events based on time intervals</li>
          <li>Tracking age-specific developmental milestones</li>
        </ul>
      </div>
    </div>
  );
}