import { create } from "zustand";
import { MessageSchema } from '../../../../schemas/message';
import Dialog from "../../../../components/Dialog";
import Button from "../../../../components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "../../../../api/api";
import { updateUseMessagesOnMessageDelete } from "../../../../api/hooks/useMessages";
import { ApiError } from "../../../../schemas/common";
import notifications from "../../../../utils/notifications";

export const useMessageDeleteModal = create<{
  open: (message: MessageSchema) => void;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  message: MessageSchema | undefined;
}>()((set) => ({
  isOpen: false,
  message: undefined,
  open: (message) => {
    set({ isOpen: true, message: message });
  },
  onOpenChange: (open) => {
    set({ isOpen: open });
  }
}));

const MessageDeleteModal = () => {
  const store = useMessageDeleteModal();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteMessage(store.message!.channelId, store.message!.id),
    onSuccess: () => {
      store.onOpenChange(false);
      updateUseMessagesOnMessageDelete(queryClient, store.message!.channelId, store.message!.id);
    },
    onError: (e) => {
      if (e instanceof ApiError) {
        notifications.error(e.message);
      }
    }
  })

  return (
    <Dialog open={store.isOpen} onOpenChange={store.onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Delete message</Dialog.Title>

        <p className="my-2">Are you sure you want to delete this message?</p>

        <div className="flex items-center gap-2 justify-end">
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            Delete
          </Button>
        </div>

      </Dialog.Content>
    </Dialog>
  );
};

export default MessageDeleteModal;
