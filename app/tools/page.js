import Link from "next/link";

export default function ToolsPage() {
  const categories = [
    {
      name: "Financial Calculators",
      slug: "calculator",
      description: "Financial calculation tools for Indian and international users",
      color: "from-blue-500 to-blue-600",
      tools: [
        { name: "Income Tax Calculator (India)", slug: "income-tax-calculator", badge: "New" },
        { name: "GST Calculator", slug: "gst-calculator", badge: "New" },
        { name: "Loan EMI Calculator", slug: "loan-emi-calculator" },
        { name: "SIP Calculator", slug: "sip-calculator" },
        { name: "Interest Calculator", slug: "interest-calculator" },
        { name: "Currency Converter", slug: "currency-converter", category: "converters" },
      ]
    },
    {
      name: "General Calculators",
      slug: "calculator",
      description: "Mathematical and utility calculators",
      color: "from-emerald-500 to-emerald-600",
      tools: [
        { name: "BMI Calculator", slug: "bmi-calculator" },
        { name: "Age Calculator", slug: "age-calculator" },
        { name: "Factorial Calculator", slug: "factorial-calculator" },
        { name: "Decimal to Binary Calculator", slug: "decimal-binary-calculator" },
      ]
    },
    {
      name: "Converters",
      slug: "converters",
      description: "Convert between different formats and units",
      color: "from-purple-500 to-purple-600",
      tools: [
        { name: "Number to Words Converter", slug: "number-words-converter" },
        { name: "Morse Code Converter", slug: "morse-code-converter" },
        { name: "Unit Converter", slug: "unit-converter" },
        { name: "Markdown to HTML Converter", slug: "markdown-html-converter" },
        { name: "SVG Converter", slug: "svg-converter" },
      ]
    },
    {
      name: "Checkers & Validators",
      slug: "checkers",
      description: "Validate and check various inputs",
      color: "from-green-500 to-green-600",
      tools: [
        { name: "Prime Number Checker", slug: "prime-checker" },
        { name: "Palindrome Checker", slug: "palindrome-checker" },
        { name: "Leap Year Checker", slug: "leap-year-checker" },
        { name: "JSON Formatter/Validator", slug: "json-formatter" },
      ]
    },
    {
      name: "Password Tools",
      slug: "password-tools",
      description: "Tools for password generation and management",
      color: "from-red-500 to-red-600",
      tools: [
        { name: "Password Generator", slug: "password-generator" },
        { name: "Password Age Checker", slug: "password-age-checker" },
      ]
    },
    {
      name: "Code & Text Tools",
      slug: "code-text-tools",
      description: "Tools for working with code and text content",
      color: "from-amber-500 to-amber-600",
      tools: [
        { name: "Text Difference Tool", slug: "text-difference" },
        { name: "Random Morse Code Generator", slug: "random-morse-generator" },
      ]
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Tools & Calculators</h1>
      
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p>
            <strong>New!</strong> We've added Indian Income Tax and GST calculators, plus improved all financial tools with Indian currency and number formatting. Try them out!
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category.slug + category.name} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className={`h-24 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>
              <ul className="space-y-2">
                {category.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link 
                      href={`/tools/${tool.category || category.slug}/${tool.slug}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium">{tool.name}</span>
                      {tool.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                          {tool.badge}
                        </span>
                      )}
                      <svg 
                        className="ml-auto h-5 w-5 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We're always adding new tools and calculators. If you have a suggestion for a tool you'd like to see, please let us know!
        </p>
        <Link 
          href="/about"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <span>Contact Us</span>
          <svg 
            className="ml-2 h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}