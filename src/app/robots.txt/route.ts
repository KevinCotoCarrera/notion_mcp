import { generateRobotsTxt } from "@lib/seo/robots";

export async function GET() {
  const robotsTxt = generateRobotsTxt();

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
