"use client";

import Ground from "./Game/Ground";
import Player from "./Game/Player";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useGameStore } from "@/store/game-store";

export default function Game() {
  const {
    player,
    path,
    updatePlayerPosition,
    removeFirstPathPoint,
    setTargetPosition,
  } = useGameStore();

  return (
    <Canvas>
      <CameraControls />
      <ambientLight />
      <Ground setTargetPosition={setTargetPosition} />
      <Player
        player={player}
        path={path}
        updatePlayerPosition={updatePlayerPosition}
        removeFirstPathPoint={removeFirstPathPoint}
      />
    </Canvas>
  );
}