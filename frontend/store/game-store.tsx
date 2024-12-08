import { GameStateTS, Vector2 } from "@/types/game";
import { findPath } from "@/utils/pathfinding";
import { create } from "zustand";

export const useGameStore = create<GameStateTS>((set, get) => ({
  player: undefined,
  setPlayer: (client_id, position) => {
    set(() => ({ player: { id: client_id, position } }));
  },

  remotePlayers: {},
  updateRemotePlayer: (client_id, position) => {
    const { remotePlayers } = get();
    
    set({
      remotePlayers: {
        ...remotePlayers,
        [client_id]: position
      }
    })
  },
  deleteRemotePlayer: (client_id) => {
    const { remotePlayers } = get();

    const updatedPlayers = { ...remotePlayers }

    delete updatedPlayers[client_id]

    set({remotePlayers: updatedPlayers})
  },

  targetPosition: undefined,
  path: [],

  setTargetPosition: (position: Vector2) => {
    let debounceTimer = undefined;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      set({ targetPosition: position });
      get().updatePath();
    }, 100);
  },

  updatePath: async () => {
    const { player, targetPosition } = get();
    if (!player || !targetPosition) {
      return;
    }
    const path = await findPath(player.position, targetPosition);
    set({ path });
  },

  updatePlayerPosition: (position, sendMessage) => {
    const { player } = get();

    if (!player) {
      return;
    }

    set(() => ({
      player: {
        ...player,
        position,
      },
    }));

    sendMessage({
      type: "Position",
      client_id: player.id,
      data: { x: player.position.x, y: player.position.y },
    });
  },

  removeFirstPathPoint: () => {
    set((state) => ({
      path: state.path.slice(1),
    }));
  },
}));
