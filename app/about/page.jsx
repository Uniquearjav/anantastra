import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnantastraIcon } from "@/components/ui/logo";
import { 
  ShieldCheck, 
  Code2, 
  Zap, 
  Lock, 
  Globe, 
  Github, 
  Heart,
  Terminal,
  Cpu,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ServerOff
} from "lucide-react";

export const metadata = {
  title: "About Use All Tools | Free, Privacy-First Online Utilities",
  description: "Learn about Use All Tools, a free and privacy-focused suite of open-source web utilities and calculators. Discover our mission, zero-data-collection architecture, and tools.",
  keywords: [
    "Use All Tools",
    "About Use All Tools",
    "Open Source Tools",
    "Privacy First Utilities",
    "Client-side Calculators",
    "Free Online Utilities",
    "Web Developer Tools",
    "Financial Calculators",
    "Zero Telemetry Software"
  ],
  authors: [{ name: "Use All Tools Team" }],
  creator: "Use All Tools",
  publisher: "Use All Tools",
  alternates: {
    canonical: "https://www.usealltools.com/about",
  },
  openGraph: {
    title: "About Use All Tools - Privacy-First Web Utilities",
    description: "Empowering users with private, client-side, zero-tracking utilities. Open source under the MIT license.",
    url: "https://www.usealltools.com/about",
    siteName: "Use All Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 960,
        height: 240,
        alt: "Use All Tools - Free Online Tools Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Use All Tools - Privacy-First Open Source Utilities",
    description: "Pure client-side calculations with zero telemetry, zero cookies, and zero server logging.",
    images: ["/logo.svg"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.usealltools.com/about",
        "url": "https://www.usealltools.com/about",
        "name": "About Use All Tools",
        "description": "Background, mission, technical architecture, and philosophy of the Use All Tools open-source project.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.usealltools.com/#website",
          "url": "https://www.usealltools.com",
          "name": "Use All Tools"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Use All Tools",
          "url": "https://www.usealltools.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.usealltools.com/logo.svg"
          }
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.usealltools.com/#software",
        "name": "Use All Tools",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern web browsers",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free, client-side open-source calculators and developer tools built with zero data collection."
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.usealltools.com/about#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Use All Tools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use All Tools is an open-source suite of browser-native utilities, financial tools, and developer helpers that execute 100% client-side without storing or collecting user data."
            }
          },
          {
            "@type": "Question",
            "name": "Why was Use All Tools built?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use All Tools was built to replace slow, bloated utility websites filled with trackers, popups, and paywalls with an ultra-fast, zero-telemetry, client-side alternative."
            }
          },
          {
            "@type": "Question",
            "name": "Does Use All Tools collect or track user data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Use All Tools operates with zero data harvesting, zero tracking cookies, and zero server logging. All calculations run strictly within the user's browser engine."
            }
          },
          {
            "@type": "Question",
            "name": "Is Use All Tools open source?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Use All Tools is completely open source under the permissive MIT License. Anyone can inspect the code, verify its zero-telemetry design, or contribute on GitHub."
            }
          }
        ]
      }
    ]
  };

  const corePillars = [
    {
      icon: ShieldCheck,
      title: "100% Client-Side Privacy",
      description: "No calculation parameters, loan amounts, or inputs ever leave your device. Everything executes inside your local browser engine via modern Web APIs."
    },
    {
      icon: Code2,
      title: "Open Source Under MIT",
      description: "Full transparency. Inspect the source code, verify our privacy guarantees, or fork and adapt the utilities for your own personal or enterprise needs."
    },
    {
      icon: Zap,
      title: "Instant Zero-Latency Execution",
      description: "No server roundtrips, no loading spinners, and no session expiration. Instant calculations with full offline capability once loaded."
    },
    {
      icon: Heart,
      title: "Community & User First",
      description: "Engineered to serve students, professionals, and developers with accessible utilities without paywalls, subscriptions, or data harvesting."
    }
  ];

  const quickFacts = [
    { label: "Project Name", value: "Use All Tools" },
    { label: "Project Status", value: "Active & Open Source" },
    { label: "License", value: "MIT License" },
    { label: "Architecture", value: "Next.js 15, React 19, Tailwind CSS v4" },
    { label: "Data Storage", value: "Zero Server Storage (100% Client-Side)" },
    { label: "Telemetry", value: "Zero Remote Data Harvesting" },
  ];

  const faqs = [
    {
      q: "What is Use All Tools and why was it built?",
      a: "Use All Tools is an open-source web application providing daily financial and developer utilities—from SIP and Interest calculators to Text converters and Password tools. It was built to solve the frustration of ad-cluttered, privacy-invasive utility websites by delivering a blazingly fast, client-side alternative."
    },
    {
      q: "How does Use All Tools guarantee zero data collection?",
      a: "All calculation algorithms, charts, and text formatters run entirely in client-side JavaScript within your browser window. There are no backend database endpoints storing your inputs, financial numbers, or generated passwords."
    },
    {
      q: "Are all tools completely free?",
      a: "Yes, 100% of the tools, calculators, and converters are completely free with no usage limits, no credit card requirements, and no registration needed."
    },
    {
      q: "Can I contribute to Use All Tools?",
      a: "Yes! Contributions from developers, designers, and educators are enthusiastically welcomed. You can submit feature requests, open issues, or create pull requests on our official GitHub repository."
    }
  ];

  return (
    <article className="min-h-screen bg-background text-foreground py-12 md:py-16">
      {/* Schema.org JSON-LD for SEO, GEO & AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Breadcrumb & Header */}
        <header className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="subtle" className="mb-3">
            About the Project
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            About Use All Tools
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A free, open-source collection of web utilities engineered with privacy, speed, and clean code at its core.
          </p>
        </header>

        {/* Project Mission Hero Card Section */}
        <section className="mb-16">
          <Card className="overflow-hidden border-border/60 bg-card shadow-sm p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              {/* Project Brand Graphic */}
              <div className="w-full sm:w-80 lg:w-72 shrink-0 flex flex-col items-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-background to-muted/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-4 rounded-2xl bg-primary/15 border border-primary/30 text-primary mb-3 shadow-inner">
                    <AnantastraIcon size={56} />
                  </div>
                  <span className="font-extrabold text-lg text-foreground tracking-tight">
                    Use All Tools
                  </span>
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider mt-0.5">
                    100% Client-Side
                  </span>
                </div>

                <div className="text-center mt-4 space-y-1">
                  <h2 className="text-lg font-bold text-foreground">Open Source Utility Suite</h2>
                  <p className="text-xs text-muted-foreground font-medium">Free • Private • Fast</p>
                </div>

                {/* GitHub Repository Button */}
                <div className="flex items-center justify-center mt-5 w-full">
                  <a
                    href="https://github.com/Uniquearjav/anantastra"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                  >
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-full border-border/70 text-xs gap-2">
                      <Github className="h-4 w-4" />
                      <span>GitHub Repository</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Mission & Story */}
              <div className="flex-1 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/30 text-xs font-medium text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>The Vision Behind Use All Tools</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  "Software should respect people's privacy by default."
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Everyday digital utilities—calculating loan EMIs, projecting compound interest, formatting sensitive JSON data, or converting numbers—should be instantaneous, accessible, and completely private.
                </p>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Most online utility websites today are burdened by invasive analytics, slow server-side page reloads, tracking cookies, and popup paywalls that harvest your inputs. <strong className="text-foreground">Use All Tools</strong> was created to prove that a modern web utility suite can be blazingly fast, visually polished, and strictly zero-telemetry.
                </p>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Every computation runs directly in your browser's local V8 engine. No sensitive inputs ever leave your device or touch a remote database.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/tools">
                    <Button className="rounded-full gap-2 shadow-xs">
                      <span>Explore All Tools</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a
                    href="https://github.com/Uniquearjav/anantastra"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="rounded-full border-border/80 gap-2">
                      <Code2 className="h-4 w-4" />
                      <span>Source Code (GitHub)</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Facts Matrix */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Key Facts at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Architectural summary and open-source specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickFacts.map((fact, idx) => (
              <Card key={idx} className="border-border/60 bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {fact.label}
                </span>
                <p className="text-sm sm:text-base font-bold text-foreground mt-1">
                  {fact.value}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Principles / Pillars */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="subtle" className="mb-2">
              Our Philosophy
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Four Core Architectural Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card key={idx} className="border-border/60 bg-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted/60 text-primary shrink-0 border border-border/40">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground">{pillar.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Modern Tech Stack Overview */}
        <section className="mb-16">
          <Card className="border-border/60 bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <span>Technology Stack & Performance Engineering</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Use All Tools is engineered using modern, production-grade tools designed for optimal client execution, small bundle sizes, and instantaneous interactivity:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                Next.js 15 (Turbopack)
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                React 19
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                Tailwind CSS v4
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                shadcn/ui Design System
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                Radix UI Primitives
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                ApexCharts & HTML5 Canvas
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                next-themes
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-background/50 text-xs font-semibold text-foreground">
                MIT Open Source
              </span>
            </div>
          </Card>
        </section>

        {/* Answer Engine Optimization (AEO) / FAQ Section */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="subtle" className="mb-2">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Questions & Answers (AEO)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Direct, factual answers for users and AI knowledge systems.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-border/60 bg-card p-5 transition-colors open:bg-card"
              >
                <summary className="cursor-pointer font-bold text-sm sm:text-base text-foreground list-none flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <span className="text-muted-foreground transition-transform duration-200 group-open:rotate-90">
                    ›
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6 border-l-2 border-primary/40">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Community & Open Source Contribution Section */}
        <section>
          <Card className="border-border/60 bg-muted/20 p-8 sm:p-12 text-center rounded-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              Open Source & Community Driven
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
              Have an idea for a new calculator, want to suggest an improvement, or report a bug? We welcome contributions from developers, educators, and users worldwide on GitHub.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/Uniquearjav/anantastra/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full shadow-xs gap-2">
                  <Github className="h-4 w-4" />
                  <span>Submit an Issue on GitHub</span>
                </Button>
              </a>
              <Link href="/tools">
                <Button variant="outline" className="rounded-full border-border/80 gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Explore All Tools</span>
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </article>
  );
}
