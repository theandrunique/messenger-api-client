import useAuthStore from "../../store/useAuthStore";
import SimpleCard from "../SimpleCard";
import Input from "../ui/Input";

const ContactsForm = () => {
  const currentUser = useAuthStore((store) => store.currentUser);

  if (currentUser === null) throw new Error("User is not logged in");

  return (
    <SimpleCard className="text-[#efeff1] max-w-5xl">
      <div className="flex justify-between p-5">
        <div className="font-semibold">Email</div>

        <div className="flex-col w-3/4 space-y-2">
          <Input className="w-full" value={currentUser.email} disabled={true} />

          <div className="text-sm font-semibold">
            {currentUser.isEmailVerified ? "Verified" : "Not verified"}
          </div>
        </div>
      </div>
    </SimpleCard>
  );
};

export default ContactsForm;
