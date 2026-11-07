"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import Footer from "@/components/layout/Footer";
import MarqueeText from "@/components/ui/MarqueeText";
import { Label, Lead, Mono, Row, Second, Section } from "@/components/ui/primitives";
import { TopFade } from "@/components/ui/SectionOverlay";
import useScrollEffects from "@/hooks/useScrollEffects";
import StartForm from "./StartForm";
import { mq } from "@/styles/theme";

const Page = styled(Section)`
  min-height: 100vh;
  padding-top: 8vw;

  ${mq.mobile} {
    padding-top: 90px;
  }
`;

const Aside = styled(Mono)`
  margin-top: 3vw;
  max-width: 34vw;

  ${mq.mobile} {
    max-width: 100%;
    margin-top: 32px;
  }
`;

// /start — replaces the Typeform embed on pxpush.com with our own form.
export default function StartPage({ initialPackage }) {
  const root = useRef(null);
  useScrollEffects(root);

  return (
    <>
      <main>
        <Page ref={root} tone="black" aria-labelledby="start-title">
          <TopFade data-effect="topFade" />
          <MarqueeText text="Start a Project" />
          <Row>
            <Label data-effect="titleRandom" data-small="">
              Nº005 / Start
            </Label>
            <Second>
              <h1 id="start-title" className="visually-hidden">
                Start a project with PX PUSH
              </h1>
              <Lead indent>
                Tell us what you need. We reply within one business day with next steps and a start date for your
                department.
              </Lead>
              <StartForm initialPackage={initialPackage} />
              <Aside as="p" copy dim>
                Requests are kept in memory on the server for this demo, so they reset whenever the server restarts.
              </Aside>
            </Second>
          </Row>
        </Page>
      </main>
      <Footer />
    </>
  );
}
