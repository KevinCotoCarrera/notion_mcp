/**
 * LLM Suggestions API Route
 * POST: Get AI-powered task suggestions using DeepSeek
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeWithDeepSeek } from "@lib/services/llm/deepseek";
import { isDeepSeekConfigured } from "@lib/config/env";
import type { LLMAnalysisRequest } from "@app-types/notion";

export async function POST(request: NextRequest) {
  if (!isDeepSeekConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "DeepSeek API is not configured. Please set DEEPSEEK_API_KEY environment variable.",
      },
      { status: 503 }
    );
  }
  
  try {
    const body: LLMAnalysisRequest = await request.json();
    
    if (!body.context) {
      return NextResponse.json(
        { success: false, error: "Context is required" },
        { status: 400 }
      );
    }
    
    const result = await analyzeWithDeepSeek(body);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("LLM suggestion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
