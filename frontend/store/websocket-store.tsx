import { WebsocketStateTS } from "@/types/websocket";
import { create } from "zustand";

export const useWebsocketStore = create<WebsocketStateTS>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],
  connect: (url) => {
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
        console.log(message)
        // set({ messages: [...get().messages, message] });
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
