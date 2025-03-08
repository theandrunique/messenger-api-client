import { forwardRef, ForwardRefExoticComponent, HTMLAttributes } from "react";
import cn from "../utils/cn";

const Divider = ({ className, ...props}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("border-b border-[#35353b]", className)}
      {...props}
    />
  );
}

interface SimpleCardProps extends HTMLAttributes<HTMLDivElement> {}

interface SimpleCardComponent extends ForwardRefExoticComponent<SimpleCardProps> {
  Divider: typeof Divider;
}

const SimpleCard = forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(`
          block
          border
          bg-[#18181b]
          border-[#35353b]
          rounded-md`,
          className
        )}
      >
        {children}
      </div>
    );
  }
) as SimpleCardComponent;

SimpleCard.Divider = Divider;

export default SimpleCard;
