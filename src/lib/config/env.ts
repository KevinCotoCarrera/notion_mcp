/**
 * Environment Configuration
 * Loads and validates environment variables for Notion MCP and DeepSeek LLM
 */

import type { AppConfig, NotionConfig, DeepSeekConfig } from "@app-types/config";

function getEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || "";
}

function getEnvVarWithDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export function getNotionConfig(): NotionConfig {
  return {
    apiKey: getEnvVar("NOTION_API_KEY", false),
    clientId: getEnvVar("NOTION_CLIENT_ID", false),
    clientSecret: getEnvVar("NOTION_CLIENT_SECRET", false),
    redirectUri: getEnvVarWithDefault(
      "NOTION_REDIRECT_URI",
      "http://localhost:3000/api/notion/callback"
    ),
    apiVersion: getEnvVarWithDefault("NOTION_API_VERSION", "2022-06-28"),
  };
}

export function getDeepSeekConfig(): DeepSeekConfig {
  return {
    apiKey: getEnvVar("DEEPSEEK_API_KEY", false),
    baseUrl: getEnvVarWithDefault(
      "DEEPSEEK_BASE_URL",
      "https://api.deepseek.com/v1"
    ),
    model: getEnvVarWithDefault("DEEPSEEK_MODEL", "deepseek-chat"),
    maxTokens: parseInt(getEnvVarWithDefault("DEEPSEEK_MAX_TOKENS", "2048"), 10),
    temperature: parseFloat(
      getEnvVarWithDefault("DEEPSEEK_TEMPERATURE", "0.7")
    ),
  };
}

export function getAppConfig(): AppConfig {
  return {
    notion: getNotionConfig(),
    deepseek: getDeepSeekConfig(),
    baseUrl: getEnvVarWithDefault("NEXT_PUBLIC_BASE_URL", "http://localhost:3000"),
  };
}

export function isNotionConfigured(): boolean {
  const config = getNotionConfig();
  return Boolean(config.apiKey || (config.clientId && config.clientSecret));
}

export function isDeepSeekConfigured(): boolean {
  const config = getDeepSeekConfig();
  return Boolean(config.apiKey);
}
