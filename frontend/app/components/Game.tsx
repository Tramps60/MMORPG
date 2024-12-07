"use client";

import Ground from "./Game/Ground";
import Player from "./Game/Player";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useGameStore } from "@/store/game-store";
import { PlayerTS } from "@/types/game";
import { useRef } from "react";
import { Mesh } from "three";

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
      <OtherPlayers />
    </Canvas>
  );
}

function OtherPlayers() {
  const otherPlayers = useGameStore((state) => state.otherPlayers);
  return otherPlayers.map((player) => (
    <OtherPlayer player={player} key={player.id} />
  ));
}

function OtherPlayer({ player }: { player: PlayerTS }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    // Update mesh position to match player position
    meshRef.current.position.x = player.position.x;
    meshRef.current.position.z = player.position.y; // y in state maps to z in Three.js
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}
