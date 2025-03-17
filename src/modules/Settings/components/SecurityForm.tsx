import { useState, useEffect } from "react";
import SimpleCard from "../../../components/SimpleCard";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/Modal";
import Input from "../../../components/ui/Input";
import { ApiError } from "../../../schemas/common";
import { QRCodeSVG } from "qrcode.react";
import notifications from "../../../utils/notifications";
import { enableMfa } from "../../../api/api";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { useAuth } from "../../../components/AuthProvider";

interface EnableMfaModalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const EnableMfaModalForm = ({
  open,
  onClose,
  onSubmit,
}: EnableMfaModalFormProps) => {
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
      <Modal open={open} onClose={onClose}>
        <div className="w-[500px] flex flex-col items-center p-4 px-16 text-[#efeff1]">
          <h2 className="font-bold text-2xl text-center mb-4">
            Enable Two-Factor Authentication
          </h2>
        </div>

        <div className="px-8 pb-8">
          <p className="text-center text-md text-[#efeff1] mb-3">
            Scan this QR code in your authenticator app:
          </p>
          <div className="w-full flex flex-col mb-3">
            <QRCodeSVG className="w-full h-44" value={otpAuthUrl} />
          </div>
          <div className="w-full flex justify-center">
            <Button variant={"primary"} onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (isEmailCodeSend) {
    return (
      <Modal open={open} onClose={onClose}>
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
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[500px] flex flex-col items-center p-4 px-16 text-[#efeff1]">
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
    </Modal>
  );
};

const SecurityForm = () => {
  const { currentUser, refetch: updateUser } = useCurrentUser();
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const { handleSignOut } = useAuth();

  return (
    <>
      <SimpleCard className="text-[#efeff1] max-w-5xl">
        <div className="flex justify-between p-5">
          <div className="font-semibold">Password</div>
          <div className="w-3/4">
            <Button variant={"secondary"}>Change Password</Button>
          </div>
        </div>

        <SimpleCard.Divider />

        <div className="flex justify-between p-5">
          <div className="font-semibold">Two-Factor Authentication</div>
          <div className="w-3/4">
            {currentUser?.mfa ? (
              <Button
                variant={"secondary"}
                onClick={() => setMfaModalOpen(true)}
              >
                Disable Two-Factor Authentication
              </Button>
            ) : (
              <Button variant={"primary"} onClick={() => setMfaModalOpen(true)}>
                Set Up Two-Factor Authentication
              </Button>
            )}
          </div>
        </div>

        <SimpleCard.Divider />

        <div className="flex justify-between p-5">
          <div className="font-semibold">Sign Out Everywhere</div>
          <div className="w-3/4">
            <Button variant={"secondary"}>Sign Out Everywhere</Button>
          </div>
        </div>

        <SimpleCard.Divider />

        <div className="flex justify-between p-5">
          <div className="font-semibold">Sign Out</div>
          <div className="w-3/4">
            <Button variant={"secondary"} onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </SimpleCard>

      <EnableMfaModalForm
        open={mfaModalOpen}
        onClose={() => setMfaModalOpen(false)}
        onSubmit={updateUser}
      />
    </>
  );
};

export default SecurityForm;
