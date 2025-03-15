import { useRef } from "react";

interface ScrollState {
  ref: React.RefObject<HTMLDivElement>;
  saveScrollPosition: (key: string) => void;
  scrollToLastSavedPositionOrEnd: () => void;
  scrollToEnd: () => void;
  isScrolledToBottom: () => boolean;
  scrollToSavedPositionOrEnd: (key: string) => void;
}

const useScrollState = (): ScrollState => {
  const scrollsPositions = useRef<Record<string, number>>({});
  const lastKey = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const saveScrollPosition = (key: string) => {
    if (lastKey.current && containerRef.current) {
      scrollsPositions.current[key] = containerRef.current.scrollTop;
    }
  };

  const scrollToSavedPositionOrEnd = (key: string) => {
    if (containerRef.current === null) return;

    const lastSavedScroll = scrollsPositions.current[key] ?? undefined;

    const scrollTo =
      lastSavedScroll !== undefined
        ? lastSavedScroll
        : containerRef.current.scrollHeight;

    requestAnimationFrame(() => {
      if (containerRef.current)
        containerRef.current.scrollTo({
          top: scrollTo - 1,
          behavior: "instant",
        });
    });
  }

  const scrollToLastSavedPositionOrEnd = () => {
    if (containerRef.current === null) return;

    const lastSavedScroll =
      lastKey.current !== null && lastKey.current in scrollsPositions.current
        ? scrollsPositions.current[lastKey.current]
        : undefined;

    const scrollTo =
      lastSavedScroll !== undefined
        ? lastSavedScroll
        : containerRef.current.scrollHeight;

    requestAnimationFrame(() => {
      if (containerRef.current)
        containerRef.current.scrollTo({
          top: scrollTo - 1,
          behavior: "instant",
        });
    });
  };

  const scrollToEnd = () => {
    if (containerRef.current === null) return;

    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  };

  const isScrolledToBottom = () => {
    if (containerRef.current === null) return false;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - (scrollTop + clientHeight) < 50;
  };

  return {
    isScrolledToBottom,
    scrollToEnd,
    saveScrollPosition,
    scrollToSavedPositionOrEnd,
    scrollToLastSavedPositionOrEnd,
    ref: containerRef,
  };
};

export default useScrollState;
