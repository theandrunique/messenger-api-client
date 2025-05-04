import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import cn from "../utils/cn";

export const TooltipProvider = TooltipPrimitive.Provider;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ children, className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden",
        "px-1.5 py-1 rounded-md shadow-lg",
        "font-bold text-xs whitespace-nowrap",
        "bg-white text-[#0e0e10]",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

const Tooltip = Object.assign(TooltipPrimitive.Root, {
  Trigger: TooltipPrimitive.Trigger,
  Content: TooltipContent,
  Arrow: TooltipPrimitive.Arrow,
});

export default Tooltip;
