import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
export function payout(reels: number[]) {
  return reels[0] === reels[1] && reels[1] === reels[2]
    ? reels[0] === 4
      ? 100
      : 50
    : new Set(reels).size === 2
      ? 15
      : 0;
}
export class SlotsEngine implements Engine {
  score = 100;
  over = false;
  won = false;
  status = "";
  credits = 100;
  spins = 10;
  reels = [0, 1, 2];
  result = [0, 1, 2];
  spinning = false;
  timer = 0;
  clock = 0;
  lastWin = 0;
  spin() {
    if (this.spinning || this.over || this.credits < 5) return;
    this.credits -= 5;
    this.spins--;
    this.lastWin = 0;
    this.result = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 5),
    );
    this.timer = 0;
    this.spinning = true;
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.clock += dt;
    const taps = input.pressed?.splice(0) ?? [];
    if (taps.includes(" ")) this.spin();
    if (this.spinning) {
      this.timer += dt;
      for (let i = 0; i < 3; i++)
        this.reels[i] =
          this.timer < 0.7 + i * 0.3
            ? Math.floor(this.clock * 20 + i * 2) % 5
            : this.result[i];
      if (this.timer >= 1.4) {
        this.spinning = false;
        this.reels = [...this.result];
        this.lastWin = payout(this.reels);
        this.credits += this.lastWin;
        if (!this.spins || this.credits < 5) {
          this.over = true;
          this.won = this.credits >= 100;
        }
      }
    }
    this.score = this.credits;
    this.status = `${this.credits} puntos · ${this.spins} tiradas${this.lastWin ? ` · Premio +${this.lastWin}` : ""}`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#392f3f";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#a68a70";
    c.beginPath();
    c.roundRect(120, 65, 560, 470, 20);
    c.fill();
    c.fillStyle = "#514855";
    c.fillRect(145, 90, 510, 420);
    label(c, "FRUTAS", 400, 138, "#e7cc94", 29);
    for (let i = 0; i < 3; i++) {
      const x = 200 + i * 150;
      c.fillStyle = "#e3dcc9";
      c.beginPath();
      c.roundRect(x, 185, 120, 180, 7);
      c.fill();
      this.symbol(c, this.reels[i], x + 60, 275);
      c.strokeStyle = "#b5a98f";
      c.strokeRect(x, 185, 120, 180);
    }
    label(c, "CADA TIRADA: 5 PUNTOS", 400, 410, "#d0c3a4", 13);
    label(
      c,
      this.spinning ? "GIRANDO…" : "ESPACIO O TOCA PARA GIRAR",
      400,
      456,
      "#ecd1a0",
      15,
    );
    label(c, "PUNTOS FICTICIOS · SIN DINERO", 400, 571, "#bdafa9", 11);
  }
  symbol(c: CanvasRenderingContext2D, id: number, x: number, y: number) {
    if (id === 4) {
      label(c, "7", x, y + 25, "#a26366", 75);
      return;
    }
    c.fillStyle = ["#bd7775", "#d8be70", "#8baf80", "#a19abc"][id];
    c.beginPath();
    if (id === 0) {
      c.arc(x - 15, y + 10, 18, 0, 7);
      c.arc(x + 15, y + 10, 18, 0, 7);
    } else c.ellipse(x, y, 30, id === 1 ? 23 : 33, id === 1 ? -0.4 : 0, 0, 7);
    c.fill();
    c.strokeStyle = "#6a8b65";
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(x, y - 25);
    c.quadraticCurveTo(x + 6, y - 44, x + 22, y - 38);
    if (id === 0) {
      c.moveTo(x, y - 25);
      c.lineTo(x - 15, y);
      c.moveTo(x, y - 25);
      c.lineTo(x + 15, y);
    }
    c.stroke();
  }
}
