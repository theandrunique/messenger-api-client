import { SubmitHandler, useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/Error";
import LinkButton from "../components/ui/LinkButton";
import Card from "../components/Card";
import { ServiceError } from "../entities";
import useApi from "../hooks/useApi";
import useNextLocationParam from "../hooks/useNextLocaionParam";
import { useNavigate } from "react-router-dom";
import FullScreenImage from "../components/FullScreenImage";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";

const schema = zod.object({
  login: zod.string().min(1, "Login is required"),
  password: zod.string().min(1, "Password is required"),
});

type SignInSchema = zod.infer<typeof schema>;

function SignInPage() {
  const { api, setTokens } = useApi();
  const nextLocation = useNextLocationParam();
  const navigate = useNavigate();
  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    try {
      if (!captchaToken) {
        throw new ServiceError("Captcha token is required");
      }

      const response = await api.signIn(
        data.login,
        data.password,
        captchaToken
      );
      setTokens(response);
      navigate(nextLocation || "/", { replace: true });
    } catch (error) {
      captchaRef.current?.resetCaptcha();

      if (error instanceof ServiceError) {
        if (error.errors) {
          for (const key of Object.keys(error.errors)) {
            const errorMessage = error.errors[key].join(" ");
            setError(key as keyof SignInSchema, { message: errorMessage });
          }
        } else {
          setError("root", { message: error.title });
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
            <HCaptcha
              ref={captchaRef}
              onVerify={(token) => setCaptchaToken(token)}
              size="normal"
              sitekey="564400fe-45c2-4d96-82c6-8276467aec10"
            />
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
