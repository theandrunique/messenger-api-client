import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { MessageSchema } from "../../../schemas/message";
import { useLocation } from "react-router-dom";

const ReplyMessageContext = createContext<{
  replyMessage: MessageSchema | undefined;
  set: (message?: MessageSchema) => void;
} | null>(null);

export const useReplyMessageContext = () => {
  const context = useContext(ReplyMessageContext);
  if (context === null) {
    throw new Error(
      "useReplyMessageContext must be used within ReplyMessageProvider"
    );
  }
  return context;
};

type ReplyMessageProvider = PropsWithChildren;

const ReplyMessageProvider = ({ children }: ReplyMessageProvider) => {
  const location = useLocation();
  const [replyMessage, setReplyMessage] = useState<MessageSchema>();

  useLayoutEffect(() => {
    setReplyMessage(undefined);
  }, [location]);

  return (
    <ReplyMessageContext.Provider
      value={{
        replyMessage,
        set: setReplyMessage,
      }}
    >
      {children}
    </ReplyMessageContext.Provider>
  );
};

export default ReplyMessageProvider;
