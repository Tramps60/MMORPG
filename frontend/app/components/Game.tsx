"use client";

import Ground from "./Game/Ground";
import Player from "./Game/Player";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useGameStore } from "@/store/game-store";
import RemotePlayers from "./Game/RemotePlayers";
import Enemy from "./Game/Enemy";
import { useUIStore } from "@/store/ui-store";

export default function Game() {
  const {
    player,
    path,
    updatePlayerPosition,
    removeFirstPathPoint,
    setTargetPosition,
  } = useGameStore();

  const closeContextMenu = useUIStore((state) => state.closeContextMenu);

  if (!player) {
    return <div>loading...</div>;
  }

  return (
    <Canvas
      onPointerMissed={closeContextMenu}
      camera={{ position: [20, 20, 20], fov: 50 }}
      style={{ height: "100vh", pointerEvents: "all" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <CameraControls />
      <Ground setTargetPosition={setTargetPosition} />
      <Player
        player={player}
        path={path}
        updatePlayerPosition={updatePlayerPosition}
        removeFirstPathPoint={removeFirstPathPoint}
      />
      <RemotePlayers />
      <Enemy />
    </Canvas>
  );
}
