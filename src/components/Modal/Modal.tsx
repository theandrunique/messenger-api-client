import { HTMLAttributes, useEffect, useRef, MouseEvent } from "react";
import { ArrowLeft, X } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import useFocusTrap from "./useFocusTrap";
import "./modal.css";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  onBack?: () => void;
  open: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  open,
  onClose,
  onBack,
  children,
  closeOnEsc = false,
  closeOnOverlayClick = false,
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, open);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") onClose?.();
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
    if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
  };

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center overflow-y-auto py-4"
      onClick={handleOverlayClick}
      {...props}
    >
      <div className="max-h-full max-w-full">
        <div className="relative bg-[#18181b] rounded-lg">
          {onBack && (
            <div className="absolute top-2.5 left-2.5">
              <ModalBackButton onBack={onBack} />
            </div>
          )}
          {onClose && (
            <div className="absolute top-2.5 right-2.5">
              <ModalCloseButton onClose={onClose} />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

interface ModalCloseButtonProps {
  onClose: () => void;
}

const ModalCloseButton = ({ onClose }: ModalCloseButtonProps) => {
  return (
    <Button className="p-1" variant={"icon"} onClick={onClose}>
      <X className="w-5 h-5" />
    </Button>
  );
};

interface ModalBackButtonProps {
  onBack: () => void;
}

const ModalBackButton = ({ onBack }: ModalBackButtonProps) => {
  return (
    <Button className="p-1" variant={"icon"} onClick={onBack}>
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
};

export default Modal;
