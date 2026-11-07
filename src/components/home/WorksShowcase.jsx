"use client";

import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import CursorPill from "@/components/ui/CursorPill";
import { mq } from "@/styles/theme";

// Endless strip of project images (pxpush.com's homeworks__showcase).
// Desktop: cruises at 200px/s, page scroll velocity adds a kick, and holding
// the pointer down "skims" at 15x while the strip shrinks to 95%.
// Mobile: horizontal drag with inertia.

const Viewport = styled.div`
  position: relative;
  width: 100%;
  height: 40vw;
  min-height: 320px;
  max-height: 72vh;
  margin-top: 5vw;
  overflow: hidden;
  cursor: none;
  touch-action: pan-y;
  user-select: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    z-index: 2;
    width: 6vw;
    height: 100%;
    opacity: 0.3;
    pointer-events: none;
  }
  &::before {
    left: 0;
    background: linear-gradient(90deg, var(--background, var(--bgcolor)) 0, transparent 100%);
  }
  &::after {
    right: 0;
    background: linear-gradient(270deg, var(--background, var(--bgcolor)) 0, transparent 100%);
  }

  ${mq.mobile} {
    height: 72vw;
    min-height: 260px;
    max-height: none;
    margin-top: 20px;
    cursor: auto;
  }
`;

const Scale = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: max-content;
  transform-origin: 50vw 50%;
  will-change: transform;
`;

const Loop = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 2.5vw;
  height: 100%;
  width: max-content;
  will-change: transform;

  ${mq.mobile} {
    gap: 16px;
  }
`;

const Figure = styled.figure`
  flex: 0 0 auto;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  pointer-events: none;

  img {
    display: block;
    width: auto;
    height: 100%;
    max-width: none;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }

  ${mq.mobile} {
    border-radius: 8px;
  }
`;

export default function WorksShowcase({ items }) {
  const viewport = useRef(null);
  const [hovering, setHovering] = useState(false);
  const holding = useRef(false);
  const touch = useRef({ active: false, dragging: false, x: 0, y: 0, t: 0 });

  // The list is rendered twice so the loop can wrap without a gap.
  const strip = [...items, ...items];

  useGSAP(
    () => {
      const loop = viewport.current.querySelector("[data-loop]");
      const figures = loop.children;
      const isMobile = window.matchMedia("(max-width: 600px)").matches;
      const state = { x: 0, gear: 2, kick: 0, inertia: 0, drift: 1 };
      const setX = gsap.quickSetter(loop, "x", "px");
      const loopLength = () => figures[items.length].offsetLeft - figures[0].offsetLeft;
      let length = loopLength();

      const tick = () => {
        const ratio = gsap.ticker.deltaRatio(60);
        const step = ratio / 60;
        state.gear += ((holding.current ? 15 : 1) - state.gear) * 0.04;

        let speed;
        if (isMobile) {
          const t = touch.current;
          state.drift += ((t.active ? 0 : 1) - state.drift) * 0.08;
          state.inertia *= t.active ? 0.96 : 0.94;
          speed = 200 * state.drift * state.gear + state.inertia;
        } else {
          speed = (200 + state.kick) * state.gear;
          state.kick *= 0.9;
        }

        state.x = gsap.utils.wrap(-length, 0, state.x - speed * step);
        setX(state.x);
      };

      // Run only while the section is on screen.
      const visibility = ScrollTrigger.create({
        trigger: viewport.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        onRefresh: () => {
          length = loopLength();
        },
      });

      // Page scroll velocity pushes the strip (desktop).
      const velocity = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          if (!isMobile) state.kick = gsap.utils.clamp(-1800, 1500, self.getVelocity() * 0.85);
        },
      });

      // Mobile drag: horizontal swipes feed inertia; vertical swipes scroll the page.
      const el = viewport.current;
      const onTouchStart = (e) => {
        const p = e.touches[0];
        touch.current = { active: true, dragging: false, x: p.clientX, y: p.clientY, t: performance.now() };
      };
      const onTouchMove = (e) => {
        const t = touch.current;
        const p = e.touches[0];
        const dx = p.clientX - t.x;
        if (!t.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(p.clientY - t.y)) t.dragging = true;
        if (!t.dragging) return;
        const now = performance.now();
        const dt = Math.max(1, now - t.t) / 1000;
        state.inertia = gsap.utils.clamp(-3600, 3600, (-dx / dt) * 2);
        t.x = p.clientX;
        t.t = now;
      };
      const onTouchEnd = () => {
        touch.current.active = false;
      };

      if (isMobile) {
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: true });
        el.addEventListener("touchend", onTouchEnd);
      }

      return () => {
        gsap.ticker.remove(tick);
        visibility.kill();
        velocity.kill();
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      };
    },
    { scope: viewport, dependencies: [items] },
  );

  const press = (down) => {
    if (window.matchMedia("(max-width: 600px)").matches) return;
    holding.current = down;
    gsap.to(viewport.current.querySelector("[data-scale]"), {
      scale: down ? 0.95 : 1,
      duration: down ? 0.35 : 0.45,
      ease: "power2.out",
    });
  };

  return (
    <>
      <Viewport
        ref={viewport}
        role="region"
        aria-label="Selected works, press and hold to skim"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false);
          if (holding.current) press(false);
        }}
        onPointerDown={() => press(true)}
        onPointerUp={() => press(false)}
      >
        <Scale data-scale>
          <Loop data-loop>
            {strip.map((item, i) => (
              <Figure key={`${item.id}-${i}`} aria-hidden={i >= items.length}>
                {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic-width strip, sizes come from the API */}
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </Figure>
            ))}
          </Loop>
        </Scale>
      </Viewport>
      <CursorPill label="Hold to skim" active={hovering} />
    </>
  );
}
