import {
  createContext,
  PropsWithChildren,
  useContext,
  cloneElement,
  ReactElement,
  useMemo,
  ReactNode,
  useState,
} from "react";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import cn from "../utils/cn";

interface DialogOptions {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const useDialog = ({ open, onOpenChange }: DialogOptions) => {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const actualOpen = isControlled ? open : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange : setUncontrolledOpen;

  const data = useFloating({
    open: actualOpen,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(data.context);
  const dismiss = useDismiss(data.context, {
    outsidePressEvent: "mousedown",
  });
  const role = useRole(data.context);

  const interactions = useInteractions([click, dismiss, role]);

  const transitionStyles = useTransitionStyles(data.context, {
    initial: {
      opacity: 0,
      transform: "scale(0.9)",
    },
    duration: 200,
  });

  return useMemo(
    () => ({
      open: actualOpen,
      onOpenChange: setOpen,
      ...interactions,
      ...data,
      ...transitionStyles,
    }),
    [actualOpen, setOpen, interactions, data, transitionStyles]
  );
};

type ContextType = ReturnType<typeof useDialog> | null;

const DialogContext = createContext<ContextType | null>(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error("Dialog components must be wrapped in <Dialog />");
  return context;
};

const Dialog = ({
  children,
  ...options
}: DialogOptions & { children: ReactNode }) => {
  const dialog = useDialog(options);
  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  children: ReactElement;
}

const DialogTrigger = ({ children }: DialogTriggerProps) => {
  const context = useDialogContext();
  return cloneElement(
    children,
    context.getReferenceProps({
      ref: context.refs.setReference,
    })
  );
};

interface DialogContentProps extends PropsWithChildren {}

const DialogContent = ({ children }: DialogContentProps) => {
  const context = useDialogContext();

  if (!context.isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        className={cn(
          "fixed inset-0 z-50 grid place-content-center",
          "bg-black/80",
          "transition-opacity duration-200 ease-in-out",
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        )}
      >
        <FloatingFocusManager context={context.context}>
          <div
            ref={context.refs.setFloating}
            {...context.getFloatingProps()}
            style={context.styles}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;

export default Dialog;
