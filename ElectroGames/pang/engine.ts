import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Ball = { x: number; y: number; vx: number; vy: number; size: number };
const radii = [48, 30, 17];
export class PangEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  stage = 1;
  time = 90;
  player = 400;
  safe = 1;
  cooldown = 0;
  balls: Ball[] = [];
  hook: { x: number; y: number; life: number } | null = null;
  constructor() {
    this.spawn();
  }
  spawn() {
    this.balls = Array.from({ length: this.stage + 1 }, (_, i) => ({
      x: 150 + (i * 500) / (this.stage + 1),
      y: 120 + (i % 2) * 60,
      vx: i % 2 ? -110 : 110,
      vy: -70,
      size: 0,
    }));
    this.time = 90;
    this.hook = null;
    this.safe = 2;
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      tap = input.pressed?.includes(" ");
    input.pressed?.splice(0);
    this.player +=
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      280 *
      dt;
    this.player = Math.max(42, Math.min(758, this.player));
    this.safe -= dt;
    this.cooldown -= dt;
    this.time -= dt;
    if (this.time <= 0) {
      this.over = true;
      return;
    }
    if ((tap || k.has(" ")) && !this.hook && this.cooldown <= 0) {
      this.hook = { x: this.player, y: 530, life: 1.1 };
      this.cooldown = 0.35;
    }
    if (this.hook) {
      this.hook.y = Math.max(30, this.hook.y - 720 * dt);
      this.hook.life -= dt;
      if (this.hook.life <= 0) this.hook = null;
    }
    for (const b of this.balls) {
      const r = radii[b.size];
      b.vy += 290 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < 30 + r) {
        b.x = 30 + r;
        b.vx = Math.abs(b.vx);
      }
      if (b.x > 770 - r) {
        b.x = 770 - r;
        b.vx = -Math.abs(b.vx);
      }
      if (b.y + r >= 540) {
        b.y = 540 - r;
        b.vy = -[440, 330, 235][b.size];
      }
      if (b.y < 30 + r) {
        b.y = 30 + r;
        b.vy = Math.abs(b.vy);
      }
      if (
        this.safe <= 0 &&
        Math.abs(this.player - b.x) < r + 12 &&
        b.y + r > 504
      ) {
        this.lives--;
        if (!this.lives) {
          this.over = true;
          return;
        }
        this.safe = 2.2;
      }
    }
    if (this.hook) {
      const i = this.balls.findIndex(
        (b) =>
          Math.abs(b.x - this.hook!.x) < radii[b.size] + 2 &&
          b.y + radii[b.size] > this.hook!.y,
      );
      if (i >= 0) {
        const b = this.balls.splice(i, 1)[0];
        this.score += [50, 30, 20][b.size];
        this.hook = null;
        if (b.size < 2)
          for (const d of [-1, 1])
            this.balls.push({
              x: b.x + d * 4,
              y: b.y,
              vx: d * (130 + b.size * 30),
              vy: -270,
              size: b.size + 1,
            });
      }
    }
    if (!this.balls.length) {
      if (this.stage === 3) this.won = this.over = true;
      else {
        this.stage++;
        this.spawn();
      }
    }
    this.status = `${this.lives} vidas · Fase ${this.stage}/3 · ${Math.ceil(this.time)} s`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#223e4d";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#405d65";
    c.beginPath();
    c.moveTo(0, 430);
    for (let x = 0; x <= 800; x += 80) c.lineTo(x, 320 + (x % 160 ? 80 : 0));
    c.lineTo(800, 600);
    c.lineTo(0, 600);
    c.fill();
    c.fillStyle = "#64775b";
    c.fillRect(30, 540, 740, 60);
    c.strokeStyle = "#acbd9b";
    c.strokeRect(30, 30, 740, 510);
    if (this.hook) {
      c.strokeStyle = "#f0d5a2";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(this.hook.x, 540);
      c.lineTo(this.hook.x, this.hook.y);
      c.stroke();
      c.beginPath();
      c.moveTo(this.hook.x - 6, this.hook.y + 8);
      c.lineTo(this.hook.x, this.hook.y);
      c.lineTo(this.hook.x + 6, this.hook.y + 8);
      c.stroke();
    }
    for (const b of this.balls) {
      c.fillStyle = ["#d0a18c", "#ddbd87", "#9bbeb4"][b.size];
      c.strokeStyle = "#f3d2b0";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(b.x, b.y, radii[b.size], 0, 7);
      c.fill();
      c.stroke();
      c.fillStyle = "#ffffff55";
      c.beginPath();
      c.arc(
        b.x - radii[b.size] * 0.3,
        b.y - radii[b.size] * 0.3,
        radii[b.size] * 0.2,
        0,
        7,
      );
      c.fill();
    }
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      c.fillStyle = "#d1d8b0";
      c.fillRect(this.player - 10, 512, 20, 27);
      c.fillStyle = "#e5bc92";
      c.beginPath();
      c.arc(this.player, 505, 10, 0, 7);
      c.fill();
    }
    label(c, "PANG", 400, 579, "#d8d5b1", 15);
  }
}
