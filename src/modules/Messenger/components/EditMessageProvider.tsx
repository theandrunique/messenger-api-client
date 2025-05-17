import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { AttachmentSchema, MessageSchema } from "../../../schemas/message";
import { useLocation } from "react-router-dom";

const EditMessageContext = createContext<{
  message: MessageSchema | undefined;
  set: (message: MessageSchema | undefined) => void;
  attachments: AttachmentSchema[];
  onAttachmentRemove: (id: string) => void;
} | null>(null);

export const useEditContextMessage = () => {
  const context = useContext(EditMessageContext);
  if (context === null) {
    throw new Error("useReplyContext must be used within ReplyContextProvider");
  }
  return context;
};

type EditMessageProviderProps = PropsWithChildren;

const EditMessageProvider = ({ children }: EditMessageProviderProps) => {
  const location = useLocation();
  const [message, set] = useState<MessageSchema | undefined>();

  const [oldAttachments, setOldAttachments] = useState<AttachmentSchema[]>([]);

  useLayoutEffect(() => {
    set(undefined);
  }, [location]);

  useLayoutEffect(() => {
    if (message) {
      setOldAttachments(message.attachments);
      console.log(`Set attachments`, message.attachments);
    } else {
      console.log("clear attachments");
      setOldAttachments([]);
    }
  }, [message]);

  const onAttachmentRemove = (id: string) => {
    setOldAttachments((old) => old.filter((a) => a.id !== id));
  };

  return (
    <EditMessageContext.Provider
      value={{
        message,
        set,
        attachments: oldAttachments,
        onAttachmentRemove,
      }}
    >
      {children}
    </EditMessageContext.Provider>
  );
};

export default EditMessageProvider;
