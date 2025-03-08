import Avatar from "../components/Avatar";
import Navbar from "../components/Navbar";
import SimpleCard from "../components/SimpleCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import useAuthStore from "../store/useAuthStore";
import zod from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../components/ui/ErrorMessage";

const profileSettingsSchema = zod.object({
  username: zod.string(),
  globalName: zod.string().min(1),
  bio: zod.string(),
});

type ProfileSettingsSchema = zod.infer<typeof profileSettingsSchema>;

const PageHeader = ({ title }: { title: string }) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-[#efeff1]">{title}</h1>
    </div>
  );
};

const SmallHeader = ({ content }: { content: string }) => {
  return <h1 className="text-xl font-semibold text-[#dedee3]">{content}</h1>;
};

const ProfilePictureForm = () => {
  const currentUser = useAuthStore((store) => store.currentUser);

  if (currentUser === null) throw new Error("User is not logged in");

  return (
    <SimpleCard className="max-w-5xl p-5">
      <div className="flex">
        <div>
          <Avatar
            avatar={currentUser.image}
            username={currentUser.username}
            className="w-24 h-24 rounded-full bg-[#374151]"
          />
        </div>

        <div className="ml-4 flex flex-col justify-center items-start space-y-2">
          <Button variant={"secondary"}>Add Profile Picture</Button>
          <div className="text-[#efeff1] text-sm">
            Must be JPEG, PNG, or GIF and cannot exceed 10MB.
          </div>
        </div>
      </div>
    </SimpleCard>
  );
};

const ProfileSettingsForm = () => {
  const currentUser = useAuthStore((store) => store.currentUser);

  if (currentUser === null) throw new Error("User is not logged in");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProfileSettingsSchema>({
    resolver: zodResolver(profileSettingsSchema),
    mode: "onChange",
    defaultValues: {
      username: currentUser.username,
      globalName: currentUser.globalName,
      bio: currentUser.bio || undefined,
    },
  });

  const onSubmit: SubmitHandler<ProfileSettingsSchema> = async (data) => {};

  return (
    <SimpleCard className="text-[#efeff1] max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between p-5">
          <div className="font-semibold">Username</div>
          <div className="w-3/4">
            <Input
              {...register("username")}
              className="w-full"
              type="text"
              disabled
            />
            <ErrorMessage message={errors.username?.message} />
          </div>
        </div>

        <SimpleCard.Divider />

        <div className="flex justify-between p-5">
          <div className="font-semibold">Global Name</div>
          <div className="w-3/4">
            <Input {...register("globalName")} className="w-full" type="text" />
            <ErrorMessage message={errors.globalName?.message} />
          </div>
        </div>

        <SimpleCard.Divider />

        <div className="flex justify-between p-5">
          <div className="font-semibold">Bio</div>
          <Textarea {...register("bio")} className="w-3/4" />
        </div>

        <SimpleCard.Divider />

        <div className="flex justify-end px-5 py-3">
          <Button disabled={isSubmitting || !isValid || true}>Save Changes</Button>
        </div>
      </form>
    </SimpleCard>
  );
};

const ContactForm = () => {
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

const Settings = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-8 bg-[#0e0e10]">
        <PageHeader title="Settings" />

        <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
          <SmallHeader content="Profile Picture" />
          <ProfilePictureForm />

          <SmallHeader content="Profile Settings" />
          <ProfileSettingsForm />

          <SmallHeader content="Contact" />
          <ContactForm />

          <SmallHeader content="Security" />
          <SecurityForm />
        </div>
      </div>
    </div>
  );
};

export default Settings;
