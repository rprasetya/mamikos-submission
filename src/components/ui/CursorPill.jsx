"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { gsap } from "@/lib/gsap";
import { scramble } from "@/lib/scramble";
import { colors, fonts, mq } from "@/styles/theme";

// Pointer-following label ("Click to close", "Hold to skim"). Eases toward the
// pointer each frame (lerp 0.16 at 60fps), fades in 0.4s / out 0.2s.

const Pill = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 23;
  display: inline-flex;
  align-items: center;
  padding: clamp(6px, 1vw, 30px);
  border: var(--borderFade);
  border-radius: 999px;
  background-color: ${colors.primary};
  color: ${colors.bg};
  font-family: ${fonts.mono};
  font-size: 0.85vw;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;

  ${mq.tablet} {
    font-size: 11px;
  }
  ${mq.mobile} {
    display: none;
  }
`;

export default function CursorPill({ label, active }) {
  const pill = useRef(null);
  const text = useRef(null);
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const el = pill.current;
    const pos = { x: target.current.x, y: target.current.y };
    gsap.set(el, { xPercent: -50, yPercent: -150 });

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY - 8 };
    };
    const tick = () => {
      const t = 1 - Math.pow(1 - 0.16, gsap.ticker.deltaRatio(60));
      pos.x += (target.current.x - pos.x) * t;
      pos.y += (target.current.y - pos.y) * t;
      gsap.set(el, { x: pos.x, y: pos.y });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  useEffect(() => {
    gsap.to(pill.current, {
      opacity: active ? 1 : 0,
      duration: active ? 0.4 : 0.2,
      ease: "power2.out",
      overwrite: true,
    });
    if (active) scramble(text.current);
  }, [active]);

  // Only ever rendered after user interaction or a client fetch, but stay SSR-safe.
  if (typeof document === "undefined") return null;

  return createPortal(
    <Pill ref={pill} aria-hidden="true">
      <span ref={text}>{label}</span>
    </Pill>,
    document.body,
  );
}
