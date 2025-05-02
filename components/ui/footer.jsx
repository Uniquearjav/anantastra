'use client';
import Link from 'next/link';
import { useState } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    alert('Thank you for subscribing!');
    setEmail('');
  };
  
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Top section with logo, description, and newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-600 dark:text-blue-400">
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,0,0,1,12,11,11,0,0,0,12,23,11,11,0,0,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
                  />
                  <path
                    fill="currentColor"
                    d="M19.73,12A7.73,7.73,0,1,1,12,4.27,7.73,7.73,0,0,1,19.73,12Z"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Anantastra</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Infinite Tools - Open-source utilities that respect your privacy.
              We don't collect or store any of your data.
            </p>
          </div>
          
          {/* Links sections */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Tools
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/interest-calculator" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                  Interest Calculator
                </Link>
              </li>
              <li>
                <Link href="/text" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                  Text Tools
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/password-generator" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                  Password Generator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="https://github.com/Uniquearjav/anantastra" target="_blank" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors flex items-center">
                  GitHub
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright and social links */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} Anantastra. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://github.com/Uniquearjav/anantastra" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 text-center sm:text-left text-xs text-gray-500 dark:text-gray-500">
            Designed with ❤️ by Arjav Choudhary
          </div>
        </div>
      </div>
    </footer>
  );
}