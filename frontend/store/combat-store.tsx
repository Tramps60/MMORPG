import { Vector2 } from "@/types/game";
import { create } from "zustand";

type CombatTargetTS = {
  id: string;
  type: "player" | "npc";
  position: Vector2;
};

type CombatStatsTS = {
  health: number;
  maxHealth: number;
  strength: number;
};

type CombatStateTS = {
  inCombat: boolean;
  target?: CombatTargetTS;
  lastAttackTime?: number;
  attackRange: number;
  aggroRange: number;
};

type CombatActionsTS = {
    attemptAttack: (targetId: string, targetPosition: Vector2) => void
    checkCombatRange: () => void
    processCombatTick: () => void
    getPlayerStats: (clientId: string) => CombatStatsTS
}

type CombatStoreTS = CombatStateTS & CombatActionsTS 

export const useCombatStore = create<CombatStoreTS>((set, get) => ({
  inCombat: false,
  target: undefined,
  lastAttackTime: undefined,
  attackRange: 1,
  aggroRange: 5,
  
  getPlayerStats: (clientId) => {
    console.log(clientId)
    return {
        health: 100,
        maxHealth: 100,
        strength: 10
    }
  },

  attemptAttack: (targetId, targetPosition) => {
    console.log({targetId, targetPosition})
    set({})
    get()
  }, 
  checkCombatRange: () => {},
  processCombatTick: () => {},
}));
