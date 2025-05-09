import { forwardRef, TextareaHTMLAttributes } from "react";
import cn from "../../utils/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `
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
          focus:outline-[3px]
          focus:outline-[#a970ff]
          focus:outline-offset-0
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:bg-[#28282c]
      `,
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

export default Textarea;
