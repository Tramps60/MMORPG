import { Vector2 } from "@/types/game";
import { create } from "zustand";

type NPCTypeTS = "enemy" | "neutral" | "item";

export type ContextMenuTypeTS = NPCTypeTS | 'remote-player'

type NPCTS = {
  position: Vector2;
  type: NPCTypeTS;
};

type ContextMenuTS = {
  isOpen: boolean;
  position: Vector2;
  type?: ContextMenuTypeTS
};

type UIStoreTS = {
  contextMenu: ContextMenuTS;
  openContextMenu: (type: ContextMenuTypeTS, position: Vector2) => void;
  closeContextMenu: () => void;

  selectedNPC?: NPCTS;
  setSelectedNPC: (npc: NPCTS) => void;
};

export const useUIStore = create<UIStoreTS>((set, get) => ({
  selectedNPC: undefined,

  setSelectedNPC: (selectedNPC) => set({ selectedNPC }),

  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
  },

  openContextMenu: (type, position) => {
    set({
      contextMenu: { ...get().contextMenu, isOpen: true, type, position },
    });
  },

  closeContextMenu: () => {
    set({
      contextMenu: {
        isOpen: false,
        position: { x: 0, y: 0 },
        type: undefined,
      },
    });
  },
}));
