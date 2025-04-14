"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // Convert height to meters
  const getHeightInMeters = () => {
    const heightValue = parseFloat(height);
    if (isNaN(heightValue) || heightValue <= 0) return 0;

    switch (heightUnit) {
      case "cm":
        return heightValue / 100;
      case "m":
        return heightValue;
      case "ft":
        return heightValue * 0.3048;
      case "in":
        return heightValue * 0.0254;
      default:
        return 0;
    }
  };

  // Convert weight to kg
  const getWeightInKg = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) return 0;

    switch (weightUnit) {
      case "kg":
        return weightValue;
      case "lb":
        return weightValue * 0.453592;
      case "st":
        return weightValue * 6.35029;
      default:
        return 0;
    }
  };

  // Calculate BMI
  const calculateBMI = () => {
    const heightInM = getHeightInMeters();
    const weightInKg = getWeightInKg();

    if (heightInM <= 0 || weightInKg <= 0) {
      setBmi(null);
      setBmiCategory("");
      return;
    }

    const calculatedBMI = weightInKg / (heightInM * heightInM);
    setBmi(calculatedBMI);

    // Set BMI category
    if (calculatedBMI < 18.5) {
      setBmiCategory("Underweight");
    } else if (calculatedBMI < 25) {
      setBmiCategory("Normal weight");
    } else if (calculatedBMI < 30) {
      setBmiCategory("Overweight");
    } else if (calculatedBMI < 35) {
      setBmiCategory("Obesity Class I");
    } else if (calculatedBMI < 40) {
      setBmiCategory("Obesity Class II");
    } else {
      setBmiCategory("Obesity Class III");
    }
  };

  // Call calculateBMI when height, weight, or units change
  useEffect(() => {
    calculateBMI();
  }, [height, weight, heightUnit, weightUnit]);

  // Reset form
  const resetForm = () => {
    setHeight("");
    setWeight("");
    setHeightUnit("cm");
    setWeightUnit("kg");
    setBmi(null);
    setBmiCategory("");
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">BMI Calculator</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Height input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">
              Height
            </label>
            <div className="flex">
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height"
                min="0"
                step="0.01"
                className="flex-1 rounded-r-none"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-r-md focus:ring-primary"
              >
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="ft">ft</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
          
          {/* Weight input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">
              Weight
            </label>
            <div className="flex">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
                min="0"
                step="0.01"
                className="flex-1 rounded-r-none"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-r-md focus:ring-primary"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
                <option value="st">st</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={resetForm} variant="outline" className="mr-2">
            Reset
          </Button>
          <Button onClick={calculateBMI}>
            Calculate
          </Button>
        </div>
        
        {/* Results */}
        {bmi !== null && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Your BMI Result</h2>
              
              <div className="text-4xl font-bold mb-2">
                {bmi.toFixed(1)}
              </div>
              
              <div className={`text-lg font-medium mb-1 ${
                bmiCategory === "Normal weight" 
                  ? "text-green-600 dark:text-green-400" 
                  : bmiCategory === "Underweight" || bmiCategory === "Overweight"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {bmiCategory}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center mx-auto"
                >
                  {showInfo ? 'Hide information' : 'What does this mean?'}
                  <svg 
                    className={`ml-1 w-4 h-4 transition-transform ${showInfo ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* BMI information */}
            {showInfo && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">BMI Categories</h3>
                    <ul className="text-sm space-y-1">
                      <li className="flex justify-between">
                        <span>Underweight:</span>
                        <span className="font-medium">Below 18.5</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Normal weight:</span>
                        <span className="font-medium">18.5 - 24.9</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Overweight:</span>
                        <span className="font-medium">25 - 29.9</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Obesity Class I:</span>
                        <span className="font-medium">30 - 34.9</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Obesity Class II:</span>
                        <span className="font-medium">35 - 39.9</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Obesity Class III:</span>
                        <span className="font-medium">40 or above</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Your Information</h3>
                    <ul className="text-sm space-y-1">
                      <li className="flex justify-between">
                        <span>Height:</span>
                        <span className="font-medium">
                          {getHeightInMeters().toFixed(2)} m 
                          {heightUnit !== 'm' && ` (${height} ${heightUnit})`}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">
                          {getWeightInKg().toFixed(1)} kg
                          {weightUnit !== 'kg' && ` (${weight} ${weightUnit})`}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-sm mt-4">
                  <strong>Note:</strong> BMI is a screening tool and not a diagnostic tool. 
                  It doesn't account for factors like muscle mass, bone density, or ethnic differences. 
                  Always consult with healthcare professionals for a proper health assessment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* BMI chart and explanations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About BMI</h2>
        
        <p className="mb-4">
          Body Mass Index (BMI) is a value derived from a person's weight and height. 
          It provides a simple numeric measure of a person's thickness or thinness, 
          allowing health professionals to discuss weight problems more objectively with their patients.
        </p>
        
        <div className="overflow-x-auto mt-6">
          <div className="w-full min-w-[600px]">
            <div className="h-6 flex">
              <div className="w-1/5 bg-blue-200 dark:bg-blue-900 text-center text-xs font-medium py-1">Underweight</div>
              <div className="w-1/5 bg-green-200 dark:bg-green-900 text-center text-xs font-medium py-1">Normal</div>
              <div className="w-1/5 bg-yellow-200 dark:bg-yellow-900 text-center text-xs font-medium py-1">Overweight</div>
              <div className="w-1/5 bg-orange-200 dark:bg-orange-900 text-center text-xs font-medium py-1">Obesity I/II</div>
              <div className="w-1/5 bg-red-200 dark:bg-red-900 text-center text-xs font-medium py-1">Obesity III</div>
            </div>
            <div className="h-6 flex text-xs text-center font-medium">
              <div className="w-1/5">16</div>
              <div className="w-1/5">18.5</div>
              <div className="w-1/5">25</div>
              <div className="w-1/5">30</div>
              <div className="w-1/5">35</div>
              <div style={{ width: "4.8%" }}>40</div>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">BMI Calculation Formula</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm">
          BMI = weight(kg) / [height(m)]²
        </div>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">Limitations of BMI</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Doesn't distinguish between muscle and fat</li>
          <li>May overestimate body fat in athletes and others with muscular builds</li>
          <li>May underestimate body fat in older people and those who have lost muscle mass</li>
          <li>Doesn't account for different body types and ethnic differences</li>
          <li>Doesn't consider where fat is distributed on the body</li>
        </ul>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg mt-4">
          <h3 className="font-semibold mb-2">Important Note:</h3>
          <p className="text-sm">
            This calculator is for informational purposes only and is not a substitute for medical advice. 
            BMI is just one factor to consider when assessing health risks related to weight. 
            Always consult with a healthcare provider for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}