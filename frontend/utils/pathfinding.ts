import EasyStar from "easystarjs";
import { Vector2 } from "@/types/game";
import { GRID_SIZE } from "@/constants/game";

const pathfinder = new EasyStar.js();
const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
pathfinder.setGrid(grid);
pathfinder.setAcceptableTiles([0]);
pathfinder.enableDiagonals();
pathfinder.enableCornerCutting();

function worldToGrid(coord: number): number {
  return Math.floor(coord + GRID_SIZE / 2);
}

function gridToWorld(coord: number): number {
  return coord - GRID_SIZE / 2;
}

export function findPath(
  start: Vector2,
  end: Vector2
): Promise<Vector2[]> {
  return new Promise((resolve) => {
    const startX = worldToGrid(start.x);
    const startY = worldToGrid(start.y);
    const endX = worldToGrid(end.x);
    const endY = worldToGrid(end.y);

    // Ensure coordinates are within bounds
    if (
      startX < 0 ||
      startX >= GRID_SIZE ||
      startY < 0 ||
      startY >= GRID_SIZE ||
      endX < 0 ||
      endX >= GRID_SIZE ||
      endY < 0 ||
      endY >= GRID_SIZE
    ) {
      resolve([]);
      return;
    }

    pathfinder.findPath(startX, startY, endX, endY, (path) => {
      if (path === null) {
        resolve([]);
      } else {
        // Convert path back to world coordinates
        resolve(
          path.map((point) => ({
            x: gridToWorld(point.x),
            y: gridToWorld(point.y),
          }))
        );
      }
    });
    pathfinder.calculate();
  });
}
