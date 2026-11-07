"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { mq, zIndex } from "@/styles/theme";

// Old-TV screen layer, ported 1:1 from pxpush.com's entry stylesheet.
// The "convex" look on the original is not a geometric distortion: it comes from
// crt.png (a curved, dark-edged bezel mask) stretched over the viewport and
// scaled to 1.02, combined with scanlines, a soft backdrop blur and moving grain.
// Every layer is pointer-events: none, so the page underneath stays interactive.

const scanlineSweep = keyframes`
  0% { transform: translate3d(0, 110vh, 0); }
  100% { transform: translate3d(0, -200vh, 0); }
`;

const scanlinesRoll = keyframes`
  0% { background-position: 0 50%; }
`;

const grain = keyframes`
  0% { transform: translate3d(0, 9rem, 0); }
  10% { transform: translate3d(-1rem, -4rem, 0); }
  20% { transform: translate3d(-8rem, 2rem, 0); }
  30% { transform: translate3d(9rem, -9rem, 0); }
  40% { transform: translate3d(-2rem, 7rem, 0); }
  50% { transform: translate3d(-9rem, -4rem, 0); }
  60% { transform: translate3d(2rem, 6rem, 0); }
  70% { transform: translate3d(7rem, -8rem, 0); }
  80% { transform: translate3d(-9rem, 1rem, 0); }
  90% { transform: translate3d(6rem, -5rem, 0); }
  100% { transform: translate3d(-7rem, 0, 0); }
`;

const Layer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  pointer-events: none;
  overflow: hidden;
`;

const Scanlines = styled(Layer)`
  height: 100vh;
  opacity: 0.25;
  z-index: ${zIndex.scanlines};

  &::before,
  &::after {
    content: "";
    display: block;
    position: absolute;
    pointer-events: none;
  }

  /* a single dark band that slowly sweeps up the screen */
  &::before {
    width: 100%;
    height: clamp(2px, 0.1vw, 3px);
    background: #000000b3;
    background-size: 100% 0.6vw;
    opacity: 0.8;
    transform: translate3d(0, -10vh, 0);
    will-change: transform;
    animation: ${scanlineSweep} 8s linear infinite;
  }

  /* dense horizontal raster lines */
  &::after {
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.3) 51%);
    background-size: 100% 0.4vw;
    animation: ${scanlinesRoll} 1s steps(60) infinite;
  }

  ${mq.mobile} {
    &::before {
      background-size: 100% 0.6vh;
      opacity: 0.5;
    }
    &::after {
      background-size: 100% 0.4vh;
    }
  }
`;

// Slight phosphor bloom: blurs whatever is behind it at low opacity.
const Gloom = styled(Layer)`
  height: 100vh;
  z-index: ${zIndex.gloom};

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    opacity: 0.15;
  }

  ${mq.mobile} {
    &::before {
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      opacity: 0.2;
    }
  }
`;

// The curved CRT bezel that creates the convex illusion.
const Vignette = styled(Layer)`
  height: 100dvh;
  z-index: ${zIndex.vignette};

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url("/img/crt.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    opacity: 0.7;
    transform: scale(1.02);
  }
`;

// Film grain. Oversized by 10rem on each side so the jitter never shows an edge.
const Noise = styled.div`
  position: fixed;
  top: -10rem;
  left: -10rem;
  width: calc(100% + 20rem);
  height: calc(100% + 20rem);
  pointer-events: none;
  z-index: ${zIndex.noise};
  background-image: url("/img/noise.png");
  background-position: 50%;
  mix-blend-mode: overlay;
  opacity: 0.3;
  animation: ${grain} 0.5s steps(1) infinite;

  ${mq.mobile} {
    display: none;
  }
`;

const ReducedMotion = styled.div`
  @media (prefers-reduced-motion: reduce) {
    & *,
    & *::before,
    & *::after {
      animation: none !important;
    }
  }
`;

export default function CrtScreen() {
  return (
    <ReducedMotion aria-hidden="true">
      <Scanlines />
      <Gloom />
      <Vignette />
      <Noise />
    </ReducedMotion>
  );
}
