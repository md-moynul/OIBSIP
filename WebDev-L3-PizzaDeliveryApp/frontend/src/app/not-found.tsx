/* eslint-disable react/no-unescaped-entities */
// app/not-found.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { House, GraduationCap, MapPin } from "@gravity-ui/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Image src="/Pizzapoint.png" alt="PizzaPoint" width={28} height={28} />
        <p className="font-display text-lg font-bold text-text">PizzaPoint</p>
      </Link>

      <GraduationCap className="mb-4 h-16 w-16 text-primary" />

      <h1 className="font-display text-6xl font-bold text-text">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-text">
        Oops! This slice went missing.
      </h2>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back to something delicious.
      </p>

      <Link href="/" className="mt-8">
        <Button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-white">
          <House className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <p className="mt-10 flex items-center justify-center gap-1 font-mono text-xs text-text-muted">
        <MapPin className="h-3 w-3" />
        Delivering across Rangpur
      </p>
    </div>
  );
}