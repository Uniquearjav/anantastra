"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function AboutPage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600">
              About Me
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            The person behind Anantastra
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Profile Image Section */}
            <div className="w-full lg:w-1/3">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-6 shadow-xl">
                {/* Replace with your actual image path */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <Image
                    src="/your-image.jpg" // Replace with your image
                    alt="Your Name"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                  <svg className="animate-spin h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <Link href="https://github.com/YourGithubUsername" target="_blank" rel="noopener noreferrer">
                  <Button className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                    </svg>
                    GitHub
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/arjav-choudhary-531b2126b/" target="_blank" rel="noopener noreferrer">
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                </Link>
                <Link href="https://twitter.com/YourTwitterUsername" target="_blank" rel="noopener noreferrer">
                  <Button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                    X (Twitter)
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* About Content */}
            <div className="w-full lg:w-2/3">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Hello there! I'm Arjav Choudhary</h2>
                
                <p className="text-gray-700 dark:text-gray-300">
                  Welcome to Anantastra, a project I created to provide free, open-source tools that respect your privacy. 
                  I'm passionate about developing utilities that make everyday tasks easier while ensuring your data stays with you.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">My Journey</h3>
                
                <p className="text-gray-700 dark:text-gray-300">
                I am a passionate programmer and commerce student at Delhi Public School, Jodhpur, with a deep interest in technology, entrepreneurship, and innovation. Starting with Python as a hobby, I have expanded my skills across web development, Artificial Intelligence, and open-source contributions. My technical expertise includes:

- Programming : Python, Node.js, front-end development, and GitHub Copilot.

- Exploration: Digital marketing, generative AI, and cutting-edge tech.

- Projects: Anantastra and Nirvatatva — building privacy-first tools and promoting sustainable handicrafts globally.


I actively work to create meaningful contributions at the intersection of technology and real-world impact. Driven by curiosity, I am focused on the future, striving to push the boundaries of innovation while staying committed to sustainability.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Why I Created Anantastra</h3>
                
                <p className="text-gray-700 dark:text-gray-300">
                  I believe in a web where privacy is respected and quality tools are accessible to everyone. 
                  Anantastra was born from this vision - a platform offering useful utilities without collecting your data.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  All calculations happen right in your browser, with zero data collection. The entire project is open-source,
                  so you can verify this for yourself or even contribute to making these tools better.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Let's Connect</h3>
                
                <p className="text-gray-700 dark:text-gray-300">
                  I'm always open to connecting with like-minded individuals, discussing new ideas,
                  or exploring collaboration opportunities. Feel free to reach out to me through any of the social links.
                </p>
              </div>
              
              {/* Call to Action */}
              <div className="mt-12 flex flex-wrap gap-4">
                <Link href="/tools">
                  <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Explore My Tools
                  </Button>
                </Link>
                <Link href="mailto:your-email@example.com">
                  <Button variant="outline" className="px-6 py-3 rounded-xl">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}