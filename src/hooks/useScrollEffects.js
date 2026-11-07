"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

// Port of pxpush.com's `effect__*` directives. Mark an element with
// data-effect="name [name...]" and call useScrollEffects(scopeRef) in the
// component that owns it. All effects are scrubbed ScrollTriggers.

const isMobile = () => window.matchMedia("(max-width: 600px)").matches;

const splitWords = (el, onSplit) =>
  SplitText.create(el, { type: "words", wordsClass: "word", autoSplit: true, onSplit });

const EFFECTS = {
  // Words pop forward from z -100 in random order (headings, labels, marquees).
  titleRandom(el) {
    gsap.set(el, { perspective: 1000 });
    splitWords(el, (self) =>
      gsap.fromTo(
        self.words,
        { opacity: 0, z: -100, transformOrigin: "50% 100%" },
        {
          opacity: 1,
          z: 0,
          rotationX: 0,
          ease: "power4",
          stagger: { each: 0.03, from: "random" },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: el.dataset.small !== undefined ? "top 50%" : "top 0%",
            scrub: true,
          },
        },
      ),
    );
  },

  // Lead paragraphs: words fade in one after another while scrolling through.
  textFade(el) {
    const targets = el.matches("p") ? [el] : [...el.querySelectorAll("p")];
    const words = [];
    targets.forEach((p) => words.push(...SplitText.create(p, { type: "words", wordsClass: "word" }).words));
    gsap.fromTo(
      words,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: isMobile() ? "top 90%" : "top 80%",
          end: isMobile() ? "center top+=10%" : "bottom 80%",
          scrub: true,
        },
      },
    );
  },

  fadeOut(el) {
    gsap.fromTo(
      el,
      { opacity: 1, filter: "blur(0px)" },
      {
        opacity: 0,
        filter: "blur(20px)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 5%", end: "top -30%", scrub: true },
      },
    );
  },

  // Hero sky: sinks and fades while the first screen scrolls away.
  fadeOutVideo(el) {
    gsap.fromTo(
      el,
      { opacity: 1, yPercent: 0 },
      {
        opacity: 0,
        yPercent: 50,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "top -100%", scrub: true },
      },
    );
  },

  separatorIn(el) {
    gsap.fromTo(
      el,
      { clipPath: "inset(0 100vw 0 0)" },
      {
        clipPath: "inset(0 0vw 0 0)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 90%", end: "top 70%", scrub: true },
      },
    );
  },

  // Horizontal blinds in the next section's colour, growing up from the bottom.
  overlayIn(el) {
    const rows = [...el.children];
    gsap.fromTo(
      rows,
      { scaleY: 0 },
      {
        scaleY: 1.01,
        transformOrigin: "50% 100%",
        ease: "power4",
        stagger: { grid: [rows.length, 1], from: "end", each: 0.04 },
        scrollTrigger: { trigger: el, start: "top 0%", end: "top -80%", scrub: true },
      },
    );
  },

  parallax(el) {
    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: Number(el.dataset.parallax) || 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom -60%", scrub: true },
      },
    );
  },

  // Sticky gradient under the header, visible only while its section is active.
  topFade(el) {
    ScrollTrigger.create({
      trigger: el.parentElement,
      start: "top 5%",
      end: "bottom 20%",
      toggleClass: { targets: el, className: "is-visible" },
    });
  },
};

export default function useScrollEffects(scopeRef, dependencies = []) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;
      const nodes = [root, ...root.querySelectorAll("[data-effect]")].filter((n) => n.dataset?.effect);
      nodes.forEach((node) => {
        node.dataset.effect.split(/\s+/).forEach((name) => EFFECTS[name]?.(node));
      });
    },
    { scope: scopeRef, dependencies, revertOnUpdate: true },
  );
}
