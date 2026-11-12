import { Poppins } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { generateRootSchema } from "@/lib/seo";
import "./globals.css";
import Script from "next/script";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usealltools.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "usealltools.com - Free Online Tools for Productivity & Calculations",
    template: "%s | usealltools.com",
  },
  description: "Free, high-speed, privacy-first web utilities & financial calculators that execute 100% in your browser. Zero tracking, zero data storage.",
  keywords: [
    "free online tools",
    "online calculators",
    "privacy first tools",
    "client-side utilities",
    "financial calculators",
    "SIP calculator",
    "income tax calculator India",
    "GST calculator",
    "loan EMI calculator",
    "interest calculator",
    "password generator",
    "unit converter",
    "JSON formatter",
    "developer utilities",
    "open source tools",
    "usealltools",
    "anantastra"
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "usealltools.com - Free Online Tools for Productivity & Calculations",
    description: "Free, high-speed, privacy-first web utilities & financial calculators that execute 100% in your browser. Zero tracking, zero data storage.",
    url: SITE_URL,
    siteName: "usealltools.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 960,
        height: 240,
        alt: "usealltools.com & Anantastra Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "usealltools.com - Free Online Tools for Productivity & Calculations",
    description: "Free, high-speed, privacy-first web utilities & financial calculators that execute 100% in your browser.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
  verification: {
    google: "lv3CEWO9JNrtG244JgsIZRiVxQmjeoD73xmDIhA0pKw",
  },
};

export default function RootLayout({ children }) {
  const { websiteSchema, organizationSchema } = generateRootSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-200`}
      >
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WVC4SHJZCB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WVC4SHJZCB');
          `}
        </Script>

        <ThemeProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
