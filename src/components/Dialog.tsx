import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cn from "../utils/cn";
import Button from "./ui/Button";
import { X } from "lucide-react";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 grid place-content-center overflow-auto",
      "bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.DialogPortal>
    <DialogOverlay>
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "relative",
          "rounded-lg bg-[#18181b] p-4 text-[#efeff1]",
          "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogOverlay>
  </DialogPrimitive.DialogPortal>
));

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none",
      className
    )}
    {...props}
  />
));

const DialogCloseButton = () => {
  return (
    <div className="absolute top-2.5 right-2.5">
      <DialogPrimitive.Close asChild>
        <Button className="p-1" variant={"icon"}>
          <X className="w-5 h-5" />
        </Button>
      </DialogPrimitive.Close>
    </div>
  );
};

const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: DialogPrimitive.Close,
  CloseButton: DialogCloseButton,
  Title: DialogTitle,
});

export default Dialog;
