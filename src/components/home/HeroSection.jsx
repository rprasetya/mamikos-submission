"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import MarqueeText from "@/components/ui/MarqueeText";
import SectionOverlay from "@/components/ui/SectionOverlay";
import useScrollEffects from "@/hooks/useScrollEffects";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import VideoOverlay from "./VideoOverlay";
import { colors, fonts, mq } from "@/styles/theme";

// WebGL only runs in the browser; skip it during SSR.
const HeroClouds = dynamic(() => import("./HeroClouds"), { ssr: false });

// .homeHeroIntro: wraps the hero AND the "PX PUSH" intro section, so the mini
// video stays pinned bottom-left through both and parks at the end of the intro.
const Wrapper = styled.div`
  position: relative;
`;

const MiniVideo = styled.div`
  position: fixed;
  bottom: 0;
  left: 3vw;
  z-index: 6;
  width: 15vw;
  height: 15vw;

  &[data-released="true"] {
    position: absolute;
    top: auto;
    bottom: 0;
  }

  ${mq.mobile} {
    position: absolute;
    top: 80vh;
    bottom: auto;
    left: 20px;
    width: 15vh;
    height: 15vh;
  }
`;

const MiniButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  height: 10vw;
  overflow: hidden;
  border-radius: var(--radius);
  clip-path: inset(100% 0 0 0 round var(--radius));
  transform: translateZ(0);

  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }

  ${mq.mobile} {
    height: 10vh;
  }
`;

// .monospace is 50% of the body size: 0.85vw on desktop, 10px at <=1300px.
const MiniCaption = styled.p`
  margin-top: 0.8vw;
  color: #fff;
  font-family: ${fonts.mono};
  font-size: 50%;
  letter-spacing: 0;
  line-height: 1.15;
  text-transform: uppercase;

  ${mq.mobile} {
    margin-top: 8px;
  }
`;

// .banner__hero: 100vh sky; hidden until the intro timeline fades it in.
const Banner = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, ${colors.skyTop} 0%, ${colors.skyBottom} 100%);
  opacity: 0;
`;

const BannerInner = styled.div`
  position: absolute;
  inset: 0;
`;

const Welcome = styled.p`
  position: absolute;
  right: 3vw;
  bottom: 3vw;
  z-index: 3;
  width: 32vw;
  color: #fff;
  font-family: ${fonts.mono};
  font-size: 50%;
  letter-spacing: -0.05vw;
  text-transform: uppercase;
  white-space: pre-line;

  ${mq.mobile} {
    right: 20px;
    bottom: 50px;
    width: 45vw;
  }
`;

const Speed = styled.span`
  margin-left: 5px;
  padding: 0 0.2em;
  background-color: var(--grey);
  color: var(--black);
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    background-color: var(--blue);
    color: var(--grey);
  }
`;

export default function HeroSection({ children }) {
  const root = useRef(null);
  const boost = useRef(false);
  const cover = useRef(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  useScrollEffects(root);

  useGSAP(
    () => {
      const mini = root.current.querySelector("[data-mini-video]");
      const isMobile = window.matchMedia("(max-width: 600px)").matches;

      // Intro reveal (runs once the page is interactive).
      const caption = SplitText.create("[data-mini-caption]", { type: "lines", mask: "lines" });
      const welcome = SplitText.create("[data-welcome]", { type: "lines", mask: "lines" });
      const titles = gsap.utils.toArray("[data-hero-marquee] [data-marquee-title]").slice(0, 3);

      const tl = gsap.timeline();
      tl.from(
        titles.flatMap((t) => [...t.querySelectorAll(":scope > span > span")]),
        { yPercent: 100, duration: 1, ease: "expo.out", stagger: 0.05 },
        1,
      )
        .from([...caption.lines, ...welcome.lines], { yPercent: 100, duration: 1, ease: "expo.out", stagger: 0.05 }, 0.4)
        .to("[data-banner]", { opacity: 1, duration: 1, ease: "none" }, 0.4)
        .to("[data-mini-button]", { clipPath: "inset(0% 0 0 0 round var(--radius))", duration: 1, ease: "expo.out" }, 0.8)
        .from("[data-mini-button] video", { scale: 1.2, duration: 2, ease: "expo.out" }, 0.8);

      // Caption fades over the first 20% of a viewport of scroll.
      gsap.to("[data-mini-caption]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "top -20%", scrub: true },
      });

      // Park the mini video at the bottom of the intro once we scroll past it.
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onLeave: () => (mini.dataset.released = "true"),
          onEnterBack: () => (mini.dataset.released = "false"),
        });
      }
    },
    { scope: root },
  );

  // Hovering "speed." pushes the clouds to 10x and flips the colours.
  const speedOn = () => {
    boost.current = true;
    gsap.to(cover.current, { opacity: 1, duration: 1.5, ease: "none", overwrite: true });
  };
  const speedOff = () => {
    boost.current = false;
    gsap.to(cover.current, { opacity: 0, duration: 0.6, ease: "none", overwrite: true });
  };

  return (
    <Wrapper ref={root}>
      <h1 className="visually-hidden">PX PUSH, on-demand design department</h1>
      <MarqueeText text="On–Demand Design Department" fixed effects="fadeOut" data-hero-marquee />

      <MiniVideo data-mini-video>
        <MiniButton type="button" onClick={openVideo} aria-label="Play the PX PUSH video" data-mini-button>
          <video src="/img/home/pxpush.mp4" autoPlay loop muted playsInline aria-hidden="true" />
        </MiniButton>
        <MiniCaption data-mini-caption>Scroll Down to Access Department</MiniCaption>
      </MiniVideo>

      <Banner aria-label="Welcome" data-banner>
        <BannerInner data-effect="fadeOutVideo">
          <HeroClouds boostRef={boost} coverRef={cover} />
        </BannerInner>
        <Welcome data-welcome>
          {"v.02 ------------------ Welcome to Px Push ------------------ //\n"}
          The department is open. We operate as a retained creative department — structured, accountable, and
          productive from day one. A flat monthly rate, a dedicated team, and work that moves at
          <Speed onPointerEnter={speedOn} onPointerLeave={speedOff}>
            speed.
          </Speed>
        </Welcome>
        <SectionOverlay color="var(--lightgrey)" />
      </Banner>

      {children}

      {videoOpen && <VideoOverlay src="/img/home/video.mp4" onClose={closeVideo} />}
    </Wrapper>
  );
}
