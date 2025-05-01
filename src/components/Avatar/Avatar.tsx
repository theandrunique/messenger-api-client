import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ImgHTMLAttributes,
  HTMLAttributes,
  useEffect,
} from "react";
import cn from "../../utils/cn";

interface AvatarContext {
  hasError: boolean;
  setHasError: (v: boolean) => void;
  isLoaded: boolean;
  setIsLoaded: (v: boolean) => void;
}

export const AvatarContext = createContext<AvatarContext | undefined>(
  undefined
);

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {}

export const Avatar = ({ children, className, ...props }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <AvatarContext.Provider
      value={{ hasError, setHasError, isLoaded, setIsLoaded }}
    >
      <div
        {...props}
        className={cn(
          "relative inline-block w-full h-full rounded-full overflow-hidden text-[#efeff1] bg-[#27272a] ",
          className
        )}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
};

export const AvatarImage = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  const context = useContext(AvatarContext);

  if (!context) throw new Error("AvatarImage must be used within Avatar");

  const [shouldRender, setShouldRender] = useState(false);

  const { hasError, setHasError, setIsLoaded } = context;

  useEffect(() => {
    if (!props.src) {
      setHasError(true);
      setIsLoaded(false);
      setShouldRender(false);
      return;
    }

    setHasError(false);
    setIsLoaded(false);
    setShouldRender(false);

    const img = new Image();
    img.src = props.src;

    img.onload = () => {
      setIsLoaded(true);
      setShouldRender(true);
    };

    img.onerror = () => {
      setHasError(true);
      setShouldRender(false);
    };
  }, [props.src]);

  if (!shouldRender || hasError) return null;

  return (
    <img
      onError={() => context.setHasError(true)}
      {...props}
      className="w-full h-full object-cover"
    />
  );
};

export const AvatarFallback = ({ children }: { children: ReactNode }) => {
  const context = useContext(AvatarContext);
  if (!context) throw new Error("AvatarFallback must be used within Avatar");

  if (!context.hasError && context.isLoaded) return;

  return (
    <div className="w-full h-full flex items-center justify-center text-sm font-medium">
      {children}
    </div>
  );
};
