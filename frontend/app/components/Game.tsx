"use client";

import Ground from "./Game/Ground";
import Player from "./Game/Player";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useGameStore } from "@/store/game-store";
import RemotePlayers from "./Game/RemotePlayers";
import Enemy from "./Game/Enemy";

export default function Game() {
  const {
    player,
    path,
    updatePlayerPosition,
    removeFirstPathPoint,
    setTargetPosition,
  } = useGameStore();

  if (!player) {
    return <div>loading...</div>;
  }

  return (
    <Canvas
      onPointerMissed={() => console.log('canvas.missed')}
      onContextMenu={(e) => e.preventDefault()}
      camera={{ position: [20, 20, 20], fov: 50 }}
      style={{ height: "100vh" }}
    >
      <CameraControls />
      <ambientLight />
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
