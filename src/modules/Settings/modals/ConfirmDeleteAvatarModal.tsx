import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 text-[#efeff1]">
        <h2 className="text-xl font-bold mb-4 text-center">
          Clear Profile Picture
        </h2>
        <p className="mb-6 text-center">
          Are you sure you want to remove your profile picture?
        </p>
        <div className="space-x-2 flex justify-end">
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <Button value={"primary"} onClick={onConfirm}>
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
