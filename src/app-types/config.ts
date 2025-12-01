/**
 * Environment Configuration Types
 */

export interface NotionConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiVersion: string;
}

export interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface AppConfig {
  notion: NotionConfig;
  deepseek: DeepSeekConfig;
  baseUrl: string;
}
