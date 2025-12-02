/**
 * Notion Page Blocks API Route
 * GET: Get blocks (children) of a page
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPageBlocks } from "@lib/services/notion/client";

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("notion_access_token")?.value || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Not authenticated with Notion" },
      { status: 401 }
    );
  }

  try {
    const pageId = params.pageId;
    const result = await getPageBlocks(pageId, accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Page blocks fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page blocks" },
      { status: 500 }
    );
  }
}
