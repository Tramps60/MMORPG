export type Vector2 = {
  x: number;
  y: number;
};

export type PlayerTS = {
  position: Vector2;
};

export type GameStateTS = {
  player: PlayerTS;
  updatePlayerPosition: (position: Vector2) => void

  targetPosition?: Vector2;
  setTargetPosition: (position: Vector2) => void;

  path: Vector2[];
  updatePath: () => void;
  removeFirstPathPoint: () => void
};
