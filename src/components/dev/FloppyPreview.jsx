"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";

const MODEL_URL = "/img/home/floppy_disk/scene.gltf";
const DIFFUSE_URL = "/img/home/floppy_disk/textures/material_0_diffuse.png";
const NORMAL_URL = "/img/home/floppy_disk/textures/material_0_normal.png";

// The glTF only ships KHR_materials_pbrSpecularGlossiness, which three.js no
// longer reads, so the textures are applied manually (same as pxpush.com does).
function Floppy() {
  const group = useRef(null);
  const { scene } = useGLTF(MODEL_URL);
  // glTF UVs expect flipY = false; configure textures once, when they load.
  const [diffuse, normal] = useTexture([DIFFUSE_URL, NORMAL_URL], ([map, normalMap]) => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.flipY = false;
    normalMap.flipY = false;
  });

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.material = new THREE.MeshStandardMaterial({
        map: diffuse,
        normalMap: normal,
        metalness: 0.2,
        roughness: 0.35,
      });
    });
  }, [scene, diffuse, normal]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function FloppyPreview() {
  return (
    <CanvasErrorBoundary>
      <Canvas camera={{ position: [0, 0, 6], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} />
        <Suspense fallback={null}>
          <Floppy />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}

useGLTF.preload(MODEL_URL);
