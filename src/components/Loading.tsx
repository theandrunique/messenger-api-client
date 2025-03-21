import { HTMLAttributes } from "react";
import Spinner from "./Spinner";
import cn from "../utils/cn";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const Loading = ({ message, className }: LoadingProps) => {
  return (
    <div
      className={cn(
        "bg-[#0e0e10] w-full h-full flex flex-col gap-2 items-center justify-center text-[#efeff1]",
        className
      )}
    >
      <Spinner />
      {message ? <p className="text-base">{message}</p> : null}
    </div>
  );
};

export default Loading;
