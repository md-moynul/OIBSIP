// components/home/Services.tsx
import { Circle, ClockArrowRotateLeft, MapPin, Box } from "@gravity-ui/icons";

const services = [
  {
    icon: Circle,
    title: "Build your own",
    description:
      "Pick your base, sauce, cheese, and veggies. Every pizza is exactly what you wanted, nothing you didn't.",
  },
  {
    icon: ClockArrowRotateLeft,
    title: "Live order tracking",
    description:
      "Watch your order move from Order Received to In Kitchen to Sent to Delivery, in real time.",
  },
  {
    icon: MapPin,
    title: "Delivered to your pin",
    description:
      "Drop a pin once and we'll always know exactly where to bring it, hot and on time.",
  },
  {
    icon: Box,
    title: "Always in stock",
    description:
      "We track ingredient inventory closely, so what you customize is always what we can actually make.",
  },
];

export default function Services() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
            What we offer
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
            Everything built around your order
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-text">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}