// the three  below are not needed for drei
// import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })

import { useRef } from "react";
import { Perf } from "r3f-perf";
import {
  MeshReflectorMaterial,
  Float,
  Text,
  Html,
  PivotControls,
  TransformControls,
  OrbitControls,
  useTexture,
  shaderMaterial,
} from "@react-three/drei";
import Sophia from "./Sophia.jsx";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";

import portalVertexShader from "./shaders/portal/vertex.js";
import portalFragmentShader from "./shaders/portal/fragment.js";
import { MeshStandardMaterial } from "three";

const PortalMaterial = shaderMaterial(
  {
    // here we provide the 3 uniforms that the shader will use
    uTime: 0,
    uColorStart: new THREE.Color("#000000"),
    uColorEnd: new THREE.Color("#FFFFFF"),
    derivatives: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial });

export default function App() {
  // removed for drei
  // const { camera, gl } = useThree()

  /////////////////////////////////TEXTURES///////////////////////////

  const [floor, normal] = useTexture([
    "./wet-concrete-floor_1K_.jpg",
    "./wet-concrete-floor_1K_Normal.jpg",
  ]);

  const rightWallProps = useTexture({
    map: "./concrete_wall_007_diff_1k.jpg",
    normalMap: "./concrete_wall_007_nor_gl_1k.jpg",
    roughnessMap: "./concrete_wall_007_rough_1k.jpg",
  });

  const portalMaterial = useRef();

  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });

  return (
    <>
      {/* make default gives TransformControls access to orbit and stops it when using transformcontrols */}
      <OrbitControls makeDefault />
      <Perf position="top-left" />
      ////////////////LIGHTS////////////////////////
      <color attach="background" args={["black"]} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      {/* PivotControls is not a group so need to use anchor rather than ref */}
      {/* anchor values are relative values to the object not x,y,z */}
      ////////////Sophia/////////////////////////
      <Sophia scale={0.02} rotation={[0, Math.PI, 0]} position={[-3, -1, -1]} />
      //////////////////////Portal////////////////////////
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[10, 10]} />

        <portalMaterial ref={portalMaterial} />
      </mesh>
      ////////////////////////FLOOR////////////////////////////
      <mesh
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        rotation-z={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <MeshReflectorMaterial
          map={floor}
          normalMap={normal}
          resolution={1024}
          mirror={0.5}
        />
      </mesh>
      ////////////////RIGHT WALL////////////////////////
      <mesh position={[5, 0, 0]} rotation-y={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial {...rightWallProps} />
      </mesh>
      <Float speed={4}>
        <Text
          // everything in the public folder available if in the same folder so ./
          fontSize={1}
          color="red"
          // note you can add material inside actual text
          font="./bangers-v20-latin-regular.woff"
          position-y={2}
        >
          I love r3f <meshNormalMaterial />
        </Text>
      </Float>
    </>
  );
}
