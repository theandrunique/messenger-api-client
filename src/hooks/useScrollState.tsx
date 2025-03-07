import { useRef } from "react";

interface ScrollState {
  ref: React.RefObject<HTMLDivElement>;
  saveScrollPosition: (newKey: string) => void;
  scrollToLastSavedPositionOrEnd: () => void;
  scrollToEnd: () => void;
  isScrolledToBottom: () => boolean;
}

const useScrollState = (): ScrollState => {
  const scrollsPositions = useRef<Record<string, number>>({});
  const lastKey = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const saveScrollPosition = (newKey: string) => {
    if (lastKey.current && containerRef.current) {
      scrollsPositions.current[lastKey.current] =
        containerRef.current.scrollTop;
    }

    lastKey.current = newKey;
  };

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

    containerRef.current.scrollTo({ top: scrollTo - 1 });
  };

  const scrollToEnd = () => {
    if (containerRef.current === null) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const isScrolledToBottom = () => {
    if (containerRef.current === null) return false;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - (scrollTop + clientHeight) < 200;
  };

  return {
    isScrolledToBottom,
    scrollToEnd,
    saveScrollPosition,
    scrollToLastSavedPositionOrEnd,
    ref: containerRef,
  };
};

export default useScrollState;
