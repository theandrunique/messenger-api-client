import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import Modal from "../Modal";
import SimpleCard from "../SimpleCard";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Slide, toast } from "react-toastify";
import api from "../../api/api";
import { ApiError } from "../../schemas/common.schema";

interface EmailVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const EmailVerificationModal = ({
  open,
  onClose,
  onSubmit,
}: EmailVerificationModalProps) => {
  const [code, setCode] = useState("");
  const firstRender = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeResend = () => {
    toast.info("Email is sent", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      theme: "dark",
      transition: Slide,
    });
    api.requestEmailVerificationCode();
  };

  useEffect(() => {
    if (open && firstRender.current) {
      firstRender.current = false;
      handleCodeResend();
    }
  }, [open]);

  const submitHandler = async () => {
    setIsLoading(true);
    try {
      await api.verifyEmail(code);
      toast.info("Email successfully verified", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
        transition: Slide,
      });
      onSubmit?.();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
          transition: Slide,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 px-10 text-[#efeff1] w-[400px] flex flex-col items-center gap-1">
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
          <Button disabled={!code.trim() || isLoading} variant={"primary"} onClick={submitHandler}>
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-md">Don't see the code?</div>
          <Button
            className="text-md"
            variant={"link"}
            onClick={handleCodeResend}
          >
            Resend code
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ContactsForm = () => {
  const currentUser = useAuthStore((store) => store.currentUser);
  const updateUser = useAuthStore((store) => store.updateUser);

  if (currentUser === null) throw new Error("User is not logged in");

  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const onEmailVerificationSuccess = () => {
    updateUser();
    setEmailModalOpen(false);
  };

  return (
    <>
      <SimpleCard className="text-[#efeff1] max-w-5xl">
        <div className="flex justify-between p-5">
          <div className="font-semibold">Email</div>

          <div className="flex-col w-3/4 space-y-2">
            <Input
              className="w-full"
              value={currentUser.email}
              disabled={true}
            />

            <div className="text-sm font-semibold">
              {currentUser.isEmailVerified ? (
                "Verified"
              ) : (
                <div className="flex items-center space-x-3">
                  <div>Not verified</div>
                  <Button
                    variant={"primary"}
                    onClick={() => setEmailModalOpen(true)}
                  >
                    Verify
                  </Button>
                </div>
              )}
            </div>

            <div className="text-[#efeff1] text-sm">
              Email changing is not supported for now.
            </div>
          </div>
        </div>
      </SimpleCard>

      <EmailVerificationModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSubmit={onEmailVerificationSuccess}
      />
    </>
  );
};

export default ContactsForm;
