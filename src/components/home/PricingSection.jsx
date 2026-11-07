"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import ArrowButton from "@/components/ui/ArrowButton";
import MarqueeText from "@/components/ui/MarqueeText";
import { Buttons, Half, Lead, Mono, Row, Section } from "@/components/ui/primitives";
import SectionOverlay, { TopFade } from "@/components/ui/SectionOverlay";
import { SectionError, SectionLoading } from "@/components/ui/SectionStatus";
import useScrollEffects from "@/hooks/useScrollEffects";
import PricingBox from "./PricingBox";
import { mq } from "@/styles/theme";

const FloppyScene = dynamic(() => import("./FloppyScene"), { ssr: false });

const Root = styled(Section)`
  --color: hsla(0, 0%, 100%, 0.7);
  color: #ffffffb3;
  transition: background 0.35s ease;
`;

const Pricing = styled.div`
  position: relative;
  min-height: 60vw;
  padding-bottom: 20vw;

  ${mq.mobile} {
    min-height: 90vw;
  }
`;

// Copy and cards sit above the fixed floppy canvas (both z 9; later wins).
const Content = styled(Row)`
  position: relative;
  z-index: 9;
`;

const Eyebrow = styled(Mono)`
  margin-bottom: 2vw;
`;

const Links = styled(Buttons)`
  padding-bottom: 3vw;
  ${mq.mobile} {
    padding-bottom: 50px;
  }
`;

// Nº004 — Membership. Packages come from GET /api/sections/packages.
export default function PricingSection({ packages }) {
  const root = useRef(null);
  const pricing = useRef(null);
  useScrollEffects(root, [packages.status]);

  const memberships = packages.items.filter((p) => p.kind === "membership");

  return (
    <Root ref={root} tone="black" space="flush" aria-labelledby="pricing-title">
      <TopFade data-effect="topFade" style={{ zIndex: 10 }} />
      <MarqueeText text="Packages" />
      <Pricing ref={pricing} id="pricing">
        <FloppyScene triggerRef={pricing} />
        <Content>
          <Half />
          <Half>
            <Eyebrow copy dim data-effect="titleRandom" id="pricing-title">
              Nº004 — Membership
            </Eyebrow>
            <div data-effect="textFade">
              <Lead indent last>
                Our pricing is simple and transparent. With PX PUSH, you get access to senior-level creative talent
                without the high overhead of full-time hires or costly agencies. Starting at just $4,000 per month. No
                hidden fees, no surprises—just high-quality work at a fraction of the cost.
              </Lead>
            </div>

            {packages.status === "loading" && <SectionLoading label="packages" minHeight="30vw" />}
            {packages.status === "error" && (
              <SectionError label="packages" error={packages.error} onRetry={packages.retry} minHeight="30vw" />
            )}
            {memberships.map((pkg) => (
              <PricingBox key={pkg.id} pkg={pkg} />
            ))}
          </Half>
        </Content>
        <Content>
          <Half />
          <Half>
            <Links>
              <ArrowButton href="https://pxpush.com/about" external>
                About PX PUSH
              </ArrowButton>
              <ArrowButton href="https://pxpush.com/terms" external>
                Terms of Service
              </ArrowButton>
            </Links>
            <Mono as="p" dim data-effect="titleRandom" data-small="">
              Choose Standard if you need a steady creative partner for design, web, and brand support. Choose Pro if
              your roadmap moves faster, your team needs more hands, or you want priority production across multiple
              workstreams. Both plans are built to stay flexible, so you can pause, scale, or shift priorities as the
              work evolves.
            </Mono>
          </Half>
        </Content>
        <SectionOverlay color="var(--blue)" layer={10} />
      </Pricing>
    </Root>
  );
}
