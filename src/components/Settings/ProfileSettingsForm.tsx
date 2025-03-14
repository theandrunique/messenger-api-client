import { SubmitHandler, useForm } from "react-hook-form";
import SimpleCard from "../SimpleCard";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useCurrentUser from "../../api/hooks/useCurrentUser";

const profileSettingsSchema = zod.object({
  username: zod.string(),
  globalName: zod.string().min(1),
  bio: zod.string(),
});

type ProfileSettingsSchema = zod.infer<typeof profileSettingsSchema>;

const ProfileSettingsForm = () => {
  const { currentUser } = useCurrentUser();

  if (!currentUser) return null;

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

  const onSubmit: SubmitHandler<ProfileSettingsSchema> = async (data) => {
    console.log(data);
  };

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
          <Button disabled={isSubmitting || !isValid || true}>
            Save Changes
          </Button>
        </div>
      </form>
    </SimpleCard>
  );
};

export default ProfileSettingsForm;
