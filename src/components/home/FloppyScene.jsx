"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import styled from "@emotion/styled";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";
import RoomEnvironmentMap from "@/components/three/RoomEnvironmentMap";
import { mq } from "@/styles/theme";

// Dark chrome floppy disk floating left of the pricing cards (pxpush.com's
// HomePricing scene). Desktop only. All numbers come from the original bundle.
//
// Textures are pre-baked at 1024px from the model's 2048px spec/gloss map, with
// the same formulas pxpush.com runs in the browser on every visit:
//   roughness = 255 - gloss        colour = #000 -> #777 by min(1, 2 * gloss)
// That replaced a 3.5MB download plus a per-pixel canvas pass at runtime.

const MODEL_URL = "/img/home/floppy_disk/scene.gltf";
const COLOR_URL = "/img/home/floppy_disk/textures/floppy_color_1024.png";
const ROUGHNESS_URL = "/img/home/floppy_disk/textures/floppy_roughness_1024.png";
const ROT_FROM = { x: -0.28, y: 0.85, z: 0.1 };
const ROT_TO = { x: 0.28, y: -0.55, z: -0.1 };

// Shared between the ScrollTrigger and the render loop.
const scroll = { progress: 0, boost: 0, direction: 1 };

function Floppy() {
  const { scene } = useGLTF(MODEL_URL);
  const [colorMap, roughnessMap] = useTexture([COLOR_URL, ROUGHNESS_URL], ([color, roughness]) => {
    color.colorSpace = THREE.SRGBColorSpace;
    roughness.colorSpace = THREE.NoColorSpace;
    color.flipY = false; // glTF UV convention
    roughness.flipY = false;
  });
  const group = useRef(null);
  const model = useRef(null);
  const { gl, scene: root, camera } = useThree();

  // Centre the model and scale its largest side to 1.3 units.
  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    clone.position.sub(box.getCenter(new THREE.Vector3()));
    return { object: clone, scale: 1.3 / Math.max(size.x, size.y, size.z) };
  }, [scene]);

  useEffect(() => {
    const materials = [];
    object.traverse((child) => {
      if (!child.isMesh) return;
      const material = new THREE.MeshPhysicalMaterial({
        map: colorMap,
        normalMap: child.material.normalMap ?? null,
        roughnessMap,
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

    // Compile shaders and upload textures off the critical path, before the
    // section is on screen (otherwise the first visible frame froze ~380ms).
    const warm = () => {
      [colorMap, roughnessMap, ...materials.map((m) => m.normalMap)].forEach((t) => t && gl.initTexture(t));
      if (gl.compileAsync) gl.compileAsync(root, camera).catch(() => {});
      else gl.compile(root, camera);
    };
    const idle = "requestIdleCallback" in window;
    const handle = idle ? requestIdleCallback(warm, { timeout: 2000 }) : setTimeout(warm, 500);

    return () => {
      if (idle) cancelIdleCallback(handle);
      else clearTimeout(handle);
      materials.forEach((m) => m.dispose());
    };
  }, [object, colorMap, roughnessMap, gl, root, camera]);

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
  // Don't download or build the scene until pricing is ~1.5 screens away, so it
  // never competes with the hero for bandwidth on a first visit.
  const [near, setNear] = useState(false);
  // Hidden below 600px (as on pxpush.com), so skip it there entirely.
  // This component is client-only (next/dynamic, ssr: false), so window exists.
  const [enabled] = useState(() => window.matchMedia("(min-width: 601px)").matches);

  useEffect(() => {
    if (!enabled || !triggerRef.current) return undefined;
    let last = 0;
    const approach = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top bottom+=150%",
      once: true,
      onEnter: () => setNear(true),
    });
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top bottom",
      end: "bottom top",
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
    return () => {
      approach.kill();
      trigger.kill();
    };
  }, [triggerRef, enabled]);

  if (!enabled) return null;

  return (
    <Stage ref={stage} aria-hidden="true">
      {near && (
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
      )}
    </Stage>
  );
}
