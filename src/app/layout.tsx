// Import Metadata from "next" to fix the error.
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import "./globals.css";
import "./skeleton.css";
import { NextIntlClientProvider } from "next-intl";
import { getUserLocale } from "@i18n/locale";
import { generateMetadata as generateSEOMetadata } from "@lib/seo/metadata";
import enMessages from "../../messages/en.json";
import thMessages from "../../messages/th.json";

export const metadata: Metadata = generateSEOMetadata({
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
    "waitlist",
    "launch pricing",
  ],
  canonical: "https://your-domain.com",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getUserLocale();
  const messages = locale === "th" ? thMessages : enMessages;

  return (
    <html lang={locale}>
      <body className="font-sans antialiased text-black">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
