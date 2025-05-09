import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import cn from "../../utils/cn";

const buttonVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]",
      secondary: "bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)]",
      icon: "bg-[var(--color-button-icon)] hover:bg-[var(--color-button-icon-hover)] p-1",
      destructive: "",
      link: "hover:underline",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, children, className, ...props }, ref) => {
    return (
      <button
        className={cn(`
          px-2
          py-1
          text-sm
          text-[var(--color-text-base)]
          rounded-[4px]
          font-semibold
          disabled:opacity-50
          disabled:bg-[#2f2f36]
          disabled:cursor-not-allowed`,
          buttonVariants({ variant }),
          className
        )}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;
