"use client";

/**
 * LLM Suggestions Page
 * AI-powered task suggestions using DeepSeek LLM
 */

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  LLMSuggestions,
  ErrorState,
  PageHeader,
  Card,
} from "@components/notion";
import { Button } from "@components/ui/shadcn/button";
import type { Task, LLMTaskSuggestion } from "@app-types/notion";

// Sample tasks for context
const SAMPLE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Build user authentication system",
    status: "in_progress",
    priority: "high",
    storyPoints: 8,
    description: "Implement secure login and registration",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Design database schema",
    status: "done",
    priority: "high",
    storyPoints: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Create API documentation",
    status: "backlog",
    priority: "low",
    storyPoints: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Implement notification system",
    status: "backlog",
    priority: "medium",
    storyPoints: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample suggestions for demonstration
const SAMPLE_SUGGESTIONS: LLMTaskSuggestion[] = [
  {
    id: "suggestion-1",
    type: "new_task",
    title: "Add password reset functionality",
    description:
      "The authentication system should include a secure password reset flow with email verification.",
    reasoning:
      "This is a critical feature that's often overlooked. Users frequently need to reset passwords, and having this built-in improves user experience.",
    confidence: 0.92,
    relatedTaskIds: ["task-1"],
    suggestedValues: {
      title: "Implement password reset flow",
      priority: "high",
      storyPoints: 3,
      status: "backlog",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "suggestion-2",
    type: "priority_change",
    title: "Increase priority of API documentation",
    description:
      "Consider moving API documentation to higher priority as it will help with onboarding and integration.",
    reasoning:
      "With authentication in progress, documenting the API now will help frontend developers start integration sooner.",
    confidence: 0.78,
    relatedTaskIds: ["task-3"],
    suggestedValues: {
      priority: "medium",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "suggestion-3",
    type: "task_update",
    title: "Break down notification system task",
    description:
      "The notification system task is quite large. Consider breaking it into smaller tasks for better tracking.",
    reasoning:
      "Tasks with 5+ story points often benefit from being broken down into smaller, more manageable pieces.",
    confidence: 0.85,
    relatedTaskIds: ["task-4"],
    suggestedValues: {
      description:
        "Consider splitting into: 1) Email notifications, 2) In-app notifications, 3) Push notifications",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "suggestion-4",
    type: "sprint_planning",
    title: "Sprint capacity recommendation",
    description:
      "Based on current velocity and task estimates, you might be overcommitting for this sprint.",
    reasoning:
      "Total backlog points (16) plus in-progress (8) exceeds typical sprint velocity. Consider prioritizing high-impact items.",
    confidence: 0.72,
    createdAt: new Date().toISOString(),
  },
];

const SAMPLE_INSIGHTS = [
  "Authentication task is on track and nearing completion",
  "Consider adding security-related tests before deployment",
  "Documentation tasks are accumulating in backlog",
  "Team might benefit from dedicating time to technical debt",
];

export default function LLMSuggestionsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<LLMTaskSuggestion[]>(SAMPLE_SUGGESTIONS);
  const [insights, setInsights] = useState<string[]>(SAMPLE_INSIGHTS);
  const [summary, setSummary] = useState(
    "Analysis of 4 tasks with AI-generated recommendations"
  );
  const [customPrompt, setCustomPrompt] = useState("");
  const [isDeepSeekConfigured, setIsDeepSeekConfigured] = useState(false);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/llm/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: customPrompt || "Analyze tasks and provide suggestions",
          tasks: SAMPLE_TASKS,
          userPrompt: customPrompt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 503) {
          // DeepSeek not configured, use sample data
          setIsDeepSeekConfigured(false);
          setSuggestions(SAMPLE_SUGGESTIONS);
          setInsights(SAMPLE_INSIGHTS);
          setSummary("Demo mode - Configure DEEPSEEK_API_KEY for real AI suggestions");
        } else {
          throw new Error(data.error || "Failed to get suggestions");
        }
      } else {
        const data = await response.json();
        if (data.success && data.data) {
          setIsDeepSeekConfigured(true);
          setSuggestions(data.data.suggestions || []);
          setInsights(data.data.insights || []);
          setSummary(data.data.summary || "");
        }
      }
    } catch {
      // Fall back to sample data on error
      setSuggestions(SAMPLE_SUGGESTIONS);
      setInsights(SAMPLE_INSIGHTS);
      setSummary("Demo mode - Using sample suggestions");
    } finally {
      setLoading(false);
    }
  }, [customPrompt]);

  const handleAcceptSuggestion = (suggestion: LLMTaskSuggestion) => {
    console.log("Accepted suggestion:", suggestion);
    // In a real app, this would create/update tasks via API
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <ErrorState
            title="Error"
            message={error}
            onRetry={() => handleRefresh()}
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
          title="AI Suggestions"
          description="Get intelligent task suggestions powered by DeepSeek LLM"
        />

        <div className="grid grid-cols-12 gap-6">
          {/* Context Panel */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">
                Analysis Context
              </h3>

              {/* Status indicator */}
              <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDeepSeekConfigured ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {isDeepSeekConfigured
                      ? "DeepSeek Connected"
                      : "Demo Mode"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {isDeepSeekConfigured
                    ? "AI suggestions are powered by DeepSeek LLM"
                    : "Set DEEPSEEK_API_KEY for real AI suggestions"}
                </p>
              </div>

              {/* Custom prompt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Prompt (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on improving sprint velocity..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={3}
                />
              </div>

              <Button onClick={handleRefresh} className="w-full" disabled={loading}>
                {loading ? "Analyzing..." : "Generate Suggestions"}
              </Button>

              {/* Current tasks summary */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Tasks Being Analyzed
                </h4>
                <div className="space-y-2">
                  {SAMPLE_TASKS.map((task) => (
                    <div
                      key={task.id}
                      className="text-xs text-gray-600 flex items-center gap-2"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          task.status === "done"
                            ? "bg-green-500"
                            : task.status === "in_progress"
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <LLMSuggestions
                suggestions={suggestions}
                summary={summary}
                insights={insights}
                loading={loading}
                onAcceptSuggestion={handleAcceptSuggestion}
                onDismissSuggestion={handleDismissSuggestion}
                onRefresh={handleRefresh}
              />
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
          <Link href="/notion/table-viewer" className="hover:text-primary">
            Table Viewer
          </Link>
          <Link
            href="/notion/llm-suggestions"
            className="text-primary font-medium"
          >
            LLM Suggestions
          </Link>
        </nav>
      </div>
    </header>
  );
}
