import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AV_image from "@/public/Arjav_about.jpg";
import { 
  ShieldCheck, 
  Code2, 
  Zap, 
  Lock, 
  Globe, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Heart,
  Terminal,
  Cpu,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  School,
  Award
} from "lucide-react";

export const metadata = {
  title: "About Anantastra & Arjav Choudhary | Mission, Privacy & Open Source",
  description: "Learn about Anantastra, a free and privacy-focused suite of open-source web utilities created by Arjav Choudhary. Discover our mission, zero-data-collection architecture, and tools.",
  keywords: [
    "Anantastra",
    "About Anantastra",
    "Arjav Choudhary",
    "Open Source Tools",
    "Privacy First Utilities",
    "Client-side Calculators",
    "Unnat Vega",
    "Free Online Utilities",
    "Web Developer Tools",
    "Indian Financial Calculators"
  ],
  authors: [{ name: "Arjav Choudhary", url: "https://github.com/Uniquearjav" }],
  creator: "Arjav Choudhary",
  publisher: "Anantastra",
  alternates: {
    canonical: "https://anantastra.vercel.app/about",
  },
  openGraph: {
    title: "About Anantastra & Founder Arjav Choudhary",
    description: "Empowering users with private, client-side, zero-tracking utilities. Open source under MIT license.",
    url: "https://anantastra.vercel.app/about",
    siteName: "Anantastra",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/Arjav_about.jpg",
        width: 800,
        height: 800,
        alt: "Arjav Choudhary - Founder of Anantastra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Anantastra - Privacy-First Open Source Utilities",
    description: "Learn about Anantastra and founder Arjav Choudhary. Pure client-side calculations with zero telemetry.",
    images: ["/Arjav_about.jpg"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AboutPage", "ProfilePage"],
        "@id": "https://anantastra.vercel.app/about",
        "url": "https://anantastra.vercel.app/about",
        "name": "About Anantastra & Founder Arjav Choudhary",
        "description": "Background, mission, technical architecture, and founder profile of the Anantastra open-source project.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://anantastra.vercel.app/#website",
          "url": "https://anantastra.vercel.app",
          "name": "Anantastra"
        },
        "mainEntity": {
          "@type": "Person",
          "@id": "https://anantastra.vercel.app/about#founder",
          "name": "Arjav Choudhary",
          "jobTitle": "Founder & Full-Stack Developer",
          "alumniOf": "Delhi Public School, Jodhpur",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jodhpur",
            "addressRegion": "Rajasthan",
            "addressCountry": "India"
          },
          "sameAs": [
            "https://github.com/Uniquearjav",
            "https://www.linkedin.com/in/arjav-choudhary-531b2126b/",
            "https://www.unnatvega.in"
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://anantastra.vercel.app/#software",
        "name": "Anantastra",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern web browsers",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "author": {
          "@id": "https://anantastra.vercel.app/about#founder"
        },
        "description": "Free, client-side open-source calculators and developer tools built with zero data collection."
      },
      {
        "@type": "FAQPage",
        "@id": "https://anantastra.vercel.app/about#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Anantastra?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anantastra is an open-source suite of browser-native utilities, financial tools, and developer helpers that execute 100% client-side without storing or collecting user data."
            }
          },
          {
            "@type": "Question",
            "name": "Who created Anantastra?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anantastra was founded and created by Arjav Choudhary, a programmer and entrepreneur based in Jodhpur, India, who is passionate about open-source and privacy-preserving technology."
            }
          },
          {
            "@type": "Question",
            "name": "Does Anantastra collect or track user data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Anantastra operates with zero data collection, zero cookies, and zero server logging. All calculations run strictly within the user's browser engine."
            }
          },
          {
            "@type": "Question",
            "name": "Is Anantastra open source?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Anantastra is open source under the MIT License. Anyone can inspect the code, suggest improvements, or contribute directly on GitHub."
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
      description: "No calculation parameters, loan amounts, or inputs ever leave your device. Everything executes inside your local browser engine."
    },
    {
      icon: Code2,
      title: "Open Source Under MIT",
      description: "Full transparency. Inspect the source code, verify privacy claims, or fork and adapt it for your own personal or enterprise needs."
    },
    {
      icon: Zap,
      title: "Instant Zero-Latency Execution",
      description: "No server roundtrips, no loading spinners, and no session expiration. Instant calculations with full offline capability."
    },
    {
      icon: Heart,
      title: "Community & User First",
      description: "Created to serve students, professionals, and developers with accessible utilities without aggressive ads or paywalls."
    }
  ];

  const quickFacts = [
    { label: "Founder", value: "Arjav Choudhary" },
    { label: "Location", value: "Jodhpur, Rajasthan, India" },
    { label: "Project Status", value: "Active & Open Source" },
    { label: "License", value: "MIT License" },
    { label: "Architecture", value: "Next.js 15, React 19, Tailwind CSS" },
    { label: "Data Storage", value: "Zero Server Storage (100% Client-Side)" },
  ];

  const faqs = [
    {
      q: "What is Anantastra and why was it built?",
      a: "Anantastra is an open-source web application providing daily financial and developer utilities—from SIP and Interest calculators to Text converters and Password tools. It was built to solve the frustration of ad-cluttered, privacy-invasive utility websites by delivering a blazingly fast, ad-light, client-side alternative."
    },
    {
      q: "Who is Arjav Choudhary?",
      a: "Arjav Choudhary is the creator and lead developer of Anantastra. He is a programmer with expertise in Python, Node.js, and modern React architectures, focusing on privacy-first tools, sustainable digital solutions, and practical AI applications."
    },
    {
      q: "How does Anantastra guarantee zero data collection?",
      a: "All calculation algorithms, charts, and text formatters run entirely in client-side JavaScript within your browser window. There are no backend database endpoints storing your inputs, financial numbers, or generated passwords."
    },
    {
      q: "Can I contribute to Anantastra?",
      a: "Yes! Contributions from developers, designers, and translators are enthusiastically welcomed. You can submit feature requests, open issues, or create pull requests on the official GitHub repository."
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
            About the Project & Creator
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            About Anantastra
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A free, open-source collection of web utilities engineered with privacy, speed, and clean code at its core.
          </p>
        </header>

        {/* Founder Hero Card Section */}
        <section className="mb-16">
          <Card className="overflow-hidden border-border/60 bg-card shadow-sm p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              {/* Profile Image & Badges */}
              <div className="w-full sm:w-80 lg:w-72 shrink-0 flex flex-col items-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-border/80 shadow-md bg-muted/40">
                  <Image
                    src={AV_image}
                    alt="Arjav Choudhary - Founder and Full-Stack Developer of Anantastra"
                    fill
                    sizes="(max-width: 768px) 256px, 300px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="text-center mt-4 space-y-1">
                  <h2 className="text-xl font-bold text-foreground">Arjav Choudhary</h2>
                  <p className="text-xs text-muted-foreground font-medium">Founder & Developer</p>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>Jodhpur, India</span>
                  </div>
                </div>

                {/* Social Connect Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-5 w-full">
                  <a
                    href="https://github.com/Uniquearjav"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                  >
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-full border-border/70 text-xs gap-1.5">
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </Button>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/arjav-choudhary-531b2126b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                  >
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-full border-border/70 text-xs gap-1.5">
                      <Linkedin className="h-3.5 w-3.5 text-blue-500" />
                      <span>LinkedIn</span>
                    </Button>
                  </a>
                  <a
                    href="https://www.unnatvega.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Unnat Vega Website"
                  >
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-full border-border/70 text-xs gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      <span>Unnat Vega</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Bio & Story */}
              <div className="flex-1 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/30 text-xs font-medium text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>The Story Behind Anantastra</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  "I believe software should respect people's privacy by default."
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Hi! I'm <strong className="text-foreground">Arjav Choudhary</strong>, a passionate programmer, student at Delhi Public School Jodhpur, and technology builder. What started as exploring Python as a hobby has grown into building complete web platforms, generative AI applications, and community-oriented utilities.
                </p>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  I created <strong className="text-foreground">Anantastra</strong> (from Sanskrit, meaning <em>"Infinite Instruments"</em>) because I grew tired of utility websites filled with trackers, popups, paywalls, and slow server-side page reloads. Everyday tools—like calculating loan EMIs, estimating SIP compound interest, or formatting tax figures—should be instant, accessible, and run completely within your own browser with <strong className="text-foreground">zero data harvesting</strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/tools">
                    <Button className="rounded-full gap-2 shadow-xs">
                      <span>Explore Tools</span>
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

        {/* Quick Facts Matrix (Optimized for GEO / Search Generative Engines) */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Key Facts at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Verified specifications and architectural summary for researchers and answer engines.
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
              Anantastra is engineered using modern, production-grade tools designed for optimal client execution, small bundle sizes, and instantaneous interactivity:
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

        {/* Collaboration & Contact Footer Card */}
        <section>
          <Card className="border-border/60 bg-muted/20 p-8 sm:p-12 text-center rounded-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              Get in Touch or Collaborate
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
              Have an idea for a new calculator, want to suggest an improvement, or explore collaboration? Connect with Arjav directly:
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
              <a
                href="https://www.linkedin.com/in/arjav-choudhary-531b2126b/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="rounded-full border-border/80 gap-2">
                  <Linkedin className="h-4 w-4 text-blue-500" />
                  <span>Message on LinkedIn</span>
                </Button>
              </a>
            </div>
          </Card>
        </section>
      </div>
    </article>
  );
}