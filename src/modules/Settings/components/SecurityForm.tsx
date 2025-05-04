import { useState } from "react";
import SimpleCard from "../../../components/SimpleCard";
import Button from "../../../components/ui/Button";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { useAuth } from "../../../components/AuthProvider";
import EnableTotpMfaModalForm from "../modals/EnableTotpMfaModalForm";

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

      <EnableTotpMfaModalForm
        open={mfaModalOpen}
        onOpenChange={setMfaModalOpen}
        onSubmit={updateUser}
      />
    </>
  );
};

export default SecurityForm;
