"use client";

import { PLAYER_SPEED } from "@/constants/game";
import { useWebsocketStore } from "@/store/websocket-store";
import { GameStateTS } from "@/types/game";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { InstancedMesh } from "three";

type PlayerPropsTS = Pick<
  GameStateTS,
  "player" | "path" | "updatePlayerPosition" | "removeFirstPathPoint"
>;

export default React.memo(function Player({
  player,
  path,
  updatePlayerPosition,
  removeFirstPathPoint,
}: PlayerPropsTS) {
  const meshRef = useRef<InstancedMesh>(null);
  const sendMessage = useWebsocketStore((state) => state.sendMessage)

  useFrame((_, delta) => {
    if (!meshRef.current || path.length === 0) {
      return;
    }

    const target = path[0];
    const currentPosition = player.position;
    const dx = target.x - currentPosition.x;
    const dy = target.y - currentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.1) {
      removeFirstPathPoint();
      return;
    }

    const velocityX = (dx / distance) * PLAYER_SPEED * delta;
    const velocityY = (dy / distance) * PLAYER_SPEED * delta;

    const newPosition = {
      x: currentPosition.x + velocityX,
      y: currentPosition.y + velocityY,
    };

    updatePlayerPosition(newPosition, sendMessage);

    meshRef.current.position.x = newPosition.x;
    meshRef.current.position.z = newPosition.y;
  });

  return (
    <mesh position={[0, 0.5, 0]} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});
