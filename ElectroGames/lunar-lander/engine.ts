import type { Engine, Input } from "../../src/shared/Arcade";
import { space, label } from "../../src/shared/drawing";
export const terrain = [
  { x: 0, y: 480 },
  { x: 90, y: 430 },
  { x: 170, y: 495 },
  { x: 240, y: 455 },
  { x: 320, y: 520 },
  { x: 480, y: 520 },
  { x: 555, y: 440 },
  { x: 650, y: 475 },
  { x: 720, y: 410 },
  { x: 800, y: 465 },
];
export function ground(x: number) {
  for (let i = 1; i < terrain.length; i++)
    if (x <= terrain[i].x) {
      const a = terrain[i - 1],
        b = terrain[i];
      return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
    }
  return 465;
}
export class LanderEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  ship = { x: 190, y: 100, vx: 28, vy: 0, a: 0 };
  fuel = 100;
  thrust = false;
  landingMessage = "";
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys;
    this.ship.a +=
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      1.35 *
      dt;
    this.ship.a = Math.max(-1.1, Math.min(1.1, this.ship.a));
    this.thrust = this.fuel > 0 && (k.has("ArrowUp") || k.has("w"));
    if (this.thrust) {
      this.fuel = Math.max(0, this.fuel - 8 * dt);
      this.ship.vx += Math.sin(this.ship.a) * 75 * dt;
      this.ship.vy -= Math.cos(this.ship.a) * 75 * dt;
    }
    this.ship.vy += 28 * dt;
    this.ship.x += this.ship.vx * dt;
    this.ship.y += this.ship.vy * dt;
    if (this.ship.x < 16 || this.ship.x > 784 || this.ship.y < 15) {
      this.over = true;
      this.status = "Fuera de la zona de vuelo";
      return;
    }
    const floor = ground(this.ship.x);
    if (this.ship.y + 18 >= floor) {
      this.over = true;
      this.won =
        this.ship.x >= 335 &&
        this.ship.x <= 465 &&
        this.ship.vy <= 42 &&
        Math.abs(this.ship.vx) <= 20 &&
        Math.abs(this.ship.a) <= 0.16;
      this.landingMessage = this.won ? "Aterrizaje correcto" : "Impacto";
      this.status = this.landingMessage;
      this.score = this.won ? Math.round(500 + this.fuel * 5) : 0;
      return;
    }
    this.status = `Combustible ${Math.ceil(this.fuel)}% · V ${Math.round(this.ship.vy)} · H ${Math.round(this.ship.vx)}`;
  }
  draw(c: CanvasRenderingContext2D) {
    space(c, "#182232");
    c.beginPath();
    c.moveTo(0, 600);
    for (const p of terrain) c.lineTo(p.x, p.y);
    c.lineTo(800, 600);
    c.closePath();
    c.fillStyle = "#39414d";
    c.fill();
    c.strokeStyle = "#889397";
    c.lineWidth = 2;
    c.beginPath();
    terrain.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
    c.stroke();
    c.strokeStyle = "#c9d6a5";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(320, 520);
    c.lineTo(480, 520);
    c.stroke();
    label(c, "ZONA DE ATERRIZAJE", 400, 555, "#c9d6a5", 11);
    label(c, "V ≤ 42 · |H| ≤ 20 · NAVE VERTICAL", 400, 575, "#8d9da8", 10);
    c.save();
    c.translate(this.ship.x, this.ship.y);
    c.rotate(this.ship.a);
    if (this.thrust) {
      c.fillStyle = "#edb77f";
      c.beginPath();
      c.moveTo(-6, 10);
      c.lineTo(0, 32);
      c.lineTo(6, 10);
      c.fill();
    }
    c.fillStyle = "#c4c6b7";
    c.strokeStyle = "#e9d5ad";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-13, 8);
    c.lineTo(-10, -11);
    c.lineTo(0, -18);
    c.lineTo(10, -11);
    c.lineTo(13, 8);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = "#678b9c";
    c.fillRect(-5, -11, 10, 7);
    c.beginPath();
    c.moveTo(-9, 6);
    c.lineTo(-19, 18);
    c.lineTo(-24, 18);
    c.moveTo(9, 6);
    c.lineTo(19, 18);
    c.lineTo(24, 18);
    c.stroke();
    c.restore();
  }
}
