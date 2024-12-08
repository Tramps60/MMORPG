import { WebsocketMessage } from "./websocket";

export type Vector2 = {
  x: number;
  y: number;
};

export type PlayerTS = {
  position: Vector2;
  id: string;
};

export type GameStateTS = {
  player?: PlayerTS;
  setPlayer: (client_id: string, position: Vector2) => void;
  updatePlayerPosition: (
    position: Vector2,
    sendMessage: (message: WebsocketMessage<{ x: number; y: number }>) => void
  ) => void;

  remotePlayers: Record<string, Vector2>;
  updateRemotePlayer: (client_id: string, position: Vector2) => void;
  deleteRemotePlayer: (client_id: string) => void

  targetPosition?: Vector2;
  setTargetPosition: (position: Vector2) => void;

  path: Vector2[];
  updatePath: () => void;
  removeFirstPathPoint: () => void;
};
