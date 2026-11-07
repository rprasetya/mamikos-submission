"use client";

import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "@/lib/gsap";

// pxpush.com's desktop cursor: the viewport is a grid of 20 square cells; the
// cell under the pointer lights up and fades after 0.2s, leaving a pixel trail.
// A gooey SVG filter melts neighbouring cells together; difference blending
// keeps it visible on every background. Hidden below 1300px and on touch.

const COLUMNS = 20;
const TTL = 0.2;

const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  pointer-events: none;
  mix-blend-mode: difference;

  @media (max-width: 1300px), (hover: none) {
    display: none;
  }

  svg {
    position: absolute;
    width: 0;
    height: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLUMNS}, calc(100vw / ${COLUMNS}));
  grid-auto-rows: calc(100vw / ${COLUMNS});
  filter: url(#px-gooey);

  div {
    background: #fff;
    opacity: 0;
  }
`;

// Interactive elements get the browser cursor instead of the trail.
const SKIP = "a, button, input, textarea, select, label, [data-cursor-off]";

export default function PixelCursor() {
  const grid = useRef(null);

  useEffect(() => {
    const el = grid.current;
    if (!window.matchMedia("(min-width: 1301px) and (hover: hover)").matches) return undefined;

    let cells = [];
    const build = () => {
      const size = window.innerWidth / COLUMNS;
      const count = COLUMNS * Math.ceil(window.innerHeight / size);
      el.replaceChildren(...Array.from({ length: count }, () => document.createElement("div")));
      cells = [...el.children];
    };
    build();

    let last = -1;
    const onMove = (e) => {
      if (e.target instanceof Element && e.target.closest(SKIP)) return;
      const size = window.innerWidth / COLUMNS;
      const index = Math.floor(e.clientY / size) * COLUMNS + Math.floor(e.clientX / size);
      if (index === last || !cells[index]) return;
      last = index;
      gsap.set(cells[index], { opacity: 1 });
      gsap.set(cells[index], { opacity: 0, delay: TTL });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", build);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", build);
      gsap.killTweensOf(cells);
    };
  }, []);

  return (
    <Root aria-hidden="true">
      <Grid ref={grid} />
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="px-gooey">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="3.2" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </Root>
  );
}
