"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = "";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+{}[]|:;<>,.?/~`";

    if (charset === "") {
      setPassword("Please select at least one character type");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setPassword(generatedPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [passwordLength, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Random Password Generator</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <Input
            type="text"
            value={password}
            readOnly
            className="font-mono text-lg"
          />
          <Button onClick={copyToClipboard} className="bg-red-600 hover:bg-red-700">Copy</Button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Password Length: {passwordLength}
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={passwordLength}
              onChange={(e) => setPasswordLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                checked={includeUpper}
                onChange={() => setIncludeUpper(!includeUpper)}
                className="mr-2"
              />
              <label htmlFor="uppercase">Include Uppercase Letters (A-Z)</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowercase"
                checked={includeLower}
                onChange={() => setIncludeLower(!includeLower)}
                className="mr-2"
              />
              <label htmlFor="lowercase">Include Lowercase Letters (a-z)</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="numbers"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                className="mr-2"
              />
              <label htmlFor="numbers">Include Numbers (0-9)</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="symbols"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                className="mr-2"
              />
              <label htmlFor="symbols">Include Symbols (!@#$%...)</label>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full bg-red-600 hover:bg-red-700">
            Generate New Password
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Password Security Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use a minimum of 12 characters for better security</li>
          <li>Include a mix of uppercase letters, lowercase letters, numbers, and symbols</li>
          <li>Avoid using easily guessable information like birthdates or names</li>
          <li>Use different passwords for different accounts</li>
          <li>Consider using a password manager to store your passwords securely</li>
        </ul>
      </div>
    </div>
  );
}