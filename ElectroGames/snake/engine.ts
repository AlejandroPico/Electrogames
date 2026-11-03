import type { Engine, Input } from "../../src/shared/Arcade";
export type Point = { x: number; y: number };
export const SIZE = 24;
export function nextFood(body: Point[], random = Math.random): Point | null {
  const free: Point[] = [];
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      if (!body.some((p) => p.x === x && p.y === y)) free.push({ x, y });
  return free.length
    ? free[Math.min(free.length - 1, Math.floor(random() * free.length))]
    : null;
}
export class SnakeEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  body: Point[] = [
    { x: 10, y: 12 },
    { x: 9, y: 12 },
    { x: 8, y: 12 },
    { x: 7, y: 12 },
  ];
  direction: Point = { x: 1, y: 0 };
  food = nextFood(this.body)!;
  elapsed = 0;
  update(dt: number, input: Input) {
    this.elapsed += dt;
    if (this.elapsed < Math.max(0.065, 0.145 - this.score / 4000)) return;
    this.elapsed = 0;
    const queued = input.pressed?.shift();
    const k = queued ? new Set([queued]) : input.keys;
    let d = this.direction;
    if ((k.has("ArrowUp") || k.has("w")) && d.y !== 1) d = { x: 0, y: -1 };
    else if ((k.has("ArrowDown") || k.has("s")) && d.y !== -1)
      d = { x: 0, y: 1 };
    else if ((k.has("ArrowLeft") || k.has("a")) && d.x !== 1)
      d = { x: -1, y: 0 };
    else if ((k.has("ArrowRight") || k.has("d")) && d.x !== -1)
      d = { x: 1, y: 0 };
    this.direction = d;
    const head = { x: this.body[0].x + d.x, y: this.body[0].y + d.y };
    const eat = head.x === this.food.x && head.y === this.food.y;
    if (
      head.x < 0 ||
      head.x >= SIZE ||
      head.y < 0 ||
      head.y >= SIZE ||
      this.body
        .slice(0, eat ? undefined : -1)
        .some((p) => p.x === head.x && p.y === head.y)
    ) {
      this.over = true;
      return;
    }
    this.body.unshift(head);
    if (eat) {
      this.score += 10;
      const f = nextFood(this.body);
      if (!f) {
        this.over = true;
        this.won = true;
      } else this.food = f;
    } else this.body.pop();
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#102c2a";
    c.fillRect(0, 0, 800, 600);
    const cell = 22,
      ox = 136,
      oy = 36;
    c.strokeStyle = "#24433b";
    c.lineWidth = 1;
    for (let i = 0; i <= SIZE; i++) {
      c.beginPath();
      c.moveTo(ox + i * cell, oy);
      c.lineTo(ox + i * cell, oy + SIZE * cell);
      c.moveTo(ox, oy + i * cell);
      c.lineTo(ox + SIZE * cell, oy + i * cell);
      c.stroke();
    }
    c.shadowBlur = 18;
    c.shadowColor = "#ffbe76";
    c.fillStyle = "#ffbe76";
    c.beginPath();
    c.arc(
      ox + this.food.x * cell + 11,
      oy + this.food.y * cell + 11,
      7,
      0,
      Math.PI * 2,
    );
    c.fill();
    c.shadowBlur = 0;
    this.body.forEach((p, i) => {
      c.fillStyle =
        i === 0 ? "#d1f5a1" : `hsl(145 40% ${Math.max(32, 62 - i * 1.5)}%)`;
      c.beginPath();
      c.roundRect(ox + p.x * cell + 2, oy + p.y * cell + 2, 18, 18, 4);
      c.fill();
    });
    const h = this.body[0],
      d = this.direction;
    c.fillStyle = "#173e31";
    for (const s of [-1, 1]) {
      c.beginPath();
      c.arc(
        ox + h.x * cell + 11 + d.x * 5 + (d.y ? s * 4 : 0),
        oy + h.y * cell + 11 + d.y * 5 + (d.x ? s * 4 : 0),
        2,
        0,
        7,
      );
      c.fill();
    }
  }
}
