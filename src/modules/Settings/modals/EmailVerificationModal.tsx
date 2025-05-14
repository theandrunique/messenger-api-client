import { create } from "zustand";
import Dialog from "../../../components/Dialog";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import notifications from "../../../utils/notifications";
import { requestEmailVerificationCode, verifyEmail } from "../../../api/api";
import { ApiError } from "../../../schemas/common";
import { useMutation } from "@tanstack/react-query";
import useCurrentUser from "../../../api/hooks/useCurrentUser";

export const useEmailVerificationModal = create<{
  open: () => void;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}>()((set) => ({
  isOpen: false,
  open: () => {
    set({ isOpen: true });
  },
  onOpenChange: (open) => {
    set({ isOpen: open });
  },
}));

const EmailVerificationModal = () => {
  const modal = useEmailVerificationModal();
  const currentUser = useCurrentUser();
  const [code, setCode] = useState("");

  const codeMutation = useMutation({
    mutationFn: () => requestEmailVerificationCode(),
    onSuccess: () => {
      notifications.info("Email is sent");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        notifications.error(err.message);
      } else {
        notifications.error("Something went wrong.");
        console.error("Error while requesting email code", err);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (code: string) => verifyEmail(code),
    onSuccess: () => {
      notifications.success("Email successfully verified");
      modal.onOpenChange(false);
      currentUser.refetch();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        notifications.error(err.message);
      } else {
        notifications.error("Something went wrong.");
        console.error("Error while verifying email", err);
      }
    },
  });

  useEffect(() => {
    if (modal.isOpen) {
      setCode("");
      codeMutation.mutate();
    }
  }, [modal.isOpen]);

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onOpenChange}>
      <Dialog.Content>
        <div className="p-4 px-10 text-[#efeff1] w-[350px] flex flex-col items-center gap-1">
          <h2 className="font-bold text-2xl mb-4">Email Verification</h2>

          <div className="w-full mb-2">
            <div>Enter the code sent to your email:</div>
          </div>

          <Input
            type="text"
            onChange={(e) => setCode(e.target.value)}
            className="w-full"
          />

          <div className="flex w-full justify-end">
            <Button
              disabled={!code.trim() || mutation.isPending}
              variant="primary"
              onClick={() => mutation.mutate(code)}
            >
              {mutation.isPending ? "Verifying..." : "Submit"}
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-md">Don't see the code?</div>
            <Button
              className="text-md"
              variant="link"
              onClick={() => codeMutation.mutate()}
            >
              Resend code
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default EmailVerificationModal;
