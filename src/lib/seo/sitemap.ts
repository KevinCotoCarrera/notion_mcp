export interface SitemapURL {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export const sitemapUrls: SitemapURL[] = [
  {
    url: "https://kraowkao.com",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: "https://kraowkao.com/en",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "https://kraowkao.com/th",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "https://kraowkao.com/login",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  },
  {
    url: "https://kraowkao.com/register",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  },
];

export function generateSitemap(urls: SitemapURL[] = sitemapUrls): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    ${
      url.lastModified
        ? `<lastmod>${url.lastModified.toISOString()}</lastmod>`
        : ""
    }
    ${
      url.changeFrequency
        ? `<changefreq>${url.changeFrequency}</changefreq>`
        : ""
    }
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}
