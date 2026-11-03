import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Segment = { ax: number; ay: number; bx: number; by: number };
export const rails: Segment[] = [
  { ax: 40, ay: 590, bx: 40, by: 100 },
  { ax: 40, ay: 100, bx: 115, by: 30 },
  { ax: 115, ay: 30, bx: 385, by: 30 },
  { ax: 385, ay: 30, bx: 470, by: 100 },
  { ax: 470, ay: 100, bx: 470, by: 700 },
  { ax: 438, ay: 160, bx: 438, by: 700 },
  { ax: 438, ay: 700, bx: 470, by: 700 },
  { ax: 40, ay: 590, bx: 150, by: 675 },
  { ax: 438, ay: 550, bx: 350, by: 650 },
  { ax: 100, ay: 400, bx: 156, by: 540 },
  { ax: 390, ay: 400, bx: 334, by: 540 },
];
export const LAUNCH = { x: 454, y: 655 };
export class PinballEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  balls = 3;
  waiting = true;
  inLane = true;
  ball = { ...LAUNCH, vx: 0, vy: 0 };
  left = 0;
  right = 0;
  clock = 0;
  multiplier = 1;
  cooldowns = [0, 0, 0];
  targetCooldowns = [0, 0, 0, 0];
  spinnerCooldown = 0;
  targets = [false, false, false, false];
  bumpers = [
    { x: 170, y: 180, r: 25 },
    { x: 320, y: 180, r: 25 },
    { x: 245, y: 295, r: 28 },
  ];
  flipper(left: boolean): Segment {
    const strength = left ? this.left : this.right,
      a = left ? 0.28 - strength * 0.9 : Math.PI - 0.28 + strength * 0.9;
    const ax = left ? 160 : 340,
      ay = 650;
    return { ax, ay, bx: ax + Math.cos(a) * 74, by: ay + Math.sin(a) * 74 };
  }
  collide(s: Segment, boost = 0, thickness = 4) {
    const b = this.ball,
      dx = s.bx - s.ax,
      dy = s.by - s.ay,
      len2 = dx * dx + dy * dy;
    if (!len2) return false;
    const t = Math.max(
        0,
        Math.min(1, ((b.x - s.ax) * dx + (b.y - s.ay) * dy) / len2),
      ),
      x = s.ax + dx * t,
      y = s.ay + dy * t,
      d = Math.hypot(b.x - x, b.y - y),
      radius = 7 + thickness;
    if (d >= radius) return false;
    const nx = d ? (b.x - x) / d : dy / Math.sqrt(len2),
      ny = d ? (b.y - y) / d : -dx / Math.sqrt(len2);
    b.x = x + nx * (radius + 0.1);
    b.y = y + ny * (radius + 0.1);
    const dot = b.vx * nx + b.vy * ny;
    if (dot < 0) {
      b.vx -= 1.84 * dot * nx;
      b.vy -= 1.84 * dot * ny;
    }
    if (boost > 0 && ny < 0.2) {
      b.vy = Math.min(b.vy, -470 - 160 * boost);
      b.vx += (250 - b.x) * 1.1;
    }
    return dot < 0;
  }
  resetBall() {
    this.waiting = true;
    this.inLane = true;
    this.ball = { ...LAUNCH, vx: 0, vy: 0 };
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.clock += dt;
    const k = input.keys,
      l = k.has("z") || k.has("ArrowLeft"),
      r = k.has("x") || k.has("ArrowRight");
    this.left = Math.max(0, Math.min(1, this.left + (l ? 11 : -8) * dt));
    this.right = Math.max(0, Math.min(1, this.right + (r ? 11 : -8) * dt));
    const launch = input.pressed?.includes(" ") || k.has(" ");
    input.pressed?.splice(0);
    if (this.waiting) {
      this.status = `${this.balls} bolas · Lanzador listo`;
      if (launch) {
        this.waiting = false;
        this.ball.vx = 0;
        this.ball.vy = -940;
      }
      return;
    }
    for (let i = 0; i < 3; i++)
      this.cooldowns[i] = Math.max(0, this.cooldowns[i] - dt);
    for (let i = 0; i < 4; i++)
      this.targetCooldowns[i] = Math.max(0, this.targetCooldowns[i] - dt);
    this.spinnerCooldown = Math.max(0, this.spinnerCooldown - dt);
    for (let n = 0; n < 12; n++) {
      const b = this.ball;
      b.vy += ((340 + Math.min(60, this.score / 150)) * dt) / 12;
      b.x += (b.vx * dt) / 12;
      b.y += (b.vy * dt) / 12;
      if (this.inLane && b.x < 427 && b.y < 170) this.inLane = false;
      for (const s of rails) this.collide(s);
      if (!this.inLane) this.collide({ ax: 438, ay: 160, bx: 470, by: 160 });
      this.collide(this.flipper(true), l ? this.left : 0, 8);
      this.collide(this.flipper(false), r ? this.right : 0, 8);
      this.bumpers.forEach((p, i) => {
        const d = Math.hypot(b.x - p.x, b.y - p.y);
        if (d < p.r + 7) {
          const nx = d ? (b.x - p.x) / d : 0,
            ny = d ? (b.y - p.y) / d : -1;
          b.x = p.x + nx * (p.r + 7.2);
          b.y = p.y + ny * (p.r + 7.2);
          b.vx = nx * 480;
          b.vy = ny * 480;
          if (!this.cooldowns[i]) {
            this.score += 100 * this.multiplier;
            this.cooldowns[i] = 0.16;
          }
        }
      });
      for (let i = 0; i < 4; i++) {
        const x = i < 2 ? 72 : 406,
          y = 320 + (i % 2) * 48;
        if (
          !this.targets[i] &&
          this.targetCooldowns[i] <= 0 &&
          Math.hypot(b.x - x, b.y - y) < 18
        ) {
          this.targets[i] = true;
          this.targetCooldowns[i] = 0.5;
          this.score += 200 * this.multiplier;
          b.vx = (x < 250 ? 1 : -1) * Math.max(220, Math.abs(b.vx));
          if (this.targets.every(Boolean)) {
            this.multiplier = Math.min(5, this.multiplier + 1);
            this.targets.fill(false);
            this.score += 500;
          }
        }
      }
      const a = Math.sin(this.clock * 0.8) * 0.65;
      const spinner = {
        ax: 245 - Math.cos(a) * 48,
        ay: 430 - Math.sin(a) * 48,
        bx: 245 + Math.cos(a) * 48,
        by: 430 + Math.sin(a) * 48,
      };
      if (this.collide(spinner, 0, 2) && !this.spinnerCooldown) {
        this.score += 25 * this.multiplier;
        this.spinnerCooldown = 0.2;
      }
      const speed = Math.hypot(b.vx, b.vy);
      if (speed > 1000) {
        b.vx *= 1000 / speed;
        b.vy *= 1000 / speed;
      }
      if (b.x < 47) {
        b.x = 47;
        b.vx = Math.abs(b.vx);
      }
      if (b.x > 463) {
        b.x = 463;
        b.vx = -Math.abs(b.vx);
      }
      if (b.y < 38) {
        b.y = 38;
        b.vy = Math.abs(b.vy);
      }
      if (b.y > 730) {
        this.balls--;
        if (!this.balls) this.over = true;
        else this.resetBall();
        return;
      }
    }
    this.status = `${this.balls} bolas · ×${this.multiplier} · ${this.targets.filter(Boolean).length}/4 dianas`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#172937";
    c.fillRect(0, 0, 500, 750);
    c.fillStyle = "#244653";
    c.beginPath();
    c.moveTo(40, 730);
    c.lineTo(40, 100);
    c.lineTo(115, 30);
    c.lineTo(385, 30);
    c.lineTo(470, 100);
    c.lineTo(470, 730);
    c.closePath();
    c.fill();
    c.fillStyle = "#1a3542";
    c.fillRect(439, 165, 29, 535);
    c.strokeStyle = "#9bb7b6";
    c.lineWidth = 7;
    c.lineCap = "round";
    for (const s of rails) {
      c.beginPath();
      c.moveTo(s.ax, s.ay);
      c.lineTo(s.bx, s.by);
      c.stroke();
    }
    if (!this.inLane) {
      c.strokeStyle = "#bd9b73";
      c.beginPath();
      c.moveTo(438, 160);
      c.lineTo(470, 160);
      c.stroke();
    }
    this.bumpers.forEach((p, i) => {
      c.fillStyle = this.cooldowns[i]
        ? "#ffe6a8"
        : i === 2
          ? "#d8b77b"
          : "#9fbdad";
      c.strokeStyle = "#eee2b5";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(p.x, p.y, p.r, 0, 7);
      c.fill();
      c.stroke();
      c.strokeStyle = "#345561";
      c.beginPath();
      c.arc(p.x, p.y, p.r - 8, 0, 7);
      c.stroke();
      label(c, String(100 * this.multiplier), p.x, p.y + 5, "#2a4550", 13);
    });
    for (let i = 0; i < 4; i++) {
      const x = i < 2 ? 72 : 406,
        y = 320 + (i % 2) * 48;
      c.fillStyle = this.targets[i] ? "#f7db85" : "#bc8f77";
      c.beginPath();
      c.roundRect(x - 7, y - 13, 14, 26, 4);
      c.fill();
    }
    const a = Math.sin(this.clock * 0.8) * 0.65;
    c.strokeStyle = "#81a5b3";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(245 - Math.cos(a) * 48, 430 - Math.sin(a) * 48);
    c.lineTo(245 + Math.cos(a) * 48, 430 + Math.sin(a) * 48);
    c.stroke();
    label(c, `MULTIPLICADOR ×${this.multiplier}`, 245, 92, "#d1c2a1", 12);
    label(c, "4 DIANAS → SUBE MULTIPLICADOR", 245, 565, "#9eb8bb", 10);
    for (const left of [true, false]) {
      const s = this.flipper(left);
      c.strokeStyle = left ? "#e5b184" : "#bed0af";
      c.lineWidth = 16;
      c.beginPath();
      c.moveTo(s.ax, s.ay);
      c.lineTo(s.bx, s.by);
      c.stroke();
    }
    c.strokeStyle = "#b7aa85";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(454, 685);
    c.lineTo(454, 715);
    c.stroke();
    c.fillStyle = "#f2eddb";
    c.shadowColor = "#fff4cd";
    c.shadowBlur = 10;
    c.beginPath();
    c.arc(this.ball.x, this.ball.y, 7, 0, 7);
    c.fill();
    c.shadowBlur = 0;
    if (this.waiting) label(c, "ESPACIO PARA LANZAR", 245, 595, "#d2dcd2", 12);
  }
}
