'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowLeftRight, 
  Sparkles, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

const MORSE_MAP = {
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

const REVERSE_MORSE_MAP = Object.entries(MORSE_MAP).reduce((acc, [char, morse]) => {
  if (char !== ' ') acc[morse] = char;
  return acc;
}, {});

export default function MorseCodeConverter() {
  const [direction, setDirection] = useState('text-to-morse'); // 'text-to-morse' | 'morse-to-text'
  const [inputText, setInputText] = useState('SOS MAYDAY 2026');
  const [inputMorse, setInputMorse] = useState('... --- ... / -- .- -.-- -.. .- -.-- / ..--- ----- ..--- -....');
  const [speedWPM, setSpeedWPM] = useState(18);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSignal, setActiveSignal] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef(null);
  const playTimeoutsRef = useRef([]);

  // Calculate text -> morse
  const computedMorse = useMemo(() => {
    if (!inputText) return '';
    return inputText
      .toUpperCase()
      .split('')
      .map(ch => MORSE_MAP[ch] || (ch === ' ' ? '/' : ''))
      .filter(Boolean)
      .join(' ')
      .replace(/\s+\/\s+/g, ' / ');
  }, [inputText]);

  // Calculate morse -> text
  const computedText = useMemo(() => {
    if (!inputMorse) return '';
    const words = inputMorse.trim().split(/\s*\/\s*|\s{3,}/);
    return words.map(word => {
      const letters = word.trim().split(/\s+/);
      return letters.map(code => REVERSE_MORSE_MAP[code] || '?').join('');
    }).join(' ');
  }, [inputMorse]);

  // Web Audio initialization
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAudio = () => {
    playTimeoutsRef.current.forEach(clearTimeout);
    playTimeoutsRef.current = [];
    setIsPlaying(false);
    setActiveSignal(false);
  };

  const playMorseAudio = (morseString) => {
    initAudio();
    stopAudio();
    if (!audioCtxRef.current || !morseString) return;

    setIsPlaying(true);

    // Standard Paris timing: dot = 1200 / WPM ms
    const dotDuration = (1200 / speedWPM) / 1000; // seconds
    const dashDuration = dotDuration * 3;
    const elementSpace = dotDuration;
    const letterSpace = dotDuration * 3;
    const wordSpace = dotDuration * 7;

    const ctx = audioCtxRef.current;
    let currTime = ctx.currentTime + 0.05;

    for (let i = 0; i < morseString.length; i++) {
      const symbol = morseString[i];

      if (symbol === '.' || symbol === '-') {
        const dur = symbol === '.' ? dotDuration : dashDuration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, currTime);

        // Attack & Release envelope to eliminate audio clicks
        gain.gain.setValueAtTime(0, currTime);
        gain.gain.linearRampToValueAtTime(0.3, currTime + 0.005);
        gain.gain.setValueAtTime(0.3, currTime + dur - 0.005);
        gain.gain.linearRampToValueAtTime(0, currTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(currTime);
        osc.stop(currTime + dur);

        // Visual flash timing
        const delayMs = (currTime - ctx.currentTime) * 1000;
        const durMs = dur * 1000;

        const tid1 = setTimeout(() => setActiveSignal(true), delayMs);
        const tid2 = setTimeout(() => setActiveSignal(false), delayMs + durMs);
        playTimeoutsRef.current.push(tid1, tid2);

        currTime += dur + elementSpace;
      } else if (symbol === ' ') {
        currTime += letterSpace - elementSpace;
      } else if (symbol === '/') {
        currTime += wordSpace - elementSpace;
      }
    }

    const totalDurMs = (currTime - ctx.currentTime) * 1000;
    const endTid = setTimeout(() => {
      setIsPlaying(false);
      setActiveSignal(false);
    }, totalDurMs);
    playTimeoutsRef.current.push(endTid);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleCopy = (content) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'SOS', text: 'SOS' },
    { label: 'Hello World', text: 'HELLO WORLD' },
    { label: 'Mayday', text: 'MAYDAY' },
    { label: 'Radio CQ', text: 'CQ CQ CQ' },
    { label: 'Open Source', text: 'OPEN SOURCE' }
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Radio className="w-3.5 h-3.5 mr-1.5 text-primary" />
          ITU International Radiotelegraphy Standard
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Morse Code Converter
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Translate text to Morse code and decode telegraph signals with 650Hz audio synthesis, visual flasher, and transmission speed control.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="flex justify-center mb-6">
        <div className="p-1 rounded-xl bg-muted/50 border border-border/60 flex gap-1">
          <button
            type="button"
            onClick={() => {
              setDirection('text-to-morse');
              stopAudio();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              direction === 'text-to-morse'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Text → Morse Code
          </button>
          <button
            type="button"
            onClick={() => {
              setDirection('morse-to-text');
              stopAudio();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              direction === 'morse-to-text'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Morse Code → Text
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="morse-input" className="text-sm font-semibold text-foreground">
                {direction === 'text-to-morse' ? 'Enter Plain Text' : 'Enter Morse Code (Dots, Dashes, Slashes)'}
              </label>
              {direction === 'morse-to-text' && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputMorse(prev => prev + '.')}
                    className="h-7 px-2 font-mono"
                  >
                    • Dot
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputMorse(prev => prev + '-')}
                    className="h-7 px-2 font-mono"
                  >
                    — Dash
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputMorse(prev => prev + ' ')}
                    className="h-7 px-2 font-mono"
                  >
                    Space
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputMorse(prev => prev + ' / ')}
                    className="h-7 px-2 font-mono"
                  >
                    / Word
                  </Button>
                </div>
              )}
            </div>

            {direction === 'text-to-morse' ? (
              <textarea
                id="morse-input"
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type any message here..."
                className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            ) : (
              <textarea
                id="morse-input"
                rows={4}
                value={inputMorse}
                onChange={(e) => setInputMorse(e.target.value)}
                placeholder="... --- ... / -- .- -.-- -.. .- -.--"
                className="w-full rounded-xl border border-input bg-background p-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            )}

            {/* Quick Presets */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs font-medium text-muted-foreground self-center mr-1">Signals:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(p.text);
                    if (direction === 'morse-to-text') {
                      setInputMorse(
                        p.text.split('').map(ch => MORSE_MAP[ch] || '').join(' ')
                      );
                    }
                  }}
                  className="text-xs px-2.5 py-1 rounded-md border border-border/60 bg-muted/30 hover:bg-muted font-mono"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sound Speed Controls */}
            <div className="mt-6 pt-5 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                  Transmission Speed:
                </span>
                <span className="font-mono font-bold text-primary">{speedWPM} WPM (Words/Min)</span>
              </div>
              <Slider
                min={8}
                max={30}
                step={1}
                value={[speedWPM]}
                onValueChange={(val) => setSpeedWPM(val[0])}
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputText('');
                  setInputMorse('');
                  stopAudio();
                }}
                className="text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">
                {direction === 'text-to-morse' ? 'Morse Code Output' : 'Decoded Text'}
              </h2>
              {/* Visual Flasher Bulb */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">Signal:</span>
                <div 
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-75 ${
                    activeSignal 
                      ? 'bg-amber-400 border-amber-500 shadow-md shadow-amber-400/50 scale-125' 
                      : 'bg-muted border-border/60'
                  }`} 
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="space-y-4">
              <div className="relative">
                <div className="min-h-[130px] max-h-56 overflow-y-auto p-4 rounded-xl border border-border/70 bg-muted/40 font-mono text-sm sm:text-base text-foreground break-all leading-relaxed select-all">
                  {direction === 'text-to-morse' ? (computedMorse || 'Enter text to generate Morse code...') : (computedText || 'Enter Morse code to decode...')}
                </div>

                <div className="absolute top-2 right-2 flex gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(direction === 'text-to-morse' ? computedMorse : computedText)}
                    className="h-7 text-xs px-2 shadow-xs"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Audio Playback Controls */}
              <div className="flex items-center gap-3 pt-2">
                {isPlaying ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopAudio}
                    className="w-full text-xs"
                  >
                    <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    Stop Sound
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => playMorseAudio(direction === 'text-to-morse' ? computedMorse : inputMorse)}
                    disabled={direction === 'text-to-morse' ? !computedMorse : !inputMorse}
                    className="w-full text-xs"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    Play Audio (650Hz)
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Audio synthesized in real-time via HTML5 AudioContext. Zero external requests.</span>
          </div>
        </div>
      </div>

      {/* Interactive Morse Alphabet Grid */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            International Morse Alphabet Chart (Click to Play Sound)
          </span>
          <span className="text-xs text-muted-foreground font-mono">ITU-R M.1677</span>
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 pt-2">
          {Object.entries(MORSE_MAP)
            .filter(([k]) => k !== ' ' && k.length === 1 && /[A-Z0-9]/.test(k))
            .map(([char, code]) => (
              <button
                key={char}
                type="button"
                onClick={() => playMorseAudio(code)}
                className="p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted text-center transition-colors group"
                title={`Play ${char}: ${code}`}
              >
                <div className="font-bold text-foreground text-xs">{char}</div>
                <div className="font-mono text-[11px] text-primary group-hover:underline mt-0.5">{code}</div>
              </button>
            ))}
        </div>
      </Card>
    </div>
  );
}
