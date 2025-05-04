import Dialog from "../../../components/Dialog";
import Button from "../../../components/ui/Button";

interface ConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ConfirmDeleteAvatarDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button value={"primary"} onClick={onConfirm}>
            Remove
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default ConfirmDeleteAvatarDialog;
