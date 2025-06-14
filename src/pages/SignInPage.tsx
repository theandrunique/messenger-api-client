import { SubmitHandler, useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import LinkButton from "../components/ui/LinkButton";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../schemas/common";
import SimpleCard from "../components/SimpleCard";
import FullScreenLoading from "../components/FullScreenLoading";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import Dialog from "../components/Dialog";

const schema = zod.object({
  login: zod.string().min(1, "Login is required"),
  password: zod.string().min(1, "Password is required"),
  totp: zod.string().optional(),
});

type SignInSchema = zod.infer<typeof schema>;

function SignInPage() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, handleSignIn } = useAuth();
  const [isTotpMfaOpen, setIsTotpMfaOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [globalName, setGlobalName] = useState("");

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm<SignInSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    try {
      await handleSignIn(data.login, data.password, data.totp);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "AUTH_TOTP_REQUIRED") {
          setIsTotpMfaOpen(true);
          setUsername(error.metadata?.username);
          setGlobalName(error.metadata?.globalName);
        } else if (error.code === "AUTH_INVALID_TOTP") {
          setError("totp", { message: "Invalid TOTP" });
        } else if (error.errors) {
          for (const key of Object.keys(error.errors)) {
            const errorMessage = error.errors[key].join("\n");
            setError(key as keyof SignInSchema, { message: errorMessage });
          }
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root", { message: "Error: something went wrong" });
        console.error("Error while handling sign in", error);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/", { replace: true });
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <FullScreenLoading message="In case you are already signed in" />;
  }

  return (
    <>
      <div className="w-full h-screen bg-[#0e0e10]">
        <div className="h-full flex justify-center items-center p-4">
          <SimpleCard className="w-full max-w-md p-16">
            <div className="text-[#efeff1] text-3xl font-bold text-center mb-5">
              Sign In
            </div>
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
            <div className="text-center text-[#efeff1]">
              Don't have an account?
              <LinkButton to={"/sign-up"}>sign up</LinkButton>
            </div>
          </SimpleCard>
        </div>
      </div>

      <Dialog
        open={isTotpMfaOpen}
        onOpenChange={(open) => {
          setIsTotpMfaOpen(open);
          if (!open) {
            resetField("totp");
          }
        }}
      >
        <Dialog.Content>
          <div className="w-[430px] flex flex-col items-center text-[#efeff1]">
            <h2 className="font-bold text-2xl text-center mb-4">
              Welcome back {username} ({globalName})!
            </h2>
          </div>
          <div className="text-[#efeff1] flex flex-col items-center gap-2">
            <p>Please enter the code from your authenticator app</p>
            <div className="flex gap-2">
              <Input {...register("totp")} type="text" placeholder="code" />
              <Button
                disabled={isSubmitting}
                variant={"primary"}
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
            <ErrorMessage
              message={errors.totp?.message}
              className="text-right"
            />
            <ErrorMessage message={errors.root?.message} />
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

export default SignInPage;
