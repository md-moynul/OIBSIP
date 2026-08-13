// components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Envelope, Handset, MapPin, ArrowUpRightFromSquare } from "@gravity-ui/icons";

interface footerLink {
    label: string;
    href: string;
}
interface footerArray {
    heading: string;
    links: footerLink[];
}
interface social {
    label: string;
    href: string;
}
const footerLinks: footerArray[] = [
    {
        heading: "Order",
        links: [
            { label: "Menu", href: "/menu" },
            { label: "Build your pizza", href: "/build" },
            { label: "Track order", href: "/track" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "FAQ", href: "/faq" },
            { label: "Privacy policy", href: "/privacy" },
            { label: "Terms of service", href: "/terms" },
        ],
    },
];

const socials:social[] = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TikTok", href: "https://tiktok.com" },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-bg px-6 pt-16">
            <div className="mx-auto max-w-6xl">
                {/* Top: brand + link columns */}
                <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/Pizzapoint.png" alt="PizzaPoint" width={28} height={28} />
                            <p className="font-display text-lg font-bold text-text">
                                PizzaPoint
                            </p>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-text-muted">
                            Build your own pizza, drop a pin, get it hot at your door.
                        </p>

                        <ul className="mt-6 space-y-2 font-mono text-sm text-text-muted">
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0" />
                                Rangpur, Bangladesh
                            </li>
                            <li className="flex items-center gap-2">
                                <Handset className="h-4 w-4 shrink-0" />
                                +880 1XXX-XXXXXX
                            </li>
                            <li className="flex items-center gap-2">
                                <Envelope className="h-4 w-4 shrink-0" />
                                hello@pizzapoint.com
                            </li>
                        </ul>
                    </div>

                    {footerLinks.map((col) => (
                        <div key={col.heading}>
                            <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                                {col.heading}
                            </p>
                            <ul className="mt-4 space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-text hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Receipt tear-line */}
                <div
                    className="h-px w-full"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(90deg, var(--color-border) 0 8px, transparent 8px 16px)",
                    }}
                />

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
                    <p className="font-mono text-xs text-text-muted">
                        © {new Date().getFullYear()} PizzaPoint · order #0000 never
                        expires
                    </p>

                    <ul className="flex items-center gap-5">
                        {socials.map((social) => (
                            <li key={social.label}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-text-muted hover:text-primary"
                                >
                                    {social.label}
                                    <ArrowUpRightFromSquare className="h-3 w-3" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}