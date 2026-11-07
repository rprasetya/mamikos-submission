"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { colors, fonts, mq } from "@/styles/theme";
import FloppyPreview from "./FloppyPreview";

// Temporary page that proves the stack works (fonts, Emotion, GSAP + SplitText,
// Lenis + ScrollTrigger, three.js). It gets replaced by the real home page.

const Section = styled.section`
  min-height: 100vh;
  padding: 8vw 3vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vw;
  background: ${(p) => p.bg || "transparent"};
  color: ${(p) => p.fg || "inherit"};

  ${mq.mobile} {
    padding: 80px 20px;
    gap: 20px;
  }
`;

const Lead = styled.h1`
  font-size: 12vw;
  letter-spacing: -0.1vw;
  line-height: 0.9;

  ${mq.mobile} {
    font-size: 20vw;
  }
`;

const Mono = styled.p`
  font-family: ${fonts.mono};
  text-transform: uppercase;
  font-size: 70%;
`;

const Swatches = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
`;

const Swatch = styled.li`
  width: 9vw;
  min-width: 80px;
  aspect-ratio: 1;
  padding: 0.6vw;
  display: flex;
  align-items: flex-end;
  background: ${(p) => p.tone};
  color: ${(p) => (p.dark ? colors.grey : colors.black)};
  font-family: ${fonts.geistMono};
  font-size: 12px;
`;

const Stage = styled.div`
  height: 60vh;
  width: 100%;
`;

const SWATCHES = [
  ["bg", colors.bg, true],
  ["grey", colors.grey],
  ["black", colors.black, true],
  ["blue", colors.blue, true],
  ["red", colors.red],
  ["cream", colors.cream],
  ["lightgrey", colors.lightgrey],
  ["lightblue", colors.lightblue],
  ["pink", colors.pink],
  ["green", colors.green],
];

export default function SetupCheck() {
  const root = useRef(null);

  useGSAP(
    () => {
      const split = SplitText.create(".js-lead", { type: "lines", mask: "lines" });
      gsap.from(split.lines, { yPercent: 100, duration: 1, ease: "expo.out", stagger: 0.08 });

      gsap.from(".js-swatch", {
        y: 60,
        opacity: 0,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ".js-swatches", start: "top 80%" },
      });

      ScrollTrigger.refresh();
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <main ref={root}>
      <Section>
        <Mono>● Setup check: fonts / emotion / gsap</Mono>
        <Lead className="js-lead">On–Demand Design Subscription</Lead>
        <p>Graphik body copy at 1.7vw. Scroll down to test Lenis and ScrollTrigger.</p>
      </Section>

      <Section bg={colors.blue} fg={colors.grey}>
        <h3>Palette</h3>
        <Swatches className="js-swatches">
          {SWATCHES.map(([name, value, dark]) => (
            <Swatch key={name} className="js-swatch" tone={value} dark={dark}>
              {name}
              <br />
              {value}
            </Swatch>
          ))}
        </Swatches>
      </Section>

      <Section bg={colors.black}>
        <h3>three.js</h3>
        <Stage>
          <FloppyPreview />
        </Stage>
      </Section>
    </main>
  );
}
