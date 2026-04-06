import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { setup } from "../api/auth";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export function SetupPage() {
  const navigate = useNavigate();
  const authLogin = useAuthStore((s) => s.login);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const result = await setup(data.username, data.password);
      authLogin(result.token, result.username);
      navigate("/");
    } catch {
      setError("Setup failed. The account may already exist.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Welcome</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create your account to get started</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="Choose a username"
              autoComplete="username"
              error={errors.username?.message}
              {...register("username", {
                required: "Username is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message ?? (error || undefined)}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
            <Button type="submit" className="mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
