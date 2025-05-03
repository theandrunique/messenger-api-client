import { createContext, ReactNode, useContext, useRef, useState } from "react";
import cn from "../utils/cn";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingContext,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";

export const TooltipContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFloating: (node: HTMLElement | null) => void;
  setReference: (node: HTMLElement | null) => void;
  arrowRef: React.RefObject<SVGSVGElement>;
  x: number | null;
  y: number | null;
  getReferenceProps: (
    userProps?: React.HTMLProps<Element>
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  floatingContext: FloatingContext;
  transitionStyles: React.CSSProperties;
  isMounted: boolean;
} | null>(null);

const Tooltip = ({
  children,
  placement = "top",
}: {
  children: ReactNode;
  placement?: Placement;
}) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const [disabled, setDisabled] = useState(false);

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    strategy: "absolute",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { styles: transitionStyles, isMounted } = useTransitionStyles(
    data.context,
    {
      initial: {
        opacity: 0,
        transform: "scale(0.9)",
      },
      duration: 200,
    }
  );

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(data.context, { move: false }),
    useFocus(data.context),
    useDismiss(data.context),
    useRole(data.context, { role: "tooltip" }),
  ]);

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        setFloating: data.refs.setFloating,
        setReference: data.refs.setReference,
        arrowRef,
        x: data.x,
        y: data.y,
        getReferenceProps,
        getFloatingProps,
        disabled,
        setDisabled,
        floatingContext: data.context,
        transitionStyles,
        isMounted,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip.Trigger must be used within Tooltip");

  return (
    <span ref={ctx.setReference} {...ctx.getReferenceProps()}>
      {children}
    </span>
  );
};

const TooltipContent = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip.Portal must be used within Tooltip");

  const {
    isMounted,
    transitionStyles,
    x,
    y,
    arrowRef,
    getFloatingProps,
    disabled,
  } = ctx;

  if (!isMounted || x == null || y == null || disabled) return null;

  return (
    <div
      ref={ctx.setFloating}
      {...getFloatingProps({
        style: {
          position: "absolute",
          top: y,
          left: x,
          zIndex: 1,
        },
      })}
    >
      <div
        className={cn(
          "px-1.5 py-1 rounded-md shadow-lg",
          "font-bold text-xs whitespace-nowrap",
          "bg-white text-[#0e0e10]"
        )}
        style={transitionStyles}
      >
        {children}
        <FloatingArrow
          ref={arrowRef}
          context={ctx.floatingContext}
          width={10}
          height={5}
          className="fill-current text-white"
        />
      </div>
    </div>
  );
};

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export default Tooltip;
