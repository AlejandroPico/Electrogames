import type { Engine, Input } from "../../src/shared/Arcade";
import { space, label } from "../../src/shared/drawing";
export const platforms = [
  { x: 45, y: 530, w: 170 },
  { x: 280, y: 430, w: 145 },
  { x: 505, y: 330, w: 140 },
  { x: 315, y: 210, w: 155 },
  { x: 610, y: 120, w: 145 },
];
export class JetpackEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  fuel = 100;
  time = 120;
  clock = 0;
  safe = 2;
  player = { x: 125, y: 500, vx: 0, vy: 0 };
  cells = [
    { x: 350, y: 393 },
    { x: 570, y: 293 },
    { x: 390, y: 173 },
    { x: 685, y: 83 },
  ];
  thrust = false;
  update(dt: number, input: Input) {
    if (this.over) return;
    this.time -= dt;
    this.clock += dt;
    this.safe -= dt;
    const k = input.keys;
    input.pressed?.splice(0);
    this.player.vx =
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      220;
    this.thrust =
      (k.has(" ") || k.has("ArrowUp") || k.has("w")) && this.fuel > 0;
    if (this.thrust) {
      this.player.vy -= 800 * dt;
      this.fuel = Math.max(0, this.fuel - 18 * dt);
    }
    this.player.vy = Math.max(-260, Math.min(380, this.player.vy + 430 * dt));
    const before = this.player.y;
    this.player.x = Math.max(
      25,
      Math.min(775, this.player.x + this.player.vx * dt),
    );
    this.player.y += this.player.vy * dt;
    if (this.player.y < 30) {
      this.player.y = 30;
      this.player.vy = 0;
    }
    if (this.player.vy >= 0)
      for (const p of platforms)
        if (
          this.player.x > p.x - 8 &&
          this.player.x < p.x + p.w + 8 &&
          before + 15 <= p.y &&
          this.player.y + 15 >= p.y
        ) {
          this.player.y = p.y - 15;
          this.player.vy = 0;
          if (!this.thrust) this.fuel = Math.min(100, this.fuel + 35 * dt);
        }
    this.cells = this.cells.filter((p) => {
      if (Math.hypot(p.x - this.player.x, p.y - this.player.y) < 25) {
        this.score += 150;
        return false;
      }
      return true;
    });
    const drones = [
      { x: 390 + Math.sin(this.clock * 0.9) * 210, y: 365 },
      { x: 430 + Math.sin(this.clock * 1.3) * 180, y: 245 },
    ];
    if (
      this.player.y > 570 ||
      (this.safe <= 0 &&
        drones.some(
          (d) => Math.hypot(d.x - this.player.x, d.y - this.player.y) < 27,
        ))
    ) {
      this.lives--;
      this.safe = 2.5;
      this.player = { x: 125, y: 500, vx: 0, vy: 0 };
      this.fuel = Math.max(50, this.fuel);
      if (!this.lives) this.over = true;
    }
    if (!this.cells.length && this.player.x > 710 && this.player.y < 120) {
      this.score += Math.floor(this.time) * 5;
      this.won = this.over = true;
    }
    if (this.time <= 0) this.over = true;
    this.status = `${this.lives} vidas · ${4 - this.cells.length}/4 baterías · Combustible ${Math.ceil(this.fuel)}%`;
  }
  draw(c: CanvasRenderingContext2D) {
    space(c, "#243341");
    c.fillStyle = "#ad7e60";
    c.fillRect(0, 578, 800, 22);
    for (const p of platforms) {
      c.fillStyle = "#657e80";
      c.fillRect(p.x, p.y, p.w, 14);
      c.fillStyle = "#9eb7a3";
      c.fillRect(p.x, p.y, p.w, 4);
    }
    for (const p of this.cells) {
      c.fillStyle = "#d5c787";
      c.fillRect(p.x - 9, p.y - 12, 18, 24);
      c.fillStyle = "#7e9a7d";
      c.fillRect(p.x - 4, p.y - 7, 8, 14);
    }
    for (const d of [
      { x: 390 + Math.sin(this.clock * 0.9) * 210, y: 365 },
      { x: 430 + Math.sin(this.clock * 1.3) * 180, y: 245 },
    ]) {
      c.fillStyle = "#b38e82";
      c.beginPath();
      c.ellipse(d.x, d.y, 22, 9, 0, 0, 7);
      c.fill();
      c.fillStyle = "#e9c193";
      c.fillRect(d.x - 4, d.y - 4, 8, 5);
    }
    c.fillStyle = this.cells.length ? "#526c70" : "#d0c88b";
    c.fillRect(715, 62, 28, 58);
    label(c, "SALIDA", 730, 50, "#cbd3ba", 10);
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      const p = this.player;
      c.fillStyle = "#d9ddd0";
      c.beginPath();
      c.roundRect(p.x - 12, p.y - 15, 24, 30, 6);
      c.fill();
      c.fillStyle = "#7099aa";
      c.fillRect(p.x - 7, p.y - 10, 14, 10);
      c.fillStyle = "#a6af9c";
      c.fillRect(p.x - 19, p.y - 3, 8, 18);
      if (this.thrust) {
        c.fillStyle = "#e0b477";
        c.beginPath();
        c.moveTo(p.x - 19, p.y + 15);
        c.lineTo(p.x - 15, p.y + 33);
        c.lineTo(p.x - 11, p.y + 15);
        c.fill();
      }
    }
  }
}
