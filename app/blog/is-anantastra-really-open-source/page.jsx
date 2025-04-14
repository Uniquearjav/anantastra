"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function OpenSourceAndPrivacyBlog() {
  // For dark/light mode detection
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if user prefers dark mode
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const storedTheme = localStorage.getItem('theme');
      setDarkMode(storedTheme === 'dark' || (!storedTheme && isDarkMode));
      
      // Listen for theme changes
      const observer = new MutationObserver(() => {
        const htmlHasDarkClass = document.documentElement.classList.contains('dark');
        setDarkMode(htmlHasDarkClass);
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  // SEO metadata
  const pageTitle = "Is Anantastra Really Open Source? Understanding Our Privacy & Open Source Policies";
  const pageDescription = "Learn about Anantastra's commitment to open source software, how we handle your privacy, and what open source really means for users and developers.";
  
  // Open Graph image URL
  const ogImage = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop";
  
  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Featured Image */}
        <div className="relative w-full h-80 mb-8 rounded-xl overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
            alt="Open source code on a computer screen" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Is Anantastra Really Open Source?</h1>
              <p className="text-lg text-gray-200">Understanding our commitment to transparency and privacy</p>
            </div>
          </div>
        </div>
        
        {/* Author and Date */}
        <div className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold mr-3">
              A
            </div>
            <span>Anantastra Team</span>
          </div>
          <span className="mx-3">•</span>
          <time dateTime="2025-04-14">April 14, 2025</time>
          <span className="mx-3">•</span>
          <span>5 min read</span>
        </div>
        
        {/* Table of Contents */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-bold mb-2">In this article:</h2>
          <ul className="space-y-1">
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              <a href="#what-is-open-source" className="flex items-center">
                <span className="mr-2">•</span>
                What does "open source" really mean?
              </a>
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              <a href="#anantastra-open-source" className="flex items-center">
                <span className="mr-2">•</span>
                Is Anantastra truly open source?
              </a>
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              <a href="#personal-data" className="flex items-center">
                <span className="mr-2">•</span>
                Does Anantastra collect personal information?
              </a>
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              <a href="#benefits" className="flex items-center">
                <span className="mr-2">•</span>
                Benefits of using open source software
              </a>
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              <a href="#contribute" className="flex items-center">
                <span className="mr-2">•</span>
                How to contribute to Anantastra
              </a>
            </li>
          </ul>
        </div>
        
        {/* Main Content */}
        <article className="prose dark:prose-invert max-w-none">
          <p className="lead text-xl">
            In today's digital landscape, privacy concerns and software transparency have become increasingly important to users. At Anantastra, we pride ourselves on being both open source and privacy-focused — but what exactly does that mean for you as a user?
          </p>
          
          <h2 id="what-is-open-source" className="text-2xl font-bold mt-10 mb-4">What Does "Open Source" Really Mean?</h2>
          
          <div className="my-6 flex">
            <div className="mr-4 flex-shrink-0 mt-1">
              <svg className="h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p>
              <strong>Open source software</strong> refers to computer software that is released under a license in which the copyright holder grants users the rights to study, change, and distribute the software to anyone and for any purpose. This approach promotes collaboration, transparency, and community-driven development.
            </p>
          </div>
          
          <p>
            When software is open source, its source code — the human-readable instructions that make the program work — is freely available for anyone to view, modify, and enhance. This is in contrast to proprietary or "closed source" software, where the source code is kept secret and controlled exclusively by its creators.
          </p>
          
          <p>
            Key characteristics of open source software include:
          </p>
          
          <ul>
            <li><strong>Transparency:</strong> Anyone can inspect the code to understand how it works and identify potential issues.</li>
            <li><strong>Community collaboration:</strong> Developers from around the world can contribute improvements and fixes.</li>
            <li><strong>Freedom:</strong> Users can modify the software to suit their specific needs.</li>
            <li><strong>Longevity:</strong> Even if the original creators stop maintaining it, the community can continue its development.</li>
          </ul>
          
          <div className="my-8 p-5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">Did you know?</h3>
            <p className="text-gray-800 dark:text-gray-200 mb-0">
              The term "open source" was coined in 1998, but the concept has been around since the early days of computing. Many of the internet's core technologies, including the Linux operating system and the Apache web server, are open source projects.
            </p>
          </div>
          
          <h2 id="anantastra-open-source" className="text-2xl font-bold mt-10 mb-4">Is Anantastra Truly Open Source?</h2>
          
          <p>
            <strong>Yes, Anantastra is 100% open source.</strong> Our entire codebase is freely available on <a href="https://github.com/Uniquearjav/anantastra" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>, where anyone can:
          </p>
          
          <ul>
            <li>View every line of code that makes our tools work</li>
            <li>Examine our data handling practices in detail</li>
            <li>Contribute improvements or new features</li>
            <li>Fork the entire project to create their own version</li>
          </ul>
          
          <p>
            Anantastra is released under the MIT License, one of the most permissive open source licenses available. This means you have the freedom to use, modify, and distribute our code, even in commercial projects, with minimal restrictions.
          </p>
          
          <div className="my-8 relative h-64 rounded-lg overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1607706189992-eae578626c86?q=80&w=2070&auto=format&fit=crop"
              alt="Transparent glass with code visible as a metaphor for transparency" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <p className="text-white text-center text-lg font-semibold px-6">
                Our code is transparent because we believe in building trust through visibility
              </p>
            </div>
          </div>
          
          <p>
            We encourage users to verify our claims by examining our codebase. This transparency ensures that our tools function exactly as described, with no hidden functionality or data collection.
          </p>
          
          <h2 id="personal-data" className="text-2xl font-bold mt-10 mb-4">Does Anantastra Collect Personal Information?</h2>
          
          <div className="my-6 flex">
            <div className="mr-4 flex-shrink-0 mt-1">
              <svg className="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p>
              <strong>No, Anantastra does not collect or store any personal information.</strong> All calculations and data processing happen entirely in your browser. Your data never leaves your device.
            </p>
          </div>
          
          <p>
            Here's how our approach to privacy works in practice:
          </p>
          
          <table className="min-w-full mt-4 border-collapse mb-8">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="py-3 px-4 text-left border border-gray-200 dark:border-gray-700">Tool Function</th>
                <th className="py-3 px-4 text-left border border-gray-200 dark:border-gray-700">How Data Is Handled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">Calculations (Interest, Loan EMI, etc.)</td>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">All calculations run directly in your browser using JavaScript. No data is sent to our servers.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">Text Manipulation</td>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">Your text stays in your browser. We have no way of accessing or storing what you type.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">Password Generation</td>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">Passwords are generated locally. We never see, store, or transmit the created passwords.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">Code Conversions</td>
                <td className="py-3 px-4 border border-gray-200 dark:border-gray-700">All encoding/decoding happens client-side, with no server processing.</td>
              </tr>
            </tbody>
          </table>
          
          <p>
            The only data we collect is anonymous usage analytics, which helps us improve our tools by understanding which features are most popular. This analytics data contains no personally identifiable information and is used solely to enhance user experience.
          </p>
          
          <div className="my-8 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-3">Minimal Advertising</h3>
            <p className="text-gray-800 dark:text-gray-200">
              Anantastra is supported by minimal, non-intrusive advertising to cover our hosting costs. We believe in transparency about how we sustain the project while keeping the tools free for everyone. These ads are served by reputable providers with strict privacy policies.
            </p>
          </div>
          
          <h2 id="benefits" className="text-2xl font-bold mt-10 mb-4">Benefits of Using Open Source Software</h2>
          
          <p>
            Choosing open source tools like Anantastra offers several advantages:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Security</h3>
              <p className="text-sm">
                With many eyes reviewing the code, security vulnerabilities are discovered and fixed quickly. The transparency of open source means nothing can be hidden.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Privacy</h3>
              <p className="text-sm">
                You can verify exactly how your data is handled. There are no black boxes or hidden data collection mechanisms.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Reliability</h3>
              <p className="text-sm">
                Open source software tends to be more reliable as bugs are found and fixed faster by the community.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Community</h3>
              <p className="text-sm">
                Being part of an open source project means being part of a community that continuously improves the software.
              </p>
            </div>
          </div>
          
          <div className="my-8 relative h-64 rounded-lg overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="A collaborative team working together, representing open source community" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <p className="text-white text-center text-lg font-semibold px-6">
                Open source thrives through collaboration and community contributions
              </p>
            </div>
          </div>
          
          <h2 id="contribute" className="text-2xl font-bold mt-10 mb-4">How to Contribute to Anantastra</h2>
          
          <p>
            We welcome contributions from developers of all skill levels. If you're interested in helping improve Anantastra or adding new tools, here's how you can get involved:
          </p>
          
          <ol>
            <li className="mb-2"><strong>Fork the repository</strong> on GitHub</li>
            <li className="mb-2"><strong>Create a feature branch</strong> for your changes</li>
            <li className="mb-2"><strong>Implement your changes</strong> following our coding guidelines</li>
            <li className="mb-2"><strong>Submit a pull request</strong> for review</li>
          </ol>
          
          <p>
            Even if you're not a developer, you can contribute by:
          </p>
          
          <ul>
            <li>Reporting bugs or suggesting features</li>
            <li>Improving documentation</li>
            <li>Sharing Anantastra with others who might find it useful</li>
          </ul>
          
          <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Q: Can I use Anantastra's tools offline?</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  A: Yes! Once loaded in your browser, many of our tools work completely offline.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Q: Is there a premium version with more features?</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  A: No, all our tools are free and will remain free. We believe in equal access to useful utilities.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Q: How is Anantastra funded?</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  A: Anantastra is supported by minimal advertising and community contributions. We maintain a balance that allows us to cover hosting costs while keeping the user experience clean.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Q: Can I create my own version of Anantastra?</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  A: Absolutely! Under the MIT License, you're free to fork the project and create your own version, even for commercial purposes.
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Conclusion</h2>
          
          <p>
            Anantastra's commitment to being truly open source and privacy-focused sets it apart in today's digital landscape. By providing transparent, browser-based tools that never collect personal information, we aim to build trust while delivering valuable utilities.
          </p>
          
          <p>
            We believe that useful software can respect your privacy and remain completely transparent. Our open source approach ensures that you never have to wonder what's happening with your data or how our tools function.
          </p>
          
          <p>
            Whether you're using our calculators, text tools, or password managers, you can do so with confidence, knowing that your information remains yours alone.
          </p>
          
          <div className="mt-10 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
            <p className="font-semibold mb-4">
              Have questions about our open source commitment or privacy practices? Join the discussion:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="https://github.com/Uniquearjav/anantastra" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-white">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub Discussions
              </Link>
              <Link href="/contact" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                Contact Us
              </Link>
            </div>
          </div>
          
        </article>
        
        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">Open Source</span>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">Privacy</span>
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full">Data Security</span>
            <span className="px-3 py-1 text-sm font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full">Web Tools</span>
            <span className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full">MIT License</span>
          </div>
        </div>
        
        {/* Related Articles/Share Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="h-40 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Password Security Best Practices</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tips for creating and managing strong passwords to keep your accounts secure.</p>
                  <Link href="#" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Read more →</Link>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="h-40 bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg className="h-16 w-16 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">How We Built the Text Analysis Tools</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">A look behind the scenes at our text manipulation utilities and how they work.</p>
                  <Link href="#" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Read more →</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <h3 className="text-xl font-bold mb-4">Share this article</h3>
            <div className="flex gap-2">
              <button className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="flex items-center justify-center p-2 bg-blue-800 hover:bg-blue-900 text-white rounded">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-800 text-white rounded">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </button>
              <button className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}