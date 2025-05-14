import SimpleCard from "../../../components/SimpleCard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useLoadedCurrentUser } from "../../../components/CurrentUserProvider";
import EmailVerificationModal, { useEmailVerificationModal } from "../modals/EmailVerificationModal";


const ContactsForm = () => {
  const emailVerificationModal = useEmailVerificationModal();
  const currentUser = useLoadedCurrentUser();

  return (
    <>
      <SimpleCard className="text-[#efeff1] max-w-5xl">
        <div className="flex flex-col sm:grid grid-cols-[25%_1fr] gap-2 p-5 items-start">
          <div className="font-semibold">Email</div>

          <div className="flex flex-col gap-2 w-full">
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
                    variant="primary"
                    onClick={emailVerificationModal.open}
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

      <EmailVerificationModal />
    </>
  );
};

export default ContactsForm;
