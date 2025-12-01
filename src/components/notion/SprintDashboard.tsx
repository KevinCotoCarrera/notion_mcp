"use client";

/**
 * SprintDashboard Component
 * Dashboard showing sprint metrics, progress, and charts
 */

import React from "react";
import { cn } from "@lib/utils/clsxTwMerge";
import type { Sprint, SprintMetrics } from "@app-types/notion";

interface SprintDashboardProps {
  sprint?: Sprint | null;
  metrics: SprintMetrics;
  loading?: boolean;
  className?: string;
}

// Metric Card component
function MetricCard({
  title,
  value,
  subtitle,
  trend,
  color = "primary",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  color?: "primary" | "success" | "warning" | "danger";
}) {
  const colorStyles = {
    primary: "border-l-primary",
    success: "border-l-green-500",
    warning: "border-l-yellow-500",
    danger: "border-l-red-500",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-5 shadow-sm border border-gray-100",
        "border-l-4",
        colorStyles[color]
      )}
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      {trend && (
        <p
          className={cn(
            "text-xs mt-2",
            trend.value >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}

// Progress bar component
function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
}: {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          {showPercentage && (
            <span className="text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percentage < 50
              ? "bg-yellow-500"
              : percentage < 80
              ? "bg-blue-500"
              : "bg-green-500"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Simple bar chart for burndown/velocity
function SimpleBarChart({
  data,
  label,
}: {
  data: { label: string; value: number }[];
  label: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      <div className="flex items-end gap-1 h-32">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? "4px" : "0",
              }}
              title={`${item.value}`}
            />
            <span className="text-[10px] text-gray-500 truncate max-w-full">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Constants
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Sprint header component
function SprintHeader({ sprint }: { sprint: Sprint }) {
  const daysRemaining = Math.ceil(
    (new Date(sprint.endDate).getTime() - Date.now()) / MS_PER_DAY
  );

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{sprint.name}</h2>
          {sprint.goal && (
            <p className="text-sm text-gray-600 mt-1">{sprint.goal}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>
              {new Date(sprint.startDate).toLocaleDateString()} -{" "}
              {new Date(sprint.endDate).toLocaleDateString()}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                sprint.status === "active"
                  ? "bg-green-100 text-green-800"
                  : sprint.status === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {daysRemaining > 0 ? daysRemaining : 0}
          </p>
          <p className="text-sm text-gray-500">days remaining</p>
        </div>
      </div>
    </div>
  );
}

export function SprintDashboard({
  sprint,
  metrics,
  loading = false,
  className,
}: SprintDashboardProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Sprint Header */}
      {sprint && <SprintHeader sprint={sprint} />}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tasks"
          value={metrics.totalTasks}
          subtitle="in sprint"
          color="primary"
        />
        <MetricCard
          title="Completed"
          value={metrics.completedTasks}
          subtitle={`${
            metrics.totalTasks > 0
              ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
              : 0
          }% done`}
          color="success"
        />
        <MetricCard
          title="In Progress"
          value={metrics.inProgressTasks}
          subtitle="active tasks"
          color="warning"
        />
        <MetricCard
          title="Story Points"
          value={`${metrics.completedStoryPoints}/${metrics.totalStoryPoints}`}
          subtitle="completed"
          color="primary"
        />
      </div>

      {/* Progress and Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Task Progress */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Sprint Progress</h3>
          <div className="space-y-4">
            <ProgressBar
              value={metrics.completedTasks}
              max={metrics.totalTasks}
              label="Tasks Completed"
            />
            <ProgressBar
              value={metrics.completedStoryPoints}
              max={metrics.totalStoryPoints}
              label="Story Points"
            />
          </div>
        </div>

        {/* Velocity Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">
            Velocity History
          </h3>
          {metrics.velocityHistory.length > 0 ? (
            <SimpleBarChart
              data={metrics.velocityHistory.map((v) => ({
                label: v.sprint,
                value: v.velocity,
              }))}
              label=""
            />
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400">
              No velocity data available
            </div>
          )}
        </div>
      </div>

      {/* Burndown Chart */}
      {metrics.burndownData.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Burndown Chart</h3>
          <div className="h-48 flex items-end gap-1">
            {metrics.burndownData.map((point, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full flex flex-col-reverse gap-0.5">
                  <div
                    className="w-full bg-primary/60 rounded-t"
                    style={{
                      height: `${
                        (point.remaining / metrics.totalStoryPoints) * 120
                      }px`,
                    }}
                  />
                  <div
                    className="w-full border-t-2 border-dashed border-gray-300"
                    style={{
                      marginBottom: `${
                        (point.ideal / metrics.totalStoryPoints) * 120
                      }px`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-primary/60 rounded" /> Actual
            </span>
            <span className="flex items-center gap-1">
              <span className="w-6 border-t-2 border-dashed border-gray-300" />{" "}
              Ideal
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SprintDashboard;
