import { useUIStore } from "@/store/ui-store";
import { ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function Enemy() {
  const meshRef = useRef<Mesh>(null);
  const openContextMenu = useUIStore((state) => state.openContextMenu);

  const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
    console.log("context menu triggered");
    event.nativeEvent.preventDefault();
    event.stopPropagation();
    openContextMenu("enemy", { x: event.clientX, y: event.clientY });
  };

  return (
    <mesh
      onContextMenu={handleContextMenu}
      castShadow
      position={[5, 0.5, 5]}
      ref={meshRef}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
