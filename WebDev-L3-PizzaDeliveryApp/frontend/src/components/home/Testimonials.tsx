// components/home/Testimonials.tsx
interface Testimonial {
  name: string;
  location: string;
  rating: number;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Rakib Hasan",
    location: "Rangpur",
    rating: 5,
    quote:
      "Building my own pizza actually changed how often I order. Tracking is spot on too — I know exactly when to head downstairs.",
  },
  {
    name: "Farzana Akter",
    location: "Rangpur",
    rating: 5,
    quote:
      "Ordered the Chicken Paradise on a whim, now it's a weekly thing. Delivery has never once been late for me.",
  },
  {
    name: "Tanvir Ahmed",
    location: "Rangpur",
    rating: 4,
    quote:
      "Love that I can pick the exact cheese and veggies. Wish there were a couple more sauce options, but the app itself is smooth.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
            Testimonials
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
            What people are saying
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-bg p-6"
            >
              <div className="font-mono text-sm text-accent">
                {"★".repeat(t.rating)}
                <span className="text-border">
                  {"★".repeat(5 - t.rating)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-medium text-text">{t.name}</p>
                <p className="text-xs text-text-muted">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}