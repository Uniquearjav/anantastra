"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle({ variant = "dropdown", className = "" }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className={`relative h-9 w-9 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm ${className}`}
      >
        <span className="h-4 w-4" />
      </Button>
    )
  }

  if (variant === "cycle") {
    // Single-click cycle: light -> dark -> light
    const isDark = resolvedTheme === "dark"
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className={`relative h-9 w-9 rounded-full border border-border/40 bg-background/60 hover:bg-accent hover:text-accent-foreground backdrop-blur-md transition-all duration-300 hover:shadow-xs hover:border-primary/30 ${className}`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 text-indigo-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className={`relative h-9 w-9 rounded-full border border-border/40 bg-background/60 hover:bg-accent hover:text-accent-foreground backdrop-blur-md transition-all duration-300 hover:shadow-sm hover:border-primary/40 ${className}`}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 text-indigo-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 ${theme === "light" ? "font-semibold text-primary bg-primary/10" : ""}`}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 ${theme === "dark" ? "font-semibold text-primary bg-primary/10" : ""}`}
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 ${theme === "system" ? "font-semibold text-primary bg-primary/10" : ""}`}
        >
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
