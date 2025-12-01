import { generateSitemap } from "@lib/seo/sitemap";

export async function GET() {
  const sitemap = generateSitemap();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
