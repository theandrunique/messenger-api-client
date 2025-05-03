import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  cloneElement,
  ReactElement,
  HTMLAttributes,
  useLayoutEffect,
} from "react";
import cn from "../utils/cn";
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { TooltipContext } from "./Tooltip";

const DropdownMenuContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFloating: (node: HTMLElement | null) => void;
  setReference: (node: HTMLElement | null) => void;
  x: number | null;
  y: number | null;
  getReferenceProps: (
    userProps?: React.HTMLProps<Element>
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  transitionStyles: React.CSSProperties;
  isMounted: boolean;
} | null>(null);

interface DropdownMenuProps extends PropsWithChildren {
  placement: Placement;
}

export const DropdownMenu = ({
  children,
  placement = "bottom",
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(0), flip(), shift({ padding: 5 })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(data.context),
    useDismiss(data.context),
    useRole(data.context, { role: "menu" }),
  ]);

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
  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        setOpen,
        setReference: data.refs.setReference,
        setFloating: data.refs.setFloating,
        x: data.x,
        y: data.y,
        getReferenceProps: getReferenceProps,
        getFloatingProps: getFloatingProps,
        transitionStyles,
        isMounted,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  children: ReactElement;
}

const DropdownMenuTrigger = ({ children }: DropdownMenuTriggerProps) => {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx)
    throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const tooltip = useContext(TooltipContext);

  useLayoutEffect(() => {
    if (tooltip) {
      tooltip.setDisabled(ctx.open);
    }
    return () => {
      if (tooltip) {
        tooltip.disabled = false;
      }
    };
  }, [ctx.open]);

  return cloneElement(children, {
    ...ctx.getReferenceProps(),
    ref: ctx.setReference,
  });
};

interface DropdownMenuContent extends HTMLAttributes<HTMLDivElement> {}

const DropdownMenuContent = ({
  children,
  className,
  ...props
}: DropdownMenuContent) => {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx)
    throw new Error("DropdownMenuContent must be used within DropdownMenu");

  if (!ctx.isMounted || ctx.x == null || ctx.y == null) return null;

  return (
    <div
      ref={ctx.setFloating}
      {...ctx.getFloatingProps({
        style: {
          position: "absolute",
          top: ctx.y,
          left: ctx.x,
          zIndex: 1,
        },
      })}
    >
      <div
        className={cn(
          "bg-[#18181b] rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.8)]",
          className
        )}
        style={ctx.transitionStyles}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Trigger = DropdownMenuTrigger;

export default DropdownMenu;
