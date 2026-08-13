// components/home/Newsletter.tsx
"use client";

import { useState } from "react";
import { Form, TextField, Input, FieldError, Button } from "@heroui/react";
import { Envelope } from "@gravity-ui/icons";

export default function Newsletter() {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email");

        console.log("Subscribe:", email);
        // TODO: POST to /newsletter/subscribe
        setIsSubscribed(true);
        form.reset();
    };

    return (
        <section className="bg-surface px-6 py-16 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
                <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                    Newsletter
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
                    Get new flavors before anyone else
                </h2>
                <p className="mt-3 text-text-muted">
                    Occasional emails about new pizzas, limited-time offers, and menu
                    updates. No spam.
                </p>

                {isSubscribed ? (
                    <p className="mt-6 font-medium text-primary">
                        You&apos;re subscribed — thanks for joining!
                    </p>
                ) : (
                    <Form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
                    >
                        <TextField
                            name="email"
                            type="email"
                            isRequired
                            className="flex flex-1 flex-col gap-1"
                        >
                            <div className="relative">
                                <Envelope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                                <Input
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-border bg-bg py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                                />
                            </div>
                            <FieldError className="text-left text-xs text-primary" />
                        </TextField>

                        <Button
                            type="submit"
                            className="rounded-xl bg-primary px-6 font-semibold text-white"
                        >
                            Subscribe
                        </Button>
                    </Form>
                )}
            </div>
        </section>
    );
}