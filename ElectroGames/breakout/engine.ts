import type { Engine, Input } from "../../src/shared/Arcade";
export type Brick = { x: number; y: number; alive: boolean; row: number };
export class BreakoutEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  lives = 3;
  status = "3 vidas";
  x = 400;
  y = 480;
  vx = 185;
  vy = -285;
  paddle = 400;
  delay = 0.65;
  trail: { x: number; y: number }[] = [];
  bricks: Brick[] = Array.from({ length: 50 }, (_, i) => ({
    x: 50 + (i % 10) * 70,
    y: 72 + Math.floor(i / 10) * 29,
    alive: true,
    row: Math.floor(i / 10),
  }));
  update(dt: number, input: Input) {
    const k = input.keys;
    if (input.pointer !== null) this.paddle = input.pointer;
    else
      this.paddle +=
        ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
          (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
        490 *
        dt;
    this.paddle = Math.max(62, Math.min(738, this.paddle));
    this.status = `${this.lives} ${this.lives === 1 ? "vida" : "vidas"} · ${this.bricks.filter((b) => b.alive).length} bloques`;
    if (this.delay > 0) {
      this.delay -= dt;
      this.x = this.paddle;
      this.y = 510;
      return;
    }
    this.trail.unshift({ x: this.x, y: this.y });
    this.trail.length = Math.min(8, this.trail.length);
    // Substeps keep the ball from crossing thin bricks on slow frames.
    for (let n = 0; n < 4; n++) {
      const oldY = this.y;
      this.x += (this.vx * dt) / 4;
      this.y += (this.vy * dt) / 4;
      if (this.x < 19) {
        this.x = 19;
        this.vx = Math.abs(this.vx);
      }
      if (this.x > 781) {
        this.x = 781;
        this.vx = -Math.abs(this.vx);
      }
      if (this.y < 19) {
        this.y = 19;
        this.vy = Math.abs(this.vy);
      }
      if (
        this.vy > 0 &&
        this.y + 8 >= 535 &&
        oldY + 8 <= 535 &&
        Math.abs(this.x - this.paddle) < 69
      ) {
        this.y = 526;
        const a = (this.x - this.paddle) / 65;
        this.vx = a * 310;
        this.vy = -Math.sqrt(360 ** 2 - this.vx ** 2);
      }
      for (const b of this.bricks) {
        if (
          b.alive &&
          this.x + 8 > b.x &&
          this.x - 8 < b.x + 64 &&
          this.y + 8 > b.y &&
          this.y - 8 < b.y + 22
        ) {
          b.alive = false;
          this.score += (5 - b.row) * 10;
          if (oldY + 8 <= b.y || oldY - 8 >= b.y + 22) this.vy *= -1;
          else this.vx *= -1;
          break;
        }
      }
      if (this.y > 620) {
        this.lives--;
        if (!this.lives) {
          this.over = true;
          return;
        }
        this.delay = 0.75;
        this.vx = 185;
        this.vy = -285;
        this.trail = [];
        return;
      }
      if (this.bricks.every((b) => !b.alive)) {
        this.won = true;
        this.over = true;
        return;
      }
    }
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#172437";
    c.fillRect(0, 0, 800, 600);
    c.strokeStyle = "#ffffff07";
    for (let x = 0; x < 800; x += 40) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 600);
      c.stroke();
    }
    const colors = ["#e8a69c", "#eab984", "#e3d796", "#9abfba", "#89a9c9"];
    for (const b of this.bricks)
      if (b.alive) {
        c.fillStyle = colors[b.row];
        c.beginPath();
        c.roundRect(b.x, b.y, 64, 22, 3);
        c.fill();
        c.fillStyle = "#ffffff35";
        c.fillRect(b.x + 3, b.y + 3, 58, 3);
      }
    this.trail.forEach((p, i) => {
      c.fillStyle = `rgba(242,218,169,${(8 - i) / 40})`;
      c.beginPath();
      c.arc(p.x, p.y, 8 - i * 0.65, 0, 7);
      c.fill();
    });
    c.fillStyle = "#f5ddb4";
    c.shadowBlur = 16;
    c.shadowColor = "#f5ddb4";
    c.beginPath();
    c.arc(this.x, this.y, 8, 0, 7);
    c.fill();
    c.shadowBlur = 0;
    c.fillStyle = "#dce6ee";
    c.beginPath();
    c.roundRect(this.paddle - 62, 535, 124, 13, 6);
    c.fill();
    c.fillStyle = "#829caf";
    c.fillRect(this.paddle - 44, 548, 88, 3);
  }
}
