'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Radio, 
  Play, 
  Square, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  Trophy, 
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
  ' ': '/'
};

const WORD_LISTS = {
  easy: [
    'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN',
    'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM',
    'HIS', 'HOW', 'MAN', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY'
  ],
  medium: [
    'RADIO', 'SIGNAL', 'ANTENNA', 'FREQUENCY', 'MORSE', 'CODING', 'TRANSMIT',
    'RECEIVE', 'BEACON', 'CIRCUIT', 'STATION', 'WEATHER', 'SYSTEM', 'VECTOR',
    'PACKET', 'NETWORK', 'MODEM', 'CIPHER', 'TELEGRAPH', 'NAVIGATE'
  ],
  hard: [
    'ELECTROMAGNETIC', 'OSCILLATION', 'CRYPTOGRAPHIC', 'PROPAGATION',
    'TELECOMMUNICATION', 'IONOSPHERE', 'MICROCONTROLLER', 'INTERFERENCE',
    'DECELERATION', 'SYNCHRONOUS'
  ]
};

export default function RandomMorseGenerator() {
  const [wordCount, setWordCount] = useState(3);
  const [difficulty, setDifficulty] = useState('easy');
  const [generatedWords, setGeneratedWords] = useState('RADIO MORSE SIGNAL');
  const [generatedMorse, setGeneratedMorse] = useState('.-. .- -.. .. --- / -- --- .-. ... . / ... .. --. -. .- .-..');
  const [revealed, setRevealed] = useState(false);
  const [speedWPM, setSpeedWPM] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio refs
  const audioCtxRef = useRef(null);
  const timeoutsRef = useRef([]);

  const textToMorse = (text) => {
    return text
      .toUpperCase()
      .split('')
      .map(ch => MORSE_MAP[ch] || '')
      .filter(Boolean)
      .join(' ')
      .replace(/\s+\/\s+/g, ' / ');
  };

  const handleGenerate = () => {
    stopAudio();
    const list = WORD_LISTS[difficulty];
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = Math.floor(Math.random() * list.length);
      words.push(list[idx]);
    }
    const combined = words.join(' ');
    setGeneratedWords(combined);
    setGeneratedMorse(textToMorse(combined));
    setRevealed(false);
  };

  // Web Audio Synth
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAudio = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsPlaying(false);
  };

  const playMorseAudio = () => {
    initAudio();
    stopAudio();
    if (!audioCtxRef.current || !generatedMorse) return;

    setIsPlaying(true);
    const dotDuration = (1200 / speedWPM) / 1000;
    const dashDuration = dotDuration * 3;
    const elementSpace = dotDuration;
    const letterSpace = dotDuration * 3;
    const wordSpace = dotDuration * 7;

    const ctx = audioCtxRef.current;
    let currTime = ctx.currentTime + 0.05;

    for (let i = 0; i < generatedMorse.length; i++) {
      const symbol = generatedMorse[i];

      if (symbol === '.' || symbol === '-') {
        const dur = symbol === '.' ? dotDuration : dashDuration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, currTime);

        gain.gain.setValueAtTime(0, currTime);
        gain.gain.linearRampToValueAtTime(0.3, currTime + 0.005);
        gain.gain.setValueAtTime(0.3, currTime + dur - 0.005);
        gain.gain.linearRampToValueAtTime(0, currTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(currTime);
        osc.stop(currTime + dur);

        currTime += dur + elementSpace;
      } else if (symbol === ' ') {
        currTime += letterSpace - elementSpace;
      } else if (symbol === '/') {
        currTime += wordSpace - elementSpace;
      }
    }

    const totalDurMs = (currTime - ctx.currentTime) * 1000;
    const endTid = setTimeout(() => setIsPlaying(false), totalDurMs);
    timeoutsRef.current.push(endTid);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMorse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Radio className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Telegraphy Ear Training & Generator
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Random Morse Code Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Practice CW radiotelegraphy skills with random word drills, real-time tone playback, and revealable answer flashcards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4">Training Parameters</h2>

            {/* Word Count */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Word Count:</span>
                <span className="font-mono font-bold text-primary">{wordCount} Words</span>
              </div>
              <Slider
                min={1}
                max={8}
                step={1}
                value={[wordCount]}
                onValueChange={(val) => setWordCount(val[0])}
              />
            </div>

            {/* Difficulty Level */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-foreground block mb-2">
                Vocabulary Tier:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Easy (3-4 L)' },
                  { id: 'medium', label: 'Medium (5-7 L)' },
                  { id: 'hard', label: 'Pro Jargon' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setDifficulty(tier.id)}
                    className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                      difficulty === tier.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission WPM Speed */}
            <div className="space-y-2 mb-6 pt-2 border-t border-border/60">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                  Speed (WPM):
                </span>
                <span className="font-mono font-bold text-primary">{speedWPM} WPM</span>
              </div>
              <Slider
                min={10}
                max={28}
                step={1}
                value={[speedWPM]}
                onValueChange={(val) => setSpeedWPM(val[0])}
              />
            </div>

            {/* Generate Action Button */}
            <Button
              onClick={handleGenerate}
              className="w-full text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Generate New Transmission
            </Button>
          </Card>
        </div>

        {/* Right Output Flashcard */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Generated Telegraph Signal</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-7 text-xs px-2.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy Morse'}
              </Button>
            </div>

            {/* Morse Code Signal Box */}
            <div className="p-5 rounded-2xl border border-border/70 bg-muted/30 font-mono text-lg text-foreground tracking-widest break-all leading-relaxed select-all">
              {generatedMorse}
            </div>

            {/* Audio Controls */}
            <div className="mt-4 flex gap-3">
              {isPlaying ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopAudio}
                  className="flex-1 text-xs"
                >
                  <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Stop Audio
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={playMorseAudio}
                  className="flex-1 text-xs"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Listen to Tone (650Hz)
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealed(!revealed)}
                className="text-xs"
              >
                {revealed ? <EyeOff className="w-3.5 h-3.5 mr-1.5" /> : <Eye className="w-3.5 h-3.5 mr-1.5" />}
                {revealed ? 'Hide Answer' : 'Reveal Words'}
              </Button>
            </div>

            {/* Answer Flashcard Reveal */}
            <div className="mt-5 p-4 rounded-xl border border-border/60 bg-card">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                Plain English Translation:
              </div>
              <div className="text-lg font-extrabold font-mono tracking-wide text-foreground">
                {revealed ? (
                  <span className="text-primary">{generatedWords}</span>
                ) : (
                  <span className="text-muted-foreground/40 select-none">•••••••• •••••••• •••••••• (Click 'Reveal Words')</span>
                )}
              </div>
            </div>
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Runs locally with Web Audio API. Perfect for amateur radio exam training.</span>
          </div>
        </div>
      </div>

      {/* Guide Card */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Effective Morse Code Learning Techniques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Koch Method</h3>
            <p className="text-xs text-muted-foreground">
              Learn Morse code at full target speed (16–20 WPM) from day one so your brain recognizes rhythmic sound melodies instead of counting dots.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Farnsworth Timing</h3>
            <p className="text-xs text-muted-foreground">
              Characters are sent at high speed, but extra space is placed between letters and words to give your brain time to process.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Prosign Standards</h3>
            <p className="text-xs text-muted-foreground">
              Standard procedural signals like <strong>AR</strong> (end of message), <strong>SK</strong> (end of contact), and <strong>BT</strong> (pause/separator).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}