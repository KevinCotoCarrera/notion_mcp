import { useState, useEffect } from "react";
import {
  getFeedbackAnalytics,
  getBusinessFeedbackAnalytics,
  getGlobalFeedbackAnalytics,
} from "@lib/api/analytics/analytics";
import {
  FeedbackAnalyticsResponse,
  FeedbackAnalyticsParams,
  AnalyticsPeriod,
} from "@lib/types/feedback";

interface UseAnalyticsOptions {
  businessId?: string;
  period?: AnalyticsPeriod;
  enabled?: boolean;
}

interface UseAnalyticsReturn {
  analytics: FeedbackAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for fetching feedback analytics data
 * @param options - Configuration options for the analytics request
 * @returns Analytics data, loading state, error, and refetch function
 */
export function useAnalytics(
  options: UseAnalyticsOptions = {}
): UseAnalyticsReturn {
  const { businessId, period = "1month", enabled = true } = options;
  const [analytics, setAnalytics] = useState<FeedbackAnalyticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      let data: FeedbackAnalyticsResponse;

      if (businessId) {
        data = await getBusinessFeedbackAnalytics(businessId, period);
      } else {
        data = await getGlobalFeedbackAnalytics(period);
      }

      setAnalytics(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch analytics";
      setError(errorMessage);
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [businessId, period, enabled]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

/**
 * Hook for fetching business-specific analytics
 * @param businessId - UUID of the business
 * @param period - Time period for analysis
 * @param enabled - Whether to automatically fetch data
 * @returns Analytics data specific to the business
 */
export function useBusinessAnalytics(
  businessId: string,
  period: AnalyticsPeriod = "1month",
  enabled: boolean = true
): UseAnalyticsReturn {
  return useAnalytics({ businessId, period, enabled });
}

/**
 * Hook for fetching global analytics across all businesses
 * @param period - Time period for analysis
 * @param enabled - Whether to automatically fetch data
 * @returns Global analytics data
 */
export function useGlobalAnalytics(
  period: AnalyticsPeriod = "1month",
  enabled: boolean = true
): UseAnalyticsReturn {
  return useAnalytics({ period, enabled });
}
