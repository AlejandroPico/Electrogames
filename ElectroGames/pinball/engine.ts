import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Segment = { ax: number; ay: number; bx: number; by: number };
export const rails: Segment[] = [
  { ax: 82, ay: 420, bx: 82, by: 90 },
  { ax: 82, ay: 90, bx: 170, by: 35 },
  { ax: 170, ay: 35, bx: 630, by: 35 },
  { ax: 630, ay: 35, bx: 718, by: 90 },
  { ax: 718, ay: 90, bx: 718, by: 420 },
  { ax: 82, ay: 420, bx: 260, by: 530 },
  { ax: 718, ay: 420, bx: 540, by: 530 },
  { ax: 150, ay: 340, bx: 235, by: 440 },
  { ax: 650, ay: 340, bx: 565, by: 440 },
];
export class PinballEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  balls = 3;
  waiting = true;
  ball = { x: 670, y: 490, vx: 0, vy: 0 };
  left = 0;
  right = 0;
  cooldowns = [0, 0, 0];
  bumpers = [
    { x: 270, y: 170, r: 29 },
    { x: 530, y: 170, r: 29 },
    { x: 400, y: 280, r: 33 },
  ];
  flipper(left: boolean): Segment {
    const strength = left ? this.left : this.right,
      a = left ? 0.36 - strength * 0.94 : Math.PI - 0.36 + strength * 0.94;
    const ax = left ? 265 : 535,
      ay = 520;
    return { ax, ay, bx: ax + Math.cos(a) * 105, by: ay + Math.sin(a) * 105 };
  }
  collide(s: Segment, boost = 0) {
    const b = this.ball,
      dx = s.bx - s.ax,
      dy = s.by - s.ay,
      t = Math.max(
        0,
        Math.min(
          1,
          ((b.x - s.ax) * dx + (b.y - s.ay) * dy) / (dx * dx + dy * dy),
        ),
      );
    const x = s.ax + dx * t,
      y = s.ay + dy * t,
      dist = Math.hypot(b.x - x, b.y - y),
      radius = boost ? 15 : 11;
    if (dist >= radius) return;
    let nx = (b.x - x) / (dist || 1),
      ny = (b.y - y) / (dist || 1);
    if (!dist) {
      nx = dy / Math.hypot(dx, dy);
      ny = -dx / Math.hypot(dx, dy);
    }
    b.x = x + nx * (radius + 0.1);
    b.y = y + ny * (radius + 0.1);
    const dot = b.vx * nx + b.vy * ny;
    if (dot < 0) {
      b.vx -= 1.82 * dot * nx;
      b.vy -= 1.82 * dot * ny;
      if (boost) {
        b.vy = Math.min(b.vy, -340 - boost * 160);
        b.vx += (400 - b.x) * 0.8;
      }
    }
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys;
    const l = k.has("z") || k.has("ArrowLeft"),
      r = k.has("x") || k.has("ArrowRight");
    this.left = Math.max(0, Math.min(1, this.left + (l ? 9 : -7) * dt));
    this.right = Math.max(0, Math.min(1, this.right + (r ? 9 : -7) * dt));
    const launch = input.pressed?.indexOf(" ") ?? -1;
    if (launch >= 0) input.pressed!.splice(launch, 1);
    if (this.waiting) {
      this.status = `${this.balls} bolas · Espacio para lanzar`;
      if (launch >= 0 || k.has(" ")) {
        this.waiting = false;
        this.ball.vx = -190;
        this.ball.vy = -610;
      }
      return;
    }
    for (let i = 0; i < 3; i++)
      this.cooldowns[i] = Math.max(0, this.cooldowns[i] - dt);
    for (let n = 0; n < 6; n++) {
      const b = this.ball;
      b.vy += (330 * dt) / 6;
      b.x += (b.vx * dt) / 6;
      b.y += (b.vy * dt) / 6;
      for (const rail of rails) this.collide(rail);
      this.collide(this.flipper(true), l ? this.left : 0);
      this.collide(this.flipper(false), r ? this.right : 0);
      this.bumpers.forEach((p, i) => {
        const d = Math.hypot(b.x - p.x, b.y - p.y),
          radius = p.r + 9;
        if (d < radius) {
          const nx = (b.x - p.x) / (d || 1),
            ny = (b.y - p.y) / (d || 1);
          b.x = p.x + nx * (radius + 0.2);
          b.y = p.y + ny * (radius + 0.2);
          b.vx = nx * 440;
          b.vy = ny * 440;
          if (!this.cooldowns[i]) {
            this.score += 100;
            this.cooldowns[i] = 0.18;
          }
        }
      });
      const speed = Math.hypot(b.vx, b.vy);
      if (speed > 780) {
        b.vx *= 780 / speed;
        b.vy *= 780 / speed;
      }
      if (b.y > 620 || b.x < 50 || b.x > 750) {
        this.balls--;
        if (!this.balls) this.over = true;
        else {
          this.waiting = true;
          this.ball = { x: 670, y: 490, vx: 0, vy: 0 };
        }
        return;
      }
    }
    this.status = `${this.balls} bolas · ${Math.floor(this.score / 100)} rebotes`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#1b293a";
    c.fillRect(0, 0, 800, 600);
    c.beginPath();
    c.moveTo(80, 600);
    c.lineTo(80, 90);
    c.quadraticCurveTo(80, 30, 175, 30);
    c.lineTo(625, 30);
    c.quadraticCurveTo(720, 30, 720, 90);
    c.lineTo(720, 600);
    c.closePath();
    c.fillStyle = "#233d4a";
    c.fill();
    c.strokeStyle = "#98aeb2";
    c.lineWidth = 7;
    c.lineCap = "round";
    for (const s of rails) {
      c.beginPath();
      c.moveTo(s.ax, s.ay);
      c.lineTo(s.bx, s.by);
      c.stroke();
    }
    this.bumpers.forEach((p, i) => {
      c.fillStyle = this.cooldowns[i]
        ? "#f4ddb0"
        : i === 2
          ? "#d4ac7b"
          : "#9eb9af";
      c.strokeStyle = "#e5d9b7";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(p.x, p.y, p.r, 0, 7);
      c.fill();
      c.stroke();
      c.strokeStyle = "#1c414e";
      c.beginPath();
      c.arc(p.x, p.y, p.r - 9, 0, 7);
      c.stroke();
      label(c, "100", p.x, p.y + 5, "#294652", 14);
    });
    c.strokeStyle = "#63848e";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(230, 340);
    c.lineTo(400, 400);
    c.lineTo(570, 340);
    c.stroke();
    for (const left of [true, false]) {
      const s = this.flipper(left);
      c.strokeStyle = left ? "#e3b487" : "#b2c8b1";
      c.lineWidth = 18;
      c.beginPath();
      c.moveTo(s.ax, s.ay);
      c.lineTo(s.bx, s.by);
      c.stroke();
      c.fillStyle = "#617b82";
      c.beginPath();
      c.arc(s.ax, s.ay, 6, 0, 7);
      c.fill();
    }
    c.fillStyle = "#e6e3d3";
    c.shadowBlur = 12;
    c.shadowColor = "#e6e3d3";
    c.beginPath();
    c.arc(this.ball.x, this.ball.y, 9, 0, 7);
    c.fill();
    c.shadowBlur = 0;
    label(c, this.waiting ? "LANZAR: ESPACIO" : "", 400, 460, "#a4b9c1", 12);
  }
}
