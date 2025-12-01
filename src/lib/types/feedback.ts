/**
 * Feedback Types Stub
 * Placeholder for feedback type definitions
 */

export type AnalyticsPeriod = "1week" | "1month" | "3months" | "1year" | "all";

export interface FeedbackAnalyticsParams {
  businessId?: string;
  period?: AnalyticsPeriod;
}

export interface FeedbackAnalyticsResponse {
  totalFeedback?: number;
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
  sentimentBreakdown?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  timeSeriesData?: Array<{
    date: string;
    count: number;
    avgRating: number;
  }>;
}
