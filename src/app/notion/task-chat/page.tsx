"use client";

/**
 * Task Management Chat Interface
 * AI-powered chat to plan, create, update, and delete tasks
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@components/ui/shadcn/button";
import { Card } from "@components/ui/shadcn/card";
import Input from "@components/ui/Input";
import type { Task } from "@app-types/notion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function TaskChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [databases, setDatabases] = useState<any[]>([]);
  const [databaseSchema, setDatabaseSchema] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    // Add welcome message once schema is loaded or after timeout
    if (!initializing && messages.length === 0) {
      const welcomeMsg: Message = {
        id: "welcome",
        role: "assistant",
        content: databaseSchema
          ? '👋 Hi! I\'m ready to help you manage your tasks. Try saying:\n\n• "Generate sample sprint tasks"\n• "Create a task to implement login feature"\n• "Show all tasks"\n• "Move task X to In Progress"\n• "Delete task Y"\n\nWhat would you like to do?'
          : "👋 Hi! No Notion database found. Please connect a database first:\n\n1. Create a top-level database in Notion\n2. Connect your integration to it\n3. Refresh this page",
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, [initializing, databaseSchema]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadTasks = async () => {
    try {
      const response = await fetch("/api/notion/databases?all=true");
      const result = await response.json();

      if (result.success && result.data) {
        const dbs = result.data.filter(
          (item: any) => item.object === "database"
        );
        setDatabases(dbs);

        if (dbs.length > 0) {
          // Get database schema to understand property names
          const dbResponse = await fetch(
            `/api/notion/databases?id=${dbs[0].id}`
          );
          const dbResult = await dbResponse.json();

          if (dbResult.success && dbResult.data) {
            setDatabaseSchema(dbResult.data.properties);
            console.log("✅ Database schema loaded:", dbResult.data.properties);
          }

          await loadTasksFromDatabase(dbs[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setInitializing(false);
    }
  };

  const loadTasksFromDatabase = async (databaseId: string) => {
    try {
      const response = await fetch("/api/notion/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseId }),
      });

      const result = await response.json();

      if (result.success && result.data?.results) {
        const notionTasks = result.data.results.map((page: any) =>
          transformNotionPageToTask(page)
        );
        setTasks(notionTasks);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const transformNotionPageToTask = (page: any): Task => {
    const props = page.properties || {};

    const getTitle = () => {
      const titleProp = Object.values(props).find(
        (p: any) => p.type === "title"
      ) as any;
      if (titleProp?.title?.[0]?.plain_text)
        return titleProp.title[0].plain_text;
      return "Untitled";
    };

    const getStatus = () => {
      const statusProp = Object.values(props).find(
        (p: any) => p.type === "status" || p.type === "select"
      ) as any;
      if (statusProp?.status?.name) {
        const status = statusProp.status.name.toLowerCase();
        if (status.includes("done")) return "done";
        if (status.includes("progress")) return "in_progress";
        if (status.includes("review")) return "review";
        if (status.includes("todo")) return "todo";
        return "backlog";
      }
      if (statusProp?.select?.name) {
        const status = statusProp.select.name.toLowerCase();
        if (status.includes("done")) return "done";
        if (status.includes("progress")) return "in_progress";
        if (status.includes("review")) return "review";
        if (status.includes("todo")) return "todo";
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

  const createTasksFromPastedList = async (
    fullText: string,
    taskLines: string[]
  ): Promise<string> => {
    if (!databaseSchema || databases.length === 0) {
      return "❌ Database not ready. Please refresh and try again.";
    }

    try {
      // Call DeepSeek AI to parse tasks intelligently
      const aiResponse = await fetch("/api/llm/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: `You are a task parser. Parse the task list and return ONLY a JSON array. For each task extract:
- name: clear task title (remove checkmarks/bullets)
- priority: Critical/High/Medium/Low (extract from parentheses or infer from task importance)
- status: In Progress/Not started/Backlog/Done (extract from text like "In Progress", "Backlog" or default to "Not started")
- description: 2-3 sentences explaining what this task involves, key deliverables, and technical considerations.

Return ONLY valid JSON array, no markdown, no explanation:
[{"name":"...","priority":"...","status":"...","description":"..."}]`,
          userPrompt: fullText,
        }),
      });

      let parsedTasks: Array<{
        name: string;
        priority: string;
        status: string;
        description?: string;
      }> = [];

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        try {
          // API returns { success: true, data: { suggestions: "..." } }
          const suggestions =
            aiData.data?.suggestions || aiData.suggestions || "";
          console.log("🤖 AI Response:", suggestions.substring(0, 500));

          // Try to extract JSON array from response
          const jsonMatch = suggestions.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Deduplicate by name
            const seen = new Set<string>();
            parsedTasks = parsed.filter((task: any) => {
              const key = task.name.toLowerCase().trim();
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            console.log(
              "✅ DeepSeek parsed",
              parsedTasks.length,
              "unique tasks:",
              parsedTasks
            );
          }
        } catch (parseErr) {
          console.error("AI parsing failed, using fallback:", parseErr);
        }
      } else {
        console.warn("DeepSeek API failed, using fallback parser");
      }

      // Fallback to regex parsing if AI fails
      if (parsedTasks.length === 0) {
        console.log("⚠️ Using fallback parser");
        const seen = new Set<string>();
        parsedTasks = taskLines
          .map((line) => {
            const cleaned = line.replace(/^[✅\-•\d\.]\s*/, "").trim();
            const priorityMatch = cleaned.match(
              /\((Critical|High|Medium|Low)[^\)]*\)/i
            );
            const statusMatch = cleaned.match(
              /\b(In Progress|Backlog|Not started|Done|Completed)\b/i
            );
            const priority = priorityMatch ? priorityMatch[1] : "Medium";
            const status = statusMatch ? statusMatch[1] : "Not started";
            const name = cleaned
              .replace(/\s*\([^\)]*\)\s*/g, "")
              .replace(/✅/g, "")
              .trim();

            return { name, priority, status };
          })
          .filter((task) => {
            const key = task.name.toLowerCase().trim();
            if (seen.has(key) || !task.name) return false;
            seen.add(key);
            return true;
          });
      }

      // Get schema info
      const titleProp = Object.keys(databaseSchema).find(
        (k) => databaseSchema[k].type === "title"
      );
      const statusProp = Object.keys(databaseSchema).find(
        (k) =>
          databaseSchema[k].type === "status" ||
          (databaseSchema[k].type === "select" &&
            k.toLowerCase().includes("status"))
      );
      const priorityProp = Object.keys(databaseSchema).find(
        (k) =>
          databaseSchema[k].type === "select" &&
          k.toLowerCase().includes("priority")
      );

      const getAvailableStatuses = () => {
        if (!statusProp) return [];
        const prop = databaseSchema[statusProp];
        if (prop.type === "status")
          return prop.status?.options?.map((o: any) => o.name) || [];
        if (prop.type === "select")
          return prop.select?.options?.map((o: any) => o.name) || [];
        return [];
      };

      const getAvailablePriorities = () => {
        if (!priorityProp) return [];
        return (
          databaseSchema[priorityProp].select?.options?.map(
            (o: any) => o.name
          ) || []
        );
      };

      const availableStatuses = getAvailableStatuses();
      const availablePriorities = getAvailablePriorities();

      const findMatch = (value: string, options: string[]): string => {
        if (options.length === 0) return value;
        const lowerValue = value.toLowerCase().trim();

        // Exact match
        const exact = options.find((opt) => opt.toLowerCase() === lowerValue);
        if (exact) return exact;

        // Partial match
        const partial = options.find(
          (opt) =>
            opt.toLowerCase().includes(lowerValue) ||
            lowerValue.includes(opt.toLowerCase())
        );
        if (partial) return partial;

        // Fallback to first option
        return options[0];
      };

      // Create tasks
      let created = 0;
      let logs: string[] = [];

      for (const task of parsedTasks.slice(0, 10)) {
        try {
          const properties: any = {};
          let children: any[] | undefined;

          if (titleProp) {
            properties[titleProp] = {
              title: [{ text: { content: task.name } }],
            };
          }

          if (statusProp) {
            const matchedStatus = findMatch(task.status, availableStatuses);
            console.log(`  Status: "${task.status}" → "${matchedStatus}"`);
            const propType = databaseSchema[statusProp].type;
            if (propType === "status") {
              properties[statusProp] = { status: { name: matchedStatus } };
            } else {
              properties[statusProp] = { select: { name: matchedStatus } };
            }
          }

          if (priorityProp) {
            const matchedPriority = findMatch(
              task.priority,
              availablePriorities
            );
            console.log(
              `  Priority: "${task.priority}" → "${matchedPriority}"`
            );
            properties[priorityProp] = { select: { name: matchedPriority } };
          }

          // Add description as page content if provided by AI
          if (task.description) {
            children = [
              {
                object: "block",
                type: "paragraph",
                paragraph: {
                  rich_text: [
                    { type: "text", text: { content: task.description } },
                  ],
                },
              },
            ];
          }

          const response = await fetch("/api/notion/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              databaseId: databases[0].id,
              properties,
              children,
            }),
          });

          const result = await response.json();
          if (result.success) {
            created++;
            logs.push(`✅ ${task.name.substring(0, 40)}...`);
          }
        } catch (err) {
          console.error("Error creating task:", err);
        }
      }

      await loadTasks();

      const logSummary = logs.slice(0, 5).join("\n");
      const moreText =
        logs.length > 5 ? `\n... and ${logs.length - 5} more` : "";

      return `🤖 Detected ${taskLines.length} tasks!\n✅ Created ${created}:\n\n${logSummary}${moreText}\n\n💡 Type "Show all tasks" to see them!`;
    } catch (err) {
      console.error("Error creating tasks from list:", err);
      return "❌ Failed to parse tasks. Try 'Generate sample tasks' instead.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await processCommand(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const processCommand = async (command: string): Promise<string> => {
    const lowerCmd = command.toLowerCase();

    console.log("📝 Raw command:", command.substring(0, 200) + "...");
    
    // Check if input has multiple checkmarks (even without newlines)
    const checkmarkCount = (command.match(/✅/g) || []).length;
    console.log("✅ Checkmark count:", checkmarkCount);

    // Detect multiple tasks from pasted list
    let taskLines = command.split("\n").filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed.length > 0 &&
        (trimmed.includes("✅") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("•") ||
          trimmed.match(/^\d+\./) ||
          trimmed.match(/\((Critical|High|Medium|Low)/i))
      );
    });
    
    // If multiple checkmarks but single line, split by checkmark
    if (taskLines.length <= 1 && checkmarkCount >= 3) {
      taskLines = command.split("✅").filter(t => t.trim().length > 10);
      console.log("🔄 Split by checkmarks:", taskLines.length);
    }

    console.log("🔍 Detected task lines:", taskLines.length);

    if (
      taskLines.length >= 3 &&
      !lowerCmd.includes("generate") &&
      !lowerCmd.includes("show") &&
      !lowerCmd.includes("delete")
    ) {
      // User pasted multiple tasks - use AI to parse and create them
      console.log("🤖 Calling createTasksFromPastedList");
      return await createTasksFromPastedList(command, taskLines);
    }

    // Generate sample tasks
    if (
      lowerCmd.includes("generate") ||
      lowerCmd.includes("sample") ||
      lowerCmd.includes("create multiple")
    ) {
      if (databases.length === 0) {
        return "❌ No database found. Please connect a Notion database first.";
      }

      if (!databaseSchema) {
        return "❌ Database schema not loaded. Please refresh and try again.";
      }

      // Find the correct property names from the schema
      const titleProp = Object.keys(databaseSchema).find(
        (key) => databaseSchema[key].type === "title"
      );
      const statusProp = Object.keys(databaseSchema).find(
        (key) =>
          databaseSchema[key].type === "status" ||
          (databaseSchema[key].type === "select" &&
            key.toLowerCase().includes("status"))
      );
      const priorityProp = Object.keys(databaseSchema).find(
        (key) =>
          databaseSchema[key].type === "select" &&
          key.toLowerCase().includes("priority")
      );

      console.log("Property names:", { titleProp, statusProp, priorityProp });

      // Get available options for status
      const getAvailableStatuses = () => {
        if (!statusProp) return [];
        const prop = databaseSchema[statusProp];
        if (prop.type === "status") {
          return prop.status?.options?.map((o: any) => o.name) || [];
        } else if (prop.type === "select") {
          return prop.select?.options?.map((o: any) => o.name) || [];
        }
        return [];
      };

      const getAvailablePriorities = () => {
        if (!priorityProp) return [];
        const prop = databaseSchema[priorityProp];
        return prop.select?.options?.map((o: any) => o.name) || [];
      };

      const availableStatuses = getAvailableStatuses();
      const availablePriorities = getAvailablePriorities();

      console.log("📊 Available statuses:", availableStatuses);
      console.log("📊 Available priorities:", availablePriorities);

      // Smart matching function to find or create option
      const findOrCreateMatch = (
        value: string,
        options: string[],
        propType: string
      ): string => {
        if (options.length === 0) {
          // No options exist, use the value as-is (Notion will create it for select, but not for status type)
          logs.push(`🆕 Creating new ${propType}: "${value}"`);
          return value;
        }

        const lowerValue = value.toLowerCase();

        // Exact match (case insensitive)
        const exactMatch = options.find(
          (opt) => opt.toLowerCase() === lowerValue
        );
        if (exactMatch) return exactMatch;

        // Contains match
        const containsMatch = options.find(
          (opt) =>
            opt.toLowerCase().includes(lowerValue) ||
            lowerValue.includes(opt.toLowerCase())
        );
        if (containsMatch) {
          if (containsMatch !== value) {
            logs.push(`📝 Using "${containsMatch}" for "${value}"`);
          }
          return containsMatch;
        }

        // Smart mapping for common statuses
        if (lowerValue.includes("todo") || lowerValue.includes("to do")) {
          const match = options.find(
            (opt) =>
              opt.toLowerCase().includes("not started") ||
              opt.toLowerCase().includes("todo")
          );
          if (match) {
            logs.push(`📝 Using "${match}" for "${value}"`);
            return match;
          }
        }

        // If no match found and it's a status type property (can't create new options)
        // Use first available option
        if (options.length > 0) {
          logs.push(`⚠️ "${value}" not available, using "${options[0]}"`);
          return options[0];
        }

        return value;
      };

      const sampleTasks = [
        {
          name: "Add Google Social Login",
          status: "Not started",
          priority: "Critical",
        },
        {
          name: "Minute-Level Worker for Alert Readiness & Suggestions",
          status: "Not started",
          priority: "Critical",
        },
        {
          name: "Build calories and micronutrients tracking interface",
          status: "Not started",
          priority: "High",
        },
        {
          name: "Implement user authentication flow",
          status: "In Progress",
          priority: "High",
        },
        {
          name: "Design dashboard wireframes",
          status: "Not started",
          priority: "Medium",
        },
        {
          name: "Set up CI/CD pipeline",
          status: "Not started",
          priority: "Medium",
        },
        {
          name: "Write API documentation",
          status: "Not started",
          priority: "Low",
        },
        {
          name: "Add unit tests for core features",
          status: "Not started",
          priority: "Medium",
        },
      ];

      let created = 0;
      let failed = 0;
      let logs: string[] = [];

      for (const task of sampleTasks) {
        try {
          const properties: any = {};

          // Add title property
          if (titleProp) {
            properties[titleProp] = {
              title: [{ text: { content: task.name } }],
            };
          }

          // Add status property with smart matching or creation
          if (statusProp) {
            const matchedStatus = findOrCreateMatch(
              task.status,
              availableStatuses,
              "status"
            );
            const propType = databaseSchema[statusProp].type;

            if (propType === "status") {
              properties[statusProp] = {
                status: { name: matchedStatus },
              };
            } else if (propType === "select") {
              properties[statusProp] = {
                select: { name: matchedStatus },
              };
            }

            if (
              matchedStatus === task.status &&
              !availableStatuses.includes(matchedStatus)
            ) {
              // Will be created
            } else if (matchedStatus !== task.status) {
              logs.push(`📝 Mapped "${task.status}" → "${matchedStatus}"`);
            }
          }

          // Add priority property with smart matching or creation
          if (priorityProp) {
            const matchedPriority = findOrCreateMatch(
              task.priority,
              availablePriorities,
              "priority"
            );
            properties[priorityProp] = {
              select: { name: matchedPriority },
            };

            if (
              matchedPriority === task.priority &&
              !availablePriorities.includes(matchedPriority)
            ) {
              // Will be created
            } else if (matchedPriority !== task.priority) {
              logs.push(
                `🎯 Mapped priority "${task.priority}" → "${matchedPriority}"`
              );
            }
          }

          const response = await fetch("/api/notion/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              databaseId: databases[0].id,
              properties,
            }),
          });

          const result = await response.json();
          if (result.success) {
            created++;
            logs.push(`✅ Created: ${task.name}`);
          } else {
            console.error("Failed to create task:", result.error);
            logs.push(`⚠️ Skipped: ${task.name.substring(0, 30)}...`);
            failed++;
          }
        } catch (err) {
          console.error("Error creating task:", err);
          failed++;
        }
      }

      await loadTasks();

      const logSummary = logs.slice(0, 5).join("\n");
      const moreLogsText =
        logs.length > 5 ? `\n... and ${logs.length - 5} more actions` : "";

      return `✅ Generated ${created} sample tasks!${
        failed > 0 ? ` (${failed} skipped)` : ""
      }\n\n${logSummary}${moreLogsText}\n\n💡 Type "Show all tasks" to see them!`;
    } // Show all tasks
    if (lowerCmd.includes("show") || lowerCmd.includes("list")) {
      if (tasks.length === 0) {
        return "📋 No tasks found. Try creating one first!";
      }

      const taskList = tasks
        .map((task, idx) => {
          const statusEmoji = {
            todo: "⚪",
            in_progress: "🔵",
            review: "🟡",
            done: "✅",
            backlog: "⚫",
          }[task.status];

          return `${idx + 1}. ${statusEmoji} **${task.title}** (${
            task.status
          })`;
        })
        .join("\n");

      return `📋 **Your Tasks:**\n\n${taskList}\n\n💡 You can move tasks by saying "Move task 1 to In Progress"`;
    }

    // Create task
    if (
      lowerCmd.includes("create") ||
      lowerCmd.includes("add") ||
      lowerCmd.includes("new task")
    ) {
      if (databases.length === 0) {
        return "❌ No database found. Please connect a Notion database first.";
      }

      if (!databaseSchema) {
        return "❌ Database schema not loaded. Please refresh and try again.";
      }

      // Extract task name (everything after "create task" or similar)
      let taskName = command
        .replace(/create\s+(a\s+)?task\s+(to\s+)?/i, "")
        .replace(/add\s+(a\s+)?task\s+(to\s+)?/i, "")
        .replace(/new task\s+(to\s+)?/i, "")
        .trim();

      if (!taskName) {
        return '❌ Please specify a task name. Example: "Create a task to implement login"';
      }

      // Find the correct property names from the schema
      const titleProp = Object.keys(databaseSchema).find(
        (key) => databaseSchema[key].type === "title"
      );
      const statusProp = Object.keys(databaseSchema).find(
        (key) =>
          databaseSchema[key].type === "status" ||
          (databaseSchema[key].type === "select" &&
            key.toLowerCase().includes("status"))
      );

      try {
        const properties: any = {};

        // Add title property
        if (titleProp) {
          properties[titleProp] = {
            title: [{ text: { content: taskName } }],
          };
        }

        // Add status property (set to "Todo" by default)
        if (statusProp) {
          const propType = databaseSchema[statusProp].type;
          if (propType === "status") {
            properties[statusProp] = {
              status: { name: "Todo" },
            };
          } else if (propType === "select") {
            properties[statusProp] = {
              select: { name: "Todo" },
            };
          }
        }

        const response = await fetch("/api/notion/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            databaseId: databases[0].id,
            properties,
          }),
        });

        const result = await response.json();

        if (result.success) {
          await loadTasks();
          return `✅ Created task: **${taskName}**\n\nWhat else would you like to do?`;
        } else {
          return `❌ Failed to create task: ${result.error}`;
        }
      } catch (err) {
        return "❌ Error creating task. Please try again.";
      }
    }

    // Move task
    if (lowerCmd.includes("move") || lowerCmd.includes("change status")) {
      if (!databaseSchema) {
        return "❌ Database schema not loaded. Please refresh and try again.";
      }

      const taskMatch = command.match(/task\s+(\d+)/i);
      const statusMatch = command.match(/to\s+(\w+(?:\s+\w+)?)/i);

      if (!taskMatch || !statusMatch) {
        return '❌ Please specify: "Move task [number] to [status]"\n\nExample: "Move task 1 to In Progress"';
      }

      const taskIndex = parseInt(taskMatch[1]) - 1;
      const newStatus = statusMatch[1].toLowerCase();

      if (taskIndex < 0 || taskIndex >= tasks.length) {
        return `❌ Task ${taskMatch[1]} not found. You have ${tasks.length} tasks.`;
      }

      const task = tasks[taskIndex];
      const statusMap: { [key: string]: string } = {
        todo: "Todo",
        "to do": "Todo",
        "in progress": "In Progress",
        progress: "In Progress",
        review: "Review",
        done: "Done",
        completed: "Done",
        backlog: "Backlog",
      };

      const mappedStatus = statusMap[newStatus] || "Todo";

      // Find status property
      const statusProp = Object.keys(databaseSchema).find(
        (key) =>
          databaseSchema[key].type === "status" ||
          (databaseSchema[key].type === "select" &&
            key.toLowerCase().includes("status"))
      );

      if (!statusProp) {
        return "❌ Could not find status property in database.";
      }

      try {
        const properties: any = {};
        const propType = databaseSchema[statusProp].type;

        if (propType === "status") {
          properties[statusProp] = {
            status: { name: mappedStatus },
          };
        } else if (propType === "select") {
          properties[statusProp] = {
            select: { name: mappedStatus },
          };
        }

        const response = await fetch("/api/notion/pages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageId: task.id,
            properties,
          }),
        });

        const result = await response.json();

        if (result.success) {
          await loadTasks();
          return `✅ Moved **${task.title}** to **${mappedStatus}**`;
        } else {
          return `❌ Failed to update task: ${result.error}`;
        }
      } catch (err) {
        return "❌ Error updating task. Please try again.";
      }
    }

    // Delete task
    if (lowerCmd.includes("delete") || lowerCmd.includes("remove")) {
      const taskMatch = command.match(/task\s+(\d+)/i);

      if (!taskMatch) {
        return '❌ Please specify: "Delete task [number]"\n\nExample: "Delete task 3"';
      }

      const taskIndex = parseInt(taskMatch[1]) - 1;

      if (taskIndex < 0 || taskIndex >= tasks.length) {
        return `❌ Task ${taskMatch[1]} not found. You have ${tasks.length} tasks.`;
      }

      const task = tasks[taskIndex];

      try {
        const response = await fetch(`/api/notion/pages?id=${task.id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          await loadTasks();
          return `🗑️ Deleted task: **${task.title}**`;
        } else {
          return `❌ Failed to delete task: ${result.error}`;
        }
      } catch (err) {
        return "❌ Error deleting task. Please try again.";
      }
    }

    return '🤔 I didn\'t understand that. Try:\n• "Show all tasks"\n• "Create a task to [description]"\n• "Move task [number] to [status]"\n• "Delete task [number]"';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Chat</h1>
          <p className="text-gray-600 mt-2">
            Manage your tasks with natural language commands
          </p>
        </div>

        <Card className="flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content
                      .split("**")
                      .map((part, idx) =>
                        idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                      )}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a command... (e.g., 'Show all tasks')"
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                Send
              </Button>
            </div>
          </div>
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
          <Link href="/notion/sprint-dashboard" className="hover:text-primary">
            Sprint Dashboard
          </Link>
          <Link href="/notion/table-viewer" className="hover:text-primary">
            Table Viewer
          </Link>
          <Link href="/notion/task-chat" className="text-primary font-medium">
            Task Chat
          </Link>
          <Link href="/notion/llm-suggestions" className="hover:text-primary">
            LLM Suggestions
          </Link>
        </nav>
      </div>
    </header>
  );
}
