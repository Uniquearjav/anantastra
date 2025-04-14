"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasswordAgeChecker() {
  const [passwords, setPasswords] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("age"); // "age", "name", "date"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"

  // Load passwords from localStorage
  useEffect(() => {
    const savedPasswords = localStorage.getItem("passwordAges");
    if (savedPasswords) {
      setPasswords(JSON.parse(savedPasswords));
    }
    setLoading(false);
  }, []);

  // Save passwords to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("passwordAges", JSON.stringify(passwords));
    }
  }, [passwords, loading]);

  const addPassword = () => {
    if (!accountName || !creationDate) return;
    
    const newPassword = {
      id: Date.now(),
      accountName,
      creationDate,
      notes
    };
    
    setPasswords([...passwords, newPassword]);
    clearForm();
  };

  const updatePassword = () => {
    if (editingIndex === null || !accountName || !creationDate) return;
    
    const updatedPasswords = [...passwords];
    updatedPasswords[editingIndex] = {
      ...updatedPasswords[editingIndex],
      accountName,
      creationDate,
      notes
    };
    
    setPasswords(updatedPasswords);
    clearForm();
    setEditingIndex(null);
  };

  const deletePassword = (index) => {
    const updatedPasswords = [...passwords];
    updatedPasswords.splice(index, 1);
    setPasswords(updatedPasswords);
  };

  const startEditing = (index) => {
    const password = passwords[index];
    setAccountName(password.accountName);
    setCreationDate(password.creationDate);
    setNotes(password.notes || "");
    setEditingIndex(index);
  };

  const clearForm = () => {
    setAccountName("");
    setCreationDate("");
    setNotes("");
    setEditingIndex(null);
  };

  const calculateAge = (dateString) => {
    const creationDate = new Date(dateString);
    const today = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = today - creationDate;
    
    // Calculate difference in days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, and remaining days
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);
    
    return { diffDays, years, months, days };
  };

  const getSeverityColor = (diffDays) => {
    if (diffDays < 90) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    if (diffDays < 180) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    if (diffDays < 365) return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
  };

  const formatAge = (age) => {
    if (age.years > 0) {
      return `${age.years} year${age.years !== 1 ? 's' : ''} ${age.months} month${age.months !== 1 ? 's' : ''}`;
    } else if (age.months > 0) {
      return `${age.months} month${age.months !== 1 ? 's' : ''} ${age.days} day${age.days !== 1 ? 's' : ''}`;
    } else {
      return `${age.days} day${age.days !== 1 ? 's' : ''}`;
    }
  };

  const getRecommendation = (diffDays) => {
    if (diffDays < 90) return "✓ Password is relatively new.";
    if (diffDays < 180) return "Consider changing soon.";
    if (diffDays < 365) return "Recommended to change.";
    return "Urgent: Password should be changed immediately.";
  };

  // Filter and sort functions
  const filteredPasswords = passwords
    .filter(password => password.accountName.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedPasswords = [...filteredPasswords].sort((a, b) => {
    if (sortBy === "age") {
      const ageA = new Date(a.creationDate);
      const ageB = new Date(b.creationDate);
      return sortOrder === "asc" ? ageA - ageB : ageB - ageA;
    } else if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.accountName.localeCompare(b.accountName) 
        : b.accountName.localeCompare(a.accountName);
    } else if (sortBy === "date") {
      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Password Age Checker</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingIndex !== null ? "Edit Password Entry" : "Add New Password Entry"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="accountName">
              Account or Website Name *
            </label>
            <Input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Gmail, Facebook, Netflix"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="creationDate">
              Password Creation Date *
            </label>
            <Input
              id="creationDate"
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this password (Don't store the actual password here)"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700"
          />
        </div>
        
        <div className="flex gap-2">
          {editingIndex !== null ? (
            <>
              <Button onClick={updatePassword} className="flex-1 bg-red-600 hover:bg-red-700">
                Update Entry
              </Button>
              <Button variant="outline" onClick={clearForm}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={addPassword} className="flex-1 bg-red-600 hover:bg-red-700">
              Add Entry
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold">Your Password Entries</h2>
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {sortedPasswords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    Account Name
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    Creation Date
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('age')}
                  >
                    Age
                    {sortBy === 'age' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedPasswords.map((password, index) => {
                  const age = calculateAge(password.creationDate);
                  const severityClass = getSeverityColor(age.diffDays);
                  const recommendation = getRecommendation(age.diffDays);
                  
                  return (
                    <tr key={password.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{password.accountName}</div>
                        {password.notes && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {password.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(password.creationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatAge(age)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs ${severityClass}`}>
                          {recommendation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => startEditing(index)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePassword(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No password entries found. Add your first entry above.</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-red-800 dark:text-red-300">Password Security Best Practices</h2>
        <ul className="list-disc pl-5 space-y-2 text-red-700 dark:text-red-400">
          <li>Change your passwords regularly (every 3-6 months)</li>
          <li>Use different passwords for different accounts</li>
          <li>Create strong passwords with a mix of characters</li>
          <li>Use a password manager to store and generate secure passwords</li>
          <li>Enable two-factor authentication when available</li>
          <li>Check if your accounts have been compromised on <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800 dark:hover:text-red-300">haveibeenpwned.com</a></li>
        </ul>
        
        <div className="mt-6 text-sm text-red-600 dark:text-red-400">
          <p><strong>Important Note:</strong> This tool stores all information locally in your browser. No data is sent to any server.</p>
        </div>
      </div>
    </div>
  );
}