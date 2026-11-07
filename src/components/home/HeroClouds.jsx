"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import styled from "@emotion/styled";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";

// Endless fly-through of 8000 cloud sprites (pxpush.com's HomeCloudCanvas, itself
// based on the classic three.js clouds demo). Values below are copied from the
// original bundle: fov 30, fog #0EAEBC near -100 far 3000, 100 units/s cruise.

const CLOUD_COUNT = 8000;
const LOOP = 8000;
const FOG = { color: 0x0eaebc, near: -100, far: 3000 };

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform vec3 fogColor;
  uniform float fogNear;
  uniform float fogFar;
  uniform float brightness;
  uniform vec3 tint;
  varying vec2 vUv;
  void main() {
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    vec4 texColor = texture2D(map, vUv);
    texColor.rgb *= brightness;
    texColor.rgb *= tint;
    texColor.w *= pow(gl_FragCoord.z, 20.0);
    gl_FragColor = mix(texColor, vec4(fogColor, texColor.w), fogFactor);
  }
`;

function buildCloudGeometry() {
  const plane = new THREE.PlaneGeometry(64, 64);
  const dummy = new THREE.Object3D();
  const planes = [];
  for (let i = 0; i < CLOUD_COUNT; i++) {
    dummy.position.set(Math.random() * 1000 - 500, -Math.random() * Math.random() * 200 - 15, i);
    dummy.rotation.z = Math.random() * Math.PI;
    dummy.scale.setScalar(Math.random() * Math.random() * 1.5 + 0.5);
    dummy.updateMatrix();
    planes.push(plane.clone().applyMatrix4(dummy.matrix));
  }
  const merged = mergeGeometries(planes);
  plane.dispose();
  planes.forEach((g) => g.dispose());
  return merged;
}

function Clouds({ boostRef, pointer }) {
  const texture = useTexture("/img/home/cloud10.png", (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  const geometry = useMemo(() => buildCloudGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          fogColor: { value: new THREE.Color(FOG.color) },
          fogNear: { value: FOG.near },
          fogFar: { value: FOG.far },
          brightness: { value: 0.9 },
          tint: { value: new THREE.Color(0xdce7f5) },
        },
        vertexShader,
        fragmentShader,
        depthWrite: false,
        depthTest: false,
        transparent: true,
      }),
    [texture],
  );
  const motion = useRef({ travelled: 0, speed: 0.2 });

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(({ camera }, delta) => {
    const m = motion.current;
    const target = boostRef.current ? 2 : 0.2;
    m.speed += (target - m.speed) * 0.06;
    m.travelled = (m.travelled + delta * m.speed * 500) % LOOP;

    const { x, y } = pointer.current;
    camera.position.x += ((x - window.innerWidth / 2) * 0.1 - camera.position.x) * 0.01;
    camera.position.y += (-(y - window.innerHeight / 3) * 0.05 - camera.position.y) * 0.01;
    camera.position.z = -m.travelled + LOOP;
  });

  return (
    <>
      <mesh geometry={geometry} material={material} renderOrder={2} frustumCulled={false} />
      <mesh geometry={geometry} material={material} renderOrder={1} position-z={-LOOP} frustumCulled={false} />
    </>
  );
}

const Stage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
`;

// Hovering "speed." in the welcome copy turns this layer on (difference blend).
const Cover = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  background-color: #725b5b;
  mix-blend-mode: difference;
  opacity: 0;
  pointer-events: none;
`;

export default function HeroClouds({ boostRef, coverRef }) {
  const stage = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    pointer.current = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const onMove = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Only render while the hero is on screen.
    const trigger = ScrollTrigger.create({
      trigger: stage.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setActive(self.isActive),
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      trigger.kill();
    };
  }, []);

  return (
    <>
      <Stage ref={stage}>
        <CanvasErrorBoundary>
          <Canvas
            frameloop={active ? "always" : "never"}
            dpr={1}
            gl={{ antialias: true, alpha: true }}
            camera={{ fov: 30, near: 1, far: 3000, position: [0, 0, 6000] }}
            onCreated={() => gsap.to(stage.current, { opacity: 1, duration: 1.2, ease: "none", delay: 0.4 })}
          >
            {/* Without this boundary the texture suspense escapes the Canvas and
                React hides the whole stage with display:none !important. */}
            <Suspense fallback={null}>
              <Clouds boostRef={boostRef} pointer={pointer} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </Stage>
      <Cover ref={coverRef} />
    </>
  );
}
