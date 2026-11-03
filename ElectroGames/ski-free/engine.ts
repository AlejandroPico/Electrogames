import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Obstacle = { x: number; y: number; kind: number };
export class SkiEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  distance = 0;
  bonus = 0;
  player = 400;
  jump = 0;
  safe = 1;
  timer = 0.3;
  obstacles: Obstacle[] = [];
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      tap = input.pressed?.includes(" ");
    input.pressed?.splice(0);
    const speed = 155 + Math.min(100, this.distance / 40);
    this.distance += speed * dt;
    this.timer -= dt;
    this.safe -= dt;
    this.jump = Math.max(0, this.jump - dt);
    this.player +=
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      300 *
      dt;
    if (input.pointer !== null) this.player = input.pointer;
    this.player = Math.max(75, Math.min(725, this.player));
    if (tap && this.jump <= 0) this.jump = 0.85;
    if (this.timer <= 0) {
      this.timer = 0.55;
      this.obstacles.push({
        x: 90 + Math.random() * 620,
        y: -40,
        kind: Math.random() < 0.16 ? 2 : Math.random() < 0.7 ? 0 : 1,
      });
    }
    for (const o of this.obstacles) {
      o.y += speed * dt;
      if (Math.abs(o.x - this.player) < 26 && Math.abs(o.y - 460) < 25) {
        if (o.kind === 2) {
          this.jump = 1.1;
          this.bonus += 50;
          o.y = 700;
        } else if (this.safe <= 0 && this.jump <= 0) {
          this.lives--;
          this.safe = 1.7;
          o.y = 700;
          if (!this.lives) this.over = true;
        }
      }
    }
    this.obstacles = this.obstacles.filter((o) => o.y < 650);
    this.score = Math.floor(this.distance / 10) + this.bonus;
    if (this.distance >= 5000) this.won = this.over = true;
    this.status = `${this.lives} vidas · ${Math.floor(this.distance)}/5000 m`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#dbe5e1";
    c.fillRect(0, 0, 800, 600);
    c.strokeStyle = "#b6c9c7";
    c.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      const x = (i * 77) % 800,
        y = (i * 91 + this.distance) % 650;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x - 12, y + 35);
      c.stroke();
    }
    for (const o of this.obstacles) {
      if (o.kind === 0) {
        c.fillStyle = "#6e927e";
        c.beginPath();
        c.moveTo(o.x, o.y - 35);
        c.lineTo(o.x - 23, o.y + 9);
        c.lineTo(o.x + 23, o.y + 9);
        c.closePath();
        c.fill();
        c.fillStyle = "#8a7358";
        c.fillRect(o.x - 4, o.y + 8, 8, 16);
      } else if (o.kind === 1) {
        c.fillStyle = "#91a4a6";
        c.beginPath();
        c.ellipse(o.x, o.y, 22, 14, 0, 0, 7);
        c.fill();
      } else {
        c.fillStyle = "#bb9271";
        c.beginPath();
        c.moveTo(o.x - 28, o.y + 12);
        c.lineTo(o.x + 28, o.y + 12);
        c.lineTo(o.x + 28, o.y - 12);
        c.closePath();
        c.fill();
      }
    }
    c.fillStyle = "#a3b6b5";
    c.beginPath();
    c.ellipse(this.player, 474, 20, 7, 0, 0, 7);
    c.fill();
    const y =
      460 -
      (this.jump > 0 ? Math.sin((this.jump / 0.85) * Math.PI) * 20 + 20 : 0);
    if (this.safe <= 0 || Math.floor(this.safe * 9) % 2 === 0) {
      c.strokeStyle = "#657f8c";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(this.player - 8, y - 4);
      c.lineTo(this.player - 15, y + 25);
      c.moveTo(this.player + 7, y - 4);
      c.lineTo(this.player + 2, y + 25);
      c.stroke();
      c.fillStyle = "#b98576";
      c.fillRect(this.player - 10, y - 22, 20, 24);
      c.fillStyle = "#eed4ae";
      c.beginPath();
      c.arc(this.player, y - 28, 9, 0, 7);
      c.fill();
    }
    label(c, "META: 5000 m", 400, 35, "#526e71", 14);
  }
}
