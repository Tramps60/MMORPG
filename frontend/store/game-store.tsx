import { GameStateTS, Vector2 } from "@/types/game";
import { findPath } from "@/utils/pathfinding";
import { create } from "zustand";

const initialPlayer = { position: { x: 0, y: 0 } };

export const useGameStore = create<GameStateTS>((set, get) => ({
  player: initialPlayer,
  targetPosition: undefined,
  path: [],

  setTargetPosition: (position: Vector2) => {
    let debounceTimer = undefined

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      set({ targetPosition: position });
      get().updatePath();
    }, 100);
  },

  updatePath: async () => {
    const { player, targetPosition } = get();
    if (!targetPosition) {
      return;
    }
    const path = await findPath(player.position, targetPosition);
    set({ path });
  },

  updatePlayerPosition: (position: Vector2) => {
    set((state) => ({
      player: {
        ...state.player,
        position,
      },
    }));
  },

  removeFirstPathPoint: () => {
    set((state) => ({
      path: state.path.slice(1),
    }));
  },
}));
