import { forwardRef, InputHTMLAttributes } from "react";
import cn from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(`
          p-1
          px-2
          border
          border-[#67676b]
          rounded-[4px]
          text-sm
          bg-[#18181b]
          text-[#efeff1]
          outline-none
          placeholder:text-[#9d9d9e]
          placeholder:font-semibold
          focus:outline-[3px]
          focus:outline-[#a970ff]
          focus:outline-offset-0
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:bg-[#28282c]`,
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

export default Input;
