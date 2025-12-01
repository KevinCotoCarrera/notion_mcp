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
    
    // Create response with the auth URL
    const response = NextResponse.json({
      success: true,
      authUrl,
    });
    
    // Store state in a secure HTTP-only cookie for CSRF validation
    response.cookies.set("notion_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    
    return response;
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
