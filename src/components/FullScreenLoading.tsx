import { PropsWithChildren } from "react";
import Loader from "./Loader";

interface FullScreenLoadingProps extends PropsWithChildren {
  message?: string;
}

const FullScreenLoading = ({ message, children }: FullScreenLoadingProps) => {
  return (
    <div className="bg-[#0e0e10] text-[#efeff1] fixed h-screen w-screen flex flex-col items-center justify-center z-50 gap-2">
      <Loader />
      {message ? <p className="text-base">{message}</p> : null}
      {children ? children : null}
    </div>
  );
};

export default FullScreenLoading;
