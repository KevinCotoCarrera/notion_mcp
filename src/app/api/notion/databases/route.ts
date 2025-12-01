/**
 * Notion Databases API Route
 * GET: List all databases
 * POST: Query a specific database
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  listDatabases,
  queryDatabase,
  getDatabase,
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
  const databaseId = searchParams.get("id");
  
  try {
    if (databaseId) {
      // Get specific database
      const result = await getDatabase(databaseId, accessToken);
      return NextResponse.json(result);
    }
    
    // List all databases
    const result = await listDatabases(accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch databases" },
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
    const { databaseId, filter, sorts, startCursor, pageSize } = body;
    
    if (!databaseId) {
      return NextResponse.json(
        { success: false, error: "Database ID is required" },
        { status: 400 }
      );
    }
    
    const result = await queryDatabase(
      databaseId,
      { filter, sorts, startCursor, pageSize },
      accessToken
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query database" },
      { status: 500 }
    );
  }
}
