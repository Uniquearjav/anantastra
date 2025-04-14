"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Popular currencies list
  const currencies = {
    USD: { name: "US Dollar", symbol: "$" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound", symbol: "£" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    AUD: { name: "Australian Dollar", symbol: "A$" },
    CAD: { name: "Canadian Dollar", symbol: "C$" },
    CHF: { name: "Swiss Franc", symbol: "Fr" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    MXN: { name: "Mexican Peso", symbol: "$" },
    SGD: { name: "Singapore Dollar", symbol: "S$" },
    NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
    BRL: { name: "Brazilian Real", symbol: "R$" },
    RUB: { name: "Russian Ruble", symbol: "₽" },
    ZAR: { name: "South African Rand", symbol: "R" },
  };

  // We'll use fixed exchange rates for demo purposes
  // In a production app, you would fetch live rates from an API
  useEffect(() => {
    // Demo exchange rates (as of a recent date)
    const demoRates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 150.25,
      AUD: 1.51,
      CAD: 1.36,
      CHF: 0.90,
      CNY: 7.24,
      INR: 83.18,
      MXN: 16.73,
      SGD: 1.34,
      NZD: 1.64,
      BRL: 5.06,
      RUB: 89.50,
      ZAR: 18.36
    };

    setExchangeRates(demoRates);
    setLastUpdated(new Date());
    setLoading(false);

    // Sample function to fetch real rates (commented out)
    // In a real app, you would use an API like this:
    // 
    // const fetchRates = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    //     const data = await response.json();
    //     setExchangeRates({ USD: 1, ...data.rates });
    //     setLastUpdated(new Date(data.time_last_updated * 1000));
    //     setLoading(false);
    //   } catch (err) {
    //     setError("Failed to fetch exchange rates. Using demo data.");
    //     setLoading(false);
    //   }
    // };
    // 
    // fetchRates();
    
    // Initial conversion
    handleConvert();
  }, []);

  const handleConvert = () => {
    if (!amount || isNaN(parseFloat(amount)) || !fromCurrency || !toCurrency) {
      return;
    }

    const amountValue = parseFloat(amount);
    
    // Convert to USD first (base currency), then to target currency
    const valueInUSD = amountValue / exchangeRates[fromCurrency];
    const convertedValue = valueInUSD * exchangeRates[toCurrency];
    
    setResult({
      fromAmount: amountValue,
      fromCurrency,
      toAmount: convertedValue,
      toCurrency,
      rate: exchangeRates[toCurrency] / exchangeRates[fromCurrency]
    });
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // Trigger conversion after state update
    setTimeout(() => handleConvert(), 0);
  };

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount)) && fromCurrency && toCurrency) {
      handleConvert();
    }
  }, [fromCurrency, toCurrency, amount]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Currency Converter</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Currency Converter</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="amount">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-5/12">
                <label className="block text-sm font-medium mb-1" htmlFor="fromCurrency">
                  From
                </label>
                <select
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                >
                  {Object.keys(currencies).map(code => (
                    <option key={code} value={code}>
                      {code} - {currencies[code].name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleSwapCurrencies}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-90">
                    <path d="M17 1l4 4-4 4"></path>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <path d="M7 23l-4-4 4-4"></path>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                </Button>
              </div>
              
              <div className="w-5/12">
                <label className="block text-sm font-medium mb-1" htmlFor="toCurrency">
                  To
                </label>
                <select
                  id="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                >
                  {Object.keys(currencies).map(code => (
                    <option key={code} value={code}>
                      {code} - {currencies[code].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Button onClick={handleConvert} className="w-full">
            Convert
          </Button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-center">
              <div className="text-lg mb-2">
                <span className="font-semibold">{result.fromAmount.toLocaleString()} {result.fromCurrency}</span>
                {" "} = {" "}
                <span className="font-bold text-xl">{result.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {result.toCurrency}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
              </div>
            </div>
          </div>
        )}
        
        {lastUpdated && (
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              Note: Using demo exchange rates for educational purposes.
            </p>
            <p>
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">About Currency Conversion</h2>
        <p className="mb-4">
          Currency conversion is the process of changing one currency into another at a specific exchange rate.
          Exchange rates fluctuate based on market forces, central bank policies, economic indicators, and geopolitical events.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Exchange Rate Basics:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Exchange rates represent the value of one currency in terms of another</li>
          <li>Rates are influenced by inflation, interest rates, political stability, and economic performance</li>
          <li>Most currencies use a floating exchange rate system, allowing values to fluctuate with the market</li>
        </ul>
        
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <p>
            <strong>Note:</strong> This converter uses fixed demo exchange rates for educational purposes.
            In real-world applications, live exchange rates should be obtained from financial data providers or banks.
          </p>
        </div>
      </div>
    </div>
  );
}