import { describe, it, expect } from "vitest";
import { SnakeEngine, nextFood, SIZE } from "../ElectroGames/snake/engine";
import { BreakoutEngine } from "../ElectroGames/breakout/engine";
import { PongEngine } from "../ElectroGames/pong/engine";
import {
  board,
  reveal,
  flag,
  neighbors,
} from "../ElectroGames/minesweeper/engine";
import type { Input } from "../src/shared/Arcade";
const input = (...keys: string[]): Input => ({
  keys: new Set(keys),
  pointer: null,
});
describe("Snake", () => {
  it("moves and keeps its length", () => {
    const e = new SnakeEngine();
    e.food = { x: 0, y: 0 };
    e.update(0.2, input());
    expect(e.body[0]).toEqual({ x: 11, y: 12 });
    expect(e.body).toHaveLength(4);
  });
  it("eats, grows and places food outside the body", () => {
    const e = new SnakeEngine();
    e.food = { x: 11, y: 12 };
    e.update(0.2, input());
    expect(e.score).toBe(10);
    expect(e.body).toHaveLength(5);
    expect(e.body).not.toContainEqual(e.food);
  });
  it("prevents reversal", () => {
    const e = new SnakeEngine();
    e.update(0.2, input("ArrowLeft"));
    expect(e.direction).toEqual({ x: 1, y: 0 });
  });
  it("accepts keyboard turns", () => {
    const e = new SnakeEngine();
    e.update(0.2, input("ArrowUp"));
    expect(e.body[0]).toEqual({ x: 10, y: 11 });
  });
  it("remembers a quick tap between movement ticks", () => {
    const e = new SnakeEngine();
    e.update(0.2, { ...input(), pressed: ["ArrowUp"] });
    expect(e.body[0]).toEqual({ x: 10, y: 11 });
  });
  it("ends at a wall", () => {
    const e = new SnakeEngine();
    e.body = [{ x: 23, y: 2 }];
    e.update(0.2, input());
    expect(e.over).toBe(true);
  });
  it("detects self collision", () => {
    const e = new SnakeEngine();
    e.body = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ];
    e.update(0.2, input());
    expect(e.over).toBe(true);
  });
  it("handles a completely filled board without looping", () => {
    const points = Array.from({ length: SIZE * SIZE }, (_, i) => ({
      x: i % SIZE,
      y: Math.floor(i / SIZE),
    }));
    expect(nextFood(points)).toBeNull();
  });
});
describe("Buscaminas", () => {
  it.each([
    [9, 9, 10],
    [12, 12, 24],
    [16, 16, 40],
  ])("protects first opening and places exact mine count for %i", (w, h, m) => {
    const b = reveal(board(w, h, m), Math.floor((w * h) / 2), () => 0.41);
    expect(b.cells.filter((c) => c.mine)).toHaveLength(m);
    expect(b.over).toBe(b.won);
    for (const i of [
      Math.floor((w * h) / 2),
      ...neighbors(Math.floor((w * h) / 2), w, h),
    ])
      expect(b.cells[i].mine).toBe(false);
  });
  it("counts all neighbors correctly without crossing rows", () => {
    expect(neighbors(0, 9, 9)).toEqual([1, 9, 10]);
    const b = reveal(board(), 40, () => 0.3);
    b.cells.forEach((c, i) =>
      expect(c.adjacent).toBe(
        neighbors(i, 9, 9).filter((j) => b.cells[j].mine).length,
      ),
    );
  });
  it("does not reveal flagged cells or place more flags than mines", () => {
    let b = flag(board(), 0);
    expect(reveal(b, 0).started).toBe(false);
    for (let i = 1; i < 15; i++) b = flag(b, i);
    expect(b.cells.filter((c) => c.flag)).toHaveLength(10);
  });
  it("loses on a mine and blocks further actions", () => {
    let b = reveal(board(), 40, () => 0.3);
    const mine = b.cells.findIndex((c) => c.mine);
    b = reveal(b, mine);
    expect(b.over).toBe(true);
    expect(b.won).toBe(false);
    expect(flag(b, 0)).toBe(b);
  });
  it("wins by revealing safe cells, without requiring flags", () => {
    let b = reveal(board(), 40, () => 0.3);
    for (let i = 0; i < b.cells.length; i++)
      if (!b.cells[i].mine) b = reveal(b, i);
    expect(b.won).toBe(true);
    expect(b.over).toBe(true);
  });
  it("does not mutate previous states", () => {
    const b = board();
    reveal(b, 40);
    expect(b.started).toBe(false);
    expect(b.cells.every((c) => !c.open && !c.mine)).toBe(true);
  });
});
describe("Breakout", () => {
  it("bounces against the paddle", () => {
    const e = new BreakoutEngine();
    e.delay = 0;
    e.x = 420;
    e.y = 523;
    e.vy = 285;
    e.update(0.025, input());
    expect(e.vy).toBeLessThan(0);
    expect(e.lives).toBe(3);
  });
  it("removes bricks and awards points", () => {
    const e = new BreakoutEngine();
    e.delay = 0;
    e.x = 80;
    e.y = 221;
    e.vy = -285;
    e.update(0.025, input());
    expect(e.bricks[40].alive).toBe(false);
    expect(e.score).toBe(10);
  });
  it("uses three lives and ends when they are exhausted", () => {
    const e = new BreakoutEngine();
    for (let i = 0; i < 3; i++) {
      e.delay = 0;
      e.y = 630;
      e.update(0.025, input());
    }
    expect(e.lives).toBe(0);
    expect(e.over).toBe(true);
  });
  it("wins on the last block", () => {
    const e = new BreakoutEngine();
    e.bricks.forEach((b, i) => (b.alive = i === 0));
    e.delay = 0;
    e.x = 80;
    e.y = 105;
    e.vy = -285;
    e.update(0.025, input());
    expect(e.won).toBe(true);
  });
  it("keeps the paddle within the arena", () => {
    const e = new BreakoutEngine();
    e.update(0.01, { ...input(), pointer: 1000 });
    expect(e.paddle).toBe(738);
  });
});
describe("Pong", () => {
  it("moves with keyboard and clamps the player paddle", () => {
    const e = new PongEngine();
    e.update(1, input("ArrowUp"));
    expect(e.player).toBe(62);
  });
  it("bounces from the player paddle and accelerates", () => {
    const e = new PongEngine();
    e.delay = 0;
    e.x = 52;
    e.y = 300;
    e.vx = -295;
    e.update(0.025, input());
    expect(e.vx).toBeGreaterThan(295);
  });
  it("awards a point and serves again", () => {
    const e = new PongEngine();
    e.delay = 0;
    e.x = 805;
    e.update(0.025, input());
    expect(e.score).toBe(1);
    expect(e.x).toBe(400);
    expect(e.delay).toBeGreaterThan(0);
  });
  it("finishes at seven points", () => {
    const e = new PongEngine();
    e.score = 6;
    e.delay = 0;
    e.x = 805;
    e.update(0.025, input());
    expect(e.won).toBe(true);
    expect(e.over).toBe(true);
  });
  it("supports losing to the CPU", () => {
    const e = new PongEngine();
    e.opponent = 6;
    e.delay = 0;
    e.x = -20;
    e.vx = -295;
    e.update(0.025, input());
    expect(e.over).toBe(true);
    expect(e.won).toBe(false);
  });
});
