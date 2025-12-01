import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  locale?: string;
}

export const defaultSEOConfig: SEOConfig = {
  title: "AI-Powered Restaurant Feedback Platform | Bangkok Restaurant Reviews",
  description:
    "Transform your Bangkok restaurant's feedback collection with our AI-powered platform. Smart QR code reviews, sentiment analysis, and actionable insights. Join the waitlist for exclusive launch pricing.",
  keywords: [
    "restaurant feedback",
    "Bangkok restaurants",
    "AI sentiment analysis",
    "QR code reviews",
    "restaurant management",
    "customer feedback",
    "restaurant analytics",
    "food service technology",
    "Thailand restaurant tech",
    "restaurant insights",
  ],
  canonical: "https://kraowkao.com",
  ogImage: "/og-image.png",
  twitterImage: "/twitter-image.jpg",
  locale: "en-US",
};

export function generateMetadata(config: Partial<SEOConfig> = {}): Metadata {
  const seoConfig = { ...defaultSEOConfig, ...config };

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords.join(", "),
    authors: [{ name: "Restaurant Feedback Platform" }],
    creator: "Restaurant Feedback Platform",
    publisher: "Restaurant Feedback Platform",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(seoConfig.canonical || "https://kraowkao.com"),
    alternates: {
      canonical: seoConfig.canonical,
      languages: {
        "en-US": "/en",
        "th-TH": "/th",
      },
    },
    openGraph: {
      type: "website",
      locale: seoConfig.locale,
      url: seoConfig.canonical,
      title: seoConfig.title,
      description: seoConfig.description,
      siteName: "Restaurant Feedback Platform",
      images: [
        {
          url: seoConfig.ogImage || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: seoConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.title,
      description: seoConfig.description,
      images: [seoConfig.twitterImage || "/twitter-image.jpg"],
      //   creator: "@your-twitter-handle",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      //   google: "your-google-verification-code",
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
    },
  };
}
