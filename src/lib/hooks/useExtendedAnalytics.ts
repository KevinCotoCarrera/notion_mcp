import { useState, useEffect, useCallback } from "react";
import {
  FeedbackAnalyticsResponse,
  AnalyticsPeriod,
} from "@lib/types/feedback";
import {
  getBusinessFeedbackAnalytics,
  getComparativeAnalytics,
  getPeakPerformanceInsights,
  getActionableInsights,
  getPerformanceIndicators,
} from "@lib/api/analytics/analytics";

interface ExtendedAnalyticsHookReturn {
  analytics: FeedbackAnalyticsResponse | null;
  insights: ReturnType<typeof getPeakPerformanceInsights> | null;
  actionableInsights: ReturnType<typeof getActionableInsights> | null;
  performanceIndicators: ReturnType<typeof getPerformanceIndicators> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Extended analytics hook that provides comprehensive insights and formatted data
 *
 * @param businessId - Business UUID
 * @param period - Analytics period
 * @param autoRefresh - Whether to auto-refresh data
 * @returns Extended analytics data with insights
 */
export function useExtendedAnalytics(
  businessId: string,
  period: AnalyticsPeriod = "1month",
  autoRefresh = false
): ExtendedAnalyticsHookReturn {
  const [analytics, setAnalytics] = useState<FeedbackAnalyticsResponse | null>(
    null
  );
  const [insights, setInsights] = useState<ReturnType<
    typeof getPeakPerformanceInsights
  > | null>(null);
  const [actionableInsights, setActionableInsights] = useState<ReturnType<
    typeof getActionableInsights
  > | null>(null);
  const [performanceIndicators, setPerformanceIndicators] = useState<ReturnType<
    typeof getPerformanceIndicators
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    try {
      const analyticsData = await getBusinessFeedbackAnalytics(
        businessId,
        period
      );
      setAnalytics(analyticsData);

      // Generate insights from the analytics data
      const performanceInsights = getPeakPerformanceInsights(analyticsData);
      const actionableData = getActionableInsights(analyticsData);
      const indicators = getPerformanceIndicators(analyticsData);

      setInsights(performanceInsights);
      setActionableInsights(actionableData);
      setPerformanceIndicators(indicators);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch analytics";
      setError(errorMessage);
      console.error("Extended analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchAnalytics, autoRefresh]);

  return {
    analytics,
    insights,
    actionableInsights,
    performanceIndicators,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

/**
 * Hook for comparative analytics between two periods
 *
 * @param businessId - Business UUID
 * @param currentPeriod - Current period
 * @param comparisonPeriod - Comparison period
 * @returns Comparative analytics data
 */
export function useComparativeAnalytics(
  businessId: string,
  currentPeriod: AnalyticsPeriod = "1month",
  comparisonPeriod: AnalyticsPeriod = "1month"
) {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getComparativeAnalytics>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparative = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    try {
      const comparativeData = await getComparativeAnalytics(
        businessId,
        currentPeriod,
        comparisonPeriod
      );
      setData(comparativeData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch comparative analytics";
      setError(errorMessage);
      console.error("Comparative analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, currentPeriod, comparisonPeriod]);

  useEffect(() => {
    fetchComparative();
  }, [fetchComparative]);

  return {
    data,
    loading,
    error,
    refetch: fetchComparative,
  };
}
