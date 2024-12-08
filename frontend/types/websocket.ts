import { Vector2 } from "./game";

export type WebsocketMessage<T = Record<string, string>> = {
  type: string;
  client_id: string;
  data: T;
};

export type WebsocketStateTS = {
  client_id?: string
  socket: WebSocket | null;
  isConnected: boolean;
  connect: (
    url: string,
    setPlayer: (client_id: string, position: Vector2) => void,
    updateRemotePlayer: (client_id: string, position: Vector2) => void,
    deleteRemotePlayer: (client_id: string) => void
  ) => void;
  disconnect: () => void;
  sendMessage: <T = Record<string, string>>(
    message: WebsocketMessage<T>
  ) => void;
  messages: WebsocketMessage[] | [];
};
