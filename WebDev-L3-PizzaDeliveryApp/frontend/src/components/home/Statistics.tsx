// components/home/Statistics.tsx
const stats = [
  { value: "10,000+", label: "Happy customers" },
  { value: "12,000+", label: "Orders delivered" },
  { value: "28 min", label: "Average delivery time" },
  { value: "4.8 / 5", label: "Average rating" },
];

export default function Statistics() {
  return (
    <section className="bg-text px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-3xl font-bold text-bg md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-bg/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}