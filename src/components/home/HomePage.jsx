"use client";

import dynamic from "next/dynamic";
import { preload } from "react-dom";
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
  // The hero's 3D assets are only requested once the three.js chunk has loaded
  // (~4s on a first visit at 20Mbps). Preloading lets them download in parallel
  // with the JS. crossOrigin matches three.js's loaders so the cache is reused.
  preload("/img/home/cloud10.png", { as: "image", crossOrigin: "anonymous" });
  preload("/img/pxpush.svg", { as: "fetch", crossOrigin: "anonymous" });

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
