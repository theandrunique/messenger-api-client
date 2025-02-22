import { useRef } from "react";

interface ScrollsState {
  ref: React.RefObject<HTMLDivElement>;
  saveScrollPosition: (newChannelId: string) => void;
  scrollToSavedPosition: () => void;
}

const useScrollsState = (): ScrollsState => {
  const scrollsPositions = useRef<Record<string, number>>({});
  const lastChannelId = useRef<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const saveScrollPosition = (newChannelId: string) => {
    if (lastChannelId.current && containerRef.current) {
      scrollsPositions.current[lastChannelId.current] =
        containerRef.current.scrollTop;
    }

    lastChannelId.current = newChannelId;
  };

  const scrollToSavedPosition = () => {
    if (containerRef.current === null) return;

    const lastSavedScroll =
      lastChannelId.current && scrollsPositions.current[lastChannelId.current];
    const scrollTo = lastSavedScroll || containerRef.current.scrollHeight;

    containerRef.current.scrollTo({ top: scrollTo });
  };

  return { saveScrollPosition, scrollToSavedPosition, ref: containerRef };
};

export default useScrollsState;
