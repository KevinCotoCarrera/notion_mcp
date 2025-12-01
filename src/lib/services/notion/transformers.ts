/**
 * Notion Data Transformers
 * Transform Notion API responses to application types
 */

import type {
  NotionPage,
  NotionPropertyValue,
  Task,
  TaskStatus,
  TaskPriority,
  Epic,
  Sprint,
} from "@app-types/notion";

// Helper to extract text from Notion property
function getTextValue(prop?: NotionPropertyValue): string {
  if (!prop) return "";
  if (prop.title) return prop.title.map((t) => t.plain_text).join("");
  if (prop.rich_text) return prop.rich_text.map((t) => t.plain_text).join("");
  return "";
}

// Helper to extract select value
function getSelectValue(prop?: NotionPropertyValue): string | null {
  if (!prop) return null;
  return prop.select?.name || prop.status?.name || null;
}

// Helper to extract number value
function getNumberValue(prop?: NotionPropertyValue): number | undefined {
  if (!prop) return undefined;
  return prop.number ?? undefined;
}

// Helper to extract date value
function getDateValue(prop?: NotionPropertyValue): string | undefined {
  if (!prop || !prop.date) return undefined;
  return prop.date.start;
}

// Helper to extract checkbox value
function getCheckboxValue(prop?: NotionPropertyValue): boolean {
  if (!prop) return false;
  return prop.checkbox ?? false;
}

// Map status string to TaskStatus
function mapToTaskStatus(status: string | null): TaskStatus {
  if (!status) return "backlog";
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes("done") || statusLower.includes("complete")) {
    return "done";
  }
  if (statusLower.includes("review") || statusLower.includes("testing")) {
    return "review";
  }
  if (statusLower.includes("progress") || statusLower.includes("doing")) {
    return "in_progress";
  }
  if (statusLower.includes("todo") || statusLower.includes("to do")) {
    return "todo";
  }
  return "backlog";
}

// Map priority string to TaskPriority
function mapToTaskPriority(priority: string | null): TaskPriority {
  if (!priority) return "medium";
  const priorityLower = priority.toLowerCase();
  
  if (priorityLower.includes("urgent") || priorityLower.includes("critical")) {
    return "urgent";
  }
  if (priorityLower.includes("high")) {
    return "high";
  }
  if (priorityLower.includes("low")) {
    return "low";
  }
  return "medium";
}

// Transform Notion page to Task
export function notionPageToTask(page: NotionPage): Task {
  const props = page.properties;
  
  return {
    id: page.id,
    title: getTextValue(props["Name"] || props["Title"] || props["Task"]),
    description: getTextValue(props["Description"] || props["Notes"]),
    status: mapToTaskStatus(
      getSelectValue(props["Status"] || props["State"])
    ),
    priority: mapToTaskPriority(
      getSelectValue(props["Priority"] || props["Importance"])
    ),
    assignee: props["Assignee"]?.people?.[0],
    dueDate: getDateValue(props["Due Date"] || props["Due"] || props["Deadline"]),
    storyPoints: getNumberValue(
      props["Story Points"] || props["Points"] || props["Estimate"]
    ),
    epicId: getTextValue(props["Epic"]),
    sprintId: getTextValue(props["Sprint"]),
    labels: props["Labels"]?.multi_select?.map((s) => s.name) || [],
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    notionPageId: page.id,
  };
}

// Transform Notion pages to Tasks
export function notionPagesToTasks(pages: NotionPage[]): Task[] {
  return pages.map(notionPageToTask);
}

// Transform Notion page to Epic
export function notionPageToEpic(
  page: NotionPage,
  tasks: Task[] = []
): Epic {
  const props = page.properties;
  const epicTasks = tasks.filter((t) => t.epicId === page.id);
  const completedTasks = epicTasks.filter((t) => t.status === "done");
  
  return {
    id: page.id,
    title: getTextValue(props["Name"] || props["Title"] || props["Epic"]),
    description: getTextValue(props["Description"] || props["Summary"]),
    status: getCheckboxValue(props["Completed"])
      ? "completed"
      : getCheckboxValue(props["Active"])
      ? "active"
      : "planning",
    progress:
      epicTasks.length > 0
        ? Math.round((completedTasks.length / epicTasks.length) * 100)
        : 0,
    tasks: epicTasks,
    color: props["Color"]?.select?.color,
    startDate: getDateValue(props["Start Date"] || props["Start"]),
    endDate: getDateValue(props["End Date"] || props["End"]),
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    notionPageId: page.id,
  };
}

// Transform Notion page to Sprint
export function notionPageToSprint(
  page: NotionPage,
  tasks: Task[] = []
): Sprint {
  const props = page.properties;
  const sprintTasks = tasks.filter((t) => t.sprintId === page.id);
  const completedTasks = sprintTasks.filter((t) => t.status === "done");
  const completedPoints = completedTasks.reduce(
    (sum, t) => sum + (t.storyPoints || 0),
    0
  );
  
  const startDate = getDateValue(props["Start Date"] || props["Start"]);
  const endDate = getDateValue(props["End Date"] || props["End"]);
  const now = new Date();
  
  let status: Sprint["status"] = "planning";
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now >= start && now <= end) {
      status = "active";
    } else if (now > end) {
      status = "completed";
    }
  }
  
  return {
    id: page.id,
    name: getTextValue(props["Name"] || props["Title"] || props["Sprint"]),
    goal: getTextValue(props["Goal"] || props["Objective"]),
    status,
    startDate: startDate || "",
    endDate: endDate || "",
    tasks: sprintTasks,
    velocity: completedPoints,
    capacity: getNumberValue(props["Capacity"] || props["Total Points"]),
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    notionDatabaseId: page.parent.database_id,
  };
}

// Create Notion properties from Task
export function taskToNotionProperties(
  task: Partial<Task>
): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  
  if (task.title !== undefined) {
    properties["Name"] = {
      title: [{ text: { content: task.title } }],
    };
  }
  
  if (task.description !== undefined) {
    properties["Description"] = {
      rich_text: [{ text: { content: task.description } }],
    };
  }
  
  if (task.status !== undefined) {
    properties["Status"] = {
      status: { name: task.status },
    };
  }
  
  if (task.priority !== undefined) {
    properties["Priority"] = {
      select: { name: task.priority },
    };
  }
  
  if (task.dueDate !== undefined) {
    properties["Due Date"] = {
      date: task.dueDate ? { start: task.dueDate } : null,
    };
  }
  
  if (task.storyPoints !== undefined) {
    properties["Story Points"] = {
      number: task.storyPoints,
    };
  }
  
  return properties;
}
