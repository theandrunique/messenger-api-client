import { HTMLAttributes, useEffect, useRef, MouseEvent } from "react";
import Button from "./ui/Button";
import { ArrowLeft } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  open: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  open,
  onClose,
  children,
  closeOnEsc = false,
  closeOnOverlayClick = false,
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, closeOnEsc]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
  };

  if (open === false) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={handleOverlayClick}
      {...props}
    >
      <div className="bg-[#1f1f23] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-start px-3 pt-3">
          <Button variant={"icon"} onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
