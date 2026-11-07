"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Pre-filtered studio lighting for chrome materials, generated locally (no HDR
// download), the same PMREM(RoomEnvironment, 0.04) setup pxpush.com uses.
// Render it as a direct child of <Canvas>; it attaches to scene.environment.
export default function RoomEnvironmentMap({ sigma = 0.04 }) {
  const gl = useThree((state) => state.gl);

  const texture = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), sigma).texture;
    pmrem.dispose();
    return env;
  }, [gl, sigma]);

  useEffect(() => () => texture.dispose(), [texture]);

  return <primitive object={texture} attach="environment" />;
}
