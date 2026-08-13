"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  Button,
  Form,
  Input,
  Label,
  TextField,
  FieldError,
} from "@heroui/react";
import { Pencil, Person, Camera } from "@gravity-ui/icons"; 
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface UserProfile {
  name?: string | null;
  image?: string | null;
  number?: string | null; 
}

interface EditProfileDialogProps {
  user: UserProfile | null | undefined;
}

const fieldBg = "bg-[#FFF9F2] dark:bg-background";
const fieldClass = `rounded-xl border-[#EAE0D3] dark:border-[#3A332A] ${fieldBg} text-[#2B2420] dark:text-[#F4EDE4] placeholder:text-[#9C9388] focus-visible:border-[#E85D3D] focus-visible:ring-[#E85D3D]/20`;
const labelClass = "text-sm font-medium text-[#2B2420] dark:text-[#F4EDE4]";

export default function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [name, setName] = useState<string>(user?.name ?? "");
  const [phone, setPhone] = useState<string>(user?.number ?? ""); 
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const uploadToImgbb = async (file: File): Promise<string | null> => {
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
    } catch (err) {
      console.error("ImgBB Upload failed", err);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, close: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let finalImageUrl = avatarPreview || "";

      if (avatarFile) {
        const uploadedUrl = await uploadToImgbb(avatarFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          toast.error("Image upload failed. Keeping old photo.");
        }
      }

      // FIX: Change 'number: phone' to 'phoneNumber: phone'
      const { data, error: updateError } = await authClient.updateUser({
        image: finalImageUrl,
        name,
        number: phone, 
      });

      if (data) {
        toast.success("Profile updated successfully!");
        window.location.reload();
        close();
      }
      
      if (updateError) {
        toast.error(updateError.message);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <Button
        className="flex items-center gap-1.5 rounded-xl border bg-[#E85D3D] text-white"
      >
        <Pencil width={15} height={15} />
        Edit Profile
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog
            className="w-full max-w-md border border-[#EAE0D3] bg-white p-6 dark:border-[#3A332A] dark:bg-[#252019]"
          >
            {({ close }) => (
              <>
                <AlertDialog.Header className="flex items-center gap-3 pb-4">
                  <AlertDialog.Icon className="bg-[#E85D3D]/10 text-[#E85D3D]">
                    <Person width={20} height={20} />
                  </AlertDialog.Icon>
                  <AlertDialog.Heading className="text-xl font-semibold text-[#2B2420] dark:text-[#F4EDE4]">
                    Edit Profile
                  </AlertDialog.Heading>
                </AlertDialog.Header>

                <AlertDialog.Body>
                  <Form
                    className="mt-2 flex flex-col gap-5"
                    onSubmit={(e) => handleSubmit(e, close)}
                  >
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3">
                      <label
                        htmlFor="dialog-avatar"
                        className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#EAE0D3] bg-[#FFF9F2] transition-colors hover:border-[#E85D3D] dark:border-[#3A332A] dark:bg-background"
                      >
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Profile preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Camera className="h-6 w-6 text-[#9C9388]" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                      </label>
                      <input
                        id="dialog-avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <p className="text-xs text-[#6B6155] dark:text-[#B8AFA2]">
                        {isUploading
                          ? "Uploading image..."
                          : "Click circle to change photo"}
                      </p>
                    </div>

                    {/* Name Input */}
                    <TextField
                      name="name"
                      isRequired
                      value={name}
                      onChange={setName}
                      className="flex flex-col gap-1.5"
                    >
                      <Label className={labelClass}>Name</Label>
                      <Input
                        placeholder="Your name"
                        className={fieldClass}
                      />
                      <FieldError className="text-xs text-[#D64545]" />
                    </TextField>

                    {/* Phone Number Input */}
                    <TextField
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      className="flex flex-col gap-1.5"
                    >
                      <Label className={labelClass}>Phone Number</Label>
                      <Input
                        placeholder="e.g., +1234567890"
                        className={fieldClass}
                      />
                      <FieldError className="text-xs text-[#D64545]" />
                    </TextField>

                    {error && <p className="text-sm text-[#D64545]">{error}</p>}

                    {/* Dialog Actions */}
                    <AlertDialog.Footer className="mt-2 flex justify-end gap-3">
                      <Button
                        slot="close"
                        isDisabled={isSubmitting || isUploading}
                        className="rounded-xl border-2 bg-background text-foreground"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isDisabled={isSubmitting || isUploading}
                        className="rounded-xl bg-[#E85D3D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D14E30] disabled:opacity-60"
                      >
                        {isSubmitting
                          ? "Saving…"
                          : isUploading
                          ? "Uploading Image…"
                          : "Save Changes"}
                      </Button>
                    </AlertDialog.Footer>
                  </Form>
                </AlertDialog.Body>
              </>
            )}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}