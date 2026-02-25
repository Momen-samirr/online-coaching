import AboutSection from "@/components/landing/AboutSection";
import ChooseYourPlanSection from "@/components/landing/ChooseYourPlanSection";
import ContactSection from "@/components/landing/ContactSection";
import CTA from "@/components/landing/CTA";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import SessionsSection from "@/components/landing/SessionsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import TransformationSection from "@/components/landing/TransformationSection";
import { getTransformations } from "@/lib/actions/transformations";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const transformations = await getTransformations(true);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <AboutSection />
      <ChooseYourPlanSection />
      <SessionsSection />
      <HowItWorks />
      <TransformationSection transformations={transformations} />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <CTA />
      <Footer />
    </div>
  );
}
