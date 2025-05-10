import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import cn from "../utils/cn";
import Button from "./ui/Button";

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, collisionPadding = 5, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      collisionPadding={collisionPadding}
      className={cn(
        "z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-[8rem]",
        "overflow-y-auto overflow-x-hidden rounded-md p-1",
        "bg-[#18181b] shadow-[0_8px_30px_rgb(0,0,0,0.8)]",
        "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Item ref={ref} {...props} />
));

interface ContextMenuButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
}

const ContextMenuButton = ({ children, onClick }: ContextMenuButtonProps) => (
  <ContextMenu.Item asChild onSelect={onClick}>
    <Button variant="icon" className="flex items-center gap-2 whitespace-nowrap">
      {children}
    </Button>
  </ContextMenu.Item>
);

const ContextMenu = Object.assign(ContextMenuPrimitive.Root, {
  Trigger: ContextMenuPrimitive.Trigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Button: ContextMenuButton,
});

export default ContextMenu;
