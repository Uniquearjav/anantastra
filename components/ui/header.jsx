'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Home, 
  Wrench, 
  Calculator, 
  Info, 
  Github, 
  Menu,
  Sparkles,
  Search,
  ExternalLink,
  BookOpen
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tools', label: 'Tools', icon: Wrench, badge: 'All' },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/interest-calculator', label: 'Interest Calculator', icon: Calculator },
  { href: '/about', label: 'About', icon: Info },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm shadow-black/5 dark:shadow-black/20' 
          : 'bg-background/50 backdrop-blur-md border-b border-border/30'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Anantastra
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  v2.0
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-background text-foreground shadow-xs shadow-black/5 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GitHub Link Button */}
            <a
              href="https://github.com/Uniquearjav/anantastra"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-1.5 rounded-full border-border/70 hover:border-primary/40 bg-background/60 hover:bg-accent/80 text-xs font-medium backdrop-blur-sm transition-all duration-200"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </Button>
            </a>

            {/* Modern 21st-century Theme Toggle */}
            <ThemeToggle variant="dropdown" />

            {/* Mobile Menu Trigger via Sheet */}
            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full border border-border/50 bg-background/50"
                    aria-label="Open menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-[380px] p-6 border-l border-border/60 bg-background/95 backdrop-blur-xl">
                  <SheetHeader className="text-left pb-4 border-b border-border/50">
                    <SheetTitle className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-lg">Anantastra</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        v2.0
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-1 py-6">
                    {NAV_LINKS.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setSheetOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
                    <a
                      href="https://github.com/Uniquearjav/anantastra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full justify-center gap-2 rounded-xl border-border/80">
                        <Github className="h-4 w-4" />
                        <span>Star on GitHub</span>
                        <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                      </Button>
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}