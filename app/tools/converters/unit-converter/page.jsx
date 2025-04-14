"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [value, setValue] = useState("1");
  const [result, setResult] = useState("3.28084");

  // Define conversion units and factors
  const unitCategories = {
    length: {
      name: "Length",
      units: {
        meter: { name: "Meter (m)", factor: 1 },
        kilometer: { name: "Kilometer (km)", factor: 0.001 },
        centimeter: { name: "Centimeter (cm)", factor: 100 },
        millimeter: { name: "Millimeter (mm)", factor: 1000 },
        inch: { name: "Inch (in)", factor: 39.3701 },
        foot: { name: "Foot (ft)", factor: 3.28084 },
        yard: { name: "Yard (yd)", factor: 1.09361 },
        mile: { name: "Mile (mi)", factor: 0.000621371 },
      },
    },
    weight: {
      name: "Weight",
      units: {
        kilogram: { name: "Kilogram (kg)", factor: 1 },
        gram: { name: "Gram (g)", factor: 1000 },
        milligram: { name: "Milligram (mg)", factor: 1000000 },
        pound: { name: "Pound (lb)", factor: 2.20462 },
        ounce: { name: "Ounce (oz)", factor: 35.274 },
        stone: { name: "Stone (st)", factor: 0.157473 },
        ton: { name: "Metric Ton (t)", factor: 0.001 },
      },
    },
    temperature: {
      name: "Temperature",
      units: {
        celsius: { name: "Celsius (°C)", factor: 1 },
        fahrenheit: { name: "Fahrenheit (°F)", factor: 1 },
        kelvin: { name: "Kelvin (K)", factor: 1 },
      },
    },
    volume: {
      name: "Volume",
      units: {
        liter: { name: "Liter (L)", factor: 1 },
        milliliter: { name: "Milliliter (mL)", factor: 1000 },
        cubicMeter: { name: "Cubic Meter (m³)", factor: 0.001 },
        gallon: { name: "Gallon (US gal)", factor: 0.264172 },
        quart: { name: "Quart (US qt)", factor: 1.05669 },
        pint: { name: "Pint (US pt)", factor: 2.11338 },
        cup: { name: "Cup (US cup)", factor: 4.22675 },
        fluidOunce: { name: "Fluid Ounce (US fl oz)", factor: 33.814 },
        tablespoon: { name: "Tablespoon (US tbsp)", factor: 67.628 },
        teaspoon: { name: "Teaspoon (US tsp)", factor: 202.884 },
      },
    },
    area: {
      name: "Area",
      units: {
        squareMeter: { name: "Square Meter (m²)", factor: 1 },
        squareFoot: { name: "Square Foot (ft²)", factor: 10.7639 },
        squareInch: { name: "Square Inch (in²)", factor: 1550 },
        squareKilometer: { name: "Square Kilometer (km²)", factor: 0.000001 },
        hectare: { name: "Hectare (ha)", factor: 0.0001 },
        acre: { name: "Acre", factor: 0.000247105 },
        squareMile: { name: "Square Mile (mi²)", factor: 3.861e-7 },
      },
    },
    speed: {
      name: "Speed",
      units: {
        meterPerSecond: { name: "Meter per Second (m/s)", factor: 1 },
        kilometerPerHour: { name: "Kilometer per Hour (km/h)", factor: 3.6 },
        milePerHour: { name: "Mile per Hour (mph)", factor: 2.23694 },
        knot: { name: "Knot (kn)", factor: 1.94384 },
        foot_per_second: { name: "Foot per Second (ft/s)", factor: 3.28084 },
      },
    },
    time: {
      name: "Time",
      units: {
        second: { name: "Second (s)", factor: 1 },
        minute: { name: "Minute (min)", factor: 1/60 },
        hour: { name: "Hour (h)", factor: 1/3600 },
        day: { name: "Day (d)", factor: 1/86400 },
        week: { name: "Week (wk)", factor: 1/604800 },
        month: { name: "Month (mo, 30 days)", factor: 1/2592000 },
        year: { name: "Year (yr, 365 days)", factor: 1/31536000 },
      },
    },
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    
    // Set default units for the new category
    const units = Object.keys(unitCategories[newCategory].units);
    setFromUnit(units[0]);
    setToUnit(units.length > 1 ? units[1] : units[0]);
    
    // Reset input values
    setValue("1");
    
    // Trigger conversion with new units
    setTimeout(() => convert("1", units[0], units.length > 1 ? units[1] : units[0], newCategory), 0);
  };

  const handleSwapUnits = () => {
    // Swap the from/to units
    const tempFromUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempFromUnit);
    
    // Trigger conversion with swapped units
    setTimeout(() => convert(value, toUnit, fromUnit, category), 0);
  };

  const convert = (value, from, to, cat) => {
    if (!value || isNaN(parseFloat(value))) {
      setResult("");
      return;
    }

    const inputValue = parseFloat(value);
    let resultValue;
    
    // Special case for temperature which doesn't use direct conversion factors
    if (cat === "temperature") {
      if (from === to) {
        resultValue = inputValue;
      } else if (from === "celsius" && to === "fahrenheit") {
        resultValue = (inputValue * 9/5) + 32;
      } else if (from === "celsius" && to === "kelvin") {
        resultValue = inputValue + 273.15;
      } else if (from === "fahrenheit" && to === "celsius") {
        resultValue = (inputValue - 32) * 5/9;
      } else if (from === "fahrenheit" && to === "kelvin") {
        resultValue = (inputValue - 32) * 5/9 + 273.15;
      } else if (from === "kelvin" && to === "celsius") {
        resultValue = inputValue - 273.15;
      } else if (from === "kelvin" && to === "fahrenheit") {
        resultValue = (inputValue - 273.15) * 9/5 + 32;
      }
    } else {
      // For other categories, we use the standard conversion formula:
      // First convert to the base unit, then convert to the target unit
      const fromFactor = unitCategories[cat].units[from].factor;
      const toFactor = unitCategories[cat].units[to].factor;
      resultValue = (inputValue * toFactor) / fromFactor;
    }
    
    // Format the result based on its magnitude
    let formatted;
    if (Math.abs(resultValue) >= 1000000 || Math.abs(resultValue) < 0.001 && resultValue !== 0) {
      formatted = resultValue.toExponential(6);
    } else {
      const decimalPlaces = Math.min(10, Math.max(2, 6 - Math.floor(Math.log10(Math.abs(resultValue) || 1))));
      formatted = resultValue.toFixed(decimalPlaces);
    }
    
    setResult(formatted);
  };

  // Handle input changes
  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    convert(newValue, fromUnit, toUnit, category);
  };

  const handleFromUnitChange = (e) => {
    const newUnit = e.target.value;
    setFromUnit(newUnit);
    convert(value, newUnit, toUnit, category);
  };

  const handleToUnitChange = (e) => {
    const newUnit = e.target.value;
    setToUnit(newUnit);
    convert(value, fromUnit, newUnit, category);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Unit Converter</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        {/* Category selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Category</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(unitCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {unitCategories[cat].name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From unit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="fromValue">
              From
            </label>
            <Input
              id="fromValue"
              type="number"
              value={value}
              onChange={handleValueChange}
              className="w-full mb-2"
            />
            <select
              value={fromUnit}
              onChange={handleFromUnitChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              {Object.keys(unitCategories[category].units).map((unit) => (
                <option key={unit} value={unit}>
                  {unitCategories[category].units[unit].name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Swap button */}
          <div className="flex items-center justify-center hidden md:flex">
            <Button
              onClick={handleSwapUnits}
              variant="ghost"
              size="icon"
              className="rounded-full self-center mt-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4"></path>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <path d="M7 23l-4-4 4-4"></path>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
            </Button>
          </div>
          
          {/* Mobile swap button */}
          <div className="flex justify-center md:hidden">
            <Button
              onClick={handleSwapUnits}
              variant="ghost"
              size="sm"
              className="my-2"
            >
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4"></path>
                <path d="M17 8v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
              Swap
            </Button>
          </div>
          
          {/* To unit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="toValue">
              To
            </label>
            <Input
              id="toValue"
              type="text"
              value={result}
              readOnly
              className="w-full mb-2 bg-gray-50 dark:bg-gray-700"
            />
            <select
              value={toUnit}
              onChange={handleToUnitChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              {Object.keys(unitCategories[category].units).map((unit) => (
                <option key={unit} value={unit}>
                  {unitCategories[category].units[unit].name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Conversion formula */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-medium mb-2">Conversion Formula:</h3>
          {category === "temperature" ? (
            <div>
              {fromUnit === "celsius" && toUnit === "fahrenheit" && (
                <p className="font-mono text-sm">°F = (°C × 9/5) + 32</p>
              )}
              {fromUnit === "celsius" && toUnit === "kelvin" && (
                <p className="font-mono text-sm">K = °C + 273.15</p>
              )}
              {fromUnit === "fahrenheit" && toUnit === "celsius" && (
                <p className="font-mono text-sm">°C = (°F - 32) × 5/9</p>
              )}
              {fromUnit === "fahrenheit" && toUnit === "kelvin" && (
                <p className="font-mono text-sm">K = (°F - 32) × 5/9 + 273.15</p>
              )}
              {fromUnit === "kelvin" && toUnit === "celsius" && (
                <p className="font-mono text-sm">°C = K - 273.15</p>
              )}
              {fromUnit === "kelvin" && toUnit === "fahrenheit" && (
                <p className="font-mono text-sm">°F = (K - 273.15) × 9/5 + 32</p>
              )}
              {fromUnit === toUnit && (
                <p className="font-mono text-sm">No conversion needed</p>
              )}
            </div>
          ) : (
            <p className="font-mono text-sm">
              {unitCategories[category].units[toUnit].name.split(' ')[0]} = {unitCategories[category].units[fromUnit].name.split(' ')[0]} × {(unitCategories[category].units[toUnit].factor / unitCategories[category].units[fromUnit].factor).toLocaleString(undefined, { maximumFractionDigits: 8 })}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About Unit Conversion</h2>
        <p className="mb-4">
          Unit conversion is the process of converting measurements from one unit to another within the same system or between different measurement systems.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Conversion Types:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Length (meters to feet, inches to centimeters)</li>
              <li>Weight (kilograms to pounds, ounces to grams)</li>
              <li>Volume (liters to gallons, cups to milliliters)</li>
              <li>Temperature (Celsius to Fahrenheit, Kelvin)</li>
              <li>Area (square meters to acres, square feet)</li>
              <li>Speed (mph to km/h, m/s to mph)</li>
              <li>Time (seconds to hours, days to minutes)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Measurement Systems:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-medium">Metric System (SI)</span>: Used worldwide, based on powers of 10
              </li>
              <li>
                <span className="font-medium">Imperial System</span>: Used primarily in the US and a few other countries
              </li>
              <li>
                <span className="font-medium">US Customary Units</span>: Similar to imperial but with some differences in volume measurements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}