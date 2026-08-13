"use client";

import { Button, Chip } from "@heroui/react";
import { MapPin, Star, Clock, ArrowRight } from "@gravity-ui/icons";
import Image from "next/image";

const buildSteps : string[] = ["Base", "Sauce", "Cheese", "Veggies"];

export default function Hero() {
    return (
        <section className="relative overflow-hidden px-6 py-20 md:py-28">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
                {/* Left column */}
                <div>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs tracking-wide text-text">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        LIVE TRACKING · RANGPUR
                    </div>

                    <h1 className="font-[Space_Grotesk] text-5xl font-bold leading-[1.05] text-text md:text-6xl">
                        Drop a pin.
                        <br />
                        Get your{" "}
                        <span className="relative inline-block text-primary">
                            pizza.
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 12"
                                fill="none"
                            >
                                <path
                                    d="M2 8C40 2 160 2 198 8"
                                    stroke="var(--color-accent)"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h1>

                    <p className="mt-6 max-w-md text-lg text-text-muted">
                        Pick your base, sauce, cheese, and veggies — build the pizza
                        that&apos;s actually yours. We&apos;ll drop it right at your pin, hot.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Button
                            size="lg"
                            className="bg-primary px-8 font-semibold text-white"
                        >
                            Start building <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"

                            className="border-text px-8 font-semibold text-text bg-background/55"
                        >
                            View menu
                        </Button>
                    </div>

                    {/* Build steps breadcrumb - genuinely sequential */}
                    <div className="mt-10 flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted">
                        {buildSteps.map((step, i) => (
                            <div key={step} className="flex items-center gap-2">
                                <Chip size="sm"  className="bg-surface text-text">
                                    0{i + 1} · {step}
                                </Chip>
                                {i < buildSteps.length - 1 && <span>→</span>}
                            </div>
                        ))}
                    </div>

                    {/* Stats row */}
                    <div className="mt-10 flex divide-x divide-border">
                        <div className="pr-6">
                            <p className="font-mono text-2xl font-bold text-text">28 min</p>
                            <p className="text-xs text-text-muted">avg delivery</p>
                        </div>
                        <div className="px-6">
                            <p className="flex items-center gap-1 font-mono text-2xl font-bold text-text">
                                4.8 <Star className="h-4 w-4 text-accent" />
                            </p>
                            <p className="text-xs text-text-muted">user rating</p>
                        </div>
                        <div className="pl-6">
                            <p className="font-mono text-2xl font-bold text-text">12k+</p>
                            <p className="text-xs text-text-muted">delivered</p>
                        </div>
                    </div>
                </div>

                {/* Right column - pin + radar signature */}
                <div className="relative flex items-center justify-center">
                    <div className="relative flex h-80 w-80 items-center justify-center">
                        <span className="absolute h-full w-full animate-[ping_2.5s_ease-out_infinite] rounded-full bg-primary/10" />
                        <span className="absolute h-56 w-56 animate-[ping_2.5s_ease-out_infinite_0.6s] rounded-full bg-accent/15" />
                        <div className="relative z-10 h-40 w-40 overflow-hidden rounded-full border-4 border-surface bg-surface shadow-xl">
                            <Image
                                src="/Pizzapoint.png" width={400} height={400} alt="PizzaPoint logo" className="h-full w-full object-contain p-4" />
                        </div>
                    </div>

                    {/* ETA ticket card */}
                    <div className="absolute -bottom-4 right-2 rounded-2xl border border-border bg-surface px-5 py-4 shadow-lg md:right-8">
                        <p className="flex items-center gap-2 font-mono text-xs text-text-muted">
                            <Clock className="h-3.5 w-3.5" />
                            ORDER #0482
                        </p>
                        <p className="mt-1 font-mono text-lg font-bold text-text">
                            ETA 14:32
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}