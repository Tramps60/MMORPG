import { Vector2 } from "@/types/game";
import { create } from "zustand";

type NPCTypeTS = "enemy" | "neutral" | "item";

type NPCTS = {
  position: Vector2;
  type: NPCTypeTS;
};

type ContextMenuTS = {
  isOpen: boolean;
  position: Vector2;
  npcType?: NPCTypeTS;
};

type UIStoreTS = {
  contextMenu: ContextMenuTS;
  openContextMenu: (npcType: NPCTypeTS, position: Vector2) => void;
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

  openContextMenu: (npcType, position) => {
    set({
      contextMenu: { ...get().contextMenu, isOpen: true, npcType, position },
    });
  },

  closeContextMenu: () => {
    set({
      contextMenu: {
        isOpen: false,
        position: { x: 0, y: 0 },
        npcType: undefined,
      },
    });
  },
}));