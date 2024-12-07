import { GameStateTS, Vector2 } from "@/types/game";
import { findPath } from "@/utils/pathfinding";
import { create } from "zustand";

export const useGameStore = create<GameStateTS>((set, get) => ({
  player: undefined,
  setPlayer: (client_id, position) => {
    set(() => ({ player: { id: client_id, position } }));
  },

  otherPlayers: [],
  updateOtherPlayers: (client_id, position) => {
    const { otherPlayers } = get();
    
    // Find if player already exists
    const existingPlayerIndex = otherPlayers.findIndex(p => p.id === client_id);
    
    if (existingPlayerIndex !== -1) {
      // Update existing player
      const updatedPlayers = [...otherPlayers];
      updatedPlayers[existingPlayerIndex].position = position;
      set({ otherPlayers: updatedPlayers });
    } else {
      // Add new player
      set({ otherPlayers: [...otherPlayers, { id: client_id, position }] });
    }
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
