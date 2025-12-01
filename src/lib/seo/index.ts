// SEO Configuration and utilities
export * from "./metadata";
export * from "./structured-data";
export * from "./robots";
export * from "./sitemap";

// Common SEO constants
export const SEO_CONSTANTS = {
  SITE_NAME: "Kraow Kao AI Restaurant Feedback Platform",
  SITE_URL: "https://kraowkao.com",
  COMPANY_NAME: "Kraow Kao",
  //   TWITTER_HANDLE: "@your-twitter-handle",
  //   FACEBOOK_APP_ID: "your-facebook-app-id",
  DEFAULT_LOCALE: "en-US",
  SUPPORTED_LOCALES: ["en-US", "th-TH"],
  THEME_COLOR: "#f59e0b",
  APPLE_TOUCH_ICON: "/apple-touch-icon.png",
  FAVICON: "/favicon.ico",
  LOGO: "/logo.png",
} as const;

// Page-specific SEO configurations
export const PAGE_SEO_CONFIGS = {
  home: {
    title:
      "AI-Powered Restaurant Feedback Platform | Bangkok Restaurant Reviews",
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
  },
  login: {
    title: "Login | Restaurant Feedback Platform",
    description:
      "Sign in to your restaurant feedback dashboard. Access AI-powered insights, manage QR code reviews, and track customer sentiment.",
    keywords: ["login", "sign in", "dashboard", "restaurant feedback"],
  },
  register: {
    title: "Sign Up | Restaurant Feedback Platform",
    description:
      "Create your account to start collecting smart restaurant feedback. Join Bangkok restaurants using AI-powered review analysis.",
    keywords: [
      "sign up",
      "register",
      "restaurant account",
      "feedback platform",
    ],
  },
  dashboard: {
    title: "Dashboard | Restaurant Feedback Platform",
    description:
      "View your restaurant's feedback analytics, AI insights, and customer sentiment data in one comprehensive dashboard.",
    keywords: [
      "dashboard",
      "analytics",
      "restaurant insights",
      "feedback management",
    ],
  },
} as const;
