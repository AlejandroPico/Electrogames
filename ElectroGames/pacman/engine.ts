import type { Engine, Input } from "../../src/shared/Arcade";
import { makeMaze, COLS, ROWS, CELL, OX, OY } from "./maze";
export { makeMaze, COLS, ROWS } from "./maze";
type Position = { x: number; y: number };
type Ghost = Position & {
  home: Position;
  color: string;
  last: number;
  respawn: number;
};
const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

export class PacmanEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  walls = makeMaze();
  dots = new Set<number>();
  powers = new Set([1 + COLS, 21 + COLS, 1 + 17 * COLS, 21 + 17 * COLS]);
  player = { x: 1, y: 1 };
  direction = 1;
  wanted = 1;
  ghosts: Ghost[] = [];
  elapsed = 0;
  ghostElapsed = 0;
  power = 0;
  safe = 1.8;
  clock = 0;
  constructor() {
    for (let y = 1; y < ROWS - 1; y++)
      for (let x = 1; x < COLS - 1; x++)
        if (!this.walls[y][x]) this.dots.add(y * COLS + x);
    this.dots.delete(COLS + 1);
    this.powers.delete(COLS + 1);
    const floors = [...this.dots].sort(
      (a, b) =>
        Math.abs((a % COLS) - 11) +
        Math.abs(Math.floor(a / COLS) - 9) -
        Math.abs((b % COLS) - 11) -
        Math.abs(Math.floor(b / COLS) - 9),
    );
    this.ghosts = ["#d99087", "#82b9bd", "#d8b678"].map((color, i) => {
      const id = floors[i * 3];
      const home = { x: id % COLS, y: Math.floor(id / COLS) };
      return { ...home, home, color, last: 0, respawn: 0 };
    });
  }
  can(p: Position, d: number) {
    const v = dirs[d];
    return this.walls[p.y + v.y]?.[p.x + v.x] === false;
  }
  reset() {
    this.player = { x: 1, y: 1 };
    this.direction = this.wanted = 1;
    this.ghosts.forEach((g) => {
      g.x = g.home.x;
      g.y = g.home.y;
      g.respawn = 0;
    });
    this.safe = 2;
    this.elapsed = this.ghostElapsed = 0;
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.clock += dt;
    this.power = Math.max(0, this.power - dt);
    this.safe -= dt;
    for (const g of this.ghosts) g.respawn = Math.max(0, g.respawn - dt);
    const names = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
    const letters = ["w", "d", "s", "a"];
    for (const key of input.pressed?.splice(0) ?? []) {
      const n = names.indexOf(key),
        l = letters.indexOf(key);
      if (n >= 0 || l >= 0) this.wanted = Math.max(n, l);
    }
    for (let i = 0; i < 4; i++)
      if (input.keys.has(names[i]) || input.keys.has(letters[i]))
        this.wanted = i;
    this.elapsed += dt;
    if (this.elapsed >= 0.135) {
      this.elapsed %= 0.135;
      if (this.can(this.player, this.wanted)) this.direction = this.wanted;
      if (this.can(this.player, this.direction)) {
        this.player.x += dirs[this.direction].x;
        this.player.y += dirs[this.direction].y;
      }
      const id = this.player.y * COLS + this.player.x;
      if (this.dots.delete(id)) {
        if (this.powers.delete(id)) {
          this.score += 50;
          this.power = 7;
        } else this.score += 10;
      }
      if (!this.dots.size) {
        this.won = this.over = true;
        return;
      }
      this.collisions();
      if (this.over) return;
    }
    this.ghostElapsed += dt;
    if (this.ghostElapsed >= (this.power ? 0.31 : 0.22)) {
      this.ghostElapsed = 0;
      const distances = new Map<number, number>();
      const q = [this.player.y * COLS + this.player.x];
      distances.set(q[0], 0);
      for (let n = 0; n < q.length; n++) {
        const id = q[n],
          p = { x: id % COLS, y: Math.floor(id / COLS) };
        for (let d = 0; d < 4; d++)
          if (this.can(p, d)) {
            const next = (p.y + dirs[d].y) * COLS + p.x + dirs[d].x;
            if (!distances.has(next)) {
              distances.set(next, distances.get(id)! + 1);
              q.push(next);
            }
          }
      }
      this.ghosts.forEach((g, i) => {
        if (g.respawn > 0) return;
        let choices = [0, 1, 2, 3].filter((d) => this.can(g, d));
        if (choices.length > 1)
          choices = choices.filter((d) => d !== (g.last + 2) % 4);
        choices.sort((a, b) => {
          const da =
              distances.get((g.y + dirs[a].y) * COLS + g.x + dirs[a].x) ?? 999,
            db =
              distances.get((g.y + dirs[b].y) * COLS + g.x + dirs[b].x) ?? 999;
          return this.power ? db - da : da - db;
        });
        const d =
          i === 2 && Math.random() < 0.25
            ? choices[Math.floor(Math.random() * choices.length)]
            : choices[0];
        if (d !== undefined) {
          g.x += dirs[d].x;
          g.y += dirs[d].y;
          g.last = d;
        }
      });
      this.collisions();
    }
    this.status = `${this.lives} vidas · ${this.dots.size} puntos restantes${this.power ? " · Energía" : ""}`;
  }
  collisions() {
    for (const g of this.ghosts)
      if (g.respawn <= 0 && g.x === this.player.x && g.y === this.player.y) {
        if (this.power) {
          this.score += 200;
          g.x = g.home.x;
          g.y = g.home.y;
          g.respawn = 2;
        } else if (this.safe <= 0) {
          this.lives--;
          if (!this.lives) this.over = true;
          else this.reset();
          return;
        }
      }
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#152337";
    c.fillRect(0, 0, 800, 600);
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        if (this.walls[y][x]) {
          c.fillStyle = "#284966";
          c.strokeStyle = "#547e9b";
          c.lineWidth = 1;
          c.beginPath();
          c.roundRect(
            OX + x * CELL + 2,
            OY + y * CELL + 2,
            CELL - 4,
            CELL - 4,
            5,
          );
          c.fill();
          c.stroke();
        }
    for (const id of this.dots) {
      c.fillStyle = "#e6d1a4";
      c.beginPath();
      c.arc(
        OX + ((id % COLS) + 0.5) * CELL,
        OY + (Math.floor(id / COLS) + 0.5) * CELL,
        this.powers.has(id) ? 5 : 2,
        0,
        7,
      );
      c.fill();
    }
    const px = OX + (this.player.x + 0.5) * CELL,
      py = OY + (this.player.y + 0.5) * CELL;
    c.save();
    c.translate(px, py);
    c.rotate(((this.direction - 1) * Math.PI) / 2);
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      const mouth = 0.15 + Math.abs(Math.sin(this.clock * 12)) * 0.35;
      c.fillStyle = "#eac76d";
      c.beginPath();
      c.moveTo(0, 0);
      c.arc(0, 0, 10, mouth, Math.PI * 2 - mouth);
      c.closePath();
      c.fill();
    }
    c.restore();
    for (const g of this.ghosts) {
      if (g.respawn > 0) continue;
      const x = OX + (g.x + 0.5) * CELL,
        y = OY + (g.y + 0.5) * CELL;
      c.fillStyle = this.power ? "#819fb7" : g.color;
      c.beginPath();
      c.arc(x, y, 10, Math.PI, 0);
      c.lineTo(x + 10, y + 10);
      for (let n = 0; n < 4; n++) {
        c.lineTo(x + 10 - n * 5 - 2.5, y + 6);
        c.lineTo(x + 5 - n * 5, y + 10);
      }
      c.closePath();
      c.fill();
      c.fillStyle = "#f5f1df";
      c.fillRect(x - 6, y - 3, 4, 5);
      c.fillRect(x + 2, y - 3, 4, 5);
    }
  }
}
