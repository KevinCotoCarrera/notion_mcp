/**
 * Notion API Client
 * Handles communication with Notion API
 */

import { getNotionConfig } from "@lib/config/env";
import type {
  NotionDatabase,
  NotionPage,
  DatabaseQueryResult,
  NotionAPIResponse,
  NotionWorkspace,
} from "@app-types/notion";

const NOTION_API_BASE = "https://api.notion.com/v1";

interface NotionRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string;
}

async function notionRequest<T>(
  endpoint: string,
  options: NotionRequestOptions = {}
): Promise<NotionAPIResponse<T>> {
  const config = getNotionConfig();
  const accessToken = options.accessToken || config.apiKey;

  if (!accessToken) {
    return {
      success: false,
      error: "Notion API key or access token is required",
    };
  }

  try {
    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": config.apiVersion,
        "Content-Type": "application/json",
      },
    };
    
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(`${NOTION_API_BASE}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message ||
          `Notion API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Database operations
export async function listDatabases(
  accessToken?: string
): Promise<NotionAPIResponse<NotionDatabase[]>> {
  const response = await notionRequest<{ results: NotionDatabase[] }>(
    "/search",
    {
      method: "POST",
      body: { filter: { property: "object", value: "database" } },
      accessToken,
    }
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  return {
    success: true,
    data: response.data?.results || [],
  };
}

export async function getDatabase(
  databaseId: string,
  accessToken?: string
): Promise<NotionAPIResponse<NotionDatabase>> {
  return notionRequest<NotionDatabase>(`/databases/${databaseId}`, {
    accessToken,
  });
}

export async function queryDatabase(
  databaseId: string,
  options: {
    filter?: Record<string, unknown>;
    sorts?: Array<{ property: string; direction: "ascending" | "descending" }>;
    startCursor?: string;
    pageSize?: number;
  } = {},
  accessToken?: string
): Promise<NotionAPIResponse<DatabaseQueryResult>> {
  const response = await notionRequest<{
    results: NotionPage[];
    next_cursor: string | null;
    has_more: boolean;
  }>(`/databases/${databaseId}/query`, {
    method: "POST",
    body: {
      ...(options.filter && { filter: options.filter }),
      ...(options.sorts && { sorts: options.sorts }),
      ...(options.startCursor && { start_cursor: options.startCursor }),
      ...(options.pageSize && { page_size: options.pageSize }),
    },
    accessToken,
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  return {
    success: true,
    data: {
      results: response.data?.results || [],
      nextCursor: response.data?.next_cursor || undefined,
      hasMore: response.data?.has_more || false,
    },
  };
}

// Page operations
export async function getPage(
  pageId: string,
  accessToken?: string
): Promise<NotionAPIResponse<NotionPage>> {
  return notionRequest<NotionPage>(`/pages/${pageId}`, { accessToken });
}

export async function createPage(
  databaseId: string,
  properties: Record<string, unknown>,
  accessToken?: string
): Promise<NotionAPIResponse<NotionPage>> {
  return notionRequest<NotionPage>("/pages", {
    method: "POST",
    body: {
      parent: { database_id: databaseId },
      properties,
    },
    accessToken,
  });
}

export async function updatePage(
  pageId: string,
  properties: Record<string, unknown>,
  accessToken?: string
): Promise<NotionAPIResponse<NotionPage>> {
  return notionRequest<NotionPage>(`/pages/${pageId}`, {
    method: "PATCH",
    body: { properties },
    accessToken,
  });
}

export async function archivePage(
  pageId: string,
  accessToken?: string
): Promise<NotionAPIResponse<NotionPage>> {
  return notionRequest<NotionPage>(`/pages/${pageId}`, {
    method: "PATCH",
    body: { archived: true },
    accessToken,
  });
}

// User/Workspace operations
export async function getCurrentUser(
  accessToken?: string
): Promise<NotionAPIResponse<NotionWorkspace>> {
  return notionRequest<NotionWorkspace>("/users/me", { accessToken });
}

export async function listUsers(
  accessToken?: string
): Promise<NotionAPIResponse<{ results: unknown[] }>> {
  return notionRequest<{ results: unknown[] }>("/users", { accessToken });
}
