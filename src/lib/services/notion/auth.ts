/**
 * Notion Authentication Service
 * Handles OAuth flow for Notion workspace authentication
 */

import { getNotionConfig } from "@lib/config/env";
import type { NotionTokenResponse, NotionAPIResponse } from "@app-types/notion";

const NOTION_AUTH_URL = "https://api.notion.com/v1/oauth/authorize";
const NOTION_TOKEN_URL = "https://api.notion.com/v1/oauth/token";

export function getAuthorizationUrl(state?: string): string {
  const config = getNotionConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    owner: "user",
  });
  
  if (state) {
    params.set("state", state);
  }
  
  return `${NOTION_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string
): Promise<NotionAPIResponse<NotionTokenResponse>> {
  const config = getNotionConfig();
  
  if (!config.clientId || !config.clientSecret) {
    return {
      success: false,
      error: "Notion OAuth client credentials are not configured",
    };
  }
  
  try {
    const credentials = Buffer.from(
      `${config.clientId}:${config.clientSecret}`
    ).toString("base64");
    
    const response = await fetch(NOTION_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error_description ||
          errorData.error ||
          `Token exchange failed: ${response.status}`,
      };
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to exchange code for token",
    };
  }
}

export function validateAccessToken(token: string): boolean {
  // Basic validation - check if token exists and has reasonable length
  return Boolean(token && token.length >= 20);
}
