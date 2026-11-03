import type { Engine, Input } from "../../src/shared/Arcade";
const W = 15,
  H = 11,
  S = 44,
  OX = 70,
  OY = 58;
type Pos = { x: number; y: number };
type Bomb = Pos & { time: number };
export class BomberEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  time = 150;
  player = { x: 1, y: 1 };
  safe = 1.5;
  repeat = 0;
  enemyTimer = 0;
  board: number[][] = [];
  bombs: Bomb[] = [];
  fire: { x: number; y: number; time: number }[] = [];
  enemies: Pos[] = [
    { x: 13, y: 9 },
    { x: 13, y: 1 },
    { x: 1, y: 9 },
  ];
  constructor() {
    for (let y = 0; y < H; y++)
      this.board.push(
        Array.from({ length: W }, (_, x) =>
          x === 0 ||
          y === 0 ||
          x === W - 1 ||
          y === H - 1 ||
          (x % 2 === 0 && y % 2 === 0)
            ? 1
            : Math.random() < 0.48
              ? 2
              : 0,
        ),
      );
    for (const p of [this.player, ...this.enemies])
      for (const [dx, dy] of [
        [0, 0],
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ])
        if (this.board[p.y + dy]?.[p.x + dx] === 2)
          this.board[p.y + dy][p.x + dx] = 0;
  }
  free(x: number, y: number) {
    return (
      this.board[y]?.[x] === 0 &&
      !this.bombs.some((b) => b.x === x && b.y === y)
    );
  }
  explode(b: Bomb) {
    this.bombs = this.bombs.filter((v) => v !== b);
    this.fire.push({ x: b.x, y: b.y, time: 0.55 });
    for (const [dx, dy] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ])
      for (let n = 1; n <= 3; n++) {
        const x = b.x + dx * n,
          y = b.y + dy * n;
        if (this.board[y]?.[x] === 1) break;
        this.fire.push({ x, y, time: 0.55 });
        const chain = this.bombs.find((v) => v.x === x && v.y === y);
        if (chain) chain.time = 0;
        if (this.board[y]?.[x] === 2) {
          this.board[y][x] = 0;
          this.score += 10;
          break;
        }
      }
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.time -= dt;
    this.safe -= dt;
    this.repeat -= dt;
    const taps = input.pressed?.splice(0) ?? [];
    if (
      taps.includes(" ") &&
      this.bombs.length < 2 &&
      !this.bombs.some((b) => b.x === this.player.x && b.y === this.player.y)
    )
      this.bombs.push({ ...this.player, time: 2.1 });
    const names = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"],
      letters = ["w", "d", "s", "a"];
    let d =
      taps
        .map((t) => Math.max(names.indexOf(t), letters.indexOf(t)))
        .find((n) => n >= 0) ?? -1;
    if (d < 0 && this.repeat <= 0)
      d = names.findIndex(
        (t, i) => input.keys.has(t) || input.keys.has(letters[i]),
      );
    if (d >= 0) {
      this.repeat = 0.13;
      const x = this.player.x + [0, 1, 0, -1][d],
        y = this.player.y + [-1, 0, 1, 0][d];
      if (this.free(x, y)) this.player = { x, y };
    }
    for (const b of [...this.bombs]) {
      b.time -= dt;
      if (b.time <= 0) this.explode(b);
    }
    for (const f of this.fire) f.time -= dt;
    this.fire = this.fire.filter((f) => f.time > 0);
    this.enemies = this.enemies.filter((e) => {
      if (this.fire.some((f) => f.x === e.x && f.y === e.y)) {
        this.score += 200;
        return false;
      }
      return true;
    });
    this.enemyTimer -= dt;
    if (this.enemyTimer <= 0) {
      this.enemyTimer = 0.4;
      for (const e of this.enemies) {
        const options = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ].filter(
          ([dx, dy]) =>
            this.free(e.x + dx, e.y + dy) &&
            !this.fire.some((f) => f.x === e.x + dx && f.y === e.y + dy),
        );
        if (options.length) {
          const [dx, dy] = options[Math.floor(Math.random() * options.length)];
          e.x += dx;
          e.y += dy;
        }
      }
    }
    if (
      this.safe <= 0 &&
      (this.fire.some((f) => f.x === this.player.x && f.y === this.player.y) ||
        this.enemies.some(
          (e) => e.x === this.player.x && e.y === this.player.y,
        ))
    ) {
      this.lives--;
      this.player = { x: 1, y: 1 };
      this.safe = 2.2;
      if (!this.lives) this.over = true;
    }
    if (!this.enemies.length && this.player.x === 13 && this.player.y === 9) {
      this.score += 500;
      this.won = this.over = true;
    }
    if (this.time <= 0) this.over = true;
    this.status = `${this.lives} vidas · ${this.enemies.length} enemigos · ${Math.ceil(this.time)} s`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#263d35";
    c.fillRect(0, 0, 800, 600);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        c.fillStyle =
          this.board[y][x] === 1
            ? "#81938c"
            : this.board[y][x] === 2
              ? "#b09170"
              : "#355949";
        c.fillRect(OX + x * S + 1, OY + y * S + 1, S - 2, S - 2);
        if (this.board[y][x] === 2) {
          c.strokeStyle = "#d2b58d";
          c.strokeRect(OX + x * S + 6, OY + y * S + 7, S - 12, S - 14);
        }
      }
    if (!this.enemies.length) {
      c.fillStyle = "#d1cf87";
      c.fillRect(OX + 13 * S + 8, OY + 9 * S + 8, 28, 28);
    }
    for (const b of this.bombs) {
      c.fillStyle = b.time < 0.6 ? "#d89674" : "#182d2d";
      c.beginPath();
      c.arc(OX + (b.x + 0.5) * S, OY + (b.y + 0.5) * S, 15, 0, 7);
      c.fill();
      c.fillStyle = "#f0cf88";
      c.fillRect(OX + (b.x + 0.5) * S - 2, OY + b.y * S + 4, 4, 9);
    }
    for (const f of this.fire) {
      c.fillStyle = "#e9b66c";
      c.fillRect(OX + f.x * S + 4, OY + f.y * S + 4, S - 8, S - 8);
    }
    for (const e of this.enemies) {
      c.fillStyle = "#cd9484";
      c.beginPath();
      c.arc(OX + (e.x + 0.5) * S, OY + (e.y + 0.5) * S, 14, 0, 7);
      c.fill();
    }
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      const x = OX + (this.player.x + 0.5) * S,
        y = OY + (this.player.y + 0.5) * S;
      c.fillStyle = "#d1e0c5";
      c.beginPath();
      c.roundRect(x - 13, y - 16, 26, 32, 8);
      c.fill();
      c.fillStyle = "#657e8f";
      c.fillRect(x - 8, y - 8, 16, 10);
    }
  }
}
