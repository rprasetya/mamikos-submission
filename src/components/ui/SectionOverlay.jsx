"use client";

import styled from "@emotion/styled";

// .overlay: a 100vh block pinned to the bottom of a section, split into rows that
// grow (effect "overlayIn") in the colour of the section that follows.
const ROWS = 10;

const Root = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: ${(p) => p.layer ?? 4};
  display: grid;
  width: 100%;
  height: 100vh;
  pointer-events: none;

  div {
    background: ${(p) => p.tint};
    transform: scaleY(0);
  }
`;

export default function SectionOverlay({ color, layer }) {
  return (
    <Root tint={color} layer={layer} data-effect="overlayIn" aria-hidden="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <div key={i} />
      ))}
    </Root>
  );
}

// .topOverlay__section: sticky fade under the fixed header.
export const TopFade = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 20vh;
  margin-bottom: -20vh;
  background: linear-gradient(180deg, var(--background, var(--bgcolor)) 2%, transparent 100%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.is-visible {
    opacity: 1;
  }
`;
