import Link from "next/link";

export default function ToolsPage() {
  const categories = [
    {
      name: "Calculators",
      slug: "calculator",
      description: "Financial and mathematical calculation tools",
      color: "from-blue-500 to-blue-600",
      tools: [
        { name: "Loan EMI Calculator", slug: "loan-emi-calculator" },
        { name: "Interest Calculator", slug: "interest-calculator" },
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
        { name: "Morse Code Converter", slug: "morse-code-converter" },
        { name: "Currency Converter", slug: "currency-converter" },
        { name: "Unit Converter", slug: "unit-converter" },
        { name: "Number to Words", slug: "number-words-converter" },
        { name: "Roman to Decimal Converter", slug: "roman-decimal-converter" },
        { name: "Markdown to HTML Converter", slug: "markdown-html-converter" },
      ]
    },
    {
      name: "Checkers",
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
        { name: "SVG Previewer & Editor", slug: "svg-previewer" },
      ]
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className={`h-24 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>
              <ul className="space-y-2">
                {category.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link 
                      href={`/tools/${category.slug}/${tool.slug}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium">{tool.name}</span>
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
    </div>
  );
}