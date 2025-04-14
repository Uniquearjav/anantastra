"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MorseCodeConverter() {
  const [textInput, setTextInput] = useState("");
  const [morseInput, setMorseInput] = useState("");
  const [textResult, setTextResult] = useState("");
  const [morseResult, setMorseResult] = useState("");
  const [activeMorse, setActiveMorse] = useState(true); // Toggle between text-to-morse and morse-to-text
  const [autoPlay, setAutoPlay] = useState(false); // Toggle for auto-play functionality
  
  // Morse code dictionary
  const morseCodeDict = {
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
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
  };
  
  // Generate reverse dictionary for morse to text conversion
  const reverseMorseCodeDict = Object.entries(morseCodeDict).reduce((acc, [char, morse]) => {
    acc[morse] = char;
    return acc;
  }, {});

  // Convert text to morse code
  const convertToMorse = (text) => {
    if (!text.trim()) {
      return "";
    }
    
    const result = text.toUpperCase().split('').map(char => {
      if (char === ' ') return ' / '; // Space between words
      if (morseCodeDict[char]) return morseCodeDict[char];
      return char; // Keep unknown characters as is
    }).join(' ');
    
    return result;
  };

  // Convert morse code to text
  const convertToText = (morse) => {
    if (!morse.trim()) {
      return "";
    }
    
    // Split morse input by words (separated by '/') and characters (separated by spaces)
    const words = morse.trim().split('/').map(word => 
      word.trim().split(' ').map(morse => 
        reverseMorseCodeDict[morse] || morse
      ).join('')
    ).join(' ');
    
    return words;
  };

  // Auto-convert when text input changes
  useEffect(() => {
    if (activeMorse) {
      setMorseResult(convertToMorse(textInput));
    }
  }, [textInput, activeMorse]);

  // Auto-convert when morse input changes
  useEffect(() => {
    if (!activeMorse) {
      setTextResult(convertToText(morseInput));
    }
  }, [morseInput, activeMorse]);

  // Handle mode toggle
  const toggleMode = (mode) => {
    setActiveMorse(mode);
    // Clear inputs and results when switching modes
    if (mode) {
      setMorseInput("");
      setTextResult("");
    } else {
      setTextInput("");
      setMorseResult("");
    }
  };

  const playMorseCode = (morseString) => {
    const dotDuration = 60; // ms
    const dashDuration = dotDuration * 3;
    const symbolBreak = dotDuration;
    const letterBreak = dotDuration * 3;
    const wordBreak = dotDuration * 7;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator
    const playTone = (duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 700;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Smooth the tone to prevent clicking
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + duration / 1000 - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
      
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
      }, duration);
      
      return duration;
    };
    
    let currentTime = 0;
    
    for (let i = 0; i < morseString.length; i++) {
      const symbol = morseString[i];
      
      setTimeout(() => {
        if (symbol === '.') {
          playTone(dotDuration);
        } else if (symbol === '-') {
          playTone(dashDuration);
        }
      }, currentTime);
      
      if (symbol === '.') {
        currentTime += dotDuration + symbolBreak;
      } else if (symbol === '-') {
        currentTime += dashDuration + symbolBreak;
      } else if (symbol === ' ') {
        currentTime += letterBreak;
      } else if (symbol === '/') {
        currentTime += wordBreak;
      }
    }
  };

  // Play the last character that was typed
  const playLastChar = () => {
    if (!morseResult) return;
    const parts = morseResult.split(' ');
    const lastPart = parts[parts.length - 1];
    if (lastPart && (lastPart.includes('.') || lastPart.includes('-'))) {
      playMorseCode(lastPart);
    }
  };

  // Play the most recently typed morse character when autoPlay is enabled
  useEffect(() => {
    if (autoPlay && activeMorse && morseResult) {
      playLastChar();
    }
  }, [morseResult]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Morse Code Converter</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => toggleMode(true)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border 
                ${activeMorse 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white text-gray-900 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white'}`}
            >
              Text → Morse Code
            </button>
            <button
              type="button"
              onClick={() => toggleMode(false)}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border
                ${!activeMorse 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white text-gray-900 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white'}`}
            >
              Morse Code → Text
            </button>
          </div>
        </div>
        
        {activeMorse ? (
          // Text to Morse converter
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="textInput">
                Enter Text (conversion happens automatically)
              </label>
              <textarea
                id="textInput"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your text here..."
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoPlay"
                checked={autoPlay}
                onChange={() => setAutoPlay(!autoPlay)}
                className="mr-2"
              />
              <label htmlFor="autoPlay" className="text-sm">
                Auto-play sounds as you type
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Morse Code Result
              </label>
              <div className="relative">
                <textarea
                  value={morseResult}
                  readOnly
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 h-32 font-mono bg-gray-50 dark:bg-gray-800"
                />
                {morseResult && (
                  <div className="absolute right-2 bottom-2 flex gap-2">
                    <Button
                      onClick={() => navigator.clipboard.writeText(morseResult)}
                      size="sm"
                      variant="outline"
                    >
                      Copy
                    </Button>
                    <Button
                      onClick={() => playMorseCode(morseResult)}
                      size="sm"
                      variant="outline"
                    >
                      Play
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Morse to Text converter
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="morseInput">
                Enter Morse Code (use space between letters and / between words)
              </label>
              <textarea
                id="morseInput"
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                placeholder=".-.. .. -.- . / - .... .. ..."
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 h-32 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Result (converts automatically)
              </label>
              <div className="relative">
                <textarea
                  value={textResult}
                  readOnly
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 h-32 bg-gray-50 dark:bg-gray-800"
                />
                {textResult && (
                  <Button
                    onClick={() => navigator.clipboard.writeText(textResult)}
                    size="sm"
                    variant="outline"
                    className="absolute right-2 bottom-2"
                  >
                    Copy
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">About Morse Code</h2>
          <p className="mb-4">
            Morse code is a method of transmitting text information as a series of on-off tones, lights, or clicks. It was developed by Samuel Morse and Alfred Vail in the 1830s.
          </p>
          <p>
            Each letter and number is represented by a unique sequence of dots and dashes (or short and long signals). The International Morse Code encodes the 26 Latin letters A through Z, some non-Latin letters, the Arabic numerals, and a small set of punctuation and procedural signals.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Morse Code Chart</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {Object.entries(morseCodeDict).slice(0, 36).map(([char, code]) => (
              <div key={char} className="flex items-center">
                <span className="font-bold w-5">{char}</span>
                <span className="font-mono ml-2">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}