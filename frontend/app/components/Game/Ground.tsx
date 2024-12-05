"use client";

import { GRID_SIZE } from "@/constants/game";
import { Vector2 } from "@/types/game";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

export default React.memo(function Ground({
  setTargetPosition,
}: {
  setTargetPosition: (position: Vector2) => void;
}) {
  const pathToLocation = (event: ThreeEvent<MouseEvent>) => {
    if (!event.intersections.length) return;

    const hit = event.intersections[0];
    if (!hit.point) return;

    event.stopPropagation();
    const position: Vector2 = {
      x: Math.round(hit.point.x),
      y: Math.round(hit.point.z),
    };
    setTargetPosition(position);
  };

  return (
    <>
      <gridHelper args={[GRID_SIZE, GRID_SIZE]} position={[0, 0.01, 0]} />
      <mesh
        onClick={pathToLocation}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </>
  );
});
