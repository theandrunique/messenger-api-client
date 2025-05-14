import { create } from "zustand";
import Dialog from "../../../components/Dialog";
import Button from "../../../components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { deleteAvatar } from "../../../api/api";
import notifications from "../../../utils/notifications";

export const useAvatarDeleteModal = create<{
  open: () => void;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}>()((set) => ({
  isOpen: false,
  avatar: undefined,
  open: () => {
    set({ isOpen: true });
  },
  onOpenChange: (open) => {
    set({ isOpen: open });
  },
}));

const ConfirmDeleteAvatarDialog = () => {
  const modal = useAvatarDeleteModal();
  const currentUser = useCurrentUser();

  const mutation = useMutation({
    mutationFn: async (_) => {
      await deleteAvatar();
    },
    onSuccess: () => {
      currentUser.refetch();
      modal.onOpenChange(false);
    },
    onError: (err) => {
      notifications.error("Something went wrong.");
      console.error("Error while deleting avatar", err);
    },
  });

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onOpenChange}>
      <Dialog.Content>
        <Dialog.Title className="text-xl text-center mb-4">
          Clear Profile Picture
        </Dialog.Title>
        <p className="mb-4 text-center">
          Are you sure you want to remove your profile picture?
        </p>
        <div className="space-x-2 flex justify-end">
          <Dialog.Close asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </Dialog.Close>
          <Button
            disabled={mutation.isPending}
            value={"primary"}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default ConfirmDeleteAvatarDialog;
