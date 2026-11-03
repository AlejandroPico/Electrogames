import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Prize = { x: number; y: number; value: number; color: string };
export class ClawEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  attempts = 6;
  caught = 0;
  x = 400;
  y = 110;
  phase: "ready" | "down" | "up" | "return" | "drop" = "ready";
  prizes: Prize[] = Array.from({ length: 7 }, (_, i) => ({
    x: 230 + i * 66,
    y: 494,
    value: 100 + (i % 3) * 50,
    color: ["#c3b3c7", "#deb181", "#99bcb1"][i % 3],
  }));
  held: Prize | null = null;
  grab() {
    if (this.phase === "ready") {
      this.attempts--;
      this.phase = "down";
    }
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      taps = input.pressed?.splice(0) ?? [];
    if (this.phase === "ready") {
      this.x +=
        ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
          (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
        220 *
        dt;
      if (input.pointer !== null) this.x = input.pointer;
      this.x = Math.max(210, Math.min(690, this.x));
      if (taps.includes(" ")) this.grab();
    } else if (this.phase === "down") {
      this.y = Math.min(475, this.y + 220 * dt);
      if (this.y >= 475) {
        const i = this.prizes.findIndex((p) => Math.abs(p.x - this.x) < 17);
        if (i >= 0) this.held = this.prizes.splice(i, 1)[0];
        this.phase = "up";
      }
    } else if (this.phase === "up") {
      this.y = Math.max(110, this.y - 195 * dt);
      if (this.y === 110) this.phase = this.held ? "return" : "drop";
    } else if (this.phase === "return") {
      this.x = Math.max(143, this.x - 230 * dt);
      if (this.x === 143) this.phase = "drop";
    } else {
      if (this.held) {
        this.held.y += 340 * dt;
        if (this.held.y >= 530) {
          this.score += this.held.value;
          this.caught++;
          this.held = null;
        }
      }
      if (!this.held) {
        if (this.caught >= 3) this.won = this.over = true;
        else if (!this.attempts) this.over = true;
        else {
          this.x = 400;
          this.y = 110;
          this.phase = "ready";
        }
      }
    }
    if (this.held && this.phase !== "drop") {
      this.held.x = this.x;
      this.held.y = this.y + 32;
    }
    this.status = `${this.caught}/3 premios · ${this.attempts} intentos · ${this.phase === "ready" ? "Apunta y baja la pinza" : "Pinza en movimiento"}`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#293b4c";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#8c9ca7";
    c.fillRect(80, 35, 640, 535);
    c.fillStyle = "#34515e";
    c.fillRect(95, 50, 610, 490);
    c.strokeStyle = "#b4c5c3";
    c.lineWidth = 4;
    c.strokeRect(95, 50, 610, 490);
    c.fillStyle = "#183542";
    c.fillRect(105, 445, 80, 95);
    label(c, "SALIDA", 145, 566, "#c8d1bd", 12);
    c.strokeStyle = "#758d97";
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(105, 85);
    c.lineTo(690, 85);
    c.stroke();
    const prize = (p: Prize) => {
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(p.x - 15, p.y - 19, 12, 0, 7);
      c.arc(p.x + 15, p.y - 19, 12, 0, 7);
      c.ellipse(p.x, p.y, 26, 30, 0, 0, 7);
      c.fill();
      c.fillStyle = "#37515a";
      c.beginPath();
      c.arc(p.x - 8, p.y - 5, 3, 0, 7);
      c.arc(p.x + 8, p.y - 5, 3, 0, 7);
      c.fill();
    };
    for (const p of this.prizes) prize(p);
    if (this.held) prize(this.held);
    c.strokeStyle = "#d0d7cd";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(this.x, 85);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.lineWidth = 5;
    const closed = this.phase !== "ready" && this.phase !== "down";
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.x - (closed ? 15 : 26), this.y + 20);
    c.lineTo(this.x - (closed ? 7 : 20), this.y + 35);
    c.moveTo(this.x, this.y);
    c.lineTo(this.x + (closed ? 15 : 26), this.y + 20);
    c.lineTo(this.x + (closed ? 7 : 20), this.y + 35);
    c.stroke();
  }
}
