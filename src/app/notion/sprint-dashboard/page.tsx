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
import type { Task, Sprint, SprintMetrics, TaskStatus } from "@app-types/notion";

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
      { date: "2024-01-07", remaining: totalPoints - completedPoints, ideal: 6 },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, _setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [sprint] = useState<Sprint>(SAMPLE_SPRINT);
  const [useSampleData, setUseSampleData] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // In a real app, we'd check the cookie or call an API
        // For demo, we'll use sample data
        setLoading(false);
        setUseSampleData(true);
      } catch {
        setError("Failed to check authentication status");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
          <ErrorState
            title="Error"
            message={error}
            onRetry={() => window.location.reload()}
          />
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
              ? "Viewing sample data - Connect Notion for real data"
              : "Manage your sprint tasks and track progress"
          }
          actions={
            <div className="flex gap-2">
              {!isAuthenticated && (
                <Button variant="outline" onClick={handleConnect}>
                  Connect Notion
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
