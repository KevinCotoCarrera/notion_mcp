/**
 * DeepSeek LLM Service
 * Handles communication with DeepSeek API for task suggestions
 */

import { getDeepSeekConfig } from "@lib/config/env";
import type {
  Task,
  Sprint,
  Epic,
  LLMTaskSuggestion,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from "@app-types/notion";

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const SYSTEM_PROMPT = `You are an expert agile project manager and software development assistant. 
Your role is to analyze tasks, sprints, and epics to provide intelligent suggestions for:
1. Breaking down large tasks into smaller, actionable items
2. Prioritizing tasks based on dependencies and business value
3. Identifying potential blockers or risks
4. Suggesting sprint planning improvements
5. Recommending task status updates based on context

Always respond with structured JSON in the following format:
{
  "suggestions": [
    {
      "type": "new_task" | "task_update" | "priority_change" | "sprint_planning",
      "title": "Brief suggestion title",
      "description": "Detailed description of the suggestion",
      "reasoning": "Why this suggestion is being made",
      "confidence": 0.0-1.0,
      "relatedTaskIds": ["task-id-1", "task-id-2"],
      "suggestedValues": { /* partial task object */ }
    }
  ],
  "summary": "Brief overall summary",
  "insights": ["Insight 1", "Insight 2"]
}`;

function formatTasksContext(tasks: Task[]): string {
  if (!tasks.length) return "No tasks provided.";
  
  return tasks
    .map(
      (t) =>
        `- [${t.id}] "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Points: ${t.storyPoints || "?"} | Due: ${t.dueDate || "None"}`
    )
    .join("\n");
}

function formatSprintsContext(sprints: Sprint[]): string {
  if (!sprints.length) return "No sprints provided.";
  
  return sprints
    .map(
      (s) =>
        `- [${s.id}] "${s.name}" | Status: ${s.status} | ${s.startDate} to ${s.endDate} | Velocity: ${s.velocity || 0} | Tasks: ${s.tasks.length}`
    )
    .join("\n");
}

function formatEpicsContext(epics: Epic[]): string {
  if (!epics.length) return "No epics provided.";
  
  return epics
    .map(
      (e) =>
        `- [${e.id}] "${e.title}" | Status: ${e.status} | Progress: ${e.progress}% | Tasks: ${e.tasks.length}`
    )
    .join("\n");
}

function buildUserPrompt(request: LLMAnalysisRequest): string {
  let prompt = `Context: ${request.context}\n\n`;
  
  if (request.tasks?.length) {
    prompt += `Tasks:\n${formatTasksContext(request.tasks)}\n\n`;
  }
  
  if (request.sprints?.length) {
    prompt += `Sprints:\n${formatSprintsContext(request.sprints)}\n\n`;
  }
  
  if (request.epics?.length) {
    prompt += `Epics:\n${formatEpicsContext(request.epics)}\n\n`;
  }
  
  if (request.userPrompt) {
    prompt += `User Request: ${request.userPrompt}\n\n`;
  }
  
  prompt += "Please analyze this data and provide suggestions.";
  
  return prompt;
}

function parseResponse(content: string): LLMAnalysisResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        suggestions: (parsed.suggestions || []).map(
          (s: Partial<LLMTaskSuggestion>, index: number) => ({
            id: `suggestion-${Date.now()}-${index}`,
            type: s.type || "task_update",
            title: s.title || "Untitled Suggestion",
            description: s.description || "",
            reasoning: s.reasoning || "",
            confidence: typeof s.confidence === "number" ? s.confidence : 0.5,
            relatedTaskIds: s.relatedTaskIds || [],
            suggestedValues: s.suggestedValues || {},
            createdAt: new Date().toISOString(),
          })
        ),
        summary: parsed.summary || "",
        insights: parsed.insights || [],
      };
    }
    
    // If no JSON found, create a simple suggestion from the text
    return {
      suggestions: [
        {
          id: `suggestion-${Date.now()}`,
          type: "task_update",
          title: "AI Analysis",
          description: content,
          reasoning: "Based on the provided context",
          confidence: 0.6,
          createdAt: new Date().toISOString(),
        },
      ],
      summary: "Analysis completed",
      insights: [],
    };
  } catch {
    return {
      suggestions: [],
      summary: "Failed to parse AI response",
      insights: [content],
    };
  }
}

export async function analyzeWithDeepSeek(
  request: LLMAnalysisRequest
): Promise<LLMAnalysisResponse> {
  const config = getDeepSeekConfig();
  
  if (!config.apiKey) {
    return {
      suggestions: [],
      summary: "DeepSeek API key is not configured",
      insights: [],
    };
  }
  
  try {
    const messages: DeepSeekMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(request) },
    ];
    
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      return {
        suggestions: [],
        summary: `DeepSeek API error: ${response.status}`,
        insights: [],
      };
    }
    
    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content || "";
    
    return parseResponse(content);
  } catch (error) {
    console.error("DeepSeek request failed:", error);
    return {
      suggestions: [],
      summary:
        error instanceof Error ? error.message : "Unknown error occurred",
      insights: [],
    };
  }
}

// Convenience functions for specific analysis types
export async function suggestTaskBreakdown(
  task: Task,
  context?: string
): Promise<LLMAnalysisResponse> {
  return analyzeWithDeepSeek({
    context:
      context || "Please break down this task into smaller, actionable subtasks",
    tasks: [task],
    userPrompt: `Break down the task "${task.title}" into 3-5 smaller subtasks that can be completed independently.`,
  });
}

export async function suggestSprintPlanning(
  backlogTasks: Task[],
  sprint: Sprint
): Promise<LLMAnalysisResponse> {
  return analyzeWithDeepSeek({
    context: "Help plan the sprint by selecting and prioritizing tasks",
    tasks: backlogTasks,
    sprints: [sprint],
    userPrompt: `Given the sprint capacity of ${sprint.capacity || "unknown"} story points, which tasks from the backlog should be included in this sprint? Consider priorities and dependencies.`,
  });
}

export async function analyzeProjectHealth(
  tasks: Task[],
  sprints: Sprint[],
  epics: Epic[]
): Promise<LLMAnalysisResponse> {
  return analyzeWithDeepSeek({
    context: "Analyze the overall project health and identify areas for improvement",
    tasks,
    sprints,
    epics,
    userPrompt:
      "Provide insights on project health, potential risks, and recommendations for improvement.",
  });
}
