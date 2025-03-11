import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  totp: z.string().min(6, "Code must be 6 characters long").max(6),
});

type TwoFactorSchema = z.infer<typeof schema>;

interface TwoFactorAuthModalProps {
  onClose?: () => void;
  onSubmit?: (totp: string) => Promise<void>;
}

const TwoFactorAuthModal = ({}: TwoFactorAuthModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TwoFactorSchema>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: TwoFactorSchema) => {
    console.log("submitting", data);
  };

  return (
    <div className="fixed inset-0 z-90 bg-[#0e0e10] bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1f1f23] rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between px-3 pt-3">
          <Button variant={"icon"}>
            <ArrowLeft />
          </Button>
        </div>

        <div className="flex flex-col px-8 pt-4 pb-8 text-[#efeff1]">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Enter 2FA Code
          </h2>

          <div className="font-semibold mb-2">Welcome back, theandru_!</div>

          <form
            className="flex flex-col space-y-3"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div className="flex flex-col space-y-3">
              <Input {...register("totp")} type="text" />
              <ErrorMessage message={errors.totp?.message} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
