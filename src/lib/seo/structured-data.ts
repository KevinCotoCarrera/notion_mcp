export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kraow Kao AI Restaurant Feedback Platform",
    description:
      "Kraow Kao is an AI-powered platform that helps Bangkok restaurants collect, analyze, and act on customer feedback with advanced sentiment analysis and actionable insights.",
    url: "https://kraowkao.com",
    logo: "https://kraowkao.com/logo.png",
    sameAs: [
      //   "https://twitter.com/your-handle",
      //   "https://linkedin.com/company/your-company",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66-6364-555-71",
      contactType: "customer service",
      areaServed: "TH",
      availableLanguage: ["en", "th"],
    },
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Restaurant Feedback Platform",
    url: "https://kraowkao.com",
    description:
      "Kraow Kao is an AI-driven restaurant feedback platform for Bangkok, enabling businesses to gather, analyze, and improve customer experiences through intelligent insights.",
    inLanguage: ["en", "th"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://kraowkao.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  service: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Restaurant Feedback Platform",
    description:
      "Revolutionize your restaurant's feedback process with Kraow Kao's AI-powered sentiment analysis, QR code review collection, and data-driven insights tailored for Bangkok's dining scene.",
    provider: {
      "@type": "Organization",
      name: "Restaurant Feedback Platform",
    },
    areaServed: {
      "@type": "City",
      name: "Bangkok",
    },
    serviceType: "Restaurant Technology",
    category: "Business Software",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Restaurant Feedback Plans",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Coffee Shop Plan",
          },
          price: "700",
          priceCurrency: "THB",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "700",
            priceCurrency: "THB",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Early Bird Plan",
          },
          price: "1500",
          priceCurrency: "THB",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "1500",
            priceCurrency: "THB",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Growth Plan",
          },
          price: "3500",
          priceCurrency: "THB",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "3500",
            priceCurrency: "THB",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
          },
        },
      ],
    },
  },

  breadcrumb: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kraowkao.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: "https://kraowkao.com/#features",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Pricing",
        item: "https://kraowkao.com/#pricing",
      },
    ],
  },
};

export function generateStructuredData(type: keyof typeof structuredData) {
  return JSON.stringify(structuredData[type]);
}
