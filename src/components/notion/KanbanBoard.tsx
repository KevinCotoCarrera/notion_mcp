"use client";

/**
 * KanbanBoard Component
 * Drag-and-drop Kanban board for task management
 */

import React, { useState, useCallback } from "react";
import { cn } from "@lib/utils/clsxTwMerge";
import { PriorityBadge } from "./DataTable";
import type { Task, TaskStatus } from "@app-types/notion";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
  loading?: boolean;
  className?: string;
}

const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: "backlog", title: "Backlog", color: "bg-gray-100" },
  { status: "todo", title: "To Do", color: "bg-blue-50" },
  { status: "in_progress", title: "In Progress", color: "bg-yellow-50" },
  { status: "review", title: "Review", color: "bg-purple-50" },
  { status: "done", title: "Done", color: "bg-green-50" },
];

function TaskCard({
  task,
  onClick,
  onDragStart,
}: {
  task: Task;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        "bg-white p-4 rounded-lg shadow-sm border border-gray-200",
        "cursor-pointer hover:shadow-md transition-shadow",
        "select-none"
      )}
    >
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h4>
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {task.storyPoints && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {task.storyPoints} pts
            </span>
          )}
          {task.assignee && (
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-medium text-white">
                {task.assignee.name?.charAt(0) || "?"}
              </span>
            </span>
          )}
        </div>
      </div>
      {task.dueDate && (
        <div className="mt-2 text-xs text-gray-400">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

function KanbanColumnComponent({
  column,
  tasks,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  column: (typeof COLUMNS)[0];
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDragStart: (taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 min-w-[280px] max-w-[350px]",
        "rounded-lg p-4",
        column.color,
        isDragOver && "ring-2 ring-primary ring-offset-2"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{column.title}</h3>
        <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick?.(task)}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", task.id);
              onDragStart(task.id);
            }}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskClick,
  loading = false,
  className,
}: KanbanBoardProps) {
  const [, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const tasksByStatus = useCallback(
    (status: TaskStatus) => tasks.filter((t) => t.status === status),
    [tasks]
  );

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && onTaskMove) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== status) {
        onTaskMove(taskId, status);
      }
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 animate-pulse">
        {COLUMNS.map((col) => (
          <div
            key={col.status}
            className="flex-1 min-w-[280px] max-w-[350px] h-[400px] bg-gray-100 rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("flex gap-4 overflow-x-auto pb-4", className)}
      onDragEnd={handleDragEnd}
    >
      {COLUMNS.map((column) => (
        <KanbanColumnComponent
          key={column.status}
          column={column}
          tasks={tasksByStatus(column.status)}
          onTaskClick={onTaskClick}
          onDragStart={handleDragStart}
          onDragOver={(e) => handleDragOver(e, column.status)}
          onDrop={(e) => handleDrop(e, column.status)}
          isDragOver={dragOverColumn === column.status}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;
