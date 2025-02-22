import { useRef } from "react";

interface ScrollState {
  ref: React.RefObject<HTMLDivElement>;
  saveScrollPosition: (newKey: string) => void;
  scrollToLastSavedPositionOrEnd: () => void;
}

const useScrollState = (): ScrollState => {
  const scrollsPositions = useRef<Record<string, number>>({});
  const lastKey = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const saveScrollPosition = (newKey: string) => {
    if (lastKey.current && containerRef.current) {
      console.log(
        `Saving scroll position for key: ${lastKey.current}, value: ${containerRef.current.scrollTop}`
      );

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

    console.log(
      `Restoring scroll position for key: ${lastKey.current}, value: ${lastSavedScroll}`
    );
    const scrollTo =
      lastSavedScroll !== undefined
        ? lastSavedScroll
        : containerRef.current.scrollHeight;

    containerRef.current.scrollTo({ top: scrollTo - 1 });
  };

  return {
    saveScrollPosition,
    scrollToLastSavedPositionOrEnd,
    ref: containerRef,
  };
};

export default useScrollState;
