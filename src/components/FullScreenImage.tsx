import { ReactNode } from "react";

import image from "../assets/bg.jpg";

interface FullScreenImageProps {
  children: ReactNode;
}

export default function FullScreenImage({ children }: FullScreenImageProps) {
  return(
    <div 
      className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
      style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {children}
    </div>
  );
}
