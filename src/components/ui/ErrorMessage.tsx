import { HTMLAttributes } from "react";
import cn from "../../utils/cn";

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const ErrorMessage = ({ message, className, ...props }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <p 
      className={cn(`
        text-sm
        text-red-600`,
        className
      )}
      {...props}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
