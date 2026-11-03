import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
type Cell = { r: number; q: number; color: number };
const colors = ["#d9978b", "#94bca8", "#d9bd7e", "#8faacb", "#b49cc4"];
export class BubbleEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  cells: Cell[] = [];
  shot: { x: number; y: number; vx: number; vy: number; color: number } | null =
    null;
  angle = -Math.PI / 2;
  color = 0;
  roof = 0;
  misses = 0;
  cooldown = 0;
  constructor() {
    for (let r = 0; r < 5; r++)
      for (let q = 0; q < 12; q++)
        this.cells.push({ r, q, color: Math.floor(Math.random() * 5) });
    this.choose();
  }
  choose() {
    const list = [...new Set(this.cells.map((c) => c.color))];
    this.color = list[Math.floor(Math.random() * list.length)] ?? 0;
  }
  center(c: { r: number; q: number }) {
    return {
      x: 148 + c.q * 42 + (c.r % 2) * 21,
      y: 60 + this.roof + c.r * 36.4,
    };
  }
  neighbors(a: Cell) {
    return this.cells.filter(
      (b) =>
        b !== a &&
        Math.hypot(
          this.center(a).x - this.center(b).x,
          this.center(a).y - this.center(b).y,
        ) < 44,
    );
  }
  attach(x: number, y: number, color: number) {
    const candidates: Cell[] = [];
    for (let r = 0; r < 13; r++)
      for (let q = 0; q < 12; q++) {
        if (this.cells.some((c) => c.r === r && c.q === q)) continue;
        const candidate = { r, q, color },
          p = this.center(candidate);
        if (
          r === 0 ||
          this.cells.some(
            (c) =>
              Math.hypot(p.x - this.center(c).x, p.y - this.center(c).y) < 44,
          )
        )
          candidates.push(candidate);
      }
    candidates.sort(
      (a, b) =>
        Math.hypot(this.center(a).x - x, this.center(a).y - y) -
        Math.hypot(this.center(b).x - x, this.center(b).y - y),
    );
    const cell = candidates[0];
    if (!cell) {
      this.over = true;
      return;
    }
    this.cells.push(cell);
    const group = new Set<Cell>([cell]),
      queue = [cell];
    for (let i = 0; i < queue.length; i++)
      for (const n of this.neighbors(queue[i]))
        if (n.color === color && !group.has(n)) {
          group.add(n);
          queue.push(n);
        }
    if (group.size >= 3) {
      this.score += group.size * 10;
      this.cells = this.cells.filter((c) => !group.has(c));
      const anchored = new Set(this.cells.filter((c) => c.r === 0)),
        q = [...anchored];
      for (let i = 0; i < q.length; i++)
        for (const n of this.neighbors(q[i]))
          if (!anchored.has(n)) {
            anchored.add(n);
            q.push(n);
          }
      this.score += (this.cells.length - anchored.size) * 20;
      this.cells = [...anchored];
    } else this.misses++;
    if (this.misses >= 5) {
      this.roof += 24;
      this.misses = 0;
    }
    if (!this.cells.length) this.won = this.over = true;
    else if (this.cells.some((c) => this.center(c).y > 470)) this.over = true;
    this.choose();
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.cooldown -= dt;
    const k = input.keys,
      tap = input.pressed?.includes(" ");
    input.pressed?.splice(0);
    this.angle +=
      ((k.has("ArrowRight") || k.has("d") ? 1 : 0) -
        (k.has("ArrowLeft") || k.has("a") ? 1 : 0)) *
      1.7 *
      dt;
    if (
      input.pointer !== null &&
      input.pointerY != null &&
      input.pointerY < 510
    )
      this.angle = Math.atan2(input.pointerY - 550, input.pointer - 400);
    this.angle = Math.max(-2.95, Math.min(-0.19, this.angle));
    if ((tap || k.has(" ")) && !this.shot && this.cooldown <= 0) {
      this.shot = {
        x: 400,
        y: 530,
        vx: Math.cos(this.angle) * 460,
        vy: Math.sin(this.angle) * 460,
        color: this.color,
      };
      this.cooldown = 0.25;
    }
    if (this.shot) {
      const s = this.shot;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.x < 145) {
        s.x = 145;
        s.vx = Math.abs(s.vx);
      }
      if (s.x > 652) {
        s.x = 652;
        s.vx = -Math.abs(s.vx);
      }
      if (
        s.y <= 60 + this.roof ||
        this.cells.some(
          (c) =>
            Math.hypot(s.x - this.center(c).x, s.y - this.center(c).y) < 38,
        )
      ) {
        this.attach(s.x, s.y, s.color);
        this.shot = null;
      }
    }
    this.status = `${this.cells.length} burbujas · ${5 - this.misses} tiros hasta descenso`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#243346";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#3c4f61";
    c.fillRect(126, 25, 550, 16 + this.roof);
    c.strokeStyle = "#7e91a2";
    c.strokeRect(126, 25, 550, 465);
    const bubble = (x: number, y: number, color: number) => {
      c.fillStyle = colors[color];
      c.strokeStyle = "#ffffff66";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(x, y, 19, 0, 7);
      c.fill();
      c.stroke();
      c.fillStyle = "#ffffff55";
      c.beginPath();
      c.arc(x - 6, y - 6, 4, 0, 7);
      c.fill();
    };
    for (const cell of this.cells) {
      const p = this.center(cell);
      bubble(p.x, p.y, cell.color);
    }
    c.strokeStyle = "#b2c1c6";
    c.lineWidth = 3;
    c.setLineDash([5, 8]);
    c.beginPath();
    c.moveTo(400, 550);
    c.lineTo(400 + Math.cos(this.angle) * 85, 550 + Math.sin(this.angle) * 85);
    c.stroke();
    c.setLineDash([]);
    bubble(400, 550, this.color);
    if (this.shot) bubble(this.shot.x, this.shot.y, this.shot.color);
    label(c, "3 DEL MISMO COLOR", 400, 588, "#acbbc5", 11);
  }
}
