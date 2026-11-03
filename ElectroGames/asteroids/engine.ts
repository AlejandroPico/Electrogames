import type { Engine, Input } from "../../src/shared/Arcade";
import { space, label } from "../../src/shared/drawing";
type Rock = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  spin: number;
};
type Bullet = { x: number; y: number; vx: number; vy: number; life: number };
export class AsteroidsEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  wave = 1;
  ship = { x: 400, y: 300, vx: 0, vy: 0, a: -Math.PI / 2 };
  invulnerable = 2;
  cooldown = 0;
  rocks: Rock[] = [];
  bullets: Bullet[] = [];
  thrust = false;
  constructor() {
    this.spawn();
  }
  spawn() {
    this.rocks = Array.from({ length: 3 + this.wave }, (_, i) => ({
      x: i % 2 ? 760 : 40,
      y: 60 + ((i * 119) % 480),
      vx: (i % 2 ? -1 : 1) * (40 + this.wave * 8),
      vy: ((i % 3) - 1) * 45,
      r: 38,
      spin: i * 0.7,
    }));
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys;
    const fire = k.has(" ") || !!input.pressed?.includes(" ");
    input.pressed?.splice(0);
    this.ship.a +=
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      3.6 *
      dt;
    this.thrust = k.has("ArrowUp") || k.has("w");
    if (this.thrust) {
      this.ship.vx += Math.cos(this.ship.a) * 230 * dt;
      this.ship.vy += Math.sin(this.ship.a) * 230 * dt;
    }
    const speed = Math.hypot(this.ship.vx, this.ship.vy);
    if (speed > 330) {
      this.ship.vx *= 330 / speed;
      this.ship.vy *= 330 / speed;
    }
    this.ship.vx *= Math.pow(0.985, dt * 60);
    this.ship.vy *= Math.pow(0.985, dt * 60);
    this.ship.x = (this.ship.x + this.ship.vx * dt + 800) % 800;
    this.ship.y = (this.ship.y + this.ship.vy * dt + 600) % 600;
    this.cooldown -= dt;
    this.invulnerable -= dt;
    if (fire && this.cooldown <= 0) {
      this.cooldown = 0.19;
      this.bullets.push({
        x: this.ship.x + Math.cos(this.ship.a) * 20,
        y: this.ship.y + Math.sin(this.ship.a) * 20,
        vx: Math.cos(this.ship.a) * 500 + this.ship.vx,
        vy: Math.sin(this.ship.a) * 500 + this.ship.vy,
        life: 1.15,
      });
    }
    for (const r of this.rocks) {
      r.x = (r.x + r.vx * dt + 800) % 800;
      r.y = (r.y + r.vy * dt + 600) % 600;
      r.spin += dt * 0.3;
    }
    for (const b of this.bullets) {
      b.x = (b.x + b.vx * dt + 800) % 800;
      b.y = (b.y + b.vy * dt + 600) % 600;
      b.life -= dt;
      if (b.life <= 0) continue;
      const i = this.rocks.findIndex((r) => this.distance(r, b) < r.r);
      if (i >= 0) {
        const r = this.rocks.splice(i, 1)[0];
        b.life = 0;
        this.score += r.r > 25 ? 100 : 200;
        if (r.r > 25)
          for (const d of [-1, 1])
            this.rocks.push({
              x: r.x,
              y: r.y,
              vx: r.vx + d * 60,
              vy: r.vy - d * 50,
              r: 20,
              spin: d,
            });
      }
    }
    this.bullets = this.bullets.filter((b) => b.life > 0);
    if (
      this.invulnerable <= 0 &&
      this.rocks.some((r) => this.distance(r, this.ship) < r.r + 11)
    ) {
      this.lives--;
      if (!this.lives) {
        this.over = true;
        return;
      }
      this.ship = { x: 400, y: 300, vx: 0, vy: 0, a: -Math.PI / 2 };
      this.invulnerable = 2.5;
    }
    if (!this.rocks.length) {
      if (this.wave === 5) {
        this.won = this.over = true;
      } else {
        this.wave++;
        this.spawn();
        this.invulnerable = 2;
      }
    }
    this.status = `${this.lives} vidas · Oleada ${this.wave}/5`;
  }
  distance(a: { x: number; y: number }, b: { x: number; y: number }) {
    const dx = Math.abs(a.x - b.x),
      dy = Math.abs(a.y - b.y);
    return Math.hypot(Math.min(dx, 800 - dx), Math.min(dy, 600 - dy));
  }
  draw(c: CanvasRenderingContext2D) {
    space(c);
    c.lineWidth = 2;
    for (const r of this.rocks) {
      c.save();
      c.translate(r.x, r.y);
      c.rotate(r.spin);
      c.strokeStyle = r.r > 25 ? "#b0c1cb" : "#d3ae85";
      c.fillStyle = "#283644";
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5,
          rr = r.r * (0.78 + (i % 3) * 0.1);
        const x = Math.cos(a) * rr,
          y = Math.sin(a) * rr;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.closePath();
      c.fill();
      c.stroke();
      c.restore();
    }
    c.fillStyle = "#f1d9a6";
    for (const b of this.bullets) {
      c.beginPath();
      c.arc(b.x, b.y, 2.5, 0, 7);
      c.fill();
    }
    if (this.invulnerable <= 0 || Math.floor(this.invulnerable * 8) % 2 === 0) {
      c.save();
      c.translate(this.ship.x, this.ship.y);
      c.rotate(this.ship.a);
      c.fillStyle = "#90bdb5";
      c.strokeStyle = "#cfe4da";
      c.beginPath();
      c.moveTo(19, 0);
      c.lineTo(-13, -12);
      c.lineTo(-7, 0);
      c.lineTo(-13, 12);
      c.closePath();
      c.fill();
      c.stroke();
      if (this.thrust) {
        c.fillStyle = "#e5b078";
        c.beginPath();
        c.moveTo(-10, -5);
        c.lineTo(-25, 0);
        c.lineTo(-10, 5);
        c.fill();
      }
      c.restore();
    }
    label(c, `OLEADA ${this.wave}`, 400, 30, "#6f8797", 11);
  }
}
