import { useGameStore } from "@/store/game-store";
import { PlayerTS } from "@/types/game";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function RemotePlayers() {
  const remotePlayers = useGameStore((state) => state.remotePlayers);
  return Object.entries(remotePlayers).map(([id, position]) => (
    <RemotePlayer player={{ id, position }} key={id} />
  ));
}

function RemotePlayer({ player }: { player: PlayerTS }) {
    const meshRef = useRef<Mesh>(null)

    useFrame(() => {
        if (!meshRef.current) return;

        meshRef.current.position.x = player.position.x
        meshRef.current.position.z = player.position.y
    })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

// when you attack find if player is in range
// if player is not in range update path to go to enemy
// if in range remove path and start attacking