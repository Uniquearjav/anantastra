"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const nextTheme = useNextTheme()
  const current = nextTheme.resolvedTheme || nextTheme.theme || 'light'
  
  const toggleTheme = () => {
    nextTheme.setTheme(current === 'dark' ? 'light' : 'dark')
  }

  return {
    ...nextTheme,
    theme: current,
    systemTheme: nextTheme.theme,
    toggleTheme,
  }
}