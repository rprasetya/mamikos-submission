"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import styled from "@emotion/styled";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";
import RoomEnvironmentMap from "@/components/three/RoomEnvironmentMap";
import { mq } from "@/styles/theme";

// Dark chrome floppy disk floating left of the pricing cards (pxpush.com's
// HomePricing scene). Desktop only. All numbers come from the original bundle.

const MODEL_URL = "/img/home/floppy_disk/scene.gltf";
const SPEC_GLOSS_URL = "/img/home/floppy_disk/textures/material_0_specularGlossiness.png";
const ROT_FROM = { x: -0.28, y: 0.85, z: 0.1 };
const ROT_TO = { x: 0.28, y: -0.55, z: -0.1 };

// Shared between the ScrollTrigger and the render loop.
const scroll = { progress: 0, boost: 0, direction: 1 };

// The original builds two maps from the gloss channel (alpha) of the
// spec/gloss texture: roughness = 1 - gloss, colour = #000 → #777 by gloss.
function buildMapsFromGloss(image) {
  const { width, height } = image;
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const ctx = source.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, width, height).data;

  const makeCanvas = (fill) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const c = canvas.getContext("2d");
    const out = c.createImageData(width, height);
    for (let i = 0; i < pixels.length; i += 4) fill(out.data, i, pixels[i + 3]);
    c.putImageData(out, 0, 0);
    return canvas;
  };

  const roughness = new THREE.CanvasTexture(
    makeCanvas((d, i, gloss) => {
      const v = 255 - gloss;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }),
  );
  roughness.colorSpace = THREE.NoColorSpace;
  roughness.flipY = false;

  const color = new THREE.CanvasTexture(
    makeCanvas((d, i, gloss) => {
      const v = Math.round(0x77 * Math.min(1, (gloss / 255) * 2));
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }),
  );
  color.colorSpace = THREE.SRGBColorSpace;
  color.flipY = false;

  return { roughness, color };
}

function Floppy() {
  const { scene } = useGLTF(MODEL_URL);
  const specGloss = useTexture(SPEC_GLOSS_URL);
  const group = useRef(null);
  const model = useRef(null);

  // Centre the model and scale its largest side to 1.3 units.
  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.position.sub(box.getCenter(new THREE.Vector3()));
    return { object: clone, scale: 1.3 / Math.max(size.x, size.y, size.z) };
  }, [scene]);

  const maps = useMemo(() => buildMapsFromGloss(specGloss.image), [specGloss]);

  useEffect(() => {
    const materials = [];
    object.traverse((child) => {
      if (!child.isMesh) return;
      const material = new THREE.MeshPhysicalMaterial({
        map: maps.color,
        normalMap: child.material.normalMap ?? null,
        roughnessMap: maps.roughness,
        color: 0xffffff,
        metalness: 1,
        roughness: 0.6,
        envMapIntensity: 2,
        clearcoat: 1.7,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      material.normalScale.set(2, 2);
      child.material = material;
      materials.push(material);
    });
    return () => {
      materials.forEach((m) => m.dispose());
      maps.color.dispose();
      maps.roughness.dispose();
    };
  }, [object, maps]);

  useFrame((_, delta) => {
    if (!group.current || !model.current) return;
    const p = scroll.progress;
    group.current.rotation.set(
      gsap.utils.interpolate(ROT_FROM.x, ROT_TO.x, p),
      gsap.utils.interpolate(ROT_FROM.y, ROT_TO.y, p),
      gsap.utils.interpolate(ROT_FROM.z, ROT_TO.z, p),
    );
    scroll.boost += (0 - scroll.boost) * 0.08;
    model.current.rotation.y += delta * -(0.55 + scroll.boost * scroll.direction);
  });

  return (
    <group ref={group} position={[-1, 0, 0]} rotation={[0.18, -0.35, -0.04]}>
      <group ref={model} scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  );
}

const Stage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  pointer-events: none;

  ${mq.mobile} {
    display: none;
  }
`;

export default function FloppyScene({ triggerRef }) {
  const stage = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!triggerRef.current) return undefined;
    let last = 0;
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onToggle: (self) => setActive(self.isActive),
      onUpdate: (self) => {
        const p = self.progress;
        const delta = p - last;
        last = p;
        scroll.progress = p;
        scroll.direction = self.direction;
        scroll.boost = Math.min(2, scroll.boost + Math.abs(delta) * 95);
        const fadeIn = gsap.utils.normalize(0, 0.03, p);
        const fadeOut = 1 - gsap.utils.normalize(0.7, 0.75, p);
        gsap.set(stage.current, { opacity: gsap.utils.clamp(0, 1, Math.min(fadeIn, fadeOut)) });
      },
    });
    return () => trigger.kill();
  }, [triggerRef]);

  return (
    <Stage ref={stage} aria-hidden="true">
      {/* scene.bin occasionally failed on a cold first load in dev; clear the
          cached rejection and try again once before giving up quietly. */}
      <CanvasErrorBoundary retries={1} onRetry={() => useGLTF.clear(MODEL_URL)}>
        <Canvas
          frameloop={active ? "always" : "never"}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 26, near: 0.1, far: 80, position: [1, 1, 4.9] }}
          onCreated={({ gl, camera }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.5;
            camera.lookAt(0, 0, 0);
          }}
        >
          <directionalLight color="#ffffff" intensity={10} position={[2.5, 3, 5]} />
          <directionalLight color="#bcdfff" intensity={5.6} position={[-3, 1, 4]} />
          <directionalLight color="#ffffff" intensity={1.8} position={[0, 3, -4]} />
          <ambientLight intensity={0.8} />
          <RoomEnvironmentMap />
          <Suspense fallback={null}>
            <Floppy />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </Stage>
  );
}
