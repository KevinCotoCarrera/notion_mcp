"use client";

/**
 * Sprint Dashboard Page
 * Displays sprint metrics, Kanban board, and task management
 */

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  SprintDashboard,
  KanbanBoard,
  LoadingState,
  ErrorState,
  PageHeader,
  Card,
} from "@components/notion";
import { Button } from "@components/ui/shadcn/button";
import type {
  Task,
  Sprint,
  SprintMetrics,
  TaskStatus,
} from "@app-types/notion";

// Sample data for demonstration when not connected to Notion
const SAMPLE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Set up project structure",
    description: "Initialize Next.js project with TypeScript",
    status: "done",
    priority: "high",
    storyPoints: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Create Notion API integration",
    description: "Implement Notion client and OAuth flow",
    status: "done",
    priority: "high",
    storyPoints: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Build reusable components",
    description: "Create DataTable, KanbanBoard, and Dashboard components",
    status: "in_progress",
    priority: "high",
    storyPoints: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Implement DeepSeek LLM integration",
    description: "Add AI-powered task suggestions",
    status: "in_progress",
    priority: "medium",
    storyPoints: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Add authentication flow",
    description: "Implement Notion OAuth authentication",
    status: "review",
    priority: "high",
    storyPoints: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-6",
    title: "Create API routes",
    description: "Build server-side API endpoints",
    status: "todo",
    priority: "medium",
    storyPoints: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-7",
    title: "Write documentation",
    description: "Document API and component usage",
    status: "backlog",
    priority: "low",
    storyPoints: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-8",
    title: "Add unit tests",
    description: "Test critical components and utilities",
    status: "backlog",
    priority: "medium",
    storyPoints: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SAMPLE_SPRINT: Sprint = {
  id: "sprint-1",
  name: "Sprint 1 - Foundation",
  goal: "Build core infrastructure and integrations",
  status: "active",
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  tasks: SAMPLE_TASKS,
  velocity: 11,
  capacity: 36,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function calculateMetrics(tasks: Task[]): SprintMetrics {
  const completedTasks = tasks.filter((t) => t.status === "done");
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "review"
  );
  const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const completedPoints = completedTasks.reduce(
    (sum, t) => sum + (t.storyPoints || 0),
    0
  );

  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    inProgressTasks: inProgressTasks.length,
    totalStoryPoints: totalPoints,
    completedStoryPoints: completedPoints,
    burndownData: [
      { date: "2024-01-01", remaining: 36, ideal: 36 },
      { date: "2024-01-02", remaining: 33, ideal: 31 },
      { date: "2024-01-03", remaining: 28, ideal: 26 },
      { date: "2024-01-04", remaining: 25, ideal: 21 },
      { date: "2024-01-05", remaining: 22, ideal: 16 },
      { date: "2024-01-06", remaining: 18, ideal: 11 },
      {
        date: "2024-01-07",
        remaining: totalPoints - completedPoints,
        ideal: 6,
      },
    ],
    velocityHistory: [
      { sprint: "Sprint -3", velocity: 24 },
      { sprint: "Sprint -2", velocity: 28 },
      { sprint: "Sprint -1", velocity: 32 },
      { sprint: "Current", velocity: completedPoints },
    ],
  };
}

export default function SprintDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [sprint] = useState<Sprint>(SAMPLE_SPRINT);
  const [useSampleData, setUseSampleData] = useState(true);
  const [databases, setDatabases] = useState<any[]>([]);

  useEffect(() => {
    // Check authentication and fetch real data
    const loadData = async () => {
      try {
        // First, search for all accessible content (pages and databases)
        const response = await fetch("/api/notion/databases?all=true");
        const result = await response.json();

        console.log("Search all response:", result);

        if (result.success && result.data) {
          // User is authenticated
          setIsAuthenticated(true);

          // Filter for databases only
          const databases = result.data.filter(
            (item: any) => item.object === "database"
          );
          console.log("Databases found:", databases);

          setDatabases(databases);

          // If we have databases, try to fetch tasks from the first one
          if (databases.length > 0) {
            console.log("Loading tasks from first database:", databases[0].id);
            await loadTasksFromDatabase(databases[0].id);
          } else {
            // No databases found - check if we have pages with child databases
            const pages = result.data.filter(
              (item: any) => item.object === "page"
            );
            console.log(
              "No databases found. Total items found:",
              result.data.length
            );
            console.log("Pages found:", pages.length);

            if (pages.length > 0) {
              // Try to find child databases within the pages
              console.log("Checking pages for child databases...");
              await findChildDatabases(pages);
            } else {
              setError(
                "No databases found. Please share a database with your Notion integration."
              );
              setUseSampleData(true);
              setLoading(false);
            }
          }
        } else {
          // Not authenticated, use sample data
          console.log("Not authenticated");
          setIsAuthenticated(false);
          setUseSampleData(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        // On error, fall back to sample data
        setUseSampleData(true);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const findChildDatabases = async (pages: any[]) => {
    try {
      let foundChildDb = false;

      // Check each page for child blocks that might be databases
      for (const page of pages) {
        console.log(
          `Checking page: ${
            page.properties?.title?.title?.[0]?.plain_text || page.id
          }`
        );

        const blocksResponse = await fetch(
          `/api/notion/pages/${page.id}/blocks`
        );
        const blocksResult = await blocksResponse.json();

        console.log(`Blocks in page ${page.id}:`, blocksResult);

        if (blocksResult.success && blocksResult.data) {
          const childDatabases = blocksResult.data.filter(
            (block: any) => block.type === "child_database"
          );

          const childPages = blocksResult.data.filter(
            (block: any) => block.type === "child_page"
          );

          console.log("Child databases found:", childDatabases);
          console.log("Child pages found:", childPages);

          if (childDatabases.length > 0) {
            console.log(
              "Attempting to load from child database:",
              childDatabases[0].id
            );
            foundChildDb = true;

            // Try to query the first child database
            const dbId = childDatabases[0].id;
            const tasksLoaded = await loadTasksFromDatabase(dbId);

            if (tasksLoaded) {
              return;
            }
          }

          // If child database didn't work, try child pages (they might be databases)
          if (childPages.length > 0 && !foundChildDb) {
            console.log("Checking child pages for database access...");
            for (const childPage of childPages) {
              console.log("Trying child page as database:", childPage.id);
              const tasksLoaded = await loadTasksFromDatabase(childPage.id);
              if (tasksLoaded) {
                return;
              }
            }
          }
        }
      }

      // No accessible databases found
      setError(
        `Found ${pages.length} page(s) but cannot access any databases. If you have a database in your page, it may need explicit connection permissions.`
      );
      setUseSampleData(true);
      setLoading(false);
    } catch (err) {
      console.error("Failed to find child databases:", err);
      setError(
        "Could not access page contents. Please ensure the integration has proper permissions."
      );
      setUseSampleData(true);
      setLoading(false);
    }
  };

  const loadTasksFromDatabase = async (
    databaseId: string
  ): Promise<boolean> => {
    try {
      console.log(`Attempting to query database: ${databaseId}`);
      const response = await fetch("/api/notion/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseId }),
      });

      const result = await response.json();
      console.log(`Database query result:`, result);

      if (result.success && result.data?.results) {
        // Transform Notion pages to tasks
        const notionTasks = result.data.results.map((page: any) =>
          transformNotionPageToTask(page)
        );

        console.log(`Transformed tasks:`, notionTasks);

        if (notionTasks.length > 0) {
          setTasks(notionTasks);
          setUseSampleData(false);
          setLoading(false);
          return true;
        } else {
          console.log("Database query successful but no tasks found");
        }
      } else {
        console.log("Database query failed or returned no results");
      }
      return false;
    } catch (err) {
      console.error("Failed to load tasks:", err);
      return false;
    }
  };

  const transformNotionPageToTask = (page: any): Task => {
    const props = page.properties || {};

    // Try to extract common property names
    const getTitle = () => {
      const titleProp = Object.values(props).find(
        (p: any) => p.type === "title"
      ) as any;
      if (titleProp?.title?.[0]?.plain_text)
        return titleProp.title[0].plain_text;
      return "Untitled";
    };

    const getStatus = (): TaskStatus => {
      const statusProp = Object.values(props).find(
        (p: any) => p.type === "status" || p.type === "select"
      ) as any;
      if (statusProp?.status?.name) {
        const status = statusProp.status.name.toLowerCase();
        if (status.includes("done") || status.includes("complete"))
          return "done";
        if (status.includes("progress") || status.includes("doing"))
          return "in_progress";
        if (status.includes("review")) return "review";
        if (status.includes("todo") || status.includes("to do")) return "todo";
        return "backlog";
      }
      if (statusProp?.select?.name) {
        const status = statusProp.select.name.toLowerCase();
        if (status.includes("done") || status.includes("complete"))
          return "done";
        if (status.includes("progress") || status.includes("doing"))
          return "in_progress";
        if (status.includes("review")) return "review";
        if (status.includes("todo") || status.includes("to do")) return "todo";
        return "backlog";
      }
      return "todo";
    };

    const getPriority = () => {
      const priorityProp = Object.values(props).find(
        (p: any) => p.type === "select"
      ) as any;
      if (priorityProp?.select?.name) {
        const priority = priorityProp.select.name.toLowerCase();
        if (priority.includes("high")) return "high";
        if (priority.includes("medium")) return "medium";
        if (priority.includes("low")) return "low";
      }
      return "medium";
    };

    const getStoryPoints = () => {
      const pointsProp = Object.values(props).find(
        (p: any) => p.type === "number"
      ) as any;
      return pointsProp?.number || 0;
    };

    return {
      id: page.id,
      title: getTitle(),
      description: "",
      status: getStatus(),
      priority: getPriority(),
      storyPoints: getStoryPoints(),
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
    };
  };

  const handleConnect = async () => {
    try {
      const response = await fetch("/api/notion/auth");
      const data = await response.json();
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch {
      setError("Failed to initiate Notion connection");
    }
  };

  const handleTaskMove = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    },
    []
  );

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    // In a real app, this would open a modal or navigate to task detail
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <LoadingState message="Loading sprint data..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <PageHeader
            title="Sprint Dashboard"
            description="Connect to your Notion workspace"
          />
          <Card className="mt-6 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error}
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Your integration is connected to a page, but you need a{" "}
              <strong>database</strong> to track tasks.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3">
                If you have a database (table) in your page:
              </h4>
              <ol className="text-left text-sm text-gray-700 space-y-2">
                <li>
                  <strong>1.</strong> Open your database page in Notion (e.g.,
                  "Sprint 1 Backlog")
                </li>
                <li>
                  <strong>2.</strong> Click the <strong>•••</strong> menu in the
                  top right
                </li>
                <li>
                  <strong>3.</strong> Click <strong>"Connections"</strong>
                </li>
                <li>
                  <strong>4.</strong> Find and connect your integration (same
                  one connected to the parent page)
                </li>
                <li>
                  <strong>5.</strong> Refresh this page
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-blue-300">
                <p className="text-xs text-gray-600 mb-2">
                  <strong>
                    Or create an inline database (inherits permissions
                    automatically):
                  </strong>
                </p>
                <ol className="text-left text-xs text-gray-600 space-y-1">
                  <li>1. Open "Sprint 1" page</li>
                  <li>
                    2. Type{" "}
                    <code className="bg-gray-200 px-1 py-0.5 rounded">
                      /table
                    </code>{" "}
                    and select <strong>"Table - Inline"</strong>
                  </li>
                  <li>
                    3. Add your task columns (Status, Priority, Story Points)
                  </li>
                  <li>
                    4. Inline tables automatically inherit parent page
                    permissions
                  </li>
                </ol>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://www.notion.so", "_blank")}
              >
                Open Notion
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const metrics = calculateMetrics(tasks);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Sprint Dashboard"
          description={
            useSampleData
              ? "Viewing sample data - Connect Notion to see your real tasks"
              : `Connected to Notion${
                  databases.length > 0
                    ? ` (${databases.length} database${
                        databases.length > 1 ? "s" : ""
                      } found)`
                    : ""
                }`
          }
          actions={
            <div className="flex gap-2">
              {!isAuthenticated && (
                <Button variant="outline" onClick={handleConnect}>
                  Connect Notion
                </Button>
              )}
              {isAuthenticated && databases.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Data
                </Button>
              )}
              <Link href="/notion/llm-suggestions">
                <Button variant="outline">AI Suggestions</Button>
              </Link>
            </div>
          }
        />

        {/* Sprint Dashboard */}
        <SprintDashboard sprint={sprint} metrics={metrics} />

        {/* Kanban Board */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Board
          </h3>
          <KanbanBoard
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
          />
        </Card>
      </main>
    </div>
  );
}

function NavHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/75 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-2xl font-semibold text-primary">
          Notion MCP
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link
            href="/notion/sprint-dashboard"
            className="text-primary font-medium"
          >
            Sprint Dashboard
          </Link>
          <Link href="/notion/table-viewer" className="hover:text-primary">
            Table Viewer
          </Link>
          <Link href="/notion/llm-suggestions" className="hover:text-primary">
            LLM Suggestions
          </Link>
        </nav>
      </div>
    </header>
  );
}
