import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Customer = { x: number; lane: number; served: boolean };
type Mug = { x: number; lane: number; returning: boolean };
export class TapperEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  mistakes = 0;
  served = 0;
  time = 90;
  lane = 0;
  repeat = 0;
  cooldown = 0;
  spawn = 2;
  customers: Customer[] = [
    { x: 340, lane: 0, served: false },
    { x: 180, lane: 2, served: false },
  ];
  mugs: Mug[] = [];
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      taps = input.pressed?.splice(0) ?? [];
    this.time -= dt;
    this.repeat -= dt;
    this.cooldown -= dt;
    this.spawn -= dt;
    let d =
      taps.includes("ArrowUp") || taps.includes("w")
        ? -1
        : taps.includes("ArrowDown") || taps.includes("s")
          ? 1
          : 0;
    if (!d && this.repeat <= 0)
      d =
        k.has("ArrowUp") || k.has("w")
          ? -1
          : k.has("ArrowDown") || k.has("s")
            ? 1
            : 0;
    if (d) {
      this.lane = Math.max(0, Math.min(3, this.lane + d));
      this.repeat = 0.2;
    }
    if (
      (taps.includes(" ") || k.has(" ")) &&
      this.cooldown <= 0 &&
      !this.mugs.some((m) => m.lane === this.lane && !m.returning)
    ) {
      this.mugs.push({ x: 668, lane: this.lane, returning: false });
      this.cooldown = 0.45;
    }
    if (this.spawn <= 0) {
      this.spawn = Math.max(0.9, 2.3 - this.served * 0.05);
      const counts = Array.from(
          { length: 4 },
          (_, lane) =>
            this.customers.filter((c) => c.lane === lane && !c.served).length,
        ),
        min = Math.min(...counts),
        options = counts
          .map((n, i) => (n === min ? i : -1))
          .filter((i) => i >= 0);
      this.customers.push({
        x: 95,
        lane: options[Math.floor(Math.random() * options.length)],
        served: false,
      });
    }
    for (const c of this.customers) {
      c.x += (c.served ? -145 : 25 + this.served * 0.8) * dt;
      if (c.x > 670 && !c.served) {
        this.mistakes++;
        c.x = -100;
      }
    }
    for (const m of this.mugs) {
      m.x += (m.returning ? 220 : -420) * dt;
      if (!m.returning) {
        const c = this.customers.find(
          (c) => !c.served && c.lane === m.lane && Math.abs(c.x - m.x) < 25,
        );
        if (c) {
          c.served = true;
          m.returning = true;
          this.score += 100;
          this.served++;
        }
      } else if (
        m.lane === this.lane &&
        m.x > 590 &&
        (k.has("x") || taps.includes("x"))
      ) {
        m.x = -100;
        this.score += 25;
      }
      if (m.x > 730 || (m.x < 70 && m.x > -50)) {
        this.mistakes++;
        m.x = -100;
      }
    }
    this.customers = this.customers.filter((c) => c.x > 70);
    this.mugs = this.mugs.filter((m) => m.x > 0);
    if (this.mistakes >= 3 || this.time <= 0) this.over = true;
    if (this.served >= 20) this.won = this.over = true;
    this.status = `${this.served}/20 clientes · ${3 - this.mistakes} errores restantes · ${Math.ceil(this.time)} s`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#3b3438";
    c.fillRect(0, 0, 800, 600);
    for (let lane = 0; lane < 4; lane++) {
      const y = 130 + lane * 115;
      c.fillStyle = this.lane === lane ? "#b19772" : "#786b59";
      c.fillRect(75, y, 650, 28);
      c.fillStyle = "#574b42";
      c.fillRect(75, y + 28, 650, 12);
      c.fillStyle = "#b6b09b";
      c.fillRect(695, y - 42, 25, 43);
      c.fillStyle = this.lane === lane ? "#d4c28e" : "#8c8c7b";
      c.fillRect(744, y - 10, 12, 12);
    }
    for (const cust of this.customers) {
      const y = 130 + cust.lane * 115;
      c.fillStyle = cust.served ? "#8eaf93" : "#b0a0bd";
      c.fillRect(cust.x - 12, y - 32, 24, 30);
      c.fillStyle = "#deb58c";
      c.beginPath();
      c.arc(cust.x, y - 43, 11, 0, 7);
      c.fill();
    }
    for (const m of this.mugs) {
      const y = 130 + m.lane * 115;
      c.fillStyle = m.returning ? "#b2c9ca" : "#d4b56c";
      c.fillRect(m.x - 8, y - 20, 16, 19);
      c.strokeStyle = "#ece1bf";
      c.strokeRect(m.x + 7, y - 15, 6, 10);
    }
    label(c, "↑ ↓ BARRA · ESPACIO SERVIR · X RECOGER", 400, 38, "#c9bfa4", 13);
  }
}
