import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteChatScrollTypes {
  loadMore: () => Promise<void>;
  hasMore?: boolean;
  threshold?: number; // how close to the top before loading
}

const useInfiniteScroll = ({
  loadMore,
  hasMore = true,
  threshold = 100,
}: UseInfiniteChatScrollTypes) => {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);

  const handleScroll = useCallback(async () => {
    const container = containerRef.current;
    if (!container || loading || !hasMore) return;

    if (container.scrollTop <= threshold) {
      setLoading(true);
      prevScrollHeight.current = container.scrollHeight;

      try {
        await loadMore();
      } finally {
        setLoading(false);

        // requestAnimationFrame(() => {
        //   const newScrollHeight = container.scrollHeight;
        //   container.scrollTop = newScrollHeight - prevScrollHeight.current;
        // });
      }
    }
  }, [loading, hasMore, loadMore, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { containerRef, loading };
};

export default useInfiniteScroll;
