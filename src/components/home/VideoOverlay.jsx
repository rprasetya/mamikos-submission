"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import CursorPill from "@/components/ui/CursorPill";
import { mq } from "@/styles/theme";

// Full-screen player opened from the hero's mini video (.homeVideoOverlay).
// Click anywhere or press Escape to close; play/mute controls bottom-right.

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 22;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  cursor: none;

  ${mq.mobile} {
    cursor: auto;
  }
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
`;

const Controls = styled.div`
  position: absolute;
  right: 3vw;
  bottom: 3vw;
  z-index: 2;
  display: flex;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: #fff;
    cursor: pointer;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  ${mq.mobile} {
    right: 20px;
    bottom: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 2;
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;

  span {
    position: absolute;
    width: 22px;
    height: 1px;
    background: #fff;
  }
  span:first-of-type {
    transform: rotate(45deg);
  }
  span:last-of-type {
    transform: rotate(-45deg);
  }

  ${mq.mobile} {
    display: flex;
  }
`;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14M16 5v14" />
  </svg>
);
const SoundIcon = ({ muted }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9z" />
    {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />}
  </svg>
);

export default function VideoOverlay({ src, onClose }) {
  const root = useRef(null);
  const video = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    gsap.fromTo(root.current, { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "expo.out" });

    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [lenis, onClose]);

  const togglePlay = (event) => {
    event.stopPropagation();
    const el = video.current;
    if (el.paused) el.play();
    else el.pause();
    setPlaying(!el.paused);
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    video.current.muted = !video.current.muted;
    setMuted(video.current.muted);
  };

  return createPortal(
    <Overlay ref={root} role="dialog" aria-modal="true" aria-label="PX PUSH video" onClick={onClose}>
      <Video ref={video} src={src} autoPlay playsInline muted={muted} onEnded={onClose} />
      <Controls>
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute video" : "Mute video"}>
          <SoundIcon muted={muted} />
        </button>
      </Controls>
      <CloseButton type="button" onClick={onClose} aria-label="Close video">
        <span />
        <span />
      </CloseButton>
      <CursorPill label="Click to close" active />
    </Overlay>,
    document.body,
  );
}
