// app/signup/page.tsx
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
import {
  Envelope,
  LockOpen,
  Eye,
  EyeSlash,
  Person,
  Handset,
  Camera,
  MapPin,
  Star,
  Clock,
} from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const uploadToImgbb = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.success ? data.data.url : null;
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const form = e.currentTarget;

    let imageUrl = "";
    if (avatarFile) {
      imageUrl = (await uploadToImgbb(avatarFile)) || "";
    }
    const formData = new FormData(form);
    const image: string = imageUrl;
    const name: string = formData.get("name") as string;;
    const email: string = formData.get("email") as string;;
    const phone: string = formData.get("phone") as string;;
    const password: string = formData.get("password") as string;;
    console.log(name, email, phone, password, image);

    const { data, error } = await authClient.signUp.email({
      email, // user email address
      password, // user password -> min 8 characters by default
      name, // user display name
      image, // User image URL (optional)
      number: phone,
      role: "user",
      callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)

    });
    console.log(data , error);
    if(data?.token){
    toast.success("Account created successfully");
      router.push("/");
    }
    if(error){
      toast.error(`Account creation failed 
        because ${error.message}
        `);
    }
  };

  const handleGoogleSignup = async () => {
    toast.info("you will back social login");
    const data = await authClient.signIn.social({
    provider: "google",
  });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: form */}
      <div className="order-2 flex items-center justify-center px-6 py-16 md:order-1">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 md:hidden">
            <Image src="/Pizzapoint.png" alt="PizzaPoint" width={24} height={24} />
            <p className="font-display text-lg font-bold text-text">PizzaPoint</p>
          </Link>

          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-text">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Sign up to start building your first pizza.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {/* Avatar upload — uploads to imgbb on select */}
            <div className="flex flex-col items-center gap-3">
              <label
                htmlFor="avatar"
                className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-surface transition-colors hover:border-primary"
              >
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-text-muted" />
                )}
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-text-muted">
                {isUploading ? "Uploading..." : "Add a profile photo (optional)"}
              </p>
            </div>

            <TextField name="name" type="text" isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-text">Full name</Label>
              <div className="relative">
                <Person className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <FieldError className="text-xs text-primary" />
            </TextField>

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

            <TextField name="phone" type="tel" isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-text">Phone number</Label>
              <div className="relative">
                <Handset className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="+880 1XXX-XXXXXX"
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
              <Label className="text-sm font-medium text-text">Password</Label>
              <div className="relative">
                <LockOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
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

            <Checkbox name="terms" isRequired>
              <Checkbox.Content>
                <Checkbox.Control className="border-2 border-accent data-selected:bg-accent data-selected:border-accent">
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <span className="text-sm text-text-muted">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary">
                    Privacy policy
                  </Link>
                </span>
              </Checkbox.Content>
              <FieldError className="text-xs text-primary" />
            </Checkbox>
            <Button
              type="submit"
              isDisabled={isUploading}
              className="w-full rounded-xl bg-primary py-2.5 font-semibold text-white"
            >
              {isUploading ? "Uploading..." : "Create account"}
            </Button>
          </Form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-xs text-text-muted">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            onPress={handleGoogleSignup}
            className="mt-6 w-full rounded-xl border-border bg-backdrop/10 py-2.5 text-sm font-medium text-text"
          >
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-primary">
              Sign in
            </Link>
          </p>

          <p className="mt-6 flex items-center justify-center gap-1 font-mono text-xs text-text-muted">
            <MapPin className="h-3 w-3" />
            Delivering across Rangpur
          </p>
        </div>
      </div>

      {/* Right: brand panel with pizza photo */}
      <div className="relative order-1 hidden flex-col justify-center gap-4 overflow-hidden px-10 py-12 md:order-2 md:flex">
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
            <p className="font-display text-lg font-bold text-bg drop-shadow-md">
              PizzaPoint
            </p>
          </Link>
        </div>

        <div className="relative z-10">
          <p className="mx-auto max-w-xs text-center text-lg leading-snug text-bg drop-shadow-md">
            Drop your pin once. Every order after this one is one tap away.
          </p>

          <div className="mt-6 flex justify-center gap-6 border-t border-bg/20 pt-6 text-center">
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
    </div>
  );
}