"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DecimalBinaryCalculator() {
  const [decimalValue, setDecimalValue] = useState("");
  const [binaryValue, setBinaryValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [octalValue, setOctalValue] = useState("");
  const [conversionSteps, setConversionSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);
  const [conversionType, setConversionType] = useState("decimal-to-binary");
  const [error, setError] = useState("");

  // Function to convert decimal to binary with steps
  const convertDecimalToBinary = (decimal) => {
    const steps = [];
    let quotient = parseInt(decimal);
    let result = "";
    
    if (quotient === 0) {
      return { binary: "0", steps: [{ quotient: 0, remainder: 0, result: "0" }] };
    }

    while (quotient > 0) {
      const remainder = quotient % 2;
      result = remainder + result;
      
      steps.push({
        quotient: quotient,
        remainder: remainder,
        result: result
      });
      
      quotient = Math.floor(quotient / 2);
    }
    
    return { binary: result, steps };
  };

  // Function to convert binary to decimal with steps
  const convertBinaryToDecimal = (binary) => {
    const steps = [];
    let result = 0;
    
    for (let i = 0; i < binary.length; i++) {
      const digit = parseInt(binary[i]);
      const position = binary.length - 1 - i;
      const positionValue = digit * Math.pow(2, position);
      
      result += positionValue;
      
      steps.push({
        digit,
        position,
        calculation: `${digit} × 2^${position}`,
        positionValue,
        runningTotal: result
      });
    }
    
    return { decimal: result, steps };
  };

  // Function to convert decimal to hexadecimal
  const convertDecimalToHex = (decimal) => {
    return parseInt(decimal).toString(16).toUpperCase();
  };

  // Function to convert decimal to octal
  const convertDecimalToOctal = (decimal) => {
    return parseInt(decimal).toString(8);
  };

  // Function to convert hexadecimal to decimal
  const convertHexToDecimal = (hex) => {
    return parseInt(hex, 16).toString();
  };

  // Function to convert binary to hexadecimal
  const convertBinaryToHex = (binary) => {
    const decimal = parseInt(binary, 2);
    return decimal.toString(16).toUpperCase();
  };

  // Function to convert binary to octal
  const convertBinaryToOctal = (binary) => {
    const decimal = parseInt(binary, 2);
    return decimal.toString(8);
  };

  // Function to convert hexadecimal to binary
  const convertHexToBinary = (hex) => {
    try {
      const decimal = parseInt(hex, 16);
      return decimal.toString(2);
    } catch (e) {
      return "";
    }
  };

  // Function to convert octal to decimal
  const convertOctalToDecimal = (octal) => {
    return parseInt(octal, 8).toString();
  };

  // Function to convert octal to binary
  const convertOctalToBinary = (octal) => {
    try {
      const decimal = parseInt(octal, 8);
      return decimal.toString(2);
    } catch (e) {
      return "";
    }
  };

  // Validate input values
  const validateInput = (value, type) => {
    if (!value.trim()) {
      return { isValid: false, message: "Please enter a value" };
    }
    
    if (type === "decimal" && !/^\d+$/.test(value)) {
      return { isValid: false, message: "Decimal must contain only digits (0-9)" };
    }
    
    if (type === "binary" && !/^[01]+$/.test(value)) {
      return { isValid: false, message: "Binary must contain only 0s and 1s" };
    }
    
    if (type === "hex" && !/^[0-9A-Fa-f]+$/.test(value)) {
      return { isValid: false, message: "Hexadecimal must contain only digits and A-F letters" };
    }
    
    if (type === "octal" && !/^[0-7]+$/.test(value)) {
      return { isValid: false, message: "Octal must contain only digits 0-7" };
    }

    // Check if the decimal value is within safe integer bounds
    if (type === "decimal" && parseInt(value) > Number.MAX_SAFE_INTEGER) {
      return { isValid: false, message: "Number too large for accurate conversion" };
    }
    
    return { isValid: true };
  };

  // Handle conversion based on selected type
  const handleConvert = () => {
    setError("");
    setConversionSteps([]);
    
    switch (conversionType) {
      case "decimal-to-binary":
        const decimalValidation = validateInput(decimalValue, "decimal");
        if (!decimalValidation.isValid) {
          setError(decimalValidation.message);
          setBinaryValue("");
          setHexValue("");
          setOctalValue("");
          return;
        }
        
        try {
          const { binary, steps } = convertDecimalToBinary(decimalValue);
          setBinaryValue(binary);
          setConversionSteps(steps);
          setHexValue(convertDecimalToHex(decimalValue));
          setOctalValue(convertDecimalToOctal(decimalValue));
        } catch (e) {
          setError("Error converting decimal to binary");
        }
        break;
        
      case "binary-to-decimal":
        const binaryValidation = validateInput(binaryValue, "binary");
        if (!binaryValidation.isValid) {
          setError(binaryValidation.message);
          setDecimalValue("");
          setHexValue("");
          setOctalValue("");
          return;
        }
        
        try {
          const { decimal, steps } = convertBinaryToDecimal(binaryValue);
          setDecimalValue(decimal.toString());
          setConversionSteps(steps);
          setHexValue(convertBinaryToHex(binaryValue));
          setOctalValue(convertBinaryToOctal(binaryValue));
        } catch (e) {
          setError("Error converting binary to decimal");
        }
        break;
        
      case "hex-to-decimal":
        const hexValidation = validateInput(hexValue, "hex");
        if (!hexValidation.isValid) {
          setError(hexValidation.message);
          setDecimalValue("");
          setBinaryValue("");
          setOctalValue("");
          return;
        }
        
        try {
          const decimal = convertHexToDecimal(hexValue);
          setDecimalValue(decimal);
          setBinaryValue(convertHexToBinary(hexValue));
          setOctalValue(convertDecimalToOctal(decimal));
        } catch (e) {
          setError("Error converting hexadecimal to decimal");
        }
        break;
        
      case "octal-to-decimal":
        const octalValidation = validateInput(octalValue, "octal");
        if (!octalValidation.isValid) {
          setError(octalValidation.message);
          setDecimalValue("");
          setBinaryValue("");
          setHexValue("");
          return;
        }
        
        try {
          const decimal = convertOctalToDecimal(octalValue);
          setDecimalValue(decimal);
          setBinaryValue(convertOctalToBinary(octalValue));
          setHexValue(convertDecimalToHex(decimal));
        } catch (e) {
          setError("Error converting octal to decimal");
        }
        break;
    }
  };

  // Handle input changes based on conversion type
  const handleInputChange = (e) => {
    const { value } = e.target;
    
    switch (conversionType) {
      case "decimal-to-binary":
        setDecimalValue(value);
        break;
      case "binary-to-decimal":
        setBinaryValue(value);
        break;
      case "hex-to-decimal":
        setHexValue(value.toUpperCase());
        break;
      case "octal-to-decimal":
        setOctalValue(value);
        break;
    }
  };

  // Reset all values
  const handleReset = () => {
    setDecimalValue("");
    setBinaryValue("");
    setHexValue("");
    setOctalValue("");
    setConversionSteps([]);
    setError("");
    setShowSteps(false);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Number Base Converter</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Conversion Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: "decimal-to-binary", label: "Decimal to Binary" },
              { id: "binary-to-decimal", label: "Binary to Decimal" },
              { id: "hex-to-decimal", label: "Hex to Decimal" },
              { id: "octal-to-decimal", label: "Octal to Decimal" },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 rounded-md cursor-pointer border ${
                  conversionType === option.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="conversionType"
                  value={option.id}
                  checked={conversionType === option.id}
                  onChange={() => {
                    setConversionType(option.id);
                    setError("");
                    setShowSteps(false);
                    setConversionSteps([]);
                  }}
                  className="sr-only"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="inputValue">
              {conversionType === "decimal-to-binary" ? "Decimal Value" :
               conversionType === "binary-to-decimal" ? "Binary Value" :
               conversionType === "hex-to-decimal" ? "Hexadecimal Value" : "Octal Value"}
            </label>
            <Input
              id="inputValue"
              value={
                conversionType === "decimal-to-binary" ? decimalValue :
                conversionType === "binary-to-decimal" ? binaryValue :
                conversionType === "hex-to-decimal" ? hexValue : octalValue
              }
              onChange={handleInputChange}
              placeholder={
                conversionType === "decimal-to-binary" ? "Enter decimal number (e.g., 42)" :
                conversionType === "binary-to-decimal" ? "Enter binary number (e.g., 101010)" :
                conversionType === "hex-to-decimal" ? "Enter hexadecimal number (e.g., 2A)" :
                "Enter octal number (e.g., 52)"
              }
              className="font-mono"
            />
            
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={handleConvert} className="flex-1">
              Convert
            </Button>
            
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
          
          {/* Results section */}
          {(decimalValue || binaryValue || hexValue || octalValue) && !error && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-medium mb-4">Conversion Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                    Decimal
                  </div>
                  <div className="font-mono break-all">
                    {decimalValue || "-"}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                    Binary
                  </div>
                  <div className="font-mono break-all">
                    {binaryValue || "-"}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                    Hexadecimal
                  </div>
                  <div className="font-mono break-all">
                    {hexValue || "-"}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                    Octal
                  </div>
                  <div className="font-mono break-all">
                    {octalValue || "-"}
                  </div>
                </div>
              </div>
              
              {/* Show conversion steps for decimal-to-binary and binary-to-decimal */}
              {(conversionType === "decimal-to-binary" || conversionType === "binary-to-decimal") && 
               conversionSteps.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                  >
                    {showSteps ? 'Hide Conversion Steps' : 'Show Conversion Steps'}
                    <svg 
                      className={`ml-1 w-4 h-4 transition-transform ${showSteps ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showSteps && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-x-auto">
                      {conversionType === "decimal-to-binary" ? (
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b dark:border-gray-600">
                              <th className="text-left py-2 px-4">Decimal</th>
                              <th className="text-left py-2 px-4">Division by 2</th>
                              <th className="text-left py-2 px-4">Remainder (Binary Digit)</th>
                              <th className="text-left py-2 px-4">Binary Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {conversionSteps.map((step, index) => (
                              <tr key={index} className="border-b dark:border-gray-600">
                                <td className="py-2 px-4">{step.quotient}</td>
                                <td className="py-2 px-4">{step.quotient} ÷ 2 = {Math.floor(step.quotient / 2)}</td>
                                <td className="py-2 px-4">{step.remainder}</td>
                                <td className="py-2 px-4 font-mono">{step.result}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b dark:border-gray-600">
                              <th className="text-left py-2 px-4">Position</th>
                              <th className="text-left py-2 px-4">Binary Digit</th>
                              <th className="text-left py-2 px-4">Calculation</th>
                              <th className="text-left py-2 px-4">Value</th>
                              <th className="text-left py-2 px-4">Running Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {conversionSteps.map((step, index) => (
                              <tr key={index} className="border-b dark:border-gray-600">
                                <td className="py-2 px-4">{step.position}</td>
                                <td className="py-2 px-4">{step.digit}</td>
                                <td className="py-2 px-4">{step.calculation}</td>
                                <td className="py-2 px-4">{step.positionValue}</td>
                                <td className="py-2 px-4">{step.runningTotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Educational section about number systems */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Understanding Number Systems</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Decimal (Base 10)</h3>
            <p className="mb-2">
              The decimal system is the most common number system, using digits 0-9. Each position represents a power of 10.
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono">
              123<sub>10</sub> = 1×10<sup>2</sup> + 2×10<sup>1</sup> + 3×10<sup>0</sup> = 100 + 20 + 3 = 123
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Binary (Base 2)</h3>
            <p className="mb-2">
              The binary system uses only 0 and 1. Each position represents a power of 2.
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono">
              1101<sub>2</sub> = 1×2<sup>3</sup> + 1×2<sup>2</sup> + 0×2<sup>1</sup> + 1×2<sup>0</sup> = 8 + 4 + 0 + 1 = 13<sub>10</sub>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Hexadecimal (Base 16)</h3>
            <p className="mb-2">
              The hexadecimal system uses digits 0-9 and letters A-F (representing values 10-15). Each position represents a power of 16.
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono">
              1A<sub>16</sub> = 1×16<sup>1</sup> + 10×16<sup>0</sup> = 16 + 10 = 26<sub>10</sub>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Octal (Base 8)</h3>
            <p className="mb-2">
              The octal system uses digits 0-7. Each position represents a power of 8.
            </p>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono">
              52<sub>8</sub> = 5×8<sup>1</sup> + 2×8<sup>0</sup> = 40 + 2 = 42<sub>10</sub>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Conversion Methods</h3>
          
          <div className="mt-4">
            <h4 className="font-medium mb-1">Decimal to Binary Conversion</h4>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              <li>Divide the decimal number by 2</li>
              <li>Record the remainder (0 or 1)</li>
              <li>Divide the quotient by 2</li>
              <li>Repeat until the quotient becomes 0</li>
              <li>Read the remainders from bottom to top</li>
            </ol>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-1">Binary to Decimal Conversion</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Multiply each binary digit by its position value (power of 2)</li>
              <li>Add all the results</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
          <h3 className="font-semibold mb-2">Common Applications</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Binary is used in computer memory and digital systems</li>
            <li>Hexadecimal is commonly used in programming for memory addresses and color codes</li>
            <li>Octal was historically used in some computing systems</li>
          </ul>
        </div>
      </div>
    </div>
  );
}