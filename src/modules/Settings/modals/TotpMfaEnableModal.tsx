import { useLayoutEffect, useState } from "react";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { enableMfa } from "../../../api/api";
import { ApiError } from "../../../schemas/common";
import notifications from "../../../utils/notifications";
import { QRCodeSVG } from "qrcode.react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dialog from "../../../components/Dialog";
import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../components/ui/ErrorMessage";

type Step = "PASSWORD" | "EMAIL_CODE" | "QR";

export const useTotpMfaEnableModal = create<{
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}>()((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const TotpMfaEnableModal = () => {
  const modal = useTotpMfaEnableModal();

  const { currentUser, refetch } = useCurrentUser();

  const [step, setStep] = useState<Step>("PASSWORD");
  const [otpAuthUrl, setOtpAuthUrl] = useState("");

  const passwordForm = useForm<{ password: string }>();
  const emailForm = useForm<{ emailCode: string }>();

  const passwordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) =>
      enableMfa(password, null),
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.code === "AUTH_INVALID_CREDENTIALS") {
          return passwordForm.setError("password", {
            message: "Invalid password",
          });
        } else if (err.code === "AUTH_EMAIL_CODE_REQUIRED") {
          setStep("EMAIL_CODE");
          return notifications.info(`Code is sent to '${currentUser?.email}'.`);
        } else {
          notifications.error(err.message);
        }
      } else {
        notifications.error("Failed to initiate TOTP MFA");
        console.error("Failed to initiate TOTP MFA", err);
      }
    },
  });

  const emailCodeMutation = useMutation({
    mutationFn: async ({ emailCode }: { emailCode: string }) => {
      return enableMfa(passwordForm.getValues("password"), emailCode);
    },
    onSuccess: (res) => {
      setOtpAuthUrl(res.otpAuthUrl);
      setStep("QR");
      refetch();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.code === "AUTH_INVALID_EMAIL_CODE") {
          emailForm.setError("emailCode", { message: "Invalid code" });
        } else {
          notifications.error(err.message);
        }
      } else {
        notifications.error("Failed to verify email code");
        console.error("Failed to verify email code", err);
      }
    },
  });

  const handleResendCode = () => {
    passwordMutation.mutate({ password: passwordForm.getValues("password") });
  };

  useLayoutEffect(() => {
    if (!modal.isOpen) {
      setStep("PASSWORD");
      setOtpAuthUrl("");
      passwordForm.reset();
      emailForm.reset();
    }
  }, [modal.isOpen]);

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.setOpen}>
      <Dialog.Content className="w-[450px] text-[#efeff1]">
        <div className="flex flex-col items-center px-6 mb-4">
          <h2 className="text-2xl font-bold text-center">
            Enable Two-Factor Authentication
          </h2>
        </div>

        {step === "PASSWORD" && (
          <form
            onSubmit={passwordForm.handleSubmit((data) =>
              passwordMutation.mutate(data)
            )}
            className="px-4"
          >
            <Input
              type="password"
              placeholder="Password"
              {...passwordForm.register("password", {
                required: "Password is required",
              })}
              className="mb-2 w-full"
            />
            {passwordForm.formState.errors.password && (
              <ErrorMessage
                message={passwordForm.formState.errors.password.message}
              />
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}

        {step === "EMAIL_CODE" && (
          <form
            onSubmit={emailForm.handleSubmit((data) =>
              emailCodeMutation.mutate(data)
            )}
            className="px-4"
          >
            <div className="text-center text-sm mb-3">
              Enter the code sent to{" "}
              <span className="font-semibold">{currentUser?.email}</span>:
            </div>

            <Input
              placeholder="Email code"
              {...emailForm.register("emailCode", {
                required: "Code is required",
              })}
              className="mb-2 w-full"
            />
            {emailForm.formState.errors.emailCode && (
              <ErrorMessage
                message={emailForm.formState.errors.emailCode.message}
              />
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={emailCodeMutation.isPending}>
                {emailCodeMutation.isPending ? "Verifying..." : "Submit"}
              </Button>
            </div>

            <div className="text-center text-sm">
              Don’t see the code?{" "}
              <Button
                type="button"
                variant="link"
                className="text-sm px-1"
                onClick={handleResendCode}
              >
                Resend
              </Button>
            </div>
          </form>
        )}

        {step === "QR" && (
          <div className="flex flex-col items-center px-6">
            <p className="text-center mb-4">
              Scan this QR code with your authenticator app:
            </p>
            <QRCodeSVG value={otpAuthUrl} className="w-full h-44 mb-4" />
            <Dialog.Close asChild>
              <Button variant="primary">Done</Button>
            </Dialog.Close>
          </div>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default TotpMfaEnableModal;
