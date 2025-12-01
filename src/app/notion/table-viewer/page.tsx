"use client";

/**
 * Table Viewer Page
 * View and manage Notion database tables
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TaskTable,
  LoadingState,
  ErrorState,
  EmptyState,
  PageHeader,
  Card,
} from "@components/notion";
import { Button } from "@components/ui/shadcn/button";
import type { Task } from "@app-types/notion";

// Sample databases for demonstration
const SAMPLE_DATABASES: { id: string; title: string; count: number }[] = [
  { id: "db-1", title: "Project Tasks", count: 24 },
  { id: "db-2", title: "Sprint Backlog", count: 12 },
  { id: "db-3", title: "Epics", count: 5 },
  { id: "db-4", title: "Team Members", count: 8 },
];

// Sample tasks for the table
const SAMPLE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Implement user authentication",
    description: "Add OAuth2 authentication flow",
    status: "done",
    priority: "high",
    storyPoints: 5,
    dueDate: "2024-01-15",
    labels: ["security", "backend"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "task-2",
    title: "Design dashboard UI",
    description: "Create wireframes and mockups",
    status: "done",
    priority: "medium",
    storyPoints: 3,
    dueDate: "2024-01-12",
    labels: ["design", "frontend"],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
  },
  {
    id: "task-3",
    title: "Build Kanban board component",
    description: "Drag and drop task management",
    status: "in_progress",
    priority: "high",
    storyPoints: 8,
    dueDate: "2024-01-20",
    labels: ["frontend", "component"],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
  {
    id: "task-4",
    title: "Integrate DeepSeek LLM",
    description: "Add AI-powered suggestions",
    status: "in_progress",
    priority: "medium",
    storyPoints: 5,
    dueDate: "2024-01-22",
    labels: ["ai", "backend"],
    createdAt: "2024-01-06T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
  {
    id: "task-5",
    title: "Write API documentation",
    description: "Document all endpoints",
    status: "todo",
    priority: "low",
    storyPoints: 2,
    dueDate: "2024-01-25",
    labels: ["documentation"],
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "task-6",
    title: "Performance optimization",
    description: "Optimize database queries",
    status: "backlog",
    priority: "medium",
    storyPoints: 5,
    labels: ["performance", "backend"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "task-7",
    title: "Add unit tests",
    description: "Test coverage for core modules",
    status: "backlog",
    priority: "medium",
    storyPoints: 8,
    labels: ["testing"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "task-8",
    title: "Setup CI/CD pipeline",
    description: "Automated deployment",
    status: "review",
    priority: "high",
    storyPoints: 3,
    dueDate: "2024-01-18",
    labels: ["devops"],
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z",
  },
];

export default function TableViewerPage() {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, _setError] = useState<string | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [databases] = useState(SAMPLE_DATABASES);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setSelectedDatabase("db-1");
      setTasks(SAMPLE_TASKS);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDatabaseSelect = (dbId: string) => {
    setSelectedDatabase(dbId);
    setLoading(true);
    // Simulate fetching database data
    setTimeout(() => {
      setTasks(SAMPLE_TASKS);
      setLoading(false);
    }, 300);
  };

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    // In a real app, open task detail modal
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Table Viewer"
          description="View and manage your Notion databases"
          actions={
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          }
        />

        <div className="grid grid-cols-12 gap-6">
          {/* Database List Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Databases</h3>
              <div className="space-y-2">
                {databases.map((db) => (
                  <button
                    key={db.id}
                    onClick={() => handleDatabaseSelect(db.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedDatabase === db.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{db.title}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {db.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Table Content */}
          <div className="col-span-12 md:col-span-9">
            <Card>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "backlog", "todo", "in_progress", "review", "done"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          filterStatus === status
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {status === "all"
                          ? "All"
                          : status
                              .split("_")
                              .map(
                                (w) => w.charAt(0).toUpperCase() + w.slice(1)
                              )
                              .join(" ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <LoadingState message="Loading table data..." />
              ) : filteredTasks.length === 0 ? (
                <EmptyState
                  title="No tasks found"
                  message={
                    searchQuery || filterStatus !== "all"
                      ? "Try adjusting your filters"
                      : "This database is empty"
                  }
                />
              ) : (
                <TaskTable
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                />
              )}

              {/* Table Stats */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </span>
                <span>
                  Total Story Points:{" "}
                  {filteredTasks.reduce(
                    (sum, t) => sum + (t.storyPoints || 0),
                    0
                  )}
                </span>
              </div>
            </Card>
          </div>
        </div>
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
          <Link href="/notion/sprint-dashboard" className="hover:text-primary">
            Sprint Dashboard
          </Link>
          <Link
            href="/notion/table-viewer"
            className="text-primary font-medium"
          >
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
