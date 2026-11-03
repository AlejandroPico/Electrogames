import type { Engine, Input } from "../../src/shared/Arcade";
import { space } from "../../src/shared/drawing";
type Segment = { q: number; r: number; dir: number };
type Bullet = { x: number; y: number };
export class CentipedeEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  wave = 1;
  player = { x: 400, y: 540 };
  safe = 1;
  step = 0;
  cooldown = 0;
  segments: Segment[] = [];
  bullets: Bullet[] = [];
  mushrooms = new Map<string, number>();
  clock = 0;
  constructor() {
    for (let i = 0; i < 32; i++)
      this.mushrooms.set(
        `${Math.floor(Math.random() * 19)},${2 + Math.floor(Math.random() * 11)}`,
        2,
      );
    this.spawn();
  }
  spawn() {
    this.segments = Array.from({ length: 10 + this.wave * 2 }, (_, i) => ({
      q: i,
      r: 0,
      dir: 1,
    }));
    this.bullets = [];
    this.safe = 2;
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      tap = input.pressed?.includes(" ");
    input.pressed?.splice(0);
    this.clock += dt;
    this.safe -= dt;
    this.cooldown -= dt;
    this.step += dt;
    this.player.x +=
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      320 *
      dt;
    this.player.y +=
      ((k.has("ArrowDown") || k.has("s") ? 1 : 0) -
        (k.has("ArrowUp") || k.has("w") ? 1 : 0)) *
      230 *
      dt;
    this.player.x = Math.max(55, Math.min(745, this.player.x));
    this.player.y = Math.max(480, Math.min(570, this.player.y));
    if ((tap || k.has(" ")) && this.cooldown <= 0) {
      this.cooldown = 0.16;
      this.bullets.push({ x: this.player.x, y: this.player.y - 16 });
    }
    if (this.step >= 0.13 - this.wave * 0.015) {
      this.step = 0;
      for (const s of this.segments) {
        const q = s.q + s.dir;
        if (q < 0 || q >= 20 || this.mushrooms.has(`${q},${s.r}`)) {
          s.dir *= -1;
          s.r = s.r >= 15 ? 13 : s.r + 1;
        } else s.q = q;
      }
    }
    for (const b of this.bullets) {
      b.y -= 600 * dt;
      const m = [...this.mushrooms.keys()].find((key) => {
        const [q, r] = key.split(",").map(Number);
        return (
          Math.abs(65 + q * 35 - b.x) < 15 && Math.abs(60 + r * 28 - b.y) < 13
        );
      });
      if (m) {
        const hp = this.mushrooms.get(m)! - 1;
        if (hp) this.mushrooms.set(m, hp);
        else {
          this.mushrooms.delete(m);
          this.score += 5;
        }
        b.y = -100;
        continue;
      }
      const i = this.segments.findIndex(
        (s) =>
          Math.abs(65 + s.q * 35 - b.x) < 17 &&
          Math.abs(60 + s.r * 28 - b.y) < 15,
      );
      if (i >= 0) {
        const s = this.segments.splice(i, 1)[0];
        this.mushrooms.set(`${s.q},${s.r}`, 2);
        this.score += 25;
        b.y = -100;
      }
    }
    this.bullets = this.bullets.filter((b) => b.y > 20);
    const spider = {
      x: 400 + Math.sin(this.clock * 1.15) * 325,
      y: 510 + Math.sin(this.clock * 2) * 32,
    };
    if (
      this.safe <= 0 &&
      (this.segments.some(
        (s) =>
          Math.hypot(
            65 + s.q * 35 - this.player.x,
            60 + s.r * 28 - this.player.y,
          ) < 28,
      ) ||
        Math.hypot(spider.x - this.player.x, spider.y - this.player.y) < 27)
    ) {
      this.lives--;
      this.safe = 2;
      if (!this.lives) this.over = true;
    }
    if (!this.segments.length) {
      if (this.wave === 3) this.won = this.over = true;
      else {
        this.wave++;
        this.spawn();
      }
    }
    this.status = `${this.lives} vidas · Oleada ${this.wave}/3 · ${this.segments.length} segmentos`;
  }
  draw(c: CanvasRenderingContext2D) {
    space(c, "#243d35");
    for (const [key, hp] of this.mushrooms) {
      const [q, r] = key.split(",").map(Number),
        x = 65 + q * 35,
        y = 60 + r * 28;
      c.fillStyle = hp === 2 ? "#b58c76" : "#967663";
      c.beginPath();
      c.arc(x, y, 12, Math.PI, 0);
      c.fill();
      c.fillRect(x - 4, y, 8, 9);
    }
    this.segments.forEach((s, i) => {
      const x = 65 + s.q * 35,
        y = 60 + s.r * 28;
      c.fillStyle = i === 0 ? "#d1c67d" : "#9abf8d";
      c.beginPath();
      c.arc(x, y, 13, 0, 7);
      c.fill();
      c.fillStyle = "#335441";
      c.fillRect(x - 5, y - 4, 3, 4);
      c.fillRect(x + 3, y - 4, 3, 4);
    });
    const sx = 400 + Math.sin(this.clock * 1.15) * 325,
      sy = 510 + Math.sin(this.clock * 2) * 32;
    c.strokeStyle = "#c6a287";
    c.lineWidth = 3;
    for (const d of [-1, 1])
      for (let n = -1; n <= 1; n++) {
        c.beginPath();
        c.moveTo(sx, sy);
        c.lineTo(sx + d * 25, sy + n * 13);
        c.stroke();
      }
    c.fillStyle = "#c6a287";
    c.beginPath();
    c.ellipse(sx, sy, 15, 10, 0, 0, 7);
    c.fill();
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      c.fillStyle = "#c1d5b0";
      c.beginPath();
      c.moveTo(this.player.x, this.player.y - 20);
      c.lineTo(this.player.x - 18, this.player.y + 10);
      c.lineTo(this.player.x + 18, this.player.y + 10);
      c.closePath();
      c.fill();
    }
    c.fillStyle = "#f0d5a2";
    for (const b of this.bullets) c.fillRect(b.x - 2, b.y - 6, 4, 12);
  }
}
