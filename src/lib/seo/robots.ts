import { NextRequest } from "next/server";

export interface RobotsConfig {
  rules: {
    userAgent: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  }[];
  sitemap?: string[];
  host?: string;
}

export const defaultRobotsConfig: RobotsConfig = {
  rules: [
    {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/dashboard/", "/private/"],
    },
    {
      userAgent: "Googlebot",
      allow: ["/"],
      disallow: ["/api/", "/dashboard/", "/private/"],
      crawlDelay: 1,
    },
  ],
  sitemap: ["https://kraowkao.com/sitemap.xml"],
  host: "https://kraowkao.com",
};

export function generateRobotsTxt(
  config: RobotsConfig = defaultRobotsConfig
): string {
  let robotsTxt = "";

  config.rules.forEach((rule) => {
    robotsTxt += `User-agent: ${rule.userAgent}\n`;

    if (rule.allow) {
      rule.allow.forEach((path) => {
        robotsTxt += `Allow: ${path}\n`;
      });
    }

    if (rule.disallow) {
      rule.disallow.forEach((path) => {
        robotsTxt += `Disallow: ${path}\n`;
      });
    }

    if (rule.crawlDelay) {
      robotsTxt += `Crawl-delay: ${rule.crawlDelay}\n`;
    }

    robotsTxt += "\n";
  });

  if (config.sitemap) {
    config.sitemap.forEach((sitemap) => {
      robotsTxt += `Sitemap: ${sitemap}\n`;
    });
  }

  if (config.host) {
    robotsTxt += `Host: ${config.host}\n`;
  }

  return robotsTxt;
}
