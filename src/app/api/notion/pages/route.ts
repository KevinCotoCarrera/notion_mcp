/**
 * Notion Pages API Route
 * GET: Get a specific page
 * POST: Create a new page
 * PATCH: Update a page
 * DELETE: Archive a page
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getPage,
  createPage,
  updatePage,
  archivePage,
} from "@lib/services/notion/client";

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("notion_access_token")?.value || null;
}

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Not authenticated with Notion" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const pageId = searchParams.get("id");

  if (!pageId) {
    return NextResponse.json(
      { success: false, error: "Page ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await getPage(pageId, accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Page fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Not authenticated with Notion" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { databaseId, properties, children } = body;

    if (!databaseId) {
      return NextResponse.json(
        { success: false, error: "Database ID is required" },
        { status: 400 }
      );
    }

    if (!properties) {
      return NextResponse.json(
        { success: false, error: "Properties are required" },
        { status: 400 }
      );
    }

    const result = await createPage(
      databaseId,
      properties,
      accessToken,
      children
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Page create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create page" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Not authenticated with Notion" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { pageId, properties } = body;

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "Page ID is required" },
        { status: 400 }
      );
    }

    if (!properties) {
      return NextResponse.json(
        { success: false, error: "Properties are required" },
        { status: 400 }
      );
    }

    const result = await updatePage(pageId, properties, accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Page update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Not authenticated with Notion" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const pageId = searchParams.get("id");

  if (!pageId) {
    return NextResponse.json(
      { success: false, error: "Page ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await archivePage(pageId, accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Page archive error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to archive page" },
      { status: 500 }
    );
  }
}
