import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import cn from "../../utils/cn";

const buttonVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-[#9147ff] hover:bg-[#772ce8]",
      secondary: "bg-[#2f2f35] hover:bg-[#35353b]",
      icon: "bg-transparent hover:bg-[#35353b]",
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
          text-[#efeff1]
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
