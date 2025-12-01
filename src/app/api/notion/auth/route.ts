/**
 * Notion Auth API Route
 * GET: Returns authorization URL for Notion OAuth
 */

import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "@lib/services/notion/auth";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    // Generate a random state parameter for CSRF protection
    const state = randomBytes(16).toString("hex");
    const authUrl = getAuthorizationUrl(state);
    
    return NextResponse.json({
      success: true,
      authUrl,
      state,
    });
  } catch (error) {
    console.error("Failed to generate auth URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate authorization URL",
      },
      { status: 500 }
    );
  }
}
