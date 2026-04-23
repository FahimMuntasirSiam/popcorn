import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Popcorn - Movies & Blog",
  description: "Your ultimate movie and blog destination.",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
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
        <Navbar />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
