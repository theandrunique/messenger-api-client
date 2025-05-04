import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import cn from "../utils/cn";
import Button from "./ui/Button";

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 0, collisionPadding = 5, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem]",
        "overflow-y-auto overflow-x-hidden rounded-md p-1",
        "bg-[#18181b] shadow-[0_8px_30px_rgb(0,0,0,0.8)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} {...props}>
    {children}
  </DropdownMenuPrimitive.Item>
));

interface DropdownMenuButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
}

const DropdownMenuButton = ({ children, onClick }: DropdownMenuButtonProps) => (
  <DropdownMenu.Item asChild onSelect={onClick}>
    <Button variant="icon" className="flex items-center gap-2 whitespace-nowrap">
      {children}
    </Button>
  </DropdownMenu.Item>
);

const DropdownMenu = Object.assign(DropdownMenuPrimitive.Root, {
  Item: DropdownMenuItem,
  Content: DropdownMenuContent,
  Trigger: DropdownMenuPrimitive.Trigger,
  Button: DropdownMenuButton,
});

export default DropdownMenu;
