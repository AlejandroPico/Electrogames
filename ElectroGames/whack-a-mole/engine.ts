import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Mole = { index: number; time: number; bad: boolean };
export function hole(index: number) {
  return { x: 240 + (index % 3) * 160, y: 160 + Math.floor(index / 3) * 145 };
}
export class MoleEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  time = 45;
  hits = 0;
  mistakes = 0;
  combo = 0;
  selected = 4;
  timer = 0.1;
  moles: Mole[] = [];
  flash = 0;
  strike() {
    const i = this.moles.findIndex((m) => m.index === this.selected);
    this.flash = 0.15;
    if (i < 0) {
      this.mistakes++;
      this.combo = 0;
      return;
    }
    const m = this.moles.splice(i, 1)[0];
    if (m.bad) {
      this.mistakes++;
      this.combo = 0;
      this.score = Math.max(0, this.score - 50);
    } else {
      this.hits++;
      this.combo++;
      this.score += 100 + Math.min(10, this.combo) * 10;
    }
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.time -= dt;
    this.timer -= dt;
    this.flash = Math.max(0, this.flash - dt);
    for (const m of this.moles) m.time -= dt;
    this.moles = this.moles.filter((m) => m.time > 0);
    for (const key of input.pressed?.splice(0) ?? []) {
      if (key === "ArrowLeft" || key === "a")
        this.selected = Math.max(0, this.selected - 1);
      if (key === "ArrowRight" || key === "d")
        this.selected = Math.min(8, this.selected + 1);
      if (key === "ArrowUp" || key === "w")
        this.selected = Math.max(0, this.selected - 3);
      if (key === "ArrowDown" || key === "s")
        this.selected = Math.min(8, this.selected + 3);
      if (key === " ") {
        if (input.pointer !== null && input.pointerY != null) {
          let best = Infinity;
          for (let i = 0; i < 9; i++) {
            const p = hole(i),
              d = Math.hypot(input.pointer - p.x, input.pointerY - p.y);
            if (d < best) {
              best = d;
              this.selected = i;
            }
          }
          if (best > 65) {
            this.mistakes++;
            continue;
          }
        }
        this.strike();
      }
    }
    if (this.timer <= 0) {
      this.timer = Math.max(0.32, 0.75 - this.hits * 0.012);
      const free = Array.from({ length: 9 }, (_, i) => i).filter(
        (i) => !this.moles.some((m) => m.index === i),
      );
      if (free.length)
        this.moles.push({
          index: free[Math.floor(Math.random() * free.length)],
          time: Math.max(0.65, 1.5 - this.hits * 0.02),
          bad: Math.random() < 0.18,
        });
    }
    if (this.hits >= 20) this.won = this.over = true;
    if (this.time <= 0 || this.mistakes >= 5) this.over = true;
    this.status = `${this.hits}/20 aciertos · ${5 - this.mistakes} errores · ${Math.ceil(this.time)} s`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#b5c6a0";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#7d9a78";
    c.fillRect(80, 40, 640, 520);
    for (let i = 0; i < 9; i++) {
      const p = hole(i);
      c.fillStyle = "#4d6250";
      c.beginPath();
      c.ellipse(p.x, p.y + 24, 57, 24, 0, 0, 7);
      c.fill();
      const m = this.moles.find((m) => m.index === i);
      if (m) {
        c.fillStyle = m.bad ? "#4c5454" : "#ab8965";
        c.beginPath();
        c.ellipse(p.x, p.y - 5, 36, 45, 0, 0, 7);
        c.fill();
        c.fillStyle = "#ddc3a0";
        c.beginPath();
        c.ellipse(p.x, p.y + 10, 22, 13, 0, 0, 7);
        c.fill();
        c.fillStyle = "#263e39";
        c.beginPath();
        c.arc(p.x - 12, p.y - 15, 4, 0, 7);
        c.arc(p.x + 12, p.y - 15, 4, 0, 7);
        c.fill();
        if (m.bad) {
          c.strokeStyle = "#df9b80";
          c.lineWidth = 5;
          c.beginPath();
          c.moveTo(p.x - 12, p.y - 8);
          c.lineTo(p.x + 12, p.y + 16);
          c.moveTo(p.x + 12, p.y - 8);
          c.lineTo(p.x - 12, p.y + 16);
          c.stroke();
        }
      }
      if (this.selected === i) {
        c.strokeStyle = this.flash ? "#eed487" : "#dbe3bd";
        c.lineWidth = this.flash ? 6 : 2;
        c.beginPath();
        c.ellipse(p.x, p.y + 24, 62, 28, 0, 0, 7);
        c.stroke();
      }
    }
    label(c, "20 TOPOS · EVITA LOS OBJETIVOS OSCUROS", 400, 580, "#375845", 13);
  }
}
