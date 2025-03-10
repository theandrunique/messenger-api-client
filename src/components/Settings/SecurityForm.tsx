import SimpleCard from "../SimpleCard";
import Button from "../ui/Button";

const SecurityForm = () => {
  return (
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
          <Button variant={"primary"}>Set Up Two-Factor Authentication</Button>
        </div>
      </div>

      <SimpleCard.Divider />

      <div className="flex justify-between p-5">
        <div className="font-semibold">Sign Out Everywhere</div>
        <div className="w-3/4">
          <Button variant={"secondary"}>Sign Out Everywhere</Button>
        </div>
      </div>
    </SimpleCard>
  );
};

export default SecurityForm;
