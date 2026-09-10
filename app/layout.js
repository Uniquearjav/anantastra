import { Poppins } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import Script from "next/script";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://anantastra.vercel.app'),
  title: {
    default: "Anantastra - Infinite Tools for Productivity & Calculations",
    template: "%s | Anantastra",
  },
  description: "Free, high-speed, open-source utilities that respect your privacy and don't store your data.",
  verification: {
    google: "lv3CEWO9JNrtG244JgsIZRiVxQmjeoD73xmDIhA0pKw",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
