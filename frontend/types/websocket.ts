export type WebsocketMessage<T = Record<string, string>> = {
  type: string;
  client_id: string;
  data: T;
};

export type WebsocketStateTS = {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: <T = Record<string, string>>(
    message: WebsocketMessage<T>
  ) => void;
  messages: WebsocketMessage[] | [];
};
