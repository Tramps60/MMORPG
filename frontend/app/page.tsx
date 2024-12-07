"use client";
import { useWebsocketStore } from "@/store/websocket-store";
import Game from "./components/Game";
import { useEffect } from "react";
import { WEBSOCKET_URL } from "@/constants/game";

export default function Home() {
  const { connect, disconnect, isConnected } = useWebsocketStore();

  useEffect(() => {
    connect(WEBSOCKET_URL);

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="h-screen w-full">
      {!isConnected && <div>connecting to game server...</div>}
      {isConnected && <Game />}
    </div>
  );
}
