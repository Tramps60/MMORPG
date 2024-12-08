"use client";
import { useWebsocketStore } from "@/store/websocket-store";
import Game from "./components/Game";
import { useEffect } from "react";
import { WEBSOCKET_URL } from "@/constants/game";
import { useGameStore } from "@/store/game-store";

export default function Home() {
  const { connect, disconnect, isConnected } = useWebsocketStore();
  const { setPlayer, updateRemotePlayer, deleteRemotePlayer } = useGameStore()

  useEffect(() => {
    connect(WEBSOCKET_URL, setPlayer, updateRemotePlayer, deleteRemotePlayer);

    return () => {
      disconnect();
    };
  }, [connect, disconnect, setPlayer, updateRemotePlayer, deleteRemotePlayer]);

  return (
    <div className="h-screen w-full">
      {!isConnected && <div>connecting to game server...</div>}
      {isConnected && <Game />}
    </div>
  );
}
