import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

// Returns a callback ref: (node) => void
export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const savedCallback = useRef(onLoadMore);

  useEffect(() => {
    savedCallback.current = onLoadMore;
  }, [onLoadMore]);

  // callback ref to attach/detach observer when element mounts/unmounts
  const setNode = useCallback(
    (node: Element | null) => {
      // disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || loading || !hasMore) return;

      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            savedCallback.current();
          }
        },
        { root: null, rootMargin: "200px", threshold: 0.1 }
      );

      obs.observe(node);
      observerRef.current = obs;
    },
    [loading, hasMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return setNode;
}
