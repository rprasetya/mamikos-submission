"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { fonts, mq } from "@/styles/theme";

// Loading and error states for sections fed by GET /api/sections/:name,
// styled like the site's monospace labels so they don't look bolted on.

const caret = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1vw;
  min-height: ${(p) => p.minHeight ?? "auto"};
  padding: 2vw 3vw;
  font-family: ${fonts.mono};
  font-size: 50%;
  letter-spacing: -0.05vw;
  text-transform: uppercase;

  ${mq.mobile} {
    gap: 12px;
    padding: 20px;
    font-size: 12px;
  }
`;

const Caret = styled.span`
  display: inline-block;
  width: 0.6em;
  height: 1em;
  margin-left: 0.3em;
  vertical-align: -0.1em;
  background: currentColor;
  animation: ${caret} 1s steps(1) infinite;
`;

const ErrorText = styled.p`
  max-width: 40em;
  text-transform: none;
  font-size: 140%;
`;

const RetryButton = styled.button`
  padding: 0.5vw 1vw;
  border: 1px solid currentColor;
  font-family: ${fonts.mono};
  text-transform: uppercase;

  @media (hover: hover) {
    &:hover {
      background: currentColor;
      span {
        color: var(--background, var(--bgcolor));
      }
    }
  }

  ${mq.mobile} {
    padding: 8px 14px;
  }
`;

export function SectionLoading({ label, minHeight }) {
  return (
    <Box role="status" aria-live="polite" minHeight={minHeight}>
      <span>
        ● Loading {label}
        <Caret aria-hidden="true" />
      </span>
    </Box>
  );
}

export function SectionError({ label, error, onRetry, minHeight }) {
  return (
    <Box role="alert" minHeight={minHeight}>
      <span>● Signal lost: could not load {label}</span>
      <ErrorText>{error?.message ?? "Something went wrong."}</ErrorText>
      <RetryButton type="button" onClick={onRetry}>
        <span>Retry ↻</span>
      </RetryButton>
    </Box>
  );
}
