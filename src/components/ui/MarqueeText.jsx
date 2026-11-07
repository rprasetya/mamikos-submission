"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import { gsap, useGSAP } from "@/lib/gsap";
import { fonts, mq } from "@/styles/theme";

// Big "● TITLE ● TITLE ..." band from pxpush.com (.marqueeText). Eight copies loop
// left at 150px/s (80px/s on mobile); the two hairlines draw in on mount.
// Scroll effects are declared through data-effect and run by useScrollEffects
// in the owning section.
const COPIES = 8;

const Root = styled.div`
  --marquee-line-scale: 0;
  position: ${(p) => (p.fixed ? "fixed" : "relative")};
  top: ${(p) => (p.fixed ? "3.5vw" : "auto")};
  left: 0;
  z-index: 3;
  width: 100%;
  height: 17vw;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
  /* the fixed hero copy blurs out while scrolling: keep it on its own layer so
     the blur runs on the GPU instead of repainting the text every frame */
  will-change: ${(p) => (p.fixed ? "opacity, filter" : "auto")};

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 3vw;
    width: 94vw;
    height: 1px;
    border-bottom: 2px solid ${(p) => p.lineColor ?? "hsla(0, 0%, 100%, 0.7)"};
    transform: scaleX(var(--marquee-line-scale));
    transform-origin: left top;
  }
  &::before {
    top: 1.4vw;
  }
  &::after {
    bottom: 4vw;
  }

  ${mq.mobile} {
    top: ${(p) => (p.fixed ? "80px" : "auto")};
    height: 100px;
    &::before {
      top: 2px;
    }
  }
`;

const Track = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: max-content;
  will-change: transform;
`;

const Title = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  margin-bottom: 2vw;
  font-family: ${fonts.display};
  font-size: 12vw;
  letter-spacing: -0.1vw;
  line-height: 0.96;
  white-space: nowrap;

  ${mq.mobile} {
    margin-bottom: 5vh;
    font-size: 20vw;
  }
`;

// Each part sits in an overflow-clipped line so the intro can slide it up.
const Part = styled.span`
  display: inline-block;
  overflow: hidden;

  & > span {
    display: inline-block;
  }
`;

const Symbol = styled(Part)`
  padding: 0 2vw;
  font-family: Arial, Helvetica, sans-serif;
`;

export default function MarqueeText({
  text,
  fixed = false,
  lineColor,
  effects = "fadeOut titleRandom separatorIn",
  className,
  ...rest
}) {
  const root = useRef(null);

  useGSAP(
    () => {
      const track = root.current.querySelector("[data-track]");
      const speed = window.matchMedia("(max-width: 600px)").matches ? 80 : 150;
      // Move exactly one copy's width, then wrap: a seamless infinite loop.
      const distance = track.children[0].getBoundingClientRect().width;
      gsap.fromTo(track, { x: 0 }, { x: -distance, duration: distance / speed, ease: "none", repeat: -1 });
      gsap.to(root.current, { "--marquee-line-scale": 1, duration: 0.8, ease: "expo.out" });
    },
    { scope: root },
  );

  return (
    <Root
      ref={root}
      fixed={fixed}
      lineColor={lineColor}
      className={className}
      data-effect={effects || undefined}
      data-marquee=""
      aria-hidden="true"
      {...rest}
    >
      <Track data-track>
        {Array.from({ length: COPIES }, (_, i) => (
          <Title key={i} data-marquee-title>
            <Symbol>
              <span>●</span>
            </Symbol>
            <Part>
              <span>{text}</span>
            </Part>
          </Title>
        ))}
      </Track>
    </Root>
  );
}
