"use client";
import { useWebsocketStore } from "@/store/websocket-store";
import Game from "./components/Game";
import { useEffect } from "react";
import { WEBSOCKET_URL } from "@/constants/game";
import { useGameStore } from "@/store/game-store";
import ContextMenu from "./components/UI/ContextMenu";

export default function Home() {

  const { connect, disconnect, isConnected } = useWebsocketStore();
  const { setPlayer, updateRemotePlayer, deleteRemotePlayer } = useGameStore();

  useEffect(() => {
    connect(WEBSOCKET_URL, setPlayer, updateRemotePlayer, deleteRemotePlayer);
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect, setPlayer, updateRemotePlayer, deleteRemotePlayer]);

  return (
    <div className="h-screen w-full">
      {!isConnected && <div>connecting to game server...</div>}
      {isConnected && (
        <div className="relative w-full h-screen">
          <Game />
          <HUD />
        </div>
      )}
    </div>
  );
}

export function HUD() {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="pointer-events-auto">
        <ContextMenu />
      </div>
    </div>
  );
}
