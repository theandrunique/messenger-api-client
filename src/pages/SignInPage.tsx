import { SubmitHandler, useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import LinkButton from "../components/ui/LinkButton";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import FullScreenImage from "../components/FullScreenImage";
import useAuthStore from "../store/useAuthStore";
import { ApiError } from "../schemas/common.schema";

const schema = zod.object({
  login: zod.string().min(1, "Login is required"),
  password: zod.string().min(1, "Password is required"),
});

type SignInSchema = zod.infer<typeof schema>;

function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    try {
      await signIn(data.login, data.password);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          for (const key of Object.keys(error.errors)) {
            const errorMessage = error.errors[key].join("\n");
            setError(key as keyof SignInSchema, { message: errorMessage });
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
    <FullScreenImage>
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-[30rem]">
          <Card.Title>Sign In</Card.Title>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input {...register("login")} type="text" placeholder="login" />
            <ErrorMessage message={errors.login?.message} />
            <Input
              {...register("password")}
              type="password"
              placeholder="password"
            />
            <ErrorMessage message={errors.password?.message} />
            <Button disabled={isSubmitting} variant={"primary"}>
              Sign In
            </Button>
            <ErrorMessage message={errors.root?.message} />
          </form>
          <div className="text-center text-slate-300">
            Don't have an account?
            <LinkButton to={"/sign-up"}>sign up</LinkButton>
          </div>
        </Card>
      </div>
    </FullScreenImage>
  );
}

export default SignInPage;
