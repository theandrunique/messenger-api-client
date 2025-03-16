import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import cn from "../utils/cn";

interface ScrollManagerProps extends HTMLAttributes<HTMLDivElement> {
  scrollKey: string;
}

const ScrollManager = forwardRef<HTMLDivElement, ScrollManagerProps>(
  ({ scrollKey, children, className, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const scrollPositions = useRef(new Map<string, number>());

    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEffect(() => {
      const container = innerRef.current;
      console.log("Scroll key changed to:", scrollKey);
      console.log("container at effect:", container);
      if (!container) return;

      requestAnimationFrame(() => {
        if (scrollPositions.current.has(scrollKey)) {
          console.log("Scrolling to", scrollPositions.current.get(scrollKey));
          container.scroll({
            top: scrollPositions.current.get(scrollKey),
            behavior: "instant",
          });
        } else {
          console.log("Scrolling to bottom", container.scrollHeight);
          container.scroll({
            top: container.scrollHeight,
            behavior: "instant",
          });
        }
      });

      return () => {
        console.log("Scroll key changed, clearing. Old:", scrollKey);
        console.log("container at clear:", container);
        if (container) {
          scrollPositions.current.set(scrollKey, container.scrollTop);
        }
        console.log("After scroll saving", scrollPositions.current);
      };
    }, [scrollKey]);

    return (
      <div ref={innerRef} className={cn("overflow-y-auto", className)} {...props}>
        {children}
      </div>
    );
  }
);

export default ScrollManager;
