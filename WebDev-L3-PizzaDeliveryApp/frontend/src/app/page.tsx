import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Services from "@/components/home/Services";
import Highlights from "@/components/home/Highlights";
import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Newsletter from "@/components/home/Newsletter";
import CTA from "@/components/home/CTA";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
};

interface HomePageProps {
  searchParams: Promise<{ page?: string; limit?: string }> | { page?: string; limit?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;

  return (
    <>
      <Hero />
      <Categories />
      <Services />
      <Highlights searchParams={resolvedParams} />
      <Statistics />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CTA />
    </>
  );
}