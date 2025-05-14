import SimpleCard from "../../../components/SimpleCard";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../components/AuthProvider";
import TotpMfaEnableModal, { useTotpMfaEnableModal } from "../modals/TotpMfaEnableModal";
import { useLoadedCurrentUser } from "../../../components/CurrentUserProvider";

const SecurityForm = () => {
  const currentUser = useLoadedCurrentUser();
  const { handleSignOut } = useAuth();
  const totpMfaEnableModal = useTotpMfaEnableModal();

  const sections = [
    {
      title: "Two-Factor Authentication",
      content: (
        <div className="w-full">
          {currentUser.mfa ? (
            <div className="font-semibold">Enabled</div>
          ) : (
            <Button variant={"primary"} onClick={() => totpMfaEnableModal.setOpen(true)}>
              Set Up Two-Factor Authentication
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Sign Out",
      content: (
        <Button variant={"secondary"} onClick={handleSignOut}>
          Sign Out
        </Button>
      ),
    },
  ];

  return (
    <>
      <SimpleCard className="text-[#efeff1] max-w-5xl">
        {sections.map((section) => (
          <>
            <div className="flex flex-col sm:grid grid-cols-[25%_1fr] gap-2 p-5 items-start">
              <div className="font-semibold text-sm">{section.title}</div>
              <div className="w-full h-full">{section.content}</div>
            </div>
            <SimpleCard.Divider />
          </>
        ))}
      </SimpleCard>

      <TotpMfaEnableModal />
    </>
  );
};

export default SecurityForm;
