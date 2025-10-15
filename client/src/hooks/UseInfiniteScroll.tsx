import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteChatScrollTypes {
  loadMore: () => Promise<void>;
  hasMore?: boolean;
}

const useInfiniteScroll = ({
  loadMore,
  hasMore = true,
}: UseInfiniteChatScrollTypes) => {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // const prevScrollHeight = useRef(0);

  const handleScroll = useCallback(async () => {
    const container = containerRef.current;
    

    if (!container || loading || !hasMore) return;

    if (container.clientHeight + Math.abs(container?.scrollTop) + 1 >=
      container?.scrollHeight) {
      setLoading(true);
      // prevScrollHeight.current = container.scrollHeight;

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
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { containerRef, loading };
};

export default useInfiniteScroll;
