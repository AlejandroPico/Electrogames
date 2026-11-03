import type { Engine, Input } from "../../src/shared/Arcade";
export class PongEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  opponent = 0;
  status = "Tú 0 · CPU 0";
  x = 400;
  y = 300;
  vx = 295;
  vy = 130;
  player = 300;
  ai = 300;
  delay = 0.75;
  update(dt: number, input: Input) {
    const k = input.keys;
    const movement =
      (k.has("ArrowDown") || k.has("s") ? 1 : 0) -
      (k.has("ArrowUp") || k.has("w") ? 1 : 0);
    if (movement) this.player += movement * 440 * dt;
    else if (input.pointerY != null) this.player = input.pointerY;
    this.player = Math.max(62, Math.min(538, this.player));
    const target = this.vx > 0 ? this.y : 300;
    this.ai += Math.max(-235 * dt, Math.min(235 * dt, target - this.ai));
    this.ai = Math.max(62, Math.min(538, this.ai));
    if (this.delay > 0) {
      this.delay -= dt;
      return;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y < 18) {
      this.y = 18;
      this.vy = Math.abs(this.vy);
    }
    if (this.y > 582) {
      this.y = 582;
      this.vy = -Math.abs(this.vy);
    }
    if (
      this.vx < 0 &&
      this.x <= 49 &&
      this.x >= 30 &&
      Math.abs(this.y - this.player) < 65
    ) {
      this.x = 50;
      this.vx = Math.min(580, Math.abs(this.vx) * 1.06);
      this.vy = (this.y - this.player) * 5;
    }
    if (
      this.vx > 0 &&
      this.x >= 751 &&
      this.x <= 770 &&
      Math.abs(this.y - this.ai) < 65
    ) {
      this.x = 750;
      this.vx = -Math.min(580, Math.abs(this.vx) * 1.06);
      this.vy = (this.y - this.ai) * 5;
    }
    if (this.x < 0 || this.x > 800) {
      if (this.x > 800) this.score++;
      else this.opponent++;
      this.status = `Tú ${this.score} · CPU ${this.opponent}`;
      if (this.score === 7 || this.opponent === 7) {
        this.over = true;
        this.won = this.score === 7;
      }
      this.x = 400;
      this.y = 300;
      this.vx = (this.vx > 0 ? -1 : 1) * 295;
      this.vy = 130;
      this.delay = 0.8;
    }
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#213c49";
    c.fillRect(0, 0, 800, 600);
    c.strokeStyle = "#a6bdbe35";
    c.lineWidth = 2;
    c.setLineDash([10, 16]);
    c.beginPath();
    c.moveTo(400, 20);
    c.lineTo(400, 580);
    c.stroke();
    c.setLineDash([]);
    c.strokeRect(14, 14, 772, 572);
    c.fillStyle = "#cce1dc25";
    c.font = "110px monospace";
    c.textAlign = "center";
    c.fillText(String(this.score), 280, 140);
    c.fillText(String(this.opponent), 520, 140);
    c.fillStyle = "#bbd5cc";
    c.beginPath();
    c.roundRect(30, this.player - 55, 12, 110, 4);
    c.fill();
    c.fillStyle = "#e7bb8a";
    c.beginPath();
    c.roundRect(758, this.ai - 55, 12, 110, 4);
    c.fill();
    c.fillStyle = "#fff0cc";
    c.shadowColor = "#fff0cc";
    c.shadowBlur = 15;
    c.beginPath();
    c.arc(this.x, this.y, 8, 0, 7);
    c.fill();
    c.shadowBlur = 0;
  }
}
