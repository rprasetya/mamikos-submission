"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import { Half, Label, Lead, Mono, Row, Second, Section, Third } from "@/components/ui/primitives";
import SectionOverlay, { TopFade } from "@/components/ui/SectionOverlay";
import { SectionError, SectionLoading } from "@/components/ui/SectionStatus";
import useScrollEffects from "@/hooks/useScrollEffects";
import WorksShowcase from "./WorksShowcase";
import { mq } from "@/styles/theme";

const SmallPrint = styled(Row)`
  justify-content: flex-start;
  margin-top: 3vw;

  ${mq.mobile} {
    margin-top: 50px;
  }
`;

const Body = styled.div`
  margin-bottom: 10vw;
`;

// Nº002 / Works — the showcase images come from GET /api/sections/works.
export default function WorksSection({ works }) {
  const root = useRef(null);
  useScrollEffects(root, [works.status]);

  return (
    <Section ref={root} tone="grey" space="flush" id="works">
      <TopFade data-effect="topFade" />
      <Body>
        <Row>
          <Third />
          <Second>
            <Mono as="p" dim data-effect="titleRandom" data-small="">
              Working across categories and stages, our team provides fast, reliable creative support—consistent,
              high-quality design that adapts to whatever the product or brand needs next.
            </Mono>
          </Second>
        </Row>
        <Row>
          <Label dim data-effect="titleRandom" data-small="">
            Nº002 / Works
          </Label>
          <Second data-effect="textFade">
            <Lead indent last>
              PX PUSH delivers everything your fast—moving team needs—branding, web &amp; interface design,
              performance creative, and more. No freelancers, no overpriced agencies—just a dedicated, high-caliber
              team delivering top-tier design fast.
            </Lead>
          </Second>
        </Row>

        {works.status === "loading" && <SectionLoading label="works" minHeight="40vw" />}
        {works.status === "error" && (
          <SectionError label="works" error={works.error} onRetry={works.retry} minHeight="40vw" />
        )}
        {works.status === "success" && <WorksShowcase items={works.items} />}

        <SmallPrint>
          <Label dim>Our Works</Label>
          <Half>
            <Mono as="p" dim>
              Our work moves across brand systems, websites, interfaces, campaigns, and product moments. Each project
              is shaped around what the team needs next, from sharp visual direction to polished assets built for
              everyday use. The result is design that feels considered, useful, and ready to keep moving across
              launches, updates, and future creative pushes.
            </Mono>
          </Half>
        </SmallPrint>
      </Body>
      <SectionOverlay color="var(--blue)" />
    </Section>
  );
}
