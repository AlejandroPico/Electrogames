import type { Engine, Input } from "../../src/shared/Arcade";
type Pipe = { x: number; gap: number; scored: boolean };
export class FlappyEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  y = 280;
  vy = 0;
  pipes: Pipe[] = [];
  timer = 0.8;
  clock = 0;
  flap() {
    this.vy = -295;
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.clock += dt;
    const taps = input.pressed?.splice(0) ?? [];
    if (taps.includes(" ") || taps.includes("ArrowUp") || taps.includes("w"))
      this.flap();
    this.vy += 725 * dt;
    this.y += this.vy * dt;
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 1.5;
      this.pipes.push({
        x: 830,
        gap: 180 + Math.random() * 215,
        scored: false,
      });
    }
    const gap = Math.max(145, 190 - this.score * 2);
    for (const p of this.pipes) {
      p.x -= (165 + this.score * 3) * dt;
      if (!p.scored && p.x + 60 < 175) {
        p.scored = true;
        this.score++;
      }
      if (
        p.x < 206 &&
        p.x + 60 > 174 &&
        (this.y - 13 < p.gap - gap / 2 || this.y + 13 > p.gap + gap / 2)
      )
        this.over = true;
    }
    this.pipes = this.pipes.filter((p) => p.x > -80);
    if (this.y < 28 || this.y > 550) this.over = true;
    if (this.score >= 20) this.won = this.over = true;
    this.status = `${this.score}/20 pasos`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#adc5c8";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#c8d7c8";
    for (let i = 0; i < 6; i++) {
      const x = ((((i * 190 - this.clock * 18) % 1100) + 1100) % 1100) - 150;
      c.beginPath();
      c.ellipse(x, 100 + (i % 3) * 50, 70, 20, 0, 0, 7);
      c.fill();
    }
    const gap = Math.max(145, 190 - this.score * 2);
    for (const p of this.pipes) {
      c.fillStyle = "#6f957c";
      c.fillRect(p.x, 0, 60, p.gap - gap / 2);
      c.fillRect(p.x, p.gap + gap / 2, 60, 560 - p.gap - gap / 2);
      c.fillStyle = "#9cba8f";
      c.fillRect(p.x - 5, p.gap - gap / 2 - 18, 70, 18);
      c.fillRect(p.x - 5, p.gap + gap / 2, 70, 18);
    }
    c.fillStyle = "#c0bc8a";
    c.fillRect(0, 565, 800, 35);
    c.fillStyle = "#879e75";
    c.fillRect(0, 556, 800, 10);
    c.save();
    c.translate(190, this.y);
    c.rotate(Math.max(-0.35, Math.min(0.8, this.vy / 500)));
    c.fillStyle = "#dfc17b";
    c.beginPath();
    c.ellipse(0, 0, 20, 15, 0, 0, 7);
    c.fill();
    c.fillStyle = "#bda06f";
    c.beginPath();
    c.ellipse(-7, 5, 10, 6, Math.sin(this.clock * 20) * 0.5, 0, 7);
    c.fill();
    c.fillStyle = "#f4eed5";
    c.beginPath();
    c.arc(8, -6, 7, 0, 7);
    c.fill();
    c.fillStyle = "#31444e";
    c.fillRect(10, -8, 3, 5);
    c.fillStyle = "#c88c6a";
    c.beginPath();
    c.moveTo(17, -1);
    c.lineTo(31, 3);
    c.lineTo(17, 7);
    c.fill();
    c.restore();
  }
}
