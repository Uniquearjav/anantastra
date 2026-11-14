/**
 * Centralized SEO & Structured Data Directory for Anantastra / usealltools.com
 * Contains keyword-optimized metadata, canonical routes, and Google-compliant schema entities.
 * NOTE: Strictly adheres to zero contact information constraint (no email, phone, or address).
 */

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usealltools.com';

export const TOOLS_SEO = {
  // ---------------------------------------------------------------------------
  // Financial Calculators
  // ---------------------------------------------------------------------------
  'sip-calculator': {
    title: 'SIP Calculator Online - Calculate Mutual Fund SIP Returns | Use All Tools',
    description: 'Free online SIP calculator to compute expected returns, total investment amount, and wealth gain on mutual fund SIP investments in Indian Rupees (INR) with compound growth charts.',
    keywords: [
      'SIP calculator',
      'mutual fund SIP calculator',
      'SIP return calculator online',
      'monthly SIP calculator',
      'mutual fund calculator India',
      'calculate SIP compound returns',
      'systematic investment plan calculator',
      'wealth gain calculator'
    ],
    canonicalPath: '/tools/calculator/sip-calculator',
    category: 'FinanceApplication',
    categoryName: 'Financial Calculators',
    categorySlug: '/tools#calculator',
    name: 'SIP Calculator',
    faqs: [
      {
        question: 'What is a SIP Calculator and how does it calculate returns?',
        answer: 'A Systematic Investment Plan (SIP) calculator calculates the prospective future value of regular monthly investments using compound interest: FV = P × [((1 + i)^n - 1) / i] × (1 + i), where P is monthly deposit, i is periodic interest rate, and n is total number of installments.'
      },
      {
        question: 'Does this SIP calculator store my financial details?',
        answer: 'No. All calculations run 100% locally in your web browser. Zero financial numbers, deposits, or personal inputs are sent to any remote server or stored in cookies.'
      },
      {
        question: 'What is a reasonable expected rate of return for equity SIPs in India?',
        answer: 'Historically, diversified equity mutual funds and index funds in India have yielded between 11% to 15% annualized returns over long horizons (7+ years), though past performance does not guarantee future results.'
      }
    ]
  },

  'income-tax-calculator': {
    title: 'Income Tax Calculator India FY 2024-25 & 2025-26 (New vs Old Regime) | Use All Tools',
    description: 'Compare tax liability under New vs Old tax regimes for India FY 2024-25 (AY 2025-26) and FY 2025-26. Includes standard deduction, 87A rebate, 80C, 80D, HRA deductions, and tax slab breakdown.',
    keywords: [
      'Income tax calculator India',
      'New vs Old tax regime calculator',
      'FY 2024-25 income tax calculator',
      'FY 2025-26 tax calculator',
      'Section 87A rebate calculator',
      'salary tax calculator India',
      'tax slab calculator AY 2025-26',
      '80C 80D HRA tax deduction'
    ],
    canonicalPath: '/tools/calculator/income-tax-calculator',
    category: 'FinanceApplication',
    categoryName: 'Financial Calculators',
    categorySlug: '/tools#calculator',
    name: 'Income Tax Calculator (India)',
    faqs: [
      {
        question: 'How does this tax calculator compare the New vs Old tax regimes?',
        answer: 'It calculates taxable income by applying standard deduction, Section 80C, 80D, and HRA exemptions under the Old Regime, and compares it against the revised slabs, enhanced standard deduction, and Section 87A tax rebate under the New Regime.'
      },
      {
        question: 'Is my salary or tax information private?',
        answer: 'Yes. Absolutely zero income data is sent over the network. Calculations are processed instantaneously and purely within your client-side browser.'
      }
    ]
  },

  'gst-calculator': {
    title: 'GST Calculator Online India (Inclusive & Exclusive GST Rates) | Use All Tools',
    description: 'Calculate Goods & Services Tax (GST) for India instantly. Supports inclusive and exclusive GST computations across 0%, 5%, 12%, 18%, and 28% slabs with CGST, SGST, and IGST breakdowns.',
    keywords: [
      'GST calculator India',
      'online GST calculator free',
      'calculate GST inclusive exclusive',
      '18% GST calculator',
      'CGST SGST IGST calculator',
      'reverse GST calculator',
      'GST calculation formula'
    ],
    canonicalPath: '/tools/calculator/gst-calculator',
    category: 'FinanceApplication',
    categoryName: 'Financial Calculators',
    categorySlug: '/tools#calculator',
    name: 'GST Calculator',
    faqs: [
      {
        question: 'What is the formula to calculate GST?',
        answer: 'For GST Exclusive: GST Amount = (Base Price × GST%) / 100. For GST Inclusive (Reverse): Base Price = (Total Amount × 100) / (100 + GST%), and GST Amount = Total Amount - Base Price.'
      },
      {
        question: 'What are CGST, SGST, and IGST?',
        answer: 'For intra-state transactions (within the same Indian state), GST is split equally into CGST (Central GST) and SGST (State GST). For inter-state transactions, IGST (Integrated GST) applies entirely.'
      }
    ]
  },

  'loan-emi-calculator': {
    title: 'Loan EMI Calculator with Amortization Schedule & Breakup | Use All Tools',
    description: 'Calculate monthly loan EMI for home, personal, or car loans. View interactive amortization payment schedules, principal vs interest breakdown, and export CSV reports for free.',
    keywords: [
      'Loan EMI calculator',
      'home loan EMI calculator',
      'car loan EMI calculator',
      'personal loan EMI calculator',
      'monthly EMI calculation formula',
      'loan amortization schedule',
      'EMI calculator with prepayment'
    ],
    canonicalPath: '/tools/calculator/loan-emi-calculator',
    category: 'FinanceApplication',
    categoryName: 'Financial Calculators',
    categorySlug: '/tools#calculator',
    name: 'Loan EMI Calculator',
    faqs: [
      {
        question: 'What is the EMI calculation formula?',
        answer: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is Principal Loan Amount, r is monthly interest rate (annual rate / 12 / 100), and n is loan tenure in months.'
      },
      {
        question: 'Can I export the amortization schedule?',
        answer: 'Yes, this tool provides instant CSV table export and visual payment progression graphs without requiring any account login.'
      }
    ]
  },

  'interest-calculator': {
    title: 'Compound & Simple Interest Calculator with Growth Schedule | Use All Tools',
    description: 'Compare simple vs compound interest over time. Features customizable compounding frequencies (daily, monthly, quarterly, annual), interactive charts, and schedule breakdown.',
    keywords: [
      'Interest calculator',
      'compound interest calculator',
      'simple interest calculator',
      'daily compound interest calculator',
      'calculate compound interest online',
      'simple vs compound interest'
    ],
    canonicalPath: '/tools/calculator/interest-calculator',
    category: 'FinanceApplication',
    categoryName: 'Financial Calculators',
    categorySlug: '/tools#calculator',
    name: 'Interest Calculator',
    faqs: [
      {
        question: 'What is the difference between simple and compound interest?',
        answer: 'Simple interest calculates interest solely on the original principal. Compound interest calculates interest on both the principal and the accumulated interest from prior periods, leading to exponential wealth accumulation.'
      }
    ]
  },

  'currency-converter': {
    title: 'Live Currency Converter & Exchange Rates Calculator | Use All Tools',
    description: 'Convert 150+ world currencies with up-to-date foreign exchange rates. Fast, zero-lag conversion with multi-currency matrix, inverse rates, and historical charts.',
    keywords: [
      'Currency converter',
      'live currency exchange rates',
      'USD to INR converter',
      'EUR to USD currency calculator',
      'real time forex calculator',
      'exchange rates today'
    ],
    canonicalPath: '/tools/converters/currency-converter',
    category: 'FinanceApplication',
    categoryName: 'Converters',
    categorySlug: '/tools#converters',
    name: 'Currency Converter'
  },

  // ---------------------------------------------------------------------------
  // General & Math Calculators
  // ---------------------------------------------------------------------------
  'bmi-calculator': {
    title: 'BMI Calculator (Body Mass Index) Metric & Imperial | Use All Tools',
    description: 'Calculate Body Mass Index (BMI) for adults with Metric (cm/kg) and Imperial (ft/lbs) units. View WHO classification, healthy weight range, and prime index.',
    keywords: [
      'BMI calculator',
      'body mass index calculator',
      'calculate BMI online',
      'metric BMI calculator',
      'ideal weight calculator',
      'WHO BMI categories'
    ],
    canonicalPath: '/tools/calculator/bmi-calculator',
    category: 'HealthApplication',
    categoryName: 'General Calculators',
    categorySlug: '/tools#calculator',
    name: 'BMI Calculator'
  },

  'age-calculator': {
    title: 'Chronological Age Calculator - Exact Years, Months & Days | Use All Tools',
    description: 'Calculate your exact age in years, months, weeks, days, hours, and minutes from date of birth. Includes countdown to next birthday and weekday of birth.',
    keywords: [
      'Age calculator',
      'chronological age calculator',
      'calculate exact age',
      'how old am I today',
      'date of birth calculator',
      'next birthday countdown'
    ],
    canonicalPath: '/tools/calculator/age-calculator',
    category: 'UtilityApplication',
    categoryName: 'General Calculators',
    categorySlug: '/tools#calculator',
    name: 'Age Calculator'
  },

  'factorial-calculator': {
    title: 'Arbitrary Precision Factorial Calculator (n!), nPr & nCr | Use All Tools',
    description: 'Compute exact arbitrary-precision factorials (n!), permutations (nPr), and combinations (nCr) using BigInt. Calculate thousands of digits instantly without floating-point overflow.',
    keywords: [
      'Factorial calculator',
      'BigInt factorial calculator',
      'calculate n factorial online',
      'permutations calculator nPr',
      'combinations calculator nCr',
      'large number factorial'
    ],
    canonicalPath: '/tools/calculator/factorial-calculator',
    category: 'UtilityApplication',
    categoryName: 'General Calculators',
    categorySlug: '/tools#calculator',
    name: 'Factorial Calculator'
  },

  'decimal-binary-calculator': {
    title: 'Binary to Decimal, Hex & Octal Base Converter with Bitboard | Use All Tools',
    description: 'Synchronized number base converter supporting Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16) with interactive toggle bitboard.',
    keywords: [
      'Binary to decimal converter',
      'decimal to binary calculator',
      'hex to binary converter',
      'number base converter',
      'interactive bitboard tool',
      'hexadecimal decimal binary octal'
    ],
    canonicalPath: '/tools/calculator/decimal-binary-calculator',
    category: 'DeveloperApplication',
    categoryName: 'General Calculators',
    categorySlug: '/tools#calculator',
    name: 'Decimal & Binary Base Converter'
  },

  // ---------------------------------------------------------------------------
  // Checkers & Code Utilities
  // ---------------------------------------------------------------------------
  'json-formatter': {
    title: 'Free Online JSON Formatter, Validator & Minifier | Use All Tools',
    description: 'Format, validate, beautify, and minify JSON online with instant syntax error highlighting, tree hierarchy navigation, and client-side privacy protection.',
    keywords: [
      'JSON formatter',
      'JSON validator online',
      'JSON beautifier',
      'minify JSON',
      'JSON lint free',
      'format JSON private client side'
    ],
    canonicalPath: '/tools/checkers/json-formatter',
    category: 'DeveloperApplication',
    categoryName: 'Checkers & Analyzers',
    categorySlug: '/tools#checkers',
    name: 'JSON Formatter & Validator'
  },

  'leap-year-checker': {
    title: 'Leap Year Checker - Check Any Year with 400-Year Rule | Use All Tools',
    description: 'Check whether any Gregorian year is a leap year. Explains the complete 4, 100, and 400-year mathematical rules with upcoming leap years list.',
    keywords: [
      'Leap year checker',
      'is this year a leap year',
      'calculate leap year rule',
      'list of leap years',
      'Gregorian calendar leap year'
    ],
    canonicalPath: '/tools/checkers/leap-year-checker',
    category: 'UtilityApplication',
    categoryName: 'Checkers & Analyzers',
    categorySlug: '/tools#checkers',
    name: 'Leap Year Checker'
  },

  'palindrome-checker': {
    title: 'Palindrome Checker - Test Words, Phrases & Numbers Online | Use All Tools',
    description: 'Verify if a word, sentence, or number is a palindrome with option to ignore punctuation, spaces, and case. Features real-time visual reverse comparison.',
    keywords: [
      'Palindrome checker',
      'test palindrome online',
      'palindrome sentence checker',
      'is word a palindrome',
      'palindrome number test'
    ],
    canonicalPath: '/tools/checkers/palindrome-checker',
    category: 'UtilityApplication',
    categoryName: 'Checkers & Analyzers',
    categorySlug: '/tools#checkers',
    name: 'Palindrome Checker'
  },

  'prime-checker': {
    title: 'Prime Number Checker & Prime Factorization Calculator | Use All Tools',
    description: 'Check if any number is prime, view its prime factors, and discover the nearest preceding and succeeding prime numbers with sub-millisecond execution.',
    keywords: [
      'Prime number checker',
      'prime factorization calculator',
      'is this number prime',
      'find prime factors online',
      'prime number test'
    ],
    canonicalPath: '/tools/checkers/prime-checker',
    category: 'UtilityApplication',
    categoryName: 'Checkers & Analyzers',
    categorySlug: '/tools#checkers',
    name: 'Prime Number Checker'
  },

  // ---------------------------------------------------------------------------
  // Password & Security Tools
  // ---------------------------------------------------------------------------
  'password-generator': {
    title: 'Cryptographically Secure Password Generator (Client-Side) | Use All Tools',
    description: 'Generate strong, unpredictable passwords using browser-native crypto.getRandomValues(). Customize length, symbols, digits, and calculate real-time entropy bits.',
    keywords: [
      'Password generator',
      'secure password generator online',
      'strong random password creator',
      'client side password generator',
      'password entropy calculator',
      'safe password generator'
    ],
    canonicalPath: '/tools/password-tools/password-generator',
    category: 'SecurityApplication',
    categoryName: 'Security Tools',
    categorySlug: '/tools#password-tools',
    name: 'Password Generator'
  },

  'password-age-checker': {
    title: 'Password Strength & Age Checker - Test Entropy & Crack Time | Use All Tools',
    description: 'Audit password strength, entropy bit depth, and estimated brute-force crack time offline. Never transmits keystrokes; runs 100% locally in browser memory.',
    keywords: [
      'Password strength checker',
      'password crack time calculator',
      'test password security online',
      'password entropy tester',
      'password age check'
    ],
    canonicalPath: '/tools/password-tools/password-age-checker',
    category: 'SecurityApplication',
    categoryName: 'Security Tools',
    categorySlug: '/tools#password-tools',
    name: 'Password Strength & Age Checker'
  },

  // ---------------------------------------------------------------------------
  // Converters & Content Tools
  // ---------------------------------------------------------------------------
  'unit-converter': {
    title: 'Universal Unit Converter - Length, Weight, Temp, Speed, Area | Use All Tools',
    description: 'Convert between Metric and Imperial measurement systems across length, mass/weight, temperature, speed, area, and digital data storage.',
    keywords: [
      'Unit converter',
      'metric to imperial converter',
      'length converter online',
      'weight converter kg to lbs',
      'temperature converter celsius to fahrenheit',
      'data storage converter'
    ],
    canonicalPath: '/tools/converters/unit-converter',
    category: 'UtilityApplication',
    categoryName: 'Converters',
    categorySlug: '/tools#converters',
    name: 'Universal Unit Converter'
  },

  'number-words-converter': {
    title: 'Number to Words Converter (Indian Lakhs/Crores & International) | Use All Tools',
    description: 'Convert numerical values into spelled words formatted for bank cheques, invoices, and legal documents. Supports Indian (Lakhs, Crores) and Western (Millions, Billions) naming.',
    keywords: [
      'Number to words converter',
      'convert numbers to words online',
      'cheque amount in words converter',
      'Indian numbering system words',
      'numbers to text calculator'
    ],
    canonicalPath: '/tools/converters/number-words-converter',
    category: 'UtilityApplication',
    categoryName: 'Converters',
    categorySlug: '/tools#converters',
    name: 'Number to Words Converter'
  },

  'morse-code-converter': {
    title: 'Morse Code Translator & Audio Player (Text to Morse) | Use All Tools',
    description: 'Translate text to Morse code and decode Morse code back to text with real-time sound audio playback, speed control (WPM), and ITU international standard table.',
    keywords: [
      'Morse code translator',
      'text to morse code converter',
      'decode morse code audio',
      'morse code sound player',
      'learn morse code alphabet'
    ],
    canonicalPath: '/tools/converters/morse-code-converter',
    category: 'UtilityApplication',
    categoryName: 'Converters',
    categorySlug: '/tools#converters',
    name: 'Morse Code Converter'
  },

  'random-morse-generator': {
    title: 'Random Morse Code Practice Generator with Audio & Speed Control | Use All Tools',
    description: 'Generate randomized Morse code characters, words, and call signs for amateur radio (CW) practice. Includes audio synthesis, adjustable WPM, and delay settings.',
    keywords: [
      'Random morse code generator',
      'morse code CW practice tool',
      'amateur radio morse trainer',
      'morse code audio practice',
      'learn CW online'
    ],
    canonicalPath: '/tools/code-text-tools/random-morse-generator',
    category: 'UtilityApplication',
    categoryName: 'Code & Text Utilities',
    categorySlug: '/tools#code-text-tools',
    name: 'Random Morse Code Generator'
  },

  'markdown-html-converter': {
    title: 'Markdown to Clean HTML Converter with Live Preview | Use All Tools',
    description: 'Convert Markdown syntax into clean, semantic HTML with real-time dual-pane preview, syntax highlighting, and 1-click clipboard copy.',
    keywords: [
      'Markdown to HTML converter',
      'convert MD to HTML online',
      'markdown previewer live',
      'render markdown to clean html',
      'online markdown editor'
    ],
    canonicalPath: '/tools/converters/markdown-html-converter',
    category: 'DeveloperApplication',
    categoryName: 'Converters',
    categorySlug: '/tools#converters',
    name: 'Markdown to HTML Converter'
  },

  'svg-converter': {
    title: 'Client-Side SVG to PNG Converter with Custom Resolution | Use All Tools',
    description: 'Convert vector SVG files into high-resolution PNG, JPEG, or WebP images client-side. Set custom width, height, and DPI scale without uploading files to servers.',
    keywords: [
      'SVG to PNG converter',
      'convert SVG to image online',
      'high resolution SVG converter',
      'vector to raster private client side',
      'SVG to WebP export'
    ],
    canonicalPath: '/tools/converters/svg-converter',
    category: 'DeveloperApplication',
    categoryName: 'Converters',
    categorySlug: '/tools#converters',
    name: 'SVG Converter'
  },

  'google-serp-preview': {
    title: 'Google SERP Simulator & Snippet Preview Tool | Use All Tools',
    description: 'Simulate how your webpage appears on Google Search results on desktop and mobile. Test title pixel width, meta description truncation, and rich snippet stars.',
    keywords: [
      'Google SERP preview tool',
      'SERP simulator desktop mobile',
      'meta title pixel width checker',
      'Google snippet preview',
      'meta description length checker'
    ],
    canonicalPath: '/tools/code-text-tools/google-serp-preview',
    category: 'DeveloperApplication',
    categoryName: 'Code & Text Utilities',
    categorySlug: '/tools#code-text-tools',
    name: 'Google SERP Preview Tool'
  },

  'seo-article-analyzer': {
    title: 'On-Page SEO Article & Content Quality Analyzer | Use All Tools',
    description: 'Audit blog articles and webpage text for on-page SEO signals: word count, reading time, keyword density, heading distribution, and readability scores.',
    keywords: [
      'SEO article analyzer',
      'content SEO audit tool',
      'keyword density checker',
      'Flesch reading ease calculator',
      'on page content analyzer free'
    ],
    canonicalPath: '/tools/code-text-tools/seo-article-analyzer',
    category: 'DeveloperApplication',
    categoryName: 'Code & Text Utilities',
    categorySlug: '/tools#code-text-tools',
    name: 'SEO Article Analyzer'
  },

  'text-difference': {
    title: 'Online Text Difference Checker - Line-by-Line Diff Tool | Use All Tools',
    description: 'Compare two texts, code snippets, or documents with color-coded side-by-side and inline diff highlights. Spot additions, deletions, and character modifications.',
    keywords: [
      'Text difference checker',
      'diff tool online',
      'compare two texts line by line',
      'text diff checker free',
      'find differences in text'
    ],
    canonicalPath: '/tools/code-text-tools/text-difference',
    category: 'DeveloperApplication',
    categoryName: 'Code & Text Utilities',
    categorySlug: '/tools#code-text-tools',
    name: 'Text Difference Checker'
  },

  'text': {
    title: 'Text & String Utilities Suite - Format, Clean & Count Words | Use All Tools',
    description: 'Comprehensive client-side text toolkit: word and character counters, UPPERCASE, lowercase, Title Case converters, whitespace cleaners, find & replace, and morse code.',
    keywords: [
      'Text utilities online',
      'word counter tool',
      'change text case',
      'remove extra spaces text',
      'find and replace online',
      'string formatter free'
    ],
    canonicalPath: '/text',
    category: 'UtilityApplication',
    categoryName: 'Productivity Utilities',
    categorySlug: '/tools#productivity',
    name: 'Text Utilities Suite'
  }
};
