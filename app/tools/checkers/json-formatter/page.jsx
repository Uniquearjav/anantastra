"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function JSONFormatter() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [stats, setStats] = useState(null);

  const formatJSON = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON data");
      setFormattedJson("");
      setStats(null);
      return;
    }

    try {
      let parsed;
      
      // Try to parse the JSON
      try {
        parsed = JSON.parse(jsonInput);
      } catch (e) {
        // If it fails, try to evaluate it as JavaScript (for cases where user inputs JSON with single quotes)
        try {
          // Replace single quotes with double quotes and fix unquoted property keys
          const fixedInput = jsonInput
            .replace(/'/g, '"')
            // Improved regex to handle more cases of unquoted keys
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
            // Handle keys with hyphens and other valid characters
            .replace(/([{,]\s*)([a-zA-Z0-9_-]+)(\s*:)/g, '$1"$2"$3')
            // Fix trailing commas in objects and arrays
            .replace(/,\s*}/g, '}')
            .replace(/,\s*\]/g, ']');
          
          parsed = JSON.parse(fixedInput);
        } catch (e2) {
          throw e; // Throw the original error if second attempt fails
        }
      }

      // Format with the specified indentation
      const formatted = JSON.stringify(parsed, null, indentSize);
      setFormattedJson(formatted);
      setError("");
      
      // Calculate statistics
      calculateStats(parsed);
      
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setFormattedJson("");
      setStats(null);
    }
  };

  const calculateStats = (obj) => {
    const stats = {
      totalKeys: 0,
      depth: 0,
      arrayCount: 0,
      objectCount: 0,
      stringCount: 0,
      numberCount: 0,
      booleanCount: 0,
      nullCount: 0
    };

    // Helper function to traverse the object and count items
    const traverse = (obj, currentDepth = 0) => {
      if (currentDepth > stats.depth) {
        stats.depth = currentDepth;
      }

      if (Array.isArray(obj)) {
        stats.arrayCount++;
        obj.forEach(item => traverse(item, currentDepth + 1));
      } else if (obj !== null && typeof obj === 'object') {
        stats.objectCount++;
        stats.totalKeys += Object.keys(obj).length;
        
        Object.values(obj).forEach(value => {
          traverse(value, currentDepth + 1);
        });
      } else {
        // Count primitive types
        if (typeof obj === 'string') stats.stringCount++;
        else if (typeof obj === 'number') stats.numberCount++;
        else if (typeof obj === 'boolean') stats.booleanCount++;
        else if (obj === null) stats.nullCount++;
      }
    };

    traverse(obj);
    setStats(stats);
  };

  const copyToClipboard = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson);
    }
  };

  const minifyJSON = () => {
    if (!jsonInput.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setError("");
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">JSON Formatter & Validator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Input JSON</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Indent size:
              </label>
              <select 
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-white dark:bg-gray-700 border rounded px-2 py-1 text-sm"
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
              </select>
            </div>
          </div>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"example": "Paste your JSON here"}'
            className="w-full h-80 p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={formatJSON} className="flex-1">
              Format & Validate
            </Button>
            <Button 
              onClick={minifyJSON} 
              variant="outline" 
              className="flex-1"
            >
              Minify
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Formatted Result</h2>
            {formattedJson && (
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Copy to Clipboard
              </Button>
            )}
          </div>
          
          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          ) : (
            <pre className="w-full h-80 p-4 font-mono text-sm overflow-auto bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              {formattedJson}
            </pre>
          )}
          
          {stats && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2">JSON Statistics:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Keys:</span>
                  <span className="font-semibold">{stats.totalKeys}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Depth:</span>
                  <span className="font-semibold">{stats.depth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Objects:</span>
                  <span className="font-semibold">{stats.objectCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrays:</span>
                  <span className="font-semibold">{stats.arrayCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Strings:</span>
                  <span className="font-semibold">{stats.stringCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Numbers:</span>
                  <span className="font-semibold">{stats.numberCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booleans:</span>
                  <span className="font-semibold">{stats.booleanCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Null values:</span>
                  <span className="font-semibold">{stats.nullCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">About JSON</h2>
        <p className="mb-4">
          JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write 
          and easy for machines to parse and generate. It is based on a subset of JavaScript syntax.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Valid JSON Types:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><span className="font-mono">String</span>: <span className="font-mono">"text"</span> (must use double quotes)</li>
          <li><span className="font-mono">Number</span>: <span className="font-mono">42</span>, <span className="font-mono">3.14159</span></li>
          <li><span className="font-mono">Object</span>: <span className="font-mono">&#123;"key": "value"&#125;</span></li>
          <li><span className="font-mono">Array</span>: <span className="font-mono">[1, 2, 3]</span></li>
          <li><span className="font-mono">Boolean</span>: <span className="font-mono">true</span> or <span className="font-mono">false</span></li>
          <li><span className="font-mono">null</span></li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-2">Common JSON Errors:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Using single quotes instead of double quotes for strings</li>
          <li>Missing commas between array items or object properties</li>
          <li>Trailing commas (not allowed in JSON)</li>
          <li>Unquoted property names (keys must be in double quotes)</li>
          <li>Including comments (not allowed in JSON)</li>
        </ul>
      </div>
    </div>
  );
}