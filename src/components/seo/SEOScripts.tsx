"use client";
import Script from "next/script";
import { generateStructuredData } from "@lib/seo/structured-data";

interface SEOScriptsProps {
  schemas?: ("organization" | "website" | "service" | "breadcrumb")[];
}

export default function SEOScripts({
  schemas = ["organization", "website", "service", "breadcrumb"],
}: SEOScriptsProps) {
  return (
    <>
      {schemas.includes("organization") && (
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData("organization"),
          }}
        />
      )}
      {schemas.includes("website") && (
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData("website"),
          }}
        />
      )}
      {schemas.includes("service") && (
        <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData("service"),
          }}
        />
      )}
      {schemas.includes("breadcrumb") && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData("breadcrumb"),
          }}
        />
      )}
    </>
  );
}
