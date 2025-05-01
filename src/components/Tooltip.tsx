import { ReactNode } from "react";
import cn from "../utils/cn";

type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface TooltipProps {
  content: ReactNode;
  side?: TooltipPosition;
  children: ReactNode;
}

const getPositionClasses = (side: TooltipPosition = "top") => {
  const map: Record<TooltipPosition, { wrapper: string; arrow: string }> = {
    "top-left": {
      wrapper: "bottom-full left-0 mb-2",
      arrow: "left-3",
    },
    top: {
      wrapper: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      arrow: " left-1/2 -translate-x-1/2",
    },
    "top-right": {
      wrapper: "bottom-full right-0 mb-2",
      arrow: "right-3",
    },
    "bottom-left": {
      wrapper: "top-full left-0 mt-2",
      arrow: "-top-1 left-3",
    },
    bottom: {
      wrapper: "top-full left-1/2 -translate-x-1/2 mt-2",
      arrow: "-top-1 left-1/2 -translate-x-1/2",
    },
    "bottom-right": {
      wrapper: "top-full right-0 mt-2",
      arrow: "-top-1 right-3",
    },
    left: {
      wrapper: "right-full top-1/2 -translate-y-1/2 mr-2",
      arrow: "-right-1 top-1/2 -translate-y-1/2",
    },
    right: {
      wrapper: "left-full top-1/2 -translate-y-1/2 ml-2",
      arrow: "-left-1 top-1/2 -translate-y-1/2",
    },
  };

  return map[side];
};

const Tooltip = ({ children, content, side = "top" }: TooltipProps) => {
  const { wrapper, arrow } = getPositionClasses(side);

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={cn(
          "absolute z-50 px-1.5 py-1 rounded-md shadow-lg",
          "font-bold text-xs whitespace-nowrap",
          "bg-white text-[#0e0e10]",
          "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto",
          "transition-all duration-200 ease-out",
          wrapper
        )}
      >
        {content}
        <div className={cn("absolute w-2 h-2 bg-white rotate-45", arrow)} />
      </div>
    </div>
  );
};

export default Tooltip;
