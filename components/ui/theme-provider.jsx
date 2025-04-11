'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Create a context for theme
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Check for user preference or stored theme on client side
  const [theme, setTheme] = useState('light')
  
  // Initialize theme on component mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('anantastra-theme')
    
    // If no saved theme, check user preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      localStorage.setItem('anantastra-theme', initialTheme)
    } else {
      setTheme(savedTheme)
    }
  }, [])

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Save to localStorage when theme changes
    localStorage.setItem('anantastra-theme', theme)
  }, [theme])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}