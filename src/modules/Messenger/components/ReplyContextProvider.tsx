import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { MessageSchema } from "../../../schemas/message";
import { useLocation } from "react-router-dom";

const ReplyContext = createContext<{
  replyMessage: MessageSchema | undefined;
  setReplyMessage: (message?: MessageSchema) => void;
} | null>(null);

export const useReplyContext = () => {
  const context = useContext(ReplyContext);
  if (context === null) {
    throw new Error("useReplyContext must be used within ReplyContextProvider");
  }
  return context;
};

type ReplyContextProvider = PropsWithChildren;

const ReplyContextProvider = ({ children }: ReplyContextProvider) => {
  const location = useLocation();
  const [replyMessage, setReplyMessage] = useState<MessageSchema>();

  useLayoutEffect(() => {
    setReplyMessage(undefined);
  }, [location]);

  return (
    <ReplyContext.Provider
      value={{
        replyMessage,
        setReplyMessage,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
};

export default ReplyContextProvider;
