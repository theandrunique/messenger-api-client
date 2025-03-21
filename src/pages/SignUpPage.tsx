import { SubmitHandler, useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import Button from "../components/ui/Button";
import LinkButton from "../components/ui/LinkButton";
import { ApiError } from "../schemas/common";
import SimpleCard from "../components/SimpleCard";
import { singUp } from "../api/api";

const schema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  globalName: zod.string(),
  password: zod.string(),
});

type SignUpSchema = zod.infer<typeof schema>;

export default function SignUpPage() {
  const navigate = useNavigate();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    try {
      await singUp(
        data.username,
        data.email,
        data.globalName,
        data.password
      );
      navigate("/sign-in");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          for (const key of Object.keys(error.errors)) {
            const errorMessage = error.errors[key].join("\n");
            setError(key as keyof SignUpSchema, { message: errorMessage });
          }
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root", { message: "Error: something went wrong" });
      }
    }
  };

  return (
    <div className="w-full h-screen bg-[#0e0e10]">
      <div className="h-full flex justify-center items-center p-4">
        <SimpleCard className="w-full max-w-md p-16">
          <div className="text-[#efeff1] text-3xl font-bold text-center mb-5">
            Sign Up
          </div>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              {...register("username")}
              type="text"
              placeholder="username"
            />
            <ErrorMessage message={errors.username?.message} />
            <Input {...register("email")} type="text" placeholder="email" />
            <ErrorMessage message={errors.email?.message} />
            <Input
              {...register("globalName")}
              type="text"
              placeholder="global name"
            />
            <ErrorMessage message={errors.globalName?.message} />
            <Input
              {...register("password")}
              type="password"
              placeholder="password"
            />
            <ErrorMessage message={errors.password?.message} />
            <Button disabled={isSubmitting}>Sign Up</Button>
            <ErrorMessage message={errors.root?.message} />
          </form>
          <div className="text-center text-[#efeff1]">
            Already have an account?
            <LinkButton to={"/sign-in"}>sign in</LinkButton>
          </div>
        </SimpleCard>
      </div>
    </div>
  );
}
