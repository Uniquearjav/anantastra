"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RandomMorseGenerator() {
  const [generatedMorse, setGeneratedMorse] = useState("");
  const [translation, setTranslation] = useState("");
  const [wordCount, setWordCount] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [showTranslation, setShowTranslation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Define Morse code mapping
  const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 
    'Y': '-.--', 'Z': '--..', 
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', 
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', 
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', 
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', 
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
  };

  // Word lists for different difficulty levels
  const wordLists = {
    easy: [
      "THE", "AND", "FOR", "ARE", "BUT", "NOT", "YOU", "ALL", "ANY", "CAN", "HAD", "HER", 
      "WAS", "ONE", "OUR", "OUT", "DAY", "GET", "HAS", "HIM", "HIS", "HOW", "MAN", "NOW", 
      "OLD", "SEE", "TWO", "WAY", "WHO", "BOY", "DID", "ITS", "LET", "PUT", "SAY", "SHE", 
      "TOO", "USE", "THAT", "WITH", "HAVE", "THIS", "WILL", "YOUR", "FROM", "THEY", "KNOW", "WANT"
    ],
    medium: [
      "ABOUT", "ABOVE", "AFTER", "AGAIN", "BELOW", "COULD", "EVERY", "FIRST", "FOUND", "GREAT", 
      "HOUSE", "LARGE", "LEARN", "NEVER", "OTHER", "PLACE", "PLANT", "POINT", "RIGHT", "SMALL", 
      "SOUND", "SPELL", "STILL", "STUDY", "WORLD", "WOULD", "WRITE", "LIGHT", "PAPER", "GROUP", 
      "MUSIC", "COLOR", "EARTH", "OFTEN", "ORDER", "WATER", "MONEY", "MONTH", "RIVER", "TABLE"
    ],
    hard: [
      "AGAINST", "BETWEEN", "COUNTRY", "DEVELOP", "EXAMPLE", "GENERAL", "HOWEVER", "INTEREST", 
      "NATIONAL", "PRESENT", "QUESTION", "RESOURCE", "SCIENCE", "SPECIAL", "THOUGHT", "TOGETHER", 
      "THROUGH", "WEATHER", "WHETHER", "BUSINESS", "COMPLETE", "CONSIDER", "EQUIPMENT", "EXPERIENCE", 
      "IMPORTANT", "KNOWLEDGE", "NECESSARY", "POSITION", "POSSIBLE", "PRACTICE", "RESEARCH", "UNDERSTAND"
    ]
  };

  // Generate random words based on difficulty and count
  const generateRandomWords = (count, difficulty) => {
    const wordList = wordLists[difficulty];
    const words = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      words.push(wordList[randomIndex]);
    }
    
    return words.join(" ");
  };

  // Convert text to Morse code
  const textToMorse = (text) => {
    return text
      .toUpperCase()
      .split('')
      .map(char => morseCodeMap[char] || char)
      .join(' ')
      .replace(/ \/ /g, ' / '); // Format spaces between words
  };

  // Generate new random Morse code
  const handleGenerate = () => {
    const text = generateRandomWords(wordCount, difficulty);
    setTranslation(text);
    setGeneratedMorse(textToMorse(text));
    setShowTranslation(false);
  };

  // Copy Morse code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMorse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle translation visibility
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Random Morse Code Generator</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Number of Words
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={15}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">
                (1-15)
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Difficulty Level
            </label>
            <div className="flex rounded-md shadow-sm" role="group">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    difficulty === level 
                      ? "bg-primary text-primary-foreground"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } ${level === 'easy' ? 'rounded-l-md' : ''} ${level === 'hard' ? 'rounded-r-md' : ''}`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Button onClick={handleGenerate} className="w-full">
            Generate Random Morse Code
          </Button>
        </div>
        
        {generatedMorse && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Morse Code</h3>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm break-all">
                {generatedMorse}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Translation</h3>
                <Button
                  onClick={toggleTranslation}
                  variant="ghost"
                  size="sm"
                >
                  {showTranslation ? "Hide" : "Show"}
                </Button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm">
                {showTranslation ? translation : "• • • • •"}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About Morse Code</h2>
        
        <p className="mb-4">
          Morse code is a method of transmitting text information as a series of on-off tones, lights, or clicks that can be understood by a skilled listener without special equipment. The International Morse Code encodes the 26 Latin letters A through Z, some non-Latin letters, the Arabic numerals and a small set of punctuation and procedural signals (prosigns).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Letters</h3>
            <div className="grid grid-cols-5 gap-2 text-sm">
              {Object.entries(morseCodeMap)
                .filter(([key]) => /^[A-Z]$/.test(key))
                .map(([key, value]) => (
                  <div key={key} className="flex space-x-2 items-center">
                    <span className="font-bold">{key}</span>
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Numbers & Punctuation</h3>
            <div className="grid grid-cols-5 gap-2 text-sm">
              {Object.entries(morseCodeMap)
                .filter(([key]) => /^[0-9]$/.test(key))
                .map(([key, value]) => (
                  <div key={key} className="flex space-x-2 items-center">
                    <span className="font-bold">{key}</span>
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                ))}
              {Object.entries(morseCodeMap)
                .filter(([key]) => /^[^A-Z0-9 ]$/.test(key))
                .slice(0, 5)
                .map(([key, value]) => (
                  <div key={key} className="flex space-x-2 items-center">
                    <span className="font-bold">{key}</span>
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-1">Morse Code Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>A dash is three times as long as a dot</li>
            <li>The space between symbols (dots and dashes) is one dot duration</li>
            <li>The space between letters is three dots duration</li>
            <li>The space between words is seven dots duration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}