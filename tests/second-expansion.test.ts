import { describe, it, expect } from "vitest";
import type { Input } from "../src/shared/Arcade";
import { PangEngine } from "../ElectroGames/pang/engine";
import { BomberEngine } from "../ElectroGames/bomberman/engine";
import { BubbleEngine } from "../ElectroGames/bubble-shooter/engine";
import { TowerEngine } from "../ElectroGames/donkey-kong/engine";
import { BoulderEngine } from "../ElectroGames/boulder-dash/engine";
import { SkiEngine } from "../ElectroGames/ski-free/engine";
import { CentipedeEngine } from "../ElectroGames/centipede/engine";
import { RallyEngine } from "../ElectroGames/rally-x/engine";
import { PaperboyEngine } from "../ElectroGames/paperboy/engine";
import { TapperEngine } from "../ElectroGames/tapper/engine";
import { FlappyEngine } from "../ElectroGames/flappy-bird/engine";
import { ClawEngine } from "../ElectroGames/claw-machine/engine";
import { MoleEngine } from "../ElectroGames/whack-a-mole/engine";
import { SlotsEngine, payout } from "../ElectroGames/fruit-slots/engine";
import { JetpackEngine } from "../ElectroGames/jetpack/engine";
const input = (...keys: string[]): Input => ({
  keys: new Set(keys),
  pressed: [...keys],
  pointer: null,
});
describe("Pang", () => {
  it("splits large balls into smaller ones", () => {
    const e = new PangEngine();
    e.balls = [{ x: 400, y: 300, vx: 0, vy: 0, size: 0 }];
    e.hook = { x: 400, y: 200, life: 1 };
    e.update(0.001, input());
    expect(e.balls).toHaveLength(2);
    expect(e.balls.every((b) => b.size === 1)).toBe(true);
    expect(e.score).toBe(50);
  });
  it("wins after clearing the third phase", () => {
    const e = new PangEngine();
    e.stage = 3;
    e.balls = [];
    e.update(0.01, input());
    expect(e.over && e.won).toBe(true);
  });
});
describe("Bomberman", () => {
  it("blocks explosions with solid walls and destroys soft walls", () => {
    const e = new BomberEngine();
    e.board = Array.from({ length: 11 }, (_, y) =>
      Array.from({ length: 15 }, (_, x) =>
        !x || !y || x === 14 || y === 10 ? 1 : 0,
      ),
    );
    e.board[3][4] = 1;
    e.board[4][3] = 2;
    const b = { x: 3, y: 3, time: 0 };
    e.bombs = [b];
    e.explode(b);
    expect(e.fire.some((f) => f.x === 4 && f.y === 3)).toBe(false);
    expect(e.fire.some((f) => f.x === 3 && f.y === 5)).toBe(false);
    expect(e.board[4][3]).toBe(0);
  });
  it("allows victory only after enemies are gone and the exit is reached", () => {
    const e = new BomberEngine();
    e.enemies = [];
    e.player = { x: 13, y: 9 };
    e.update(0.01, input());
    expect(e.won).toBe(true);
  });
});
describe("Bubble Shooter", () => {
  it("removes connected groups of three and unsupported bubbles", () => {
    const e = new BubbleEngine();
    e.cells = [
      { r: 0, q: 0, color: 1 },
      { r: 0, q: 1, color: 1 },
      { r: 1, q: 0, color: 2 },
    ];
    e.attach(232, 60, 1);
    expect(e.cells).toHaveLength(0);
    expect(e.won).toBe(true);
    expect(e.score).toBeGreaterThanOrEqual(30);
  });
  it("fires toward the selected angle", () => {
    const e = new BubbleEngine();
    e.update(0.01, input(" "));
    expect(e.shot).not.toBeNull();
    expect(e.shot!.vy).toBeLessThan(0);
  });
});
describe("Donkey Kong", () => {
  it("climbs only when at a ladder", () => {
    const e = new TowerEngine();
    e.player = { x: 650, y: 540, vy: 0 };
    e.update(0.1, input("ArrowUp"));
    expect(e.player.y).toBeLessThan(540);
  });
  it("wins at the upper exit", () => {
    const e = new TowerEngine();
    e.player = { x: 720, y: 180, vy: 0 };
    e.update(0.01, input());
    expect(e.won).toBe(true);
  });
});
describe("Boulder Dash", () => {
  it("collects a diamond and can push a rock horizontally", () => {
    const e = new BoulderEngine();
    e.board[1][2] = 4;
    e.move(1, 0);
    expect(e.gems).toBe(1);
    e.board[1][3] = 3;
    e.board[1][4] = 0;
    e.move(1, 0);
    expect(e.board[1][4]).toBe(3);
    expect(e.player.x).toBe(3);
  });
  it("crushes a player under an already falling rock", () => {
    const e = new BoulderEngine();
    e.board[3][3] = 3;
    e.player = { x: 3, y: 4 };
    e.falling.add("3,3");
    e.update(0.21, input());
    expect(e.over).toBe(true);
  });
});
describe("SkiFree", () => {
  it("avoids an obstacle while jumping", () => {
    const e = new SkiEngine();
    e.safe = 0;
    e.obstacles = [{ x: 400, y: 459, kind: 0 }];
    e.update(0.001, input(" "));
    expect(e.lives).toBe(3);
    expect(e.jump).toBeGreaterThan(0);
  });
  it("wins at the finish distance", () => {
    const e = new SkiEngine();
    e.distance = 5000;
    e.update(0.01, input());
    expect(e.won).toBe(true);
  });
});
describe("Centipede", () => {
  it("turns and descends at an edge", () => {
    const e = new CentipedeEngine();
    e.segments = [{ q: 19, r: 0, dir: 1 }];
    e.update(0.2, input());
    expect(e.segments[0]).toMatchObject({ dir: -1, r: 1 });
  });
  it("wins after the third swarm", () => {
    const e = new CentipedeEngine();
    e.wave = 3;
    e.segments = [];
    e.update(0.01, input());
    expect(e.won).toBe(true);
  });
});
describe("Rally-X", () => {
  it("collects flags and spends fuel on smoke", () => {
    const e = new RallyEngine();
    e.flags = [
      { x: 2, y: 1 },
      { x: 5, y: 1 },
    ];
    e.update(0.12, input("ArrowRight", " "));
    expect(e.score).toBe(100);
    expect(e.smoke).toHaveLength(1);
  });
  it("finishes when no flags remain", () => {
    const e = new RallyEngine();
    e.flags = [];
    e.update(0.01, input());
    expect(e.won).toBe(true);
  });
});
describe("Paperboy", () => {
  it("delivers a projectile to a mailbox only once", () => {
    const e = new PaperboyEngine();
    e.mailboxes = [{ x: 225, y: 460, hit: false }];
    e.shots = [{ x: 225, y: 460, vx: 0 }];
    e.update(0.001, input());
    expect(e.delivered).toBe(1);
    e.update(0.001, input());
    expect(e.delivered).toBe(1);
  });
  it("throws to the selected side and uses a newspaper", () => {
    const e = new PaperboyEngine();
    e.update(0.01, input("z"));
    expect(e.shots[0].vx).toBeLessThan(0);
    expect(e.papers).toBe(39);
  });
});
describe("Tapper", () => {
  it("serves a customer and returns the empty glass", () => {
    const e = new TapperEngine();
    e.customers = [{ x: 300, lane: 0, served: false }];
    e.mugs = [{ x: 302, lane: 0, returning: false }];
    e.update(0.001, input());
    expect(e.served).toBe(1);
    expect(e.mugs[0].returning).toBe(true);
  });
  it("catches returning mugs without penalty", () => {
    const e = new TapperEngine();
    e.mugs = [{ x: 650, lane: 0, returning: true }];
    e.update(0.01, input("x"));
    expect(e.mugs).toHaveLength(0);
    expect(e.mistakes).toBe(0);
  });
});
describe("Flappy Bird", () => {
  it("flaps upward on a fresh action", () => {
    const e = new FlappyEngine();
    e.update(0.01, input(" "));
    expect(e.vy).toBeLessThan(0);
  });
  it("loses on a pipe collision", () => {
    const e = new FlappyEngine();
    e.y = 100;
    e.pipes = [{ x: 180, gap: 300, scored: false }];
    e.update(0.01, input());
    expect(e.over).toBe(true);
  });
});
describe("Máquina de garra", () => {
  it("captures a centered prize and transports it to the exit", () => {
    const e = new ClawEngine();
    e.x = e.prizes[0].x;
    e.grab();
    for (let n = 0; n < 1000 && e.caught === 0; n++) e.update(0.01, input());
    expect(e.caught).toBe(1);
    expect(e.prizes).toHaveLength(6);
    expect(e.attempts).toBe(5);
  });
  it("uses an attempt when the claw misses", () => {
    const e = new ClawEngine();
    e.x = 260;
    e.grab();
    for (let n = 0; n < 1000 && e.phase !== "ready" && !e.over; n++)
      e.update(0.01, input());
    expect(e.caught).toBe(0);
    expect(e.attempts).toBe(5);
  });
});
describe("Golpear al topo", () => {
  it("scores good targets and penalizes dark targets", () => {
    const e = new MoleEngine();
    e.moles = [{ index: 4, time: 1, bad: false }];
    e.strike();
    expect(e.hits).toBe(1);
    e.moles = [{ index: 4, time: 1, bad: true }];
    e.strike();
    expect(e.mistakes).toBe(1);
  });
  it("ends at five mistakes", () => {
    const e = new MoleEngine();
    e.mistakes = 5;
    e.update(0.01, input());
    expect(e.over).toBe(true);
  });
});
describe("Tragaperras", () => {
  it("computes virtual rewards", () => {
    expect(payout([4, 4, 4])).toBe(100);
    expect(payout([1, 1, 1])).toBe(50);
    expect(payout([1, 2, 1])).toBe(15);
    expect(payout([1, 2, 3])).toBe(0);
  });
  it("charges once and prevents concurrent spins", () => {
    const e = new SlotsEngine();
    e.spin();
    e.spin();
    expect(e.credits).toBe(95);
    expect(e.spins).toBe(9);
  });
});
describe("Jetpack", () => {
  it("spends fuel during sustained propulsion", () => {
    const e = new JetpackEngine();
    e.update(0.1, input(" "));
    expect(e.player.vy).toBeLessThan(0);
    expect(e.fuel).toBeLessThan(100);
  });
  it("collects batteries and wins at the exit", () => {
    const e = new JetpackEngine();
    e.player.x = e.cells[0].x;
    e.player.y = e.cells[0].y;
    e.update(0.001, input());
    expect(e.cells).toHaveLength(3);
    e.cells = [];
    e.player = { x: 730, y: 90, vx: 0, vy: 0 };
    e.update(0.001, input());
    expect(e.won).toBe(true);
  });
});
