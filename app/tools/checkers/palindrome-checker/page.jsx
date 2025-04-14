"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PalindromeChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);

  const checkPalindrome = () => {
    if (!text.trim()) {
      setResult(null);
      return;
    }

    let processedText = text;
    
    // Apply filters based on options
    if (ignoreCase) {
      processedText = processedText.toLowerCase();
    }
    
    if (ignoreSpaces) {
      processedText = processedText.replace(/\s+/g, "");
    }
    
    if (ignorePunctuation) {
      processedText = processedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    }

    // Check if the processed text is a palindrome
    const reversed = processedText.split("").reverse().join("");
    const isPalindrome = processedText === reversed;
    
    // Find the longest palindrome substring if not a palindrome
    let longestPalindrome = "";
    if (!isPalindrome && processedText.length > 1) {
      longestPalindrome = findLongestPalindrome(processedText);
    }
    
    setResult({
      isPalindrome,
      processedText,
      reversed,
      longestPalindrome,
    });
  };

  // Function to find the longest palindrome substring
  const findLongestPalindrome = (str) => {
    if (str.length <= 1) return str;
    
    let longest = str[0];
    
    // Check for odd-length palindromes
    for (let i = 0; i < str.length; i++) {
      // Expand around center
      let left = i, right = i;
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        if (right - left + 1 > longest.length) {
          longest = str.substring(left, right + 1);
        }
        left--;
        right++;
      }
    }
    
    // Check for even-length palindromes
    for (let i = 0; i < str.length - 1; i++) {
      // Expand around center
      let left = i, right = i + 1;
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        if (right - left + 1 > longest.length) {
          longest = str.substring(left, right + 1);
        }
        left--;
        right++;
      }
    }
    
    return longest;
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Palindrome Checker</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="text">
              Enter Text
            </label>
            <Input
              id="text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to check"
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={() => setIgnoreCase(!ignoreCase)}
                className="form-checkbox rounded text-primary"
              />
              <span>Ignore Case</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={ignoreSpaces}
                onChange={() => setIgnoreSpaces(!ignoreSpaces)}
                className="form-checkbox rounded text-primary"
              />
              <span>Ignore Spaces</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={ignorePunctuation}
                onChange={() => setIgnorePunctuation(!ignorePunctuation)}
                className="form-checkbox rounded text-primary"
              />
              <span>Ignore Punctuation</span>
            </label>
          </div>
          
          <Button onClick={checkPalindrome} className="w-full">Check</Button>
          
          {result && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${
                result.isPalindrome 
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" 
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
              }`}>
                <h3 className="font-semibold text-lg mb-2">
                  {result.isPalindrome 
                  ? "Yes, this is a palindrome!" 
                  : "No, this is not a palindrome."}
                </h3>
                
                <div className="space-y-2 mt-4">
                  <div>
                    <span className="text-sm opacity-80">Processed text:</span>
                    <p className="font-mono text-sm bg-white/20 dark:bg-black/20 p-1 rounded">
                      {result.processedText}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm opacity-80">Reversed:</span>
                    <p className="font-mono text-sm bg-white/20 dark:bg-black/20 p-1 rounded">
                      {result.reversed}
                    </p>
                  </div>
                </div>
                
                {!result.isPalindrome && result.longestPalindrome && result.longestPalindrome.length > 1 && (
                  <div className="mt-4 p-3 bg-white/30 dark:bg-black/30 rounded">
                    <p className="font-medium">Longest palindrome found:</p>
                    <p className="font-mono">{result.longestPalindrome}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">What is a Palindrome?</h2>
        <p className="mb-4">
          A palindrome is a word, number, phrase, or other sequence of characters that reads the same forward and backward,
          ignoring spaces, punctuation, and capitalization.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Examples:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>"radar" - The same forward and backward</li>
          <li>"A man, a plan, a canal: Panama" - Ignoring spaces, punctuation, and case</li>
          <li>"Madam, I'm Adam" - Another classic palindrome phrase</li>
          <li>"racecar" - Another perfect palindrome word</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-2">Interesting Facts:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>The longest single-word English palindrome commonly cited is "rotavator"</li>
          <li>Palindromes can be found in numbers, DNA sequences, and musical compositions</li>
          <li>Some languages and cultures have traditions of creating palindromic poetry</li>
        </ul>
      </div>
    </div>
  );
}