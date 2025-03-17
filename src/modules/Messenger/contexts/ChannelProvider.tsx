import { createContext, PropsWithChildren, useContext, useState } from "react";
import { ChannelSchema } from "../../../schemas/channel";

interface ChannelContext {
  createMessage: () => void;
  selectChannel: (channel: ChannelSchema) => void;
  selectedChannel: ChannelSchema | null;
}

export const ChannelContext = createContext<ChannelContext | undefined>(
  undefined
);

interface ChannelProviderProps extends PropsWithChildren {}

const ChannelProvider = ({ children }: ChannelProviderProps) => {
  const [selectedChannel, selectChannel] = useState<ChannelSchema | null>(null);

  const createMessage = () => {};

  return (
    <ChannelContext.Provider
      value={{ createMessage, selectChannel, selectedChannel }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelProvider;

export const useChannelContext = () => {
  const context = useContext(ChannelContext);

  if (context === undefined) {
    throw new Error(
      "useChannelContext must be used within a ChannelContextProvider"
    );
  }
  return context;
};
