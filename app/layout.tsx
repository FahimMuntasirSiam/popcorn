import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'),
  title: {
    default: 'Popcorn — Movies, Blogs & Trailers',
    template: '%s | Popcorn',
  },
  description: 'Your ultimate destination for movies, film blogs, and latest trailers. Download HD movies and read reviews.',
  keywords: ['movies', 'download movies', 'film blog', 'trailers', 'bangla movies', 'hindi movies', 'english movies', 'anime'],
  openGraph: {
    type: 'website',
    siteName: 'Popcorn',
    title: 'Popcorn — Movies, Blogs & Trailers',
    description: 'Your ultimate destination for movies, film blogs and latest trailers.',
    images: [
      {
        url: '/og-image.jpg', // Make sure this exists in public folder
        width: 1200,
        height: 630,
        alt: 'Popcorn — Movies, Blogs & Trailers',
      }
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Popcorn — Movies, Blogs & Trailers',
    description: 'Your ultimate destination for movies, film blogs and latest trailers.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'ADD_GOOGLE_SEARCH_CONSOLE_CODE_HERE',
  },
};

import GlobalAds from "@/components/interactions/GlobalAds";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <GlobalAds />
        {/* ADSTERRA SCRIPT: Paste your site verification script here */}
        {/* ADSENSE SCRIPT: Paste your AdSense script here */}
        <style>{`
          .skiptranslate { display: none !important; }
          body { top: 0px !important; }
          #google_translate_element { display: none; }
        `}</style>
      </head>
      <body className={`${inter.className} bg-popcorn-dark text-white min-h-screen flex flex-col`}>
        <div id="google_translate_element"></div>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,bn',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 bg-popcorn-dark" />}>
            <Navbar />
          </Suspense>
          <main className="grow">
            {children}
          </main>
        </LanguageProvider>
        <Footer />
      </body>
    </html>
  );
}
