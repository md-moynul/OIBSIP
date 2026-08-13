// app/signin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Checkbox,
  Button,
} from "@heroui/react";
import { Envelope, LockOpen, Eye, EyeSlash, MapPin, Star, Clock } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email: string = formData.get("email") as string;
    const password: string = formData.get("password") as string;
    const remember: boolean = formData.get("remember") as string ? true : false;
    console.log(email, password, remember);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: remember,
    },)
    if(data?.token){
      toast.success("Login successful");
      router.push("/");
    }
    if(error){
      toast.error(`Login failed 
        because ${error.message}
        `);
    }
  };
  const handleGoogleSignup = async () => {
    toast.info("you will back social login");
    const data = await authClient.signIn.social({
    provider: "google",
  });
}

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: brand panel with pizza photo */}
      <div className="relative hidden flex-col justify-center gap-4 overflow-hidden px-10 py-12 md:flex">
        <Image
          src="/pizza-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-text via-text/70 to-text/30" />
        <div className="flex items-center justify-center">
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <Image src="/Pizzapoint.png" alt="PizzaPoint" width={28} height={28} />
            <p className="font-display text-lg font-bold text-bg">PizzaPoint</p>
          </Link>
        </div>

        <div className="relative z-10">
          <p className="max-w-xs mx-auto text-lg leading-snug text-bg ">
            Sign in to pick up right where you left off  track your last
            order or start building a new one.
          </p>

          <div className="mt-6 flex justify-center gap-6 border-t border-bg/20 pt-6 text-center it">
            <div>
              <p className="flex items-center gap-1 font-mono text-lg font-bold text-bg">
                <Clock className="h-4 w-4" />
                28 min
              </p>
              <p className="text-xs text-bg/60">avg delivery</p>
            </div>
            <div>
              <p className="flex items-center gap-1 font-mono text-lg font-bold text-bg">
                <Star className="h-4 w-4 text-accent" />
                4.8
              </p>
              <p className="text-xs text-bg/60">user rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 md:hidden">
            <Image src="/Pizzapoint.png" alt="PizzaPoint" width={24} height={24} />
            <p className="font-display text-lg font-bold text-text">
              PizzaPoint
            </p>
          </Link>

          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-text">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Sign in to continue to your account.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <TextField name="email" type="email" isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-text">Email</Label>
              <div className="relative">
                <Envelope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <FieldError className="text-xs text-primary" />
            </TextField>

            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              isRequired
              minLength={6}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-text">Password</Label>
                <Link href="/forgot-password" className="text-xs text-text-muted hover:text-primary">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? (
                    <EyeSlash className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError className="text-xs text-primary" />
            </TextField>

            <Checkbox name="remember">
              <Checkbox.Content>
                <Checkbox.Control className="border-2 border-accent data-selected:border-accent data-selected:bg-accent">
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <span className="text-sm text-text-muted">Remember me</span>
              </Checkbox.Content>
            </Checkbox>

            <Button
              type="submit"
              className="mt-1 w-full rounded-xl bg-primary py-2.5 font-semibold text-white"
            >
              Sign in
            </Button>
          </Form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-xs text-text-muted">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            onPress={handleGoogleSignup}
            className="mt-6 w-full rounded-xl border-border py-2.5 text-sm font-medium text-text bg-backdrop/10"
          >
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-text-muted">
            New to PizzaPoint?{" "}
            <Link href="/auth/signup" className="font-medium text-primary">
              Create an account
            </Link>
          </p>

          <p className="mt-6 flex items-center justify-center gap-1 font-mono text-xs text-text-muted">
            <MapPin className="h-3 w-3" />
            Delivering across Rangpur
          </p>
        </div>
      </div>
    </div>
  );
}