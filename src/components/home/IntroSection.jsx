"use client";

import styled from "@emotion/styled";
import { useLenis } from "lenis/react";
import ArrowButton from "@/components/ui/ArrowButton";
import MarqueeText from "@/components/ui/MarqueeText";
import { TopFade } from "@/components/ui/SectionOverlay";
import { Buttons, Label, Lead, Row, Second, Section } from "@/components/ui/primitives";

// Nº001 / Intro. Rendered inside HeroSection, whose useScrollEffects call also
// runs the data-effect markers in here (so this component must not call it).

const PARAGRAPHS = [
  "There’s a better way.",
  "PX PUSH is the creative backbone for startups and established companies. Our team of seasoned designers, strategists, and writers integrates with yours, offering unlimited design at predictable costs. Our model is simple and flexible; request design, set priorities, we execute.",
  "We offer top-tier creative talent without the headaches. Our team of senior designers, strategists, and copywriters becomes yours—minus the bloated costs and unpredictability. We’re flexible, reliable, and fully integrated with your team, delivering high-quality design at a fraction of the price.",
  "It’s like having a world-class design crew on demand, starting at $4,000/mo.",
];

// Light grey section: buttons get a 2px rule and bolder text, hover ink is grey.
const Actions = styled(Buttons)`
  a {
    border-bottom-width: 2px;
    font-weight: 600;
    --btn-hover-ink: var(--grey);
  }
  a:first-of-type {
    border-top-width: 2px;
  }
`;

export default function IntroSection() {
  const lenis = useLenis();

  const toPricing = (event) => {
    if (!lenis) return;
    event.preventDefault();
    const mobile = window.matchMedia("(max-width: 600px)").matches;
    lenis.scrollTo("#pricing", { offset: mobile ? -100 : -window.innerHeight / 10 });
  };

  return (
    <Section tone="lightgrey" space="noTop" id="intro">
      <TopFade data-effect="topFade" />
      <MarqueeText text="PX PUSH" lineColor="var(--black)" />
      <Row>
        <Label data-effect="titleRandom" data-small="">
          Nº001 / Intro
        </Label>
        <Second data-effect="textFade">
          <Lead indent>
            Do you need top-tier creative talent without the headaches? Design is crucial for communication, brand
            identity, and user experience, directly affecting your success. However, finding the right design solution
            can be challenging. Full-time designers are costly, freelancers unreliable, and typical agencies might not
            match your pace or pricing needs.
          </Lead>
          {PARAGRAPHS.map((text) => (
            <Lead key={text.slice(0, 16)}>{text}</Lead>
          ))}
          <Actions>
            <ArrowButton href="/start">Get Started</ArrowButton>
            <ArrowButton href="#pricing" onClick={toPricing}>
              View Pricing
            </ArrowButton>
          </Actions>
        </Second>
      </Row>
    </Section>
  );
}
