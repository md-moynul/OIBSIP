// app/contact/page.tsx
"use client";

import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { Envelope, Handset, MapPin, Clock } from "@gravity-ui/icons";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    console.log({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });
    // TODO: POST to /contact (or send via an email service)
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
          Contact us
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-text md:text-4xl">
          Questions? We&apos;re listening.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-text-muted">
          Order issues, feedback, or partnership questions — send us a
          message and we&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.3fr]">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
              <MapPin className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-medium text-text">Address</p>
              <p className="mt-1 text-sm text-text-muted">
                Rangpur, Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
              <Handset className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-medium text-text">Handset</p>
              <p className="mt-1 text-sm text-text-muted">
                +880 1746-568176
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
              <Envelope className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-medium text-text">Email</p>
              <p className="mt-1 text-sm text-text-muted">
                hello@pizzapoint.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
              <Clock className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-medium text-text">Hours</p>
              <p className="mt-1 text-sm text-text-muted">
                Every day · 11:00 AM – 11:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField name="name" type="text" isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-text">Name</Label>
              <Input
                placeholder="Your name"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <FieldError className="text-xs text-primary" />
            </TextField>

            <TextField name="email" type="email" isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-text">Email</Label>
              <Input
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <FieldError className="text-xs text-primary" />
            </TextField>
          </div>

          <TextField name="subject" type="text" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-text">Subject</Label>
            <Input
              placeholder="What's this about?"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
            <FieldError className="text-xs text-primary" />
          </TextField>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-text">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell us what's going on..."
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full rounded-xl bg-primary py-2.5 font-semibold text-white sm:w-fit sm:px-8"
          >
            Send message
          </Button>
        </Form>
      </div>
    </div>
  );
}