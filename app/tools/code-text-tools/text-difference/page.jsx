"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TextDifferenceTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState(null);
  const [diffStats, setDiffStats] = useState(null);
  const [viewMode, setViewMode] = useState("inline"); // inline, side-by-side
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  // Process diff when inputs or settings change
  useEffect(() => {
    if (text1 || text2) {
      computeDiff();
    }
  }, [text1, text2, ignoreWhitespace, ignoreCase, viewMode]);

  // Find the differences between two texts
  const computeDiff = () => {
    // Prepare texts based on settings
    let processedText1 = text1;
    let processedText2 = text2;
    
    if (ignoreCase) {
      processedText1 = processedText1.toLowerCase();
      processedText2 = processedText2.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      processedText1 = processedText1.replace(/\s+/g, " ").trim();
      processedText2 = processedText2.replace(/\s+/g, " ").trim();
    }

    // Split texts into lines
    const lines1 = processedText1.split("\n");
    const lines2 = processedText2.split("\n");
    
    // Compute longest common subsequence (LCS)
    const lcsMatrix = computeLCS(lines1, lines2);
    
    // Generate diff based on LCS
    const diff = backtrackLCS(lcsMatrix, lines1, lines2, lines1.length, lines2.length);
    
    // Calculate statistics
    const stats = {
      added: diff.filter(d => d.type === 'added').length,
      removed: diff.filter(d => d.type === 'removed').length,
      unchanged: diff.filter(d => d.type === 'unchanged').length,
      totalLines: diff.length
    };
    
    setDiffResult(diff);
    setDiffStats(stats);
  };

  // Compute Longest Common Subsequence matrix
  const computeLCS = (lines1, lines2) => {
    const m = lines1.length;
    const n = lines2.length;
    
    // Create 2D matrix filled with zeros
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Fill the matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (lines1[i - 1] === lines2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    return dp;
  };

  // Backtrack to get diff result
  const backtrackLCS = (lcsMatrix, lines1, lines2, i, j) => {
    const result = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
        // Lines are the same
        result.unshift({ 
          type: 'unchanged', 
          line: lines1[i - 1], 
          lineNum1: i, 
          lineNum2: j 
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
        // Line added in second text
        result.unshift({ 
          type: 'added', 
          line: lines2[j - 1], 
          lineNum1: null, 
          lineNum2: j 
        });
        j--;
      } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
        // Line removed from first text
        result.unshift({ 
          type: 'removed', 
          line: lines1[i - 1], 
          lineNum1: i, 
          lineNum2: null 
        });
        i--;
      }
    }
    
    return result;
  };

  // Function to highlight character-level differences in a line
  const highlightCharDifferences = (line1, line2) => {
    if (!line1 || !line2) return { line1, line2 };
    
    let processedLine1 = line1;
    let processedLine2 = line2;
    
    if (ignoreCase) {
      processedLine1 = processedLine1.toLowerCase();
      processedLine2 = processedLine2.toLowerCase();
    }
    
    const charMatrix = computeLCSChars(processedLine1, processedLine2);
    const charDiff = backtrackLCSChars(charMatrix, processedLine1, processedLine2, processedLine1.length, processedLine2.length);
    
    let markedLine1 = '';
    let markedLine2 = '';
    let inDiff1 = false;
    let inDiff2 = false;
    
    for (const item of charDiff) {
      if (item.type === 'unchanged') {
        // If we were in a diff, close the span
        if (inDiff1) {
          markedLine1 += '</span>';
          inDiff1 = false;
        }
        if (inDiff2) {
          markedLine2 += '</span>';
          inDiff2 = false;
        }
        markedLine1 += escapeHtml(item.char);
        markedLine2 += escapeHtml(item.char);
      } else if (item.type === 'removed') {
        // Start a new diff span if not already in one
        if (!inDiff1) {
          markedLine1 += '<span class="bg-red-200 dark:bg-red-900">';
          inDiff1 = true;
        }
        markedLine1 += escapeHtml(item.char);
      } else if (item.type === 'added') {
        // Start a new diff span if not already in one
        if (!inDiff2) {
          markedLine2 += '<span class="bg-green-200 dark:bg-green-900">';
          inDiff2 = true;
        }
        markedLine2 += escapeHtml(item.char);
      }
    }
    
    // Close any open spans
    if (inDiff1) markedLine1 += '</span>';
    if (inDiff2) markedLine2 += '</span>';
    
    return { 
      line1: markedLine1, 
      line2: markedLine2 
    };
  };

  // Compute LCS for characters
  const computeLCSChars = (str1, str2) => {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    return dp;
  };

  // Backtrack for character-level diff
  const backtrackLCSChars = (lcsMatrix, str1, str2, i, j) => {
    const result = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
        // Characters are the same
        result.unshift({ type: 'unchanged', char: str1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
        // Character added in second string
        result.unshift({ type: 'added', char: str2[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
        // Character removed from first string
        result.unshift({ type: 'removed', char: str1[i - 1] });
        i--;
      }
    }
    
    return result;
  };

  // Helper to escape HTML special characters
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Load example texts
  const loadExample = () => {
    setText1(`This is the first sample text.
It contains some lines that are the same.
This line will be removed in the second text.
Both texts share this line without changes.
Here is another line that will be modified.`);
    
    setText2(`This is the first sample text.
It contains some lines that are the same.
Both texts share this line without changes.
Here is another line that has been modified slightly.
This is a completely new line added to the second text.`);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Text Difference Tool</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={() => setIgnoreWhitespace(!ignoreWhitespace)}
                className="rounded text-primary"
              />
              <span>Ignore Whitespace</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={() => setIgnoreCase(!ignoreCase)}
                className="rounded text-primary"
              />
              <span>Ignore Case</span>
            </label>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "inline" ? "default" : "outline"}
              onClick={() => setViewMode("inline")}
              size="sm"
            >
              Inline View
            </Button>
            <Button
              variant={viewMode === "side-by-side" ? "default" : "outline"}
              onClick={() => setViewMode("side-by-side")}
              size="sm"
            >
              Side-by-Side
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Text 1 (Original)
            </label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter or paste original text here..."
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Text 2 (Modified)
            </label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter or paste modified text here..."
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 font-mono text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button onClick={loadExample} variant="outline">
            Load Example
          </Button>
        </div>
      </div>
      
      {diffResult && diffResult.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Differences</h2>
          
          {diffStats && (
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span>Added: {diffStats.added}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span>Removed: {diffStats.removed}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
                <span>Unchanged: {diffStats.unchanged}</span>
              </div>
              <div className="flex items-center">
                <span>Total lines: {diffStats.totalLines}</span>
              </div>
            </div>
          )}
          
          {viewMode === "inline" ? (
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left w-12">Line</th>
                    <th className="py-2 px-4 text-left">Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-mono text-sm">
                  {diffResult.map((item, index) => {
                    let bgColor = "";
                    if (item.type === "added") bgColor = "bg-green-50 dark:bg-green-900/20";
                    else if (item.type === "removed") bgColor = "bg-red-50 dark:bg-red-900/20";
                    
                    return (
                      <tr key={index} className={`${bgColor}`}>
                        <td className="py-1 px-4 text-gray-500 text-right whitespace-nowrap">
                          {item.lineNum1 || item.lineNum2}
                        </td>
                        <td 
                          className="py-1 px-4 whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: item.line }}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left w-12">Line</th>
                    <th className="py-2 px-4 text-left">Text 1</th>
                    <th className="py-2 px-4 text-left w-12">Line</th>
                    <th className="py-2 px-4 text-left">Text 2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-mono text-sm">
                  {diffResult.map((item, index) => {
                    let leftBg = "";
                    let rightBg = "";
                    
                    if (item.type === "added") {
                      leftBg = "bg-gray-100 dark:bg-gray-800";
                      rightBg = "bg-green-50 dark:bg-green-900/20";
                    } else if (item.type === "removed") {
                      leftBg = "bg-red-50 dark:bg-red-900/20";
                      rightBg = "bg-gray-100 dark:bg-gray-800";
                    }
                    
                    // Get character-level diff for unchanged lines that have matching line numbers
                    let highlightedContent = { line1: item.line, line2: item.line };
                    if (item.type === "unchanged" && item.lineNum1 && item.lineNum2) {
                      // Find exact texts from original inputs to handle case and whitespace correctly
                      const originalLine1 = text1.split("\n")[item.lineNum1 - 1];
                      const originalLine2 = text2.split("\n")[item.lineNum2 - 1];
                      
                      if (originalLine1 !== originalLine2) {
                        highlightedContent = highlightCharDifferences(originalLine1, originalLine2);
                      }
                    }
                    
                    return (
                      <tr key={index}>
                        <td className={`py-1 px-4 text-gray-500 text-right whitespace-nowrap ${leftBg}`}>
                          {item.lineNum1}
                        </td>
                        <td 
                          className={`py-1 px-4 whitespace-pre-wrap ${leftBg}`}
                          dangerouslySetInnerHTML={{ __html: item.type === "added" ? "&nbsp;" : highlightedContent.line1 }}
                        />
                        <td className={`py-1 px-4 text-gray-500 text-right whitespace-nowrap ${rightBg}`}>
                          {item.lineNum2}
                        </td>
                        <td 
                          className={`py-1 px-4 whitespace-pre-wrap ${rightBg}`}
                          dangerouslySetInnerHTML={{ __html: item.type === "removed" ? "&nbsp;" : highlightedContent.line2 }}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About Text Difference Tool</h2>
        <p className="mb-4">
          This tool allows you to compare two texts and visualize the differences between them. It's useful for:
        </p>
        
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Comparing versions of documents or code</li>
          <li>Finding changes between text drafts</li>
          <li>Reviewing edits and modifications</li>
          <li>Identifying missing or added content</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Paste your original text in the first textarea</li>
          <li>Paste the modified text in the second textarea</li>
          <li>Toggle options like ignoring whitespace or case as needed</li>
          <li>Switch between inline and side-by-side views to better visualize differences</li>
        </ol>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
          <h3 className="font-semibold mb-2">Color Legend:</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"></span>
              <span>Green: Added content (present in Text 2 but not in Text 1)</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"></span>
              <span>Red: Removed content (present in Text 1 but not in Text 2)</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></span>
              <span>White/Default: Unchanged content (present in both texts)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}