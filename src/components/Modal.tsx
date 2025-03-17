import React, { HTMLAttributes, useEffect, useRef, MouseEvent } from "react";
import Button from "./ui/Button";
import { ArrowLeft, X } from "lucide-react";
import { createPortal } from "react-dom";

const useFocusTrap = (ref: React.RefObject<HTMLElement>, open: boolean) => {
  useEffect(() => {
    if (!open || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open, ref]);
};

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
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
      <div className="w-screen h-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-[#18181b] rounded-lg relative">
            {onBack && (
              <div className="absolute top-2.5 left-2.5">
                <ModalBackButton onBack={onBack} />
              </div>
            )}
            <div className="absolute top-2.5 right-2.5">
              <ModalCloseButton onClose={onClose} />
            </div>
            <div>{children}</div>
          </div>
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
