/**
 * Notion OAuth Callback API Route
 * GET: Handles OAuth callback and exchanges code for token
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken } from "@lib/services/notion/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  
  // Handle error from Notion
  if (error) {
    const errorDescription = searchParams.get("error_description") || error;
    return NextResponse.redirect(
      new URL(
        `/notion/auth-error?error=${encodeURIComponent(errorDescription)}`,
        request.url
      )
    );
  }
  
  // Validate state parameter to prevent CSRF attacks
  const cookieStore = await cookies();
  const storedState = cookieStore.get("notion_oauth_state")?.value;
  
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL(
        `/notion/auth-error?error=${encodeURIComponent("Invalid state parameter - possible CSRF attack")}`,
        request.url
      )
    );
  }
  
  // Validate code
  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/notion/auth-error?error=${encodeURIComponent("No authorization code received")}`,
        request.url
      )
    );
  }
  
  // Exchange code for token
  const result = await exchangeCodeForToken(code);
  
  if (!result.success || !result.data) {
    return NextResponse.redirect(
      new URL(
        `/notion/auth-error?error=${encodeURIComponent(result.error || "Token exchange failed")}`,
        request.url
      )
    );
  }
  
  // Create response with redirect to success page
  const response = NextResponse.redirect(
    new URL("/notion/sprint-dashboard", request.url)
  );
  
  // Clear the OAuth state cookie
  response.cookies.delete("notion_oauth_state");
  
  // Set the access token in a secure HTTP-only cookie
  response.cookies.set("notion_access_token", result.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  
  // Store workspace info in a separate cookie (non-sensitive)
  if (result.data.workspace_name) {
    response.cookies.set(
      "notion_workspace",
      JSON.stringify({
        id: result.data.workspace_id,
        name: result.data.workspace_name,
        icon: result.data.workspace_icon,
      }),
      {
        httpOnly: false, // Allow client access
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }
    );
  }
  
  return response;
}
