import { ReactNode } from "react";

interface FullScreenImageProps {
  children: ReactNode;
}

export default function FullScreenImage({ children }: FullScreenImageProps) {
  return (
    <div
      className="w-full bg-[#0e0e10]"
    >
      {children}
    </div>
  );
}
