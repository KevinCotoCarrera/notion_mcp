"use client";

/**
 * LLMSuggestions Component
 * Display and interact with AI-generated suggestions
 */

import React, { useState } from "react";
import { cn } from "@lib/utils/clsxTwMerge";
import { Button } from "@components/ui/shadcn/button";
import type { LLMTaskSuggestion } from "@app-types/notion";

interface LLMSuggestionsProps {
  suggestions: LLMTaskSuggestion[];
  summary?: string;
  insights?: string[];
  loading?: boolean;
  onAcceptSuggestion?: (suggestion: LLMTaskSuggestion) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
  onRefresh?: () => void;
  className?: string;
}

// Suggestion type icons and colors
const suggestionTypeConfig: Record<
  LLMTaskSuggestion["type"],
  { icon: string; color: string; label: string }
> = {
  new_task: {
    icon: "➕",
    color: "bg-green-100 text-green-800 border-green-200",
    label: "New Task",
  },
  task_update: {
    icon: "✏️",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Task Update",
  },
  priority_change: {
    icon: "⚡",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Priority Change",
  },
  sprint_planning: {
    icon: "📋",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    label: "Sprint Planning",
  },
};

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100);
  let colorClass = "bg-red-100 text-red-700";
  if (confidence >= 0.8) {
    colorClass = "bg-green-100 text-green-700";
  } else if (confidence >= 0.6) {
    colorClass = "bg-yellow-100 text-yellow-700";
  } else if (confidence >= 0.4) {
    colorClass = "bg-orange-100 text-orange-700";
  }

  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full", colorClass)}>
      {percentage}% confidence
    </span>
  );
}

function SuggestionCard({
  suggestion,
  onAccept,
  onDismiss,
}: {
  suggestion: LLMTaskSuggestion;
  onAccept?: () => void;
  onDismiss?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = suggestionTypeConfig[suggestion.type];

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-all",
        config.color.split(" ")[0],
        "border-gray-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{config.icon}</span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                config.color
              )}
            >
              {config.label}
            </span>
            <ConfidenceBadge confidence={suggestion.confidence} />
          </div>
          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Reasoning
                </p>
                <p className="text-sm text-gray-700">{suggestion.reasoning}</p>
              </div>
              {suggestion.suggestedValues &&
                Object.keys(suggestion.suggestedValues).length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Suggested Values
                    </p>
                    <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(suggestion.suggestedValues, null, 2)}
                    </pre>
                  </div>
                )}
              {suggestion.relatedTaskIds &&
                suggestion.relatedTaskIds.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Related Tasks
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestion.relatedTaskIds.map((id) => (
                        <span
                          key={id}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
        <div className="flex items-center gap-2">
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-gray-500"
            >
              Dismiss
            </Button>
          )}
          {onAccept && (
            <Button size="sm" onClick={onAccept}>
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function InsightsList({ insights }: { insights: string[] }) {
  if (!insights.length) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <h4 className="font-medium text-blue-900 mb-2">💡 Insights</h4>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LLMSuggestions({
  suggestions,
  summary,
  insights = [],
  loading = false,
  onAcceptSuggestion,
  onDismissSuggestion,
  onRefresh,
  className,
}: LLMSuggestionsProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Generating suggestions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI Suggestions
          </h3>
          {summary && <p className="text-sm text-gray-500 mt-1">{summary}</p>}
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            ↻ Refresh
          </Button>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && <InsightsList insights={insights} />}

      {/* Suggestions List */}
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAccept={
                onAcceptSuggestion
                  ? () => onAcceptSuggestion(suggestion)
                  : undefined
              }
              onDismiss={
                onDismissSuggestion
                  ? () => onDismissSuggestion(suggestion.id)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No suggestions available</p>
          <p className="text-sm text-gray-400 mt-1">
            Add some tasks or context to get AI-powered suggestions
          </p>
        </div>
      )}
    </div>
  );
}

export default LLMSuggestions;
