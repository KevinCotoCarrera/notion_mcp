"use client";

/**
 * DataTable Component
 * Reusable table component for displaying Notion database data
 */

import React, { useState, useMemo } from "react";
import { cn } from "@lib/utils/clsxTwMerge";
import type { Task, TaskStatus, TaskPriority } from "@app-types/notion";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

// Status badge component
export function StatusBadge({ status }: { status: TaskStatus }) {
  const statusStyles: Record<TaskStatus, string> = {
    backlog: "bg-gray-100 text-gray-800",
    todo: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    review: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
  };

  const statusLabels: Record<TaskStatus, string> = {
    backlog: "Backlog",
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

// Priority badge component
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const priorityStyles: Record<TaskPriority, string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-blue-100 text-blue-600",
    high: "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        priorityStyles[priority]
      )}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc"
          ? { key, direction: "desc" }
          : null;
      }
      return { key, direction: "asc" };
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-1" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-lg border", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.sortable && "cursor-pointer hover:bg-gray-100",
                  column.width
                )}
                onClick={() =>
                  column.sortable && handleSort(String(column.key))
                }
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortConfig?.key === column.key && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "hover:bg-gray-50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = getNestedValue(row, String(column.key));
                  return (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "-")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Pre-configured table for tasks
export function TaskTable({
  tasks,
  loading,
  onTaskClick,
}: {
  tasks: Task[];
  loading?: boolean;
  onTaskClick?: (task: Task) => void;
}) {
  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Task",
      sortable: true,
      render: (value) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => <StatusBadge status={value as TaskStatus} />,
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (value) => <PriorityBadge priority={value as TaskPriority} />,
    },
    {
      key: "assignee",
      header: "Assignee",
      render: (value) => {
        const user = value as Task["assignee"];
        return user?.name || "-";
      },
    },
    {
      key: "storyPoints",
      header: "Points",
      sortable: true,
      render: (value) => (value ? String(value) : "-"),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (value) =>
        value ? new Date(String(value)).toLocaleDateString() : "-",
    },
  ];

  return (
    <DataTable
      data={tasks}
      columns={columns}
      loading={loading}
      emptyMessage="No tasks found"
      onRowClick={onTaskClick}
    />
  );
}

export default DataTable;
