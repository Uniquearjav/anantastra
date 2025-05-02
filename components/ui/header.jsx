'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './button';
import { useTheme } from './theme-provider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiHome, 
  FiTool, 
  FiInfo, 
  FiGithub, 
  FiDollarSign 
} from 'react-icons/fi';
import { BiCalculator } from 'react-icons/bi';
import { TbCircle, TbCircleFilled } from 'react-icons/tb';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md dark:bg-gray-900/80 shadow-md' 
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
              <TbCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <TbCircleFilled className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1 left-1" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Anantastra</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-500">
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link href="/tools" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-500">
                <FiTool className="w-4 h-4" />
                <span>Tools</span>
              </Link>
              <Link href="/interest-calculator" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-500">
                <BiCalculator className="w-4 h-4" />
                <span>Interest Calculator</span>
              </Link>
              <Link href="/about" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-500">
                <FiInfo className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link href="https://github.com/Uniquearjav/anantastra" target="_blank" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-500">
                <FiGithub className="w-4 h-4" />
                <span>GitHub</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button - Always Visible */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors transform hover:scale-105"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile Menu - Shadcn Sheet */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    aria-label="Open menu"
                  >
                    <FiMenu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <TbCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <TbCircleFilled className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-1 left-1" />
                        </div>
                        <span className="font-bold">Anantastra</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiHome className="w-5 h-5" />
                      <span>Home</span>
                    </Link>
                    <Link href="/tools" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiTool className="w-5 h-5" />
                      <span>Tools</span>
                    </Link>
                    <Link href="/interest-calculator" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <BiCalculator className="w-5 h-5" />
                      <span>Interest Calculator</span>
                    </Link>
                    <Link href="/about" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiInfo className="w-5 h-5" />
                      <span>About</span>
                    </Link>
                    <Link href="https://github.com/Uniquearjav/anantastra" target="_blank" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 transition-colors px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiGithub className="w-5 h-5" />
                      <span>GitHub</span>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}