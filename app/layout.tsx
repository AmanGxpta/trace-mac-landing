import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  SITE_URL,
  DMG_PATH,
  APP_VERSION,
  site,
  faqs,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  authors: [{ name: site.publisher }],
  creator: site.publisher,
  publisher: site.publisher,
  alternates: { canonical: "/" },
  icons: { icon: "/trace-icon.png" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: site.name,
    title: site.title,
    description: site.description,
    // The OG image is provided by app/opengraph-image.tsx (auto-discovered).
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// JSON-LD structured data — the highest-leverage GEO signal. Lets search
// engines and LLMs extract Trace's facts (what it is, platform, price) verbatim.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Productivity",
    operatingSystem: site.operatingSystem,
    softwareVersion: APP_VERSION,
    description: site.description,
    url: SITE_URL,
    downloadUrl: `${SITE_URL}${DMG_PATH}`,
    fileSize: "3.3 MB",
    image: `${SITE_URL}/trace-icon.png`,
    offers: {
      "@type": "Offer",
      price: site.price,
      priceCurrency: site.priceCurrency,
    },
    publisher: { "@type": "Organization", name: site.publisher },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
