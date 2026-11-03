import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
export const shapes = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];
const colors = [
  "#83b8c0",
  "#e2cb86",
  "#b3a0c5",
  "#99bf9d",
  "#d4988c",
  "#8fa7cc",
  "#d2ad83",
];
export type Piece = { shape: number[][]; x: number; y: number; type: number };
export class BlocksEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lines = 0;
  level = 1;
  grid: number[][] = Array.from({ length: 20 }, () => Array(10).fill(0));
  bag: number[] = [];
  piece: Piece;
  next: number;
  gravity = 0;
  horizontal = 0;
  constructor() {
    this.next = this.take();
    this.piece = this.newPiece(this.take());
  }
  take() {
    if (!this.bag.length) {
      this.bag = [0, 1, 2, 3, 4, 5, 6];
      for (let i = 6; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop()!;
  }
  newPiece(type: number): Piece {
    return {
      shape: shapes[type].map((r) => [...r]),
      x: Math.floor((10 - shapes[type][0].length) / 2),
      y: 0,
      type,
    };
  }
  valid(p: Piece) {
    return p.shape.every((r, y) =>
      r.every(
        (v, x) =>
          !v ||
          (p.x + x >= 0 &&
            p.x + x < 10 &&
            p.y + y < 20 &&
            (p.y + y < 0 || this.grid[p.y + y][p.x + x] === 0)),
      ),
    );
  }
  move(dx: number, dy: number) {
    const p = { ...this.piece, x: this.piece.x + dx, y: this.piece.y + dy };
    if (this.valid(p)) {
      this.piece = p;
      return true;
    }
    return false;
  }
  rotate() {
    const s = this.piece.shape,
      rot = s[0].map((_, x) => s.map((r) => r[x]).reverse());
    for (const dx of [0, -1, 1, -2, 2]) {
      const p = { ...this.piece, shape: rot, x: this.piece.x + dx };
      if (this.valid(p)) {
        this.piece = p;
        return true;
      }
    }
    return false;
  }
  lock() {
    for (let y = 0; y < this.piece.shape.length; y++)
      for (let x = 0; x < this.piece.shape[y].length; x++)
        if (this.piece.shape[y][x]) {
          const py = this.piece.y + y;
          if (py < 0) {
            this.over = true;
            return;
          }
          this.grid[py][this.piece.x + x] = this.piece.type + 1;
        }
    const remaining = this.grid.filter((r) => r.some((v) => v === 0)),
      count = 20 - remaining.length;
    this.grid = [
      ...Array.from({ length: count }, () => Array(10).fill(0)),
      ...remaining,
    ];
    this.score += [0, 100, 300, 500, 800][count] * this.level;
    this.lines += count;
    this.level = 1 + Math.floor(this.lines / 10);
    this.piece = this.newPiece(this.next);
    this.next = this.take();
    this.gravity = 0;
    if (!this.valid(this.piece)) this.over = true;
  }
  drop() {
    while (this.move(0, 1)) this.score += 2;
    this.lock();
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const keys = input.keys;
    for (const key of input.pressed?.splice(0) ?? []) {
      if (this.over) break;
      if (key === "ArrowUp" || key === "w") this.rotate();
      else if (key === " ") this.drop();
      else if (key === "ArrowLeft" || key === "a") {
        this.move(-1, 0);
        this.horizontal = 0.16;
      } else if (key === "ArrowRight" || key === "d") {
        this.move(1, 0);
        this.horizontal = 0.16;
      }
    }
    this.horizontal -= dt;
    if (this.horizontal <= 0) {
      const dx =
        (keys.has("ArrowRight") || keys.has("d") ? 1 : 0) -
        (keys.has("ArrowLeft") || keys.has("a") ? 1 : 0);
      if (dx) {
        this.move(dx, 0);
        this.horizontal = 0.11;
      }
    }
    this.gravity += dt;
    const soft = keys.has("ArrowDown") || keys.has("s");
    const interval = soft
      ? 0.045
      : Math.max(0.08, 0.7 * Math.pow(0.83, this.level - 1));
    if (this.gravity >= interval) {
      this.gravity = 0;
      if (!this.move(0, 1)) this.lock();
      else if (soft) this.score++;
    }
    this.status = `${this.lines} líneas · Nivel ${this.level}`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#1d2937";
    c.fillRect(0, 0, 400, 600);
    const ox = 26,
      oy = 50,
      s = 25;
    c.fillStyle = "#12202b";
    c.fillRect(ox - 2, oy - 2, 254, 504);
    c.strokeStyle = "#526170";
    c.strokeRect(ox - 2, oy - 2, 254, 504);
    const block = (x: number, y: number, t: number, ghost = false) => {
      if (y < 0) return;
      c.fillStyle = colors[t];
      c.strokeStyle = colors[t];
      if (ghost) {
        c.globalAlpha = 0.35;
        c.strokeRect(ox + x * s + 2, oy + y * s + 2, s - 4, s - 4);
        c.globalAlpha = 1;
      } else {
        c.fillRect(ox + x * s + 1, oy + y * s + 1, s - 2, s - 2);
        c.fillStyle = "#ffffff30";
        c.fillRect(ox + x * s + 3, oy + y * s + 3, s - 6, 3);
      }
    };
    for (let y = 0; y < 20; y++)
      for (let x = 0; x < 10; x++) {
        if (this.grid[y][x]) block(x, y, this.grid[y][x] - 1);
        else {
          c.fillStyle = "#ffffff08";
          c.fillRect(ox + x * s + 12, oy + y * s + 12, 1, 1);
        }
      }
    const ghost = { ...this.piece };
    while (this.valid({ ...ghost, y: ghost.y + 1 })) ghost.y++;
    for (const [p, isGhost] of [
      [ghost, true],
      [this.piece, false],
    ] as const)
      for (let y = 0; y < p.shape.length; y++)
        for (let x = 0; x < p.shape[y].length; x++)
          if (p.shape[y][x]) block(p.x + x, p.y + y, p.type, isGhost);
    label(c, "SIGUIENTE", 335, 95, "#9eb2bd", 12);
    shapes[this.next].forEach((r, y) =>
      r.forEach((v, x) => {
        if (v) {
          c.fillStyle = colors[this.next];
          c.fillRect(294 + x * 23, 120 + y * 23, 21, 21);
        }
      }),
    );
    label(c, `NIVEL ${this.level}`, 335, 250, "#d4c29c", 15);
    label(c, `${this.lines} LÍNEAS`, 335, 280, "#a2b4bf", 13);
  }
}
