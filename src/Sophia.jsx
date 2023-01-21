import { useGLTF, useAnimations } from "@react-three/drei";
import { useLayoutEffect } from "react";

export default function Sophia({ ...props }) {
  const { scene, materials, animations } = useGLTF(
    "/sophia-v1-transformed.glb"
  );
  const { actions } = useAnimations(animations, scene);
  useLayoutEffect(() => {
    materials["rp_sophia_animated_003_mat"].roughness = 1;
    materials["rp_sophia_animated_003_mat"].metalness = 1;
    materials["rp_sophia_animated_003_mat"].color.set("#444");
    actions["Take 001"].play();
    scene.traverse((obj) => {
      if (obj.isMesh) obj.castShadow = obj.receiveShadow = true;
    });
  }, []);
  return <primitive object={scene} {...props} />;
}