"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// pxpush.com runs Lenis with its default options (lerp 0.1).
const LENIS_OPTIONS = {
  autoRaf: false, // GSAP's ticker drives Lenis so ScrollTrigger and Lenis share one frame loop
  lerp: 0.1,
  smoothWheel: true,
};

// Lives inside <ReactLenis> so useLenis can subscribe to scroll events.
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // ReactLenis creates its instance in its own effect and exposes it through
    // state, so it is not on the ref yet when this effect runs. Read it on every
    // tick instead of caching it here.
    const tick = (time) => lenisRef.current?.lenis?.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={LENIS_OPTIONS}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
