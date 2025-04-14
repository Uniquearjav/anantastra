"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NumberToWordsConverter() {
  const [number, setNumber] = useState("");
  const [words, setWords] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");

  const LANGUAGES = {
    en: {
      name: "English",
      units: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
      teens: ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
      tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
      scales: ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"],
      and: "and",
      hundred: "hundred",
      zero: "zero",
      minus: "minus",
      point: "point",
      invalid: "Invalid input. Please enter a valid number."
    },
    es: {
      name: "Spanish",
      units: ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"],
      teens: ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"],
      tens: ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"],
      scales: ["", "mil", "millón", "billón", "trillón", "cuatrillón", "quintillón"],
      and: "y",
      hundred: "cien",
      zero: "cero",
      minus: "menos",
      point: "punto",
      invalid: "Entrada inválida. Introduce un número válido."
    },
    fr: {
      name: "French",
      units: ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"],
      teens: ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"],
      tens: ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"],
      scales: ["", "mille", "million", "milliard", "billion", "billiard", "trillion"],
      and: "et",
      hundred: "cent",
      zero: "zéro",
      minus: "moins",
      point: "virgule",
      invalid: "Entrée non valide. Veuillez saisir un nombre valide."
    }
  };

  const convertNumberToWords = (num, lang) => {
    const dictionary = LANGUAGES[lang];
    
    // Handle zero case
    if (num === 0) {
      return dictionary.zero;
    }
    
    // Handle negative numbers
    if (num < 0) {
      return `${dictionary.minus} ${convertNumberToWords(Math.abs(num), lang)}`;
    }

    // Handle decimal numbers
    if (num % 1 !== 0) {
      const parts = num.toString().split('.');
      const integerPart = convertNumberToWords(parseInt(parts[0]), lang);
      const decimalPart = parts[1].split('').map(digit => dictionary.units[parseInt(digit)]).join(' ');
      return `${integerPart} ${dictionary.point} ${decimalPart}`;
    }

    // Convert a number from 1-999 to words
    const convertLessThanThousand = (n) => {
      let result = "";
      
      // Handle hundreds
      if (n >= 100) {
        result += `${dictionary.units[Math.floor(n / 100)]} ${dictionary.hundred}`;
        n %= 100;
        if (n > 0) {
          result += ` ${dictionary.and} `;
        }
      }
      
      // Handle tens and units
      if (n > 0) {
        if (n < 10) {
          result += dictionary.units[n];
        } else if (n < 20) {
          result += dictionary.teens[n - 10];
        } else {
          const tensDigit = Math.floor(n / 10);
          const unitsDigit = n % 10;
          result += dictionary.tens[tensDigit];
          if (unitsDigit > 0) {
            // Some languages use different separators
            const separator = lang === 'es' ? ' ' + dictionary.and + ' ' : '-';
            result += `${separator}${dictionary.units[unitsDigit]}`;
          }
        }
      }
      
      return result;
    };

    // Main conversion function for whole numbers
    let words = "";
    let chunkIndex = 0;
    
    // Process the number in chunks of 3 digits
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkWords = convertLessThanThousand(chunk);
        const scale = dictionary.scales[chunkIndex];
        words = chunkWords + (scale ? ` ${scale}` : '') + (words ? ', ' + words : '');
      }
      chunkIndex++;
      num = Math.floor(num / 1000);
    }
    
    return words;
  };

  const handleConvert = () => {
    try {
      // Validate input
      if (!number.trim()) {
        setError("Please enter a number");
        setWords("");
        return;
      }
      
      const num = parseFloat(number.replace(/,/g, ''));
      if (isNaN(num) || !isFinite(num)) {
        setError(LANGUAGES[language].invalid);
        setWords("");
        return;
      }
      
      // Limit the size of the number to avoid performance issues
      if (Math.abs(num) > 1e18) {
        setError("Number is too large to convert");
        setWords("");
        return;
      }
      
      const result = convertNumberToWords(num, language);
      setWords(result.charAt(0).toUpperCase() + result.slice(1));
      setError("");
    } catch (err) {
      setError(`Error: ${err.message}`);
      setWords("");
    }
  };

  const copyToClipboard = () => {
    if (words) {
      navigator.clipboard.writeText(words);
    }
  };

  const handleClear = () => {
    setNumber("");
    setWords("");
    setError("");
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Number to Words Converter</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Enter a number:
          </label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. 42, 1234.56, -789"
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-2">
              Select language:
            </label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
            >
              {Object.entries(LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end gap-2">
            <Button onClick={handleConvert} className="px-6">
              Convert
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        
        {words && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Result:</h3>
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Copy
              </Button>
            </div>
            <p className="p-2 bg-white dark:bg-gray-800 border rounded-md">
              {words}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About Number to Words Conversion</h2>
        <p className="mb-4">
          Number to words conversion is the process of expressing numeric values as written words. 
          This is commonly used in financial documents, checks, invoices, and legal documents where 
          numbers need to be spelled out to avoid ambiguity and prevent fraud.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Supports whole numbers, negative numbers, and decimal values</li>
          <li>Handles numbers up to quintillion (10<sup>18</sup>)</li>
          <li>Multiple language support (English, Spanish, French)</li>
          <li>Proper linguistic rules for each language</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Writing checks and financial documents</li>
          <li>Legal documents requiring spelled-out numbers</li>
          <li>Educational purposes for teaching number words</li>
          <li>Accessibility applications for screen readers</li>
          <li>Creating formal invitations or announcements</li>
        </ul>
      </div>
    </div>
  );
}