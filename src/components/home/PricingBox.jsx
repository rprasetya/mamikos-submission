"use client";

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ArrowButton from "@/components/ui/ArrowButton";
import { formatPackagePrice, formatUsd } from "@/lib/format";
import { fonts, mq } from "@/styles/theme";

// .pricing__box: name/price header, summary, feature list and CTA.
// `columns` lays the features out in two columns (brand sprint variant).

const Box = styled.article`
  position: relative;
  margin-bottom: 2vw;
  padding-bottom: 2vw;

  ${mq.mobile} {
    margin: 20px 0 40px;
    padding: 40px 0;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: stretch;
  margin-bottom: 1vw;
  border-top: var(--border);
  border-bottom: var(--border);
  font-family: ${fonts.display};
  font-size: 2.8vw;
  line-height: 1;

  /* original: p.lead at 120% of the 20px mobile body size */
  ${mq.mobile} {
    margin-bottom: 20px;
    font-size: 24px;
  }
`;

const cell = css`
  display: flex;
  align-items: center;
  padding: 1vw 0;
  ${mq.mobile} {
    padding: 14px 0;
  }
`;

const Name = styled.h3`
  ${cell}
  gap: 0.6vw;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: normal;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2vw 0.55vw;
  border: var(--border);
  border-radius: 999px;
  /* the original asks for var(--mono), which is undefined, so it inherits SemiSqueezed */
  font-family: ${fonts.display};
  font-size: 0.75vw;
  letter-spacing: 0.02em;
  line-height: 1;
  text-transform: uppercase;

  ${mq.mobile} {
    padding: 4px 8px;
    font-size: 10px;
  }
`;

const Price = styled.p`
  ${cell}
  justify-content: flex-end;
  gap: 0.4em;
  margin-left: 1vw;
  padding-left: 2vw;
  border-left: var(--border);
  text-align: right;
  white-space: nowrap;

  s {
    opacity: 0.55;
  }

  ${mq.mobile} {
    margin-left: 14px;
    padding-left: 14px;
  }
`;

const Summary = styled.p`
  max-width: 30vw;
  margin-bottom: 3vw;
  font-family: ${fonts.mono};
  font-size: 70%;
  letter-spacing: -0.05vw;
  opacity: ${(p) => (p.muted ? 0.5 : 1)};

  ${mq.mobile} {
    max-width: 100%;
    margin-bottom: 30px;
  }
`;

const Features = styled.ul`
  display: flex;
  flex-direction: column;
  font-family: ${fonts.mono};
  font-size: 70%;
  letter-spacing: -0.05vw;
  list-style: none;

  ${(p) =>
    p.columns &&
    css`
      flex-flow: row wrap;
      li {
        width: 50%;
      }
      ${mq.mobile} {
        li {
          width: 100%;
        }
      }
    `}

  li {
    padding: 0.5vw 0;
    border-bottom: var(--border);
  }
  li:first-of-type {
    border-top: 1px solid hsla(0, 0%, 100%, 0.35);
  }
  li:last-of-type {
    border-bottom: none;
  }

  /* the original's mobile "font-size: 100%" is on the li, so items stay at 70% (14px) */
  ${mq.mobile} {
    li {
      padding: 5px 0;
    }
  }
`;

// CTA colours differ per section: inverted grey bar in pricing, black bar on blue.
const Cta = styled.div`
  margin-top: 4vw;

  a {
    padding-left: 1vw;
    padding-right: 1vw;
    border: 0;
    --btn-bg: ${(p) => (p.tone === "sprint" ? "#000" : "var(--grey)")};
    --btn-ink: ${(p) => (p.tone === "sprint" ? "var(--cream)" : "var(--background)")};
    --btn-fill: ${(p) => (p.tone === "sprint" ? "var(--lightgrey)" : "#fff")};
    --btn-hover-ink: ${(p) => (p.tone === "sprint" ? "#000" : "var(--background)")};
  }

  ${mq.mobile} {
    margin-top: ${(p) => (p.tone === "sprint" ? "50px" : "80px")};
    a {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
`;

export default function PricingBox({ pkg, columns = false }) {
  const isSprint = pkg.kind === "sprint";

  return (
    <Box aria-labelledby={`pkg-${pkg.id}`}>
      <Header>
        <Name id={`pkg-${pkg.id}`}>
          {pkg.name}
          {pkg.badge && <Badge>{pkg.badge}</Badge>}
        </Name>
        <Price>
          {pkg.compareAtPrice && (
            <s>
              <span className="visually-hidden">Was </span>
              {formatUsd(pkg.compareAtPrice)}
            </s>
          )}
          <span>{formatPackagePrice(pkg)}</span>
        </Price>
      </Header>

      <Summary muted={!isSprint}>{pkg.summary}</Summary>

      <Features columns={columns}>
        {pkg.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </Features>

      <Cta tone={isSprint ? "sprint" : "membership"}>
        <ArrowButton href={`/start?package=${pkg.id}`}>{pkg.cta}</ArrowButton>
      </Cta>
    </Box>
  );
}
