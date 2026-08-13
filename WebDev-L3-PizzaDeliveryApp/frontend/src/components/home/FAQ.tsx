// components/home/FAQ.tsx
"use client";

import { useState } from "react";
import { Plus } from "@gravity-ui/icons";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long does delivery usually take?",
    answer:
      "Most orders arrive within 25-35 minutes of confirmation, depending on your distance from the kitchen and current order volume.",
  },
  {
    question: "Can I customize every ingredient?",
    answer:
      "Yes — the pizza builder lets you choose your base, sauce, cheese, and vegetables individually. Nothing is locked to a fixed combination.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently support card payments through Razorpay. Cash on delivery may be available in select areas — this shows up at checkout if it applies to you.",
  },
  {
    question: "Can I track my order in real time?",
    answer:
      "Yes — once your order is confirmed, you can track it from Order Received through In Kitchen to Sent to Delivery from your dashboard.",
  },
  {
    question: "What if an ingredient I picked is out of stock?",
    answer:
      "Our inventory is checked in real time, so the builder only shows ingredients that are currently available — you won't be able to select something we can't make.",
  },
];

function FAQRow({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-medium text-text">{item.question}</span>
        <Plus
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </button>

      {isOpen && (
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {item.answer}
        </p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
            Common questions
          </h2>
        </div>

        <div className="mt-10">
          {faqs.map((item) => (
            <FAQRow key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}