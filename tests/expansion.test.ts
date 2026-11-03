import { describe, it, expect } from "vitest";
import { AsteroidsEngine } from "../ElectroGames/asteroids/engine";
import { InvadersEngine } from "../ElectroGames/invaders/engine";
import {
  PacmanEngine,
  makeMaze,
  COLS,
  ROWS,
} from "../ElectroGames/pacman/engine";
import { PinballEngine } from "../ElectroGames/pinball/engine";
import { RoadEngine, STEP, goals } from "../ElectroGames/road-crossing/engine";
import { BlocksEngine } from "../ElectroGames/falling-blocks/engine";
import { TanksEngine } from "../ElectroGames/tanks/engine";
import { LanderEngine, ground } from "../ElectroGames/lunar-lander/engine";
import { filterGames } from "../src/catalog";
import type { Input } from "../src/shared/Arcade";
const input = (...keys: string[]): Input => ({
  keys: new Set(keys),
  pointer: null,
  pressed: [],
});
describe("Asteroides", () => {
  it("uses thrust, inertia and wrapped borders", () => {
    const e = new AsteroidsEngine();
    e.ship.a = 0;
    e.update(0.1, input("ArrowUp"));
    expect(e.ship.vx).toBeGreaterThan(0);
    e.ship.x = 799;
    e.ship.vx = 200;
    e.update(0.1, input());
    expect(e.ship.x).toBeLessThan(40);
  });
  it("fires with a cooldown", () => {
    const e = new AsteroidsEngine();
    e.update(0.01, input(" "));
    e.update(0.01, input(" "));
    expect(e.bullets).toHaveLength(1);
  });
  it("splits large rocks and awards points", () => {
    const e = new AsteroidsEngine();
    e.rocks = [{ x: 100, y: 100, vx: 0, vy: 0, r: 38, spin: 0 }];
    e.bullets = [{ x: 100, y: 100, vx: 0, vy: 0, life: 1 }];
    e.update(0.01, input());
    expect(e.score).toBe(100);
    expect(e.rocks).toHaveLength(2);
    expect(e.rocks.every((r) => r.r === 20)).toBe(true);
  });
  it("protects respawning ships and then uses lives", () => {
    const e = new AsteroidsEngine();
    e.rocks = [{ x: 400, y: 300, vx: 0, vy: 0, r: 20, spin: 0 }];
    e.update(0.01, input());
    expect(e.lives).toBe(3);
    e.invulnerable = 0;
    e.update(0.01, input());
    expect(e.lives).toBe(2);
  });
  it("wins after five waves", () => {
    const e = new AsteroidsEngine();
    e.wave = 5;
    e.rocks = [];
    e.update(0.01, input());
    expect(e.over && e.won).toBe(true);
  });
});
describe("Matamarcianos", () => {
  it("removes an alien hit by a player projectile", () => {
    const e = new InvadersEngine();
    e.aliens = [
      { x: 100, y: 100, row: 0 },
      { x: 200, y: 100, row: 1 },
    ];
    e.shots = [{ x: 100, y: 105, enemy: false }];
    e.update(0.01, input());
    expect(e.aliens).toHaveLength(1);
    expect(e.score).toBe(40);
  });
  it("wears down shields with projectiles", () => {
    const e = new InvadersEngine(),
      b = e.shields[0],
      count = e.shields.length;
    e.shots = [{ x: b.x + 5, y: b.y + 2, enemy: true }];
    e.update(0.01, input());
    expect(e.shields).toHaveLength(count - 1);
  });
  it("loses when the formation reaches the base", () => {
    const e = new InvadersEngine();
    e.aliens[0].y = 520;
    e.update(0.01, input());
    expect(e.over).toBe(true);
  });
  it("completes three waves", () => {
    const e = new InvadersEngine();
    e.wave = 3;
    e.aliens = [];
    e.update(0.01, input());
    expect(e.won && e.over).toBe(true);
  });
});
describe("Pac-Man", () => {
  it("has a connected original maze with closed boundaries", () => {
    const m = makeMaze(),
      seen = new Set(["1,1"]),
      q = [[1, 1]];
    for (let n = 0; n < q.length; n++) {
      const [x, y] = q[n];
      for (const [dx, dy] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]) {
        const nx = x + dx,
          ny = y + dy,
          key = `${nx},${ny}`;
        if (m[ny]?.[nx] === false && !seen.has(key)) {
          seen.add(key);
          q.push([nx, ny]);
        }
      }
    }
    expect(seen.size).toBe(m.flat().filter((v) => !v).length);
    expect(m[0].every(Boolean) && m[ROWS - 1].every(Boolean)).toBe(true);
    expect(m.every((r) => r[0] && r[COLS - 1])).toBe(true);
  });
  it("does not allow walking into walls", () => {
    const e = new PacmanEngine();
    expect(e.can({ x: 1, y: 1 }, 0)).toBe(false);
    expect(e.can({ x: 1, y: 1 }, 3)).toBe(false);
  });
  it("uses a life on contact and resets with protection", () => {
    const e = new PacmanEngine();
    e.safe = 0;
    e.ghosts[0].x = e.player.x;
    e.ghosts[0].y = e.player.y;
    e.collisions();
    expect(e.lives).toBe(2);
    expect(e.safe).toBeGreaterThan(0);
  });
  it("eats ghosts while powered", () => {
    const e = new PacmanEngine();
    e.power = 5;
    e.ghosts[0].x = e.player.x;
    e.ghosts[0].y = e.player.y;
    e.collisions();
    expect(e.score).toBe(200);
    expect(e.lives).toBe(3);
  });
  it("wins after eating the final point", () => {
    const e = new PacmanEngine(),
      d = [0, 1, 2, 3].find((d) => e.can(e.player, d))!;
    e.direction = e.wanted = d;
    const dx = [0, 1, 0, -1][d],
      dy = [-1, 0, 1, 0][d];
    e.dots = new Set([(e.player.y + dy) * COLS + e.player.x + dx]);
    e.update(0.14, input());
    expect(e.won && e.over).toBe(true);
  });
});
describe("Pinball", () => {
  it("waits for launch and launches upward", () => {
    const e = new PinballEngine();
    e.update(0.01, input());
    expect(e.waiting).toBe(true);
    e.update(0.01, input(" "));
    expect(e.waiting).toBe(false);
    expect(e.ball.vy).toBeLessThan(0);
  });
  it("bumper collisions award points and push the ball away", () => {
    const e = new PinballEngine();
    e.waiting = false;
    e.ball = { x: 295, y: 170, vx: -10, vy: 0 };
    e.update(0.001, input());
    expect(e.score).toBe(100);
    expect(e.ball.vx).toBeGreaterThan(0);
  });
  it("keeps reflected speed finite on rail contact", () => {
    const e = new PinballEngine();
    e.ball = { x: 85, y: 180, vx: -100, vy: 0 };
    e.collide({ ax: 82, ay: 90, bx: 82, by: 420 });
    expect(e.ball.vx).toBeGreaterThan(0);
    expect(Number.isFinite(e.ball.x)).toBe(true);
  });
  it("has moving independent flippers", () => {
    const e = new PinballEngine(),
      start = e.flipper(true).by;
    e.update(0.1, input("z"));
    expect(e.flipper(true).by).toBeLessThan(start);
    expect(e.right).toBe(0);
  });
  it("ends after the third lost ball", () => {
    const e = new PinballEngine();
    for (let n = 0; n < 3; n++) {
      e.waiting = false;
      e.ball = { x: 400, y: 630, vx: 0, vy: 0 };
      e.update(0.01, input());
    }
    expect(e.balls).toBe(0);
    expect(e.over).toBe(true);
  });
});
describe("Cruzar la carretera", () => {
  it("moves one cell on a short key tap", () => {
    const e = new RoadEngine();
    e.update(0.01, { ...input(), pressed: ["ArrowUp"] });
    expect(e.player.row).toBe(13);
    expect(e.score).toBe(10);
  });
  it("loses a life after a road collision", () => {
    const e = new RoadEngine(),
      l = e.lanes.find((l) => !l.river)!;
    e.player = { x: e.objects(l)[1] + l.length / 2, row: l.row };
    e.update(0.001, input());
    expect(e.lives).toBe(2);
    expect(e.player.row).toBe(14);
  });
  it("carries the player along a log", () => {
    const e = new RoadEngine(),
      l = e.lanes[0];
    e.player = { x: e.objects(l)[1] + l.length / 2, row: l.row };
    const before = e.player.x;
    e.update(0.01, input());
    expect(e.lives).toBe(3);
    expect(e.player.x).not.toBe(before);
  });
  it("records a refuge and rejects an occupied refuge", () => {
    const e = new RoadEngine();
    e.player = { x: (goals[0] + 0.5) * STEP, row: 0 };
    e.update(0.01, input());
    expect(e.homes.has(0)).toBe(true);
    e.delay = 0;
    e.player = { x: (goals[0] + 0.5) * STEP, row: 0 };
    e.update(0.01, input());
    expect(e.lives).toBe(2);
  });
  it("wins with all five refuges", () => {
    const e = new RoadEngine();
    e.homes = new Set([0, 1, 2, 3]);
    e.player = { x: (goals[4] + 0.5) * STEP, row: 0 };
    e.update(0.01, input());
    expect(e.over && e.won).toBe(true);
  });
  it("ends on timeout", () => {
    const e = new RoadEngine();
    e.time = 0.01;
    e.update(0.02, input());
    expect(e.over).toBe(true);
  });
});
describe("Bloques descendentes", () => {
  it("uses all seven shapes once in each new bag", () => {
    const e = new BlocksEngine();
    e.bag = [];
    const types = Array.from({ length: 7 }, () => e.take()).sort();
    expect(types).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
  it("blocks moves outside the board", () => {
    const e = new BlocksEngine();
    e.piece = e.newPiece(1);
    e.piece.x = 0;
    expect(e.move(-1, 0)).toBe(false);
  });
  it("clears a row and awards its score", () => {
    const e = new BlocksEngine();
    e.grid[19] = Array(10).fill(1);
    e.grid[19][4] = 0;
    e.piece = { type: 0, x: 4, y: 19, shape: [[1]] };
    e.lock();
    expect(e.lines).toBe(1);
    expect(e.score).toBe(100);
    expect(e.grid[19].every((v) => v === 0)).toBe(true);
  });
  it("hard drops only on a new press", () => {
    const e = new BlocksEngine();
    e.update(0.01, { ...input(" "), pressed: [" "] });
    const count = e.grid.flat().filter(Boolean).length;
    e.update(0.01, input(" "));
    expect(e.grid.flat().filter(Boolean)).toHaveLength(count);
    expect(count).toBe(4);
  });
  it("ends when the next piece cannot spawn", () => {
    const e = new BlocksEngine();
    e.grid[0] = Array(10).fill(1);
    e.grid[0][0] = 0;
    e.piece = { type: 0, x: 4, y: 19, shape: [[1]] };
    e.lock();
    expect(e.over).toBe(true);
  });
});
describe("Tanques", () => {
  it("stops against walls and arena borders", () => {
    const e = new TanksEngine(),
      w = e.walls[0];
    expect(e.can(w.x + 10, w.y + 10)).toBe(false);
    expect(e.can(0, 0)).toBe(false);
  });
  it("fires in the direction of the turret", () => {
    const e = new TanksEngine();
    e.player.dir = 1;
    e.update(0.01, input(" "));
    expect(e.shots[0].vx).toBeGreaterThan(0);
    expect(e.shots[0].vy).toBe(0);
  });
  it("requires two hits to destroy an enemy", () => {
    const e = new TanksEngine(),
      enemy = e.enemies[0];
    for (let n = 0; n < 2; n++) {
      e.shots = [{ x: enemy.x, y: enemy.y, vx: 0, vy: 0, enemy: false }];
      e.update(0.001, input());
    }
    expect(e.score).toBe(100);
    expect(e.enemies.includes(enemy)).toBe(false);
  });
  it("wins on the final wave", () => {
    const e = new TanksEngine();
    e.wave = 3;
    e.enemies = [];
    e.update(0.01, input());
    expect(e.over && e.won).toBe(true);
  });
});
describe("Aterrizaje lunar", () => {
  it("applies gravity and consumes fuel only with thrust", () => {
    const e = new LanderEngine();
    e.update(0.1, input());
    expect(e.ship.vy).toBeGreaterThan(0);
    expect(e.fuel).toBe(100);
    e.update(0.1, input("ArrowUp"));
    expect(e.fuel).toBeLessThan(100);
  });
  it("accepts a slow upright landing on the platform", () => {
    const e = new LanderEngine();
    e.ship = { x: 400, y: 501.9, vx: 0, vy: 20, a: 0 };
    e.update(0.01, input());
    expect(e.over && e.won).toBe(true);
    expect(e.score).toBe(1000);
  });
  it("rejects a fast landing", () => {
    const e = new LanderEngine();
    e.ship = { x: 400, y: 501.9, vx: 0, vy: 80, a: 0 };
    e.update(0.01, input());
    expect(e.over).toBe(true);
    expect(e.won).toBe(false);
  });
  it("rejects landings on rough terrain", () => {
    const e = new LanderEngine();
    e.ship = { x: 200, y: ground(200) - 18, vx: 0, vy: 1, a: 0 };
    e.update(0.01, input());
    expect(e.over && !e.won).toBe(true);
  });
});
describe("Filtros combinables", () => {
  const items = [
    { name: "Pong", category: "Reflejos" },
    { name: "Snake", category: "Supervivencia" },
    { name: "Tanques", category: "Disparos" },
  ];
  it("combines multiple categories as a union", () =>
    expect(
      filterGames(items, ["Reflejos", "Disparos"], "").map((g) => g.name),
    ).toEqual(["Pong", "Tanques"]));
  it("combines selected categories and search", () =>
    expect(filterGames(items, ["Reflejos", "Disparos"], "tan")).toEqual([
      items[2],
    ]));
  it("shows all games when no categories are selected", () =>
    expect(filterGames(items, [], "")).toHaveLength(3));
});
