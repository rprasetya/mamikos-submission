"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import MarqueeText from "@/components/ui/MarqueeText";
import { Half, Lead, Mono, Row, Section } from "@/components/ui/primitives";
import { TopFade } from "@/components/ui/SectionOverlay";
import { SectionError, SectionLoading } from "@/components/ui/SectionStatus";
import useScrollEffects from "@/hooks/useScrollEffects";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import PricingBox from "./PricingBox";
import { mq } from "@/styles/theme";

const BRANDING_IMAGES = Array.from({ length: 15 }, (_, i) => `/img/works/branding${i + 1}.webp`);

const grain = keyframes`
  0% { transform: translate3d(0, 9rem, 0); }
  20% { transform: translate3d(-8rem, 2rem, 0); }
  40% { transform: translate3d(-2rem, 7rem, 0); }
  60% { transform: translate3d(2rem, 6rem, 0); }
  80% { transform: translate3d(-9rem, 1rem, 0); }
  100% { transform: translate3d(-7rem, 0, 0); }
`;

// Fixed 4:5 frame bottom-left that wipes open while the section is on screen.
const Frame = styled.div`
  position: fixed;
  bottom: 3vw;
  left: 3vw;
  z-index: 12;
  width: 20vw;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--radius);
  background-color: #000;
  clip-path: inset(100% 0 0 0 round var(--radius));
  pointer-events: none;
  will-change: clip-path;

  ${mq.mobile} {
    display: none;
  }
`;

const Stack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -10rem;
    width: calc(100% + 20rem);
    height: calc(100% + 20rem);
    background-image: url("/img/noise.png");
    background-position: 50%;
    mix-blend-mode: overlay;
    pointer-events: none;
    animation: ${grain} 0.5s steps(1) infinite;
  }
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--bgcolor);
  visibility: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Copy = styled(Half)`
  & > p:last-of-type {
    margin-top: 2vw;
  }
`;

// Brand Sprint. The package card comes from the same GET /api/sections/packages
// response as the pricing section (fetched once by HomePage).
export default function BrandSprintSection({ packages }) {
  const root = useRef(null);
  const sprint = packages.items.find((p) => p.kind === "sprint");
  useScrollEffects(root, [packages.status]);

  useGSAP(
    () => {
      const frame = root.current.querySelector("[data-frame]");
      const stack = root.current.querySelector("[data-stack]");
      const slides = gsap.utils.toArray("[data-slide]", root.current);
      if (!frame || slides.length === 0) return;

      // Open, hold, close — scrubbed across the section.
      const radius = "var(--radius)";
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 80%", scrub: true },
        })
        .fromTo(stack, { scale: 1.18, opacity: 0.35 }, { scale: 1, opacity: 1, duration: 0.2 }, 0)
        .fromTo(
          frame,
          { clipPath: `inset(100% 0% 0% 0% round ${radius})` },
          { clipPath: `inset(0% 0% 0% 0% round ${radius})`, duration: 0.2 },
          0,
        )
        .to(stack, { scale: 1.18, opacity: 0.35, duration: 0.2 }, 0.8)
        .to(frame, { clipPath: `inset(0% 0% 100% 0% round ${radius})`, duration: 0.2 }, 0.8);

      // Hard-cut to the next image every time enough scroll velocity builds up.
      let index = 0;
      let charge = 0;
      gsap.set(slides[0], { autoAlpha: 1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          charge += Math.abs(self.getVelocity()) * 7e-5;
          while (charge >= 1) {
            charge -= 1;
            gsap.set(slides[index], { autoAlpha: 0 });
            index = gsap.utils.wrap(0, slides.length, index + self.direction);
            gsap.set(slides[index], { autoAlpha: 1 });
          }
        },
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="blue" space="noTop" aria-label="Brand Sprint">
      <TopFade data-effect="topFade" />
      <Frame data-frame aria-hidden="true">
        <Stack data-stack>
          {BRANDING_IMAGES.map((src) => (
            <Slide key={src} data-slide>
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative flipbook frame */}
              <img src={src} alt="" loading="lazy" decoding="async" />
            </Slide>
          ))}
        </Stack>
      </Frame>

      <MarqueeText text="Brand Sprint" />
      <Row>
        <Half />
        <Copy>
          <div data-effect="textFade">
            <Lead indent>
              Our branding sprint gives your business a complete creative foundation in just 4 weeks. We shape the
              strategy, identity, visual language, and core brand assets into one cohesive system. Everything you need
              to launch with confidence.
            </Lead>
          </div>

          {packages.status === "loading" && <SectionLoading label="brand sprint" minHeight="20vw" />}
          {packages.status === "error" && (
            <SectionError label="brand sprint" error={packages.error} onRetry={packages.retry} minHeight="20vw" />
          )}
          {sprint && <PricingBox pkg={sprint} columns />}

          <Mono as="p" data-effect="titleRandom" data-small="">
            The sprint moves from strategy into identity, then into the practical assets your team needs to launch. We
            define the visual system, explore the core brand language, and package everything into clear guidelines for
            real-world use. By the end, you have a complete brand foundation ready for web, pitch decks, social, and
            future campaigns.
          </Mono>
        </Copy>
      </Row>
    </Section>
  );
}
