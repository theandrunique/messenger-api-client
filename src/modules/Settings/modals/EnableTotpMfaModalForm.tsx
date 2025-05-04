import { useEffect, useState } from "react";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { enableMfa } from "../../../api/api";
import { ApiError } from "../../../schemas/common";
import notifications from "../../../utils/notifications";
import { QRCodeSVG } from "qrcode.react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dialog from "../../../components/Dialog";

interface EnableTotpMfaModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
}

const EnableTotpMfaModalForm = ({
  open,
  onOpenChange,
  onSubmit,
}: EnableTotpMfaModalFormProps) => {
  const { currentUser } = useCurrentUser();

  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailCodeSend, setIsEmailCodeSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpAuthUrl, setOtpAuthUrl] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
      setEmailCode("");
      setIsEmailCodeSend(false);
      setOtpAuthUrl("");
    }
  }, [open]);

  const onPasswordSubmit = async () => {
    setIsLoading(true);
    try {
      await enableMfa(password, null);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "AUTH_INVALID_CREDENTIALS") {
          notifications.error("Invalid password");
        } else if (err.code === "AUTH_EMAIL_CODE_REQUIRED") {
          setIsEmailCodeSend(true);
          notifications.info(`Code is sent to '${currentUser?.email}'.`);
        } else {
          notifications.error(err.message);
        }
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onCodeSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await enableMfa(password, emailCode);
      setOtpAuthUrl(response.otpAuthUrl);
      onSubmit?.();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "AUTH_INVALID_EMAIL_CODE") {
          notifications.error(err.message);
        }
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (otpAuthUrl) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content className="w-[450px]">
          <div className="w-[450px] flex flex-col items-center p-4 px-16 text-[#efeff1]">
            <h2 className="font-bold text-2xl text-center mb-4">
              Enable Two-Factor Authentication
            </h2>
          </div>

          <div className="px-4">
            <p className="text-center text-md text-[#efeff1] mb-3">
              Scan this QR code in your authenticator app:
            </p>
            <div className="w-full flex flex-col mb-3">
              <QRCodeSVG className="w-full h-44" value={otpAuthUrl} />
            </div>
            <div className="w-full flex justify-center">
              <Dialog.Close asChild>
                <Button variant={"primary"}>
                  Done
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  }

  if (isEmailCodeSend) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
          <div className="w-[500px] flex flex-col items-center p-4 px-16 text-[#efeff1]">
            <h2 className="font-bold text-2xl text-center mb-4">
              Enable Two-Factor Authentication
            </h2>
          </div>

          <div className="px-8 pb-8">
            <div className="text-center text-md text-[#efeff1] mb-3">
              Enter the code sent to{" "}
              <span className="font-semibold">{currentUser?.email}</span>:
            </div>
            <div className="w-full flex flex-col">
              <Input
                type="text"
                placeholder="Code"
                className="my-4 w-full"
                onChange={(e) => setEmailCode(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-end">
              <Button
                variant={"primary"}
                onClick={onCodeSubmit}
                disabled={emailCode.trim() === "" || isLoading}
              >
                Submit
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-md text-[#efeff1]">Don't see the code?</div>
              <Button
                className="text-md"
                variant={"link"}
                onClick={onPasswordSubmit}
              >
                Resend code
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <div className="w-[450px] flex flex-col items-center p-4 px-16 text-[#efeff1]">
          <h2 className="font-bold text-2xl text-center mb-4">
            Enable Two-Factor Authentication
          </h2>
        </div>

        <div className="px-8 pb-8">
          <div className="w-full flex flex-col">
            <Input
              type="password"
              placeholder="Password"
              className="my-4 w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-end">
            <Button
              variant={"primary"}
              onClick={onPasswordSubmit}
              disabled={password.trim() === "" || isLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default EnableTotpMfaModalForm;
