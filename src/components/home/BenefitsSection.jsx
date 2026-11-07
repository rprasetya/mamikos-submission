"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import { Label, Lead, Mono, Row, Second, Section } from "@/components/ui/primitives";
import SectionOverlay, { TopFade } from "@/components/ui/SectionOverlay";
import { SectionError, SectionLoading } from "@/components/ui/SectionStatus";
import useScrollEffects from "@/hooks/useScrollEffects";
import { mq } from "@/styles/theme";

const Heading = styled.h2`
  width: 100%;
  padding-bottom: 5vw;
  font-size: 6vw;
  letter-spacing: normal;
  line-height: 0.85;

  ${mq.mobile} {
    margin-bottom: 20vw;
    font-size: 10vw;
  }
`;

const List = styled.ul`
  position: relative;
  padding-bottom: 1vw;
  list-style: none;
`;

// Stacking cards: each card sticks 10vh lower than the previous one (desktop),
// the same resting positions pxpush.com computes on every Lenis scroll event.
const Item = styled.li`
  position: sticky;
  top: calc((var(--i) + 1) * 10vh);
  border-top: var(--border);
  background-color: var(--background);

  ${mq.mobile} {
    position: relative;
    top: auto;
  }
`;

const ItemRow = styled(Row)`
  position: relative;
`;

const ItemBody = styled(Second)`
  display: flex;
  justify-content: space-between;
`;

const Text = styled.div`
  width: 56%;
  padding-bottom: 8vw;

  h3 {
    padding-right: 0;
    font-size: 4.42vw;
    line-height: 0.8;
  }
  p {
    width: 70%;
  }

  ${mq.mobile} {
    width: 60%;
    padding-bottom: 80px;
    line-height: 1.1;
    h3 {
      margin-bottom: 20px;
      font-size: 30px;
    }
    p {
      width: 100%;
    }
  }
`;

const Figure = styled.figure`
  width: 35%;
  height: auto;
  overflow: hidden;
  border-radius: var(--radius);

  img {
    width: 100%;
    height: auto;
  }

  ${mq.mobile} {
    position: absolute;
    top: 20px;
    right: 10px;
    width: 35%;
  }
`;

const Number = styled(Label)`
  ${mq.mobile} {
    display: none;
  }
`;

// Nº003 / Benefits — items come from GET /api/sections/benefits.
export default function BenefitsSection({ benefits }) {
  const root = useRef(null);
  useScrollEffects(root, [benefits.status]);

  return (
    <Section ref={root} tone="blue" space="noTop" id="benefits">
      <TopFade data-effect="topFade" />
      <Row>
        <Label data-effect="titleRandom">Nº003 / Benefits</Label>
        <Second>
          <Heading data-effect="titleRandom">It’s a whole new level — you’ll wonder how you managed before.</Heading>
        </Second>
      </Row>

      {benefits.status === "loading" && <SectionLoading label="benefits" minHeight="30vw" />}
      {benefits.status === "error" && (
        <SectionError label="benefits" error={benefits.error} onRetry={benefits.retry} minHeight="30vw" />
      )}
      {benefits.status === "success" && (
        <List>
          {benefits.items.map((item, i) => (
            <Item key={item.id} style={{ "--i": i }}>
              <ItemRow>
                <Number>{item.number}</Number>
                <ItemBody>
                  <Text>
                    <Lead as="h3" last>
                      {item.title}
                    </Lead>
                    <Mono as="p" copy>
                      {item.description}
                    </Mono>
                  </Text>
                  <Figure>
                    {/* eslint-disable-next-line @next/next/no-img-element -- sized webp from the API */}
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </Figure>
                </ItemBody>
              </ItemRow>
            </Item>
          ))}
        </List>
      )}
      <SectionOverlay color="var(--black)" />
    </Section>
  );
}
