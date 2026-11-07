"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/layout/Footer";
import useSection from "@/hooks/useSection";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import WorksSection from "./WorksSection";
import BenefitsSection from "./BenefitsSection";
import PricingSection from "./PricingSection";
import BrandSprintSection from "./BrandSprintSection";

const HeroLogo3D = dynamic(() => import("./HeroLogo3D"), { ssr: false });

// Home page. The three API-backed lists are fetched here, once each; packages
// feed both the pricing cards and the brand sprint card.
export default function HomePage() {
  const works = useSection("works");
  const benefits = useSection("benefits");
  const packages = useSection("packages");

  return (
    <>
      <HeroLogo3D />
      <main>
        <HeroSection>
          <IntroSection />
        </HeroSection>
        <WorksSection works={works} />
        <BenefitsSection benefits={benefits} />
        <PricingSection packages={packages} />
        <BrandSprintSection packages={packages} />
      </main>
      <Footer />
    </>
  );
}
