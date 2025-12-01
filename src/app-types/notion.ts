/**
 * Notion MCP TypeScript Types
 * Types for Notion databases, pages, sprints, tasks, and epics
 */

// Base Notion types
export interface NotionUser {
  id: string;
  name: string;
  avatar_url?: string;
  type: "person" | "bot";
  email?: string;
}

export interface NotionWorkspace {
  id: string;
  name: string;
  icon?: string;
  domain?: string;
}

// Property value types
export type NotionPropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "people"
  | "files"
  | "checkbox"
  | "url"
  | "email"
  | "phone_number"
  | "formula"
  | "relation"
  | "rollup"
  | "created_time"
  | "created_by"
  | "last_edited_time"
  | "last_edited_by"
  | "status";

export interface NotionSelectOption {
  id: string;
  name: string;
  color: string;
}

export interface NotionPropertyValue {
  type: NotionPropertyType;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  number?: number | null;
  select?: NotionSelectOption | null;
  multi_select?: NotionSelectOption[];
  date?: { start: string; end?: string | null } | null;
  people?: NotionUser[];
  checkbox?: boolean;
  url?: string | null;
  email?: string | null;
  status?: NotionSelectOption | null;
  created_time?: string;
  last_edited_time?: string;
}

// Database types
export interface NotionDatabaseProperty {
  id: string;
  name: string;
  type: NotionPropertyType;
  options?: NotionSelectOption[];
}

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  cover?: string;
  properties: Record<string, NotionDatabaseProperty>;
  created_time: string;
  last_edited_time: string;
  url: string;
}

// Page/Row types
export interface NotionPage {
  id: string;
  object: "page";
  parent: { type: string; database_id?: string };
  properties: Record<string, NotionPropertyValue>;
  icon?: { type: string; emoji?: string };
  cover?: { type: string; external?: { url: string } };
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  archived: boolean;
  url: string;
}

// Sprint Management types
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: NotionUser;
  dueDate?: string;
  storyPoints?: number;
  epicId?: string;
  sprintId?: string;
  labels?: string[];
  createdAt: string;
  updatedAt: string;
  notionPageId?: string;
}

export interface Epic {
  id: string;
  title: string;
  description?: string;
  status: "planning" | "active" | "completed";
  progress: number; // 0-100
  tasks: Task[];
  color?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  notionPageId?: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  status: "planning" | "active" | "completed";
  startDate: string;
  endDate: string;
  tasks: Task[];
  velocity?: number;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
  notionDatabaseId?: string;
}

export interface Backlog {
  id: string;
  tasks: Task[];
  prioritizedOrder: string[]; // Task IDs in priority order
}

// API Response types
export interface NotionAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  nextCursor?: string;
  hasMore?: boolean;
}

export interface DatabaseQueryResult {
  results: NotionPage[];
  nextCursor?: string;
  hasMore: boolean;
}

// LLM Suggestion types
export interface LLMTaskSuggestion {
  id: string;
  type: "new_task" | "task_update" | "priority_change" | "sprint_planning";
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-1
  relatedTaskIds?: string[];
  suggestedValues?: Partial<Task>;
  createdAt: string;
}

export interface LLMAnalysisRequest {
  context: string;
  tasks?: Task[];
  sprints?: Sprint[];
  epics?: Epic[];
  userPrompt?: string;
}

export interface LLMAnalysisResponse {
  suggestions: LLMTaskSuggestion[];
  summary?: string;
  insights?: string[];
}

// Kanban Board types
export interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
  limit?: number;
}

export interface KanbanBoard {
  id: string;
  columns: KanbanColumn[];
  sprintId?: string;
}

// Dashboard types
export interface SprintMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  burndownData: { date: string; remaining: number; ideal: number }[];
  velocityHistory: { sprint: string; velocity: number }[];
}

export interface DashboardData {
  activeSprint?: Sprint;
  metrics: SprintMetrics;
  recentActivity: { id: string; action: string; task: Task; timestamp: string }[];
  upcomingDeadlines: Task[];
}

// Auth types
export interface NotionAuthConfig {
  clientId: string;
  redirectUri: string;
  responseType: "code";
}

export interface NotionTokenResponse {
  access_token: string;
  token_type: "bearer";
  bot_id: string;
  workspace_id: string;
  workspace_name?: string;
  workspace_icon?: string;
  owner?: NotionUser;
}
