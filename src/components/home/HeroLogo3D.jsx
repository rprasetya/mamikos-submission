"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import styled from "@emotion/styled";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";
import RoomEnvironmentMap from "@/components/three/RoomEnvironmentMap";
import { mq } from "@/styles/theme";

// Chrome PX PUSH mark extruded from /img/pxpush.svg (pxpush.com's Logo3D).
// It starts centred in the hero and, as you scroll, rises and shrinks to 25%
// until it docks at the top centre, where clicking it scrolls back to the top.

const SVG_URL = "/img/pxpush.svg";
const EXTRUDE = { depth: 30, bevelEnabled: true, bevelSegments: 2, steps: 10, bevelSize: 0.5, bevelThickness: 1, curveSegments: 50 };

// Shared between the scroll handler and the render loop.
const spin = { kick: 0, smooth: 0, enabled: true };

function LogoMesh() {
  const svg = useLoader(SVGLoader, SVG_URL);
  const mesh = useRef(null);
  const { viewport, camera } = useThree();

  const geometry = useMemo(() => {
    const shapes = svg.paths.flatMap((path) => SVGLoader.createShapes(path));
    const geo = new THREE.ExtrudeGeometry(shapes, EXTRUDE);
    geo.center();
    geo.scale(1, -1, 1); // SVG y points down
    geo.computeBoundingBox();
    return geo;
  }, [svg]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xe7edf6,
        metalness: 0.92,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.7,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Fit to 80% of the visible area at the logo's depth (viewport updates on resize).
  const scale = useMemo(() => {
    const box = geometry.boundingBox.getSize(new THREE.Vector3());
    const visible = viewport.getCurrentViewport(camera, [0, 0, 0]);
    return Math.min((0.8 * visible.width) / box.x, (0.8 * visible.height) / box.y);
  }, [geometry, viewport, camera]);

  useFrame(() => {
    if (!mesh.current) return;
    spin.kick *= 0.9;
    spin.smooth += (spin.kick - spin.smooth) * 0.16;
    mesh.current.rotation.y += -0.01 + spin.smooth;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} scale={scale} rotation-y={-0.45} />;
}

const Dock = styled.div`
  position: fixed;
  top: 39vh;
  left: 50%;
  z-index: 3;
  width: 70vw;
  height: 32vh;
  pointer-events: none;
  opacity: 0;

  &[data-docked="true"] {
    z-index: 21;
    cursor: pointer;
    pointer-events: auto;
  }

  ${mq.mobile} {
    top: 29vh;
  }
`;

export default function HeroLogo3D() {
  const dock = useRef(null);
  const lenis = useLenis();

  useGSAP(() => {
    const el = dock.current;
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    const restTop = () => el.offsetTop - (isMobile ? window.innerHeight * 0.025 : 0);

    gsap.set(el, { xPercent: -50, transformOrigin: "50% 0%" });
    gsap.to(el, { opacity: 1, duration: 1.2, delay: 0.8, ease: "none" });
    gsap.to(el, {
      y: () => -restTop(),
      scale: 0.25,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: () => `${restTop()}px top`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          el.dataset.docked = String(self.progress >= 0.98);
        },
      },
    });

    // Scroll velocity nudges the spin; paused while the floppy disk is on screen.
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (!spin.enabled || isMobile) return;
        spin.kick = gsap.utils.clamp(-0.08, 0.08, -self.getVelocity() * 2e-5);
      },
    });
    const pricing = document.querySelector("#pricing");
    if (pricing) {
      ScrollTrigger.create({
        trigger: pricing,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          spin.enabled = !self.isActive;
        },
      });
    }
  });

  const backToTop = () => {
    if (dock.current?.dataset.docked === "true") lenis?.scrollTo(0);
  };

  return (
    <Dock ref={dock} onClick={backToTop} aria-hidden="true">
      <CanvasErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 10, near: 0.1, far: 100, position: [0, 0, 13] }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
          }}
        >
          <directionalLight color="#ffffff" intensity={2.6} position={[3, 4, 8]} />
          <directionalLight color="#a8d7ff" intensity={1.2} position={[-4, -1, 6]} />
          <directionalLight color="#ffffff" intensity={1} position={[0, 2, -8]} />
          <ambientLight intensity={0.8} />
          <RoomEnvironmentMap />
          <Suspense fallback={null}>
            <LogoMesh />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </Dock>
  );
}
