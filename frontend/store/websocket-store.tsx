import { WebsocketStateTS } from "@/types/websocket";
import { create } from "zustand";

export const useWebsocketStore = create<WebsocketStateTS>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],
  connect: (url, setPlayer, updateRemotePlayer, deleteRemotePlayer) => {
    if (get().socket?.readyState === WebSocket.OPEN) {
      console.warn("Websocket is already connected");
      return;
    }

    const socket = new WebSocket(url);

    socket.onopen = () => {
      set({ isConnected: true });
      console.log("websocket connected");
    };

    socket.onclose = () => {
      set({ isConnected: false, socket: null });
      console.log("websocket disconnected");
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "NewConnection") {
          setPlayer(message.client_id, message.data.position);
          set({ client_id: message.client_id });
        }

        if (message.type === "Position") {
          updateRemotePlayer(message.client_id, message.data);
        }

        if (message.type === "Disconnection") {
          deleteRemotePlayer(message.client_id);
        }
      } catch (error) {
        console.error("error parsing websocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("websocket error:", error);
    };

    set({ socket });
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },
  sendMessage: (message) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  },
}));
