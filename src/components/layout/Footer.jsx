"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import Logo from "@/components/brand/Logo";
import ArrowButton from "@/components/ui/ArrowButton";
import { Buttons, Label, Row, Second, Section } from "@/components/ui/primitives";
import useScrollEffects from "@/hooks/useScrollEffects";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/styles/theme";

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/pxpush/", external: true },
  { label: "Instagram", href: "https://www.instagram.com/_pxpush", external: true },
  { label: "X", href: "https://twitter.com/_pxpush", external: true },
  { label: "Get in Touch", href: "/start" },
  { label: "Terms of Service", href: "https://pxpush.com/terms", external: true },
  { label: "Privacy Policy", href: "https://pxpush.com/privacy", external: true },
];

// Trail copies behind the wordmark: index 3/2/1, crop offsets 10%/5%/0%.
const TRAILS = [
  { index: 3, offset: "10%" },
  { index: 2, offset: "5%" },
  { index: 1, offset: "0%" },
];

const Root = styled(Section)`
  min-height: calc(100vh - 5.1vw);
  overflow: hidden;
`;

const LogoStack = styled.div`
  --trail-progress: 0;
  --trail-crop: 90%;
  position: relative;
  isolation: isolate;
  padding: 3vw;
  color: var(--grey);
  opacity: 0.7;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  ${mq.mobile} {
    padding: 20px;
  }
`;

const Front = styled.div`
  position: relative;
  z-index: 5;
`;

const Trail = styled.div`
  position: absolute;
  top: 3vw;
  left: 3vw;
  width: calc(100% - 6vw);
  background-color: var(--background, var(--bgcolor));
  color: var(--grey);
  clip-path: inset(0 0 calc(var(--trail-crop) + var(--trail-crop-offset, 0%)) 0);
  transform: translateY(calc(var(--trail-progress) * var(--trail-index) * -22%));
  will-change: transform;

  ${mq.mobile} {
    top: 20px;
    left: 20px;
    width: calc(100% - 40px);
  }
`;

const Address = styled(Label)`
  font-style: normal;
  ${mq.mobile} {
    margin-bottom: 50px;
  }
`;

export default function Footer() {
  const root = useRef(null);
  useScrollEffects(root);

  useGSAP(
    () => {
      gsap.to("[data-logo-stack]", {
        "--trail-progress": 1,
        "--trail-crop": "65%",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom center", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <Root as="footer" ref={root} tone="blue" space="none">
      <div data-effect="parallax" data-parallax="70">
        <LogoStack data-logo-stack>
          {TRAILS.map((trail) => (
            <Trail
              key={trail.index}
              aria-hidden="true"
              style={{ "--trail-index": trail.index, "--trail-crop-offset": trail.offset, zIndex: trail.index }}
            >
              <Logo variant="footer" title="" />
            </Trail>
          ))}
          <Front>
            <Logo variant="footer" />
          </Front>
        </LogoStack>

        <Row>
          <Address as="address">
            {"PEAK/SHIFT LTD.\nBG204478925\n12 VITOSHKA BLVD.\nSOFIA\nBULGARIA\n\nGMT +02:00"}
          </Address>
          <Second>
            <Buttons>
              {LINKS.map((link) => (
                <ArrowButton key={link.label} href={link.href} size="half" external={link.external}>
                  {link.label}
                </ArrowButton>
              ))}
            </Buttons>
          </Second>
        </Row>
      </div>
    </Root>
  );
}
