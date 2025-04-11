'use client'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

const Text = () => {
    const [text, setText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [char, setChar] = useState(0);
    const [words, setWords] = useState(0);
    const [operation, setOperation] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Apply dark mode effect when state changes
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    // Handle input change
    const handleInputChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        countStats(newText);
    };

    // Count text statistics
    const countStats = (text) => {
        setChar(text.length);
        setWords(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    };

    // Text operations
    const handleUpperCase = () => {
        const result = text.toUpperCase();
        setOutputText(result);
        setOperation('uppercase');
    };

    const handleLowerCase = () => {
        const result = text.toLowerCase();
        setOutputText(result);
        setOperation('lowercase');
    };

    const handleCapitalize = () => {
        const result = text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        setOutputText(result);
        setOperation('capitalize');
    };

    const handleRemoveSpaces = () => {
        const result = text.replace(/\s+/g, '');
        setOutputText(result);
        setOperation('remove spaces');
    };

    const handleClearText = () => {
        setText('');
        setOutputText('');
        setChar(0);
        setWords(0);
        setOperation('');
    };

    // Copy to clipboard
    const handleCopy = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <main className={`p-5 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className='text-3xl md:text-4xl font-extrabold text-center md:text-left'>Text Operations</h1>
                <Button 
                    onClick={toggleDarkMode} 
                    className={`py-2 px-4 rounded-full transition-all ${darkMode ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                >
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </Button>
            </div>
            
            <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className='text-lg mb-2'>Enter your text below to transform it using various operations</p>
                <div className='mb-4'>
                    <textarea 
                        value={text}
                        onChange={handleInputChange}
                        placeholder="Type or paste your text here..."
                        className={`w-full h-32 p-3 rounded-md border ${
                            darkMode 
                                ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' 
                                : 'bg-white text-black border-gray-300 focus:border-blue-500'
                        } outline-none transition-colors`}
                    />
                </div>
                
                <div className='flex flex-wrap gap-2 mb-4'>
                    <Button onClick={handleUpperCase} className='bg-blue-600 hover:bg-blue-700 text-white'>
                        UPPERCASE
                    </Button>
                    <Button onClick={handleLowerCase} className='bg-green-600 hover:bg-green-700 text-white'>
                        lowercase
                    </Button>
                    <Button onClick={handleCapitalize} className='bg-purple-600 hover:bg-purple-700 text-white'>
                        Capitalize Words
                    </Button>
                    <Button onClick={handleRemoveSpaces} className='bg-orange-600 hover:bg-orange-700 text-white'>
                        Remove Spaces
                    </Button>
                    <Button onClick={handleClearText} className='bg-red-600 hover:bg-red-700 text-white'>
                        Clear Text
                    </Button>
                </div>
                
                <div className='flex gap-4 text-sm font-medium mb-2'>
                    <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Characters: {char}
                    </div>
                    <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Words: {words}
                    </div>
                </div>
            </div>

            {outputText && (
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <h3 className='font-medium'>{operation && `Text ${operation}`}</h3>
                        <Button 
                            onClick={handleCopy}
                            className={`text-sm ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                        >
                            {copied ? '✓ Copied!' : 'Copy to clipboard'}
                        </Button>
                    </div>
                    <div className={`p-4 overflow-auto max-h-60 whitespace-pre-wrap ${
                        darkMode ? 'text-white' : 'text-black'
                    }`}>
                        {outputText}
                    </div>
                </div>
            )}
            
            <div className="mt-10 text-center text-sm opacity-70">
                <p>Tips: You can paste text, apply multiple operations in sequence, and copy the result.</p>
            </div>
        </main>
    );
}

export default Text