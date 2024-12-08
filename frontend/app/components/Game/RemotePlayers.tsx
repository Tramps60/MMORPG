import { useGameStore } from "@/store/game-store";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { Mesh } from "three";

export default React.memo(function RemotePlayers() {
   // Only select the array of IDs using a stable reference
  const remotePlayers = useGameStore((state) => 
    // Convert remotePlayers to an ID-only array in the selector
    Object.keys(state.remotePlayers).join(',')  // Using join to create a stable string
  );
  
  // Convert back to array when rendering
  const playerIds = useMemo(() => 
    remotePlayers.split(',').filter(Boolean), 
    [remotePlayers]
  );
  
  return playerIds.map((id) => (
    <RemotePlayer clientId={id} key={id} />
  ));
});

const RemotePlayer = React.memo(function RemotePlayer({
  clientId,
}: {
  clientId: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const player = useGameStore((state) => state.remotePlayers[clientId]);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.position.x = player.x;
    meshRef.current.position.z = player.y;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
});

// when you attack find if player is in range
// if player is not in range update path to go to enemy
// if in range remove path and start attacking
