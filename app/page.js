import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Calculator, 
  TrendingUp, 
  Receipt, 
  FileText, 
  KeyRound, 
  Lock, 
  Github, 
  Star,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function Home() {
  const popularTools = [
    {
      title: "SIP Calculator",
      category: "Finance",
      badge: "Popular",
      badgeVariant: "success",
      description: "Calculate expected returns on Systematic Investment Plans with Indian Rupee formatting and wealth charts.",
      href: "/tools/calculator/sip-calculator",
      icon: TrendingUp,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Interest Calculator",
      category: "Finance",
      badge: "Featured",
      badgeVariant: "subtle",
      description: "Compare simple vs compound interest over time with dynamic graphs, flexible compounding, and CSV export.",
      href: "/interest-calculator",
      icon: Calculator,
      accent: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "GST Calculator",
      category: "Tax & Compliance",
      badge: "India",
      badgeVariant: "outline",
      description: "Compute Goods & Services Tax quickly with standard 5%, 12%, 18%, and 28% slabs for inclusive or exclusive amounts.",
      href: "/tools/calculator/gst-calculator",
      icon: Receipt,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Income Tax Calculator",
      category: "Tax & Compliance",
      badge: "FY 2024-25",
      badgeVariant: "warning",
      description: "Accurately compare tax liabilities under the New vs Old Tax Regime in India with standard deduction calculations.",
      href: "/tools/calculator/income-tax-calculator",
      icon: Layers,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Text & String Utilities",
      category: "Productivity",
      badge: "Updated",
      badgeVariant: "subtle",
      description: "Transform, clean, count, and format text content instantly. Includes case convert, spaces cleaner, and morse code.",
      href: "/text",
      icon: FileText,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Password Generator",
      category: "Security",
      badge: "Secure",
      badgeVariant: "default",
      description: "Generate cryptographically strong passwords using browser-native entropy with custom rules and age verification.",
      href: "/password-generator",
      icon: KeyRound,
      accent: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
    }
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Zero Data Collection",
      description: "All computations occur directly in your browser's V8 engine. No cookies, no analytics tracking, and zero database queries.",
      accent: "bg-primary text-primary-foreground"
    },
    {
      icon: Zap,
      title: "Instant & Offline-First",
      description: "Zero round-trip latency to remote servers. The tools load instantly, cache efficiently, and function without interruption.",
      accent: "bg-amber-500 text-white"
    },
    {
      icon: Code2,
      title: "100% Free & Open Source",
      description: "Every line of code is inspectable on GitHub under the permissive MIT license. Fork it, contribute, or run it locally.",
      accent: "bg-emerald-600 text-white"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted/50 text-xs sm:text-sm font-medium text-foreground mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="font-semibold text-primary">Anantastra 2.0</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Free, Private & Open Source Utilities</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
              Infinite tools for{" "}
              <span className="text-primary">
                everyday tasks.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              A modern, privacy-first collection of web calculators and developer utilities running completely in your browser. With <strong className="text-foreground font-semibold">zero telemetry</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tools" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 px-7 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Explore Tools</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <a 
                href="https://github.com/Uniquearjav/anantastra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-12 px-7 rounded-full text-base border-border/80 bg-background/60 hover:bg-accent/70 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Github className="h-4 w-4 mr-2" />
                  <span>Star on GitHub</span>
                </Button>
              </a>
            </div>

            {/* Bento Key Metrics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">15+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Free Utilities</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Client-Side</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">0 Bytes</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Data Collected</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-500">MIT</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Open Source</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles / Features */}
      <section className="py-16 border-y border-border/40 bg-muted/20 backdrop-blur-xs">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="subtle" className="mb-3">
              Core Principles
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Built for speed, privacy, and simplicity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card 
                  key={idx} 
                  className="relative group overflow-hidden border-border/60 bg-card/80 backdrop-blur-md hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <CardHeader className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.accent} shadow-xs group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {feat.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                      {feat.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Tools Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="subtle" className="mb-3">
                Curated Showcase
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Popular Tools & Calculators
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Direct browser execution with zero login or signup required.
              </p>
            </div>
            <Link href="/tools">
              <Button variant="outline" className="gap-2 rounded-full border-border/80 hover:border-primary/40">
                <span>View All Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.title} href={tool.href} className="group block">
                  <Card className="h-full border-border/60 bg-card/75 backdrop-blur-md hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tool.accent}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant={tool.badgeVariant}>
                          {tool.badge}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {tool.category}
                        </span>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors flex items-center justify-between mt-1">
                          <span>{tool.title}</span>
                          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-primary" />
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="w-full pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        <span>Launch Tool</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community / User Testimonials */}
      <section className="py-16 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="subtle" className="mb-3">
              Community Loved
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Trusted by creators & financial planners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/60 bg-card/60 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-foreground/90 italic text-sm leading-relaxed">
                  "The interest and SIP calculators are blazingly fast with precise Indian Rupee formatting. Zero ads in the way and no tracking."
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                  JD
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">John D.</div>
                  <div className="text-xs text-muted-foreground">Certified Financial Advisor</div>
                </div>
              </CardFooter>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-foreground/90 italic text-sm leading-relaxed">
                  "I use the password generator and text tools daily. Knowing that it's 100% open source gives me total peace of mind."
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-xs">
                  SL
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Sarah L.</div>
                  <div className="text-xs text-muted-foreground">Full-Stack Engineer</div>
                </div>
              </CardFooter>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-md sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-foreground/90 italic text-sm leading-relaxed">
                  "The new dark and light mode UI is stunning. The contrast and responsiveness are on par with modern SaaS applications."
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Rahul K.</div>
                  <div className="text-xs text-muted-foreground">Product Designer</div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Source Callout Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl border border-border/70 bg-card p-8 sm:p-12 overflow-hidden shadow-xs">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center md:text-left">
                <Badge variant="subtle" className="mb-3">
                  Open Source Freedom
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Build and contribute to Anantastra
                </h2>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed">
                  Anantastra is community-built and open for everyone. Add new calculators, improve UI themes, or report feature requests on GitHub.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://github.com/Uniquearjav/anantastra"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="rounded-full gap-2 shadow-md">
                    <Github className="h-4 w-4" />
                    <span>Contribute on GitHub</span>
                  </Button>
                </a>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="rounded-full border-border/80">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
