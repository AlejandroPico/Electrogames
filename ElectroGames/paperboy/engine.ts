import type { Engine, Input } from "../../src/shared/Arcade";
type Mailbox = { x: number; y: number; hit: boolean };
type Paper = { x: number; y: number; vx: number };
export class PaperboyEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  delivered = 0;
  papers = 40;
  time = 70;
  player = 400;
  safe = 1;
  mailTimer = 0.2;
  obstacleTimer = 2;
  cooldown = 0;
  clock = 0;
  facing = -1;
  mailboxes: Mailbox[] = [];
  shots: Paper[] = [];
  obstacles: { x: number; y: number; kind: number }[] = [];
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      taps = input.pressed?.splice(0) ?? [];
    this.time -= dt;
    this.clock += dt;
    this.safe -= dt;
    this.cooldown -= dt;
    this.mailTimer -= dt;
    this.obstacleTimer -= dt;
    const dx =
      (k.has("ArrowRight") || k.has("d") ? 1 : 0) -
      (k.has("ArrowLeft") || k.has("a") ? 1 : 0);
    this.player = Math.max(280, Math.min(520, this.player + dx * 230 * dt));
    if (dx) this.facing = dx;
    const left = taps.includes("z") || k.has("z"),
      right = taps.includes("x") || k.has("x");
    if (
      this.cooldown <= 0 &&
      this.papers > 0 &&
      (left || right || taps.includes(" ") || k.has(" "))
    ) {
      const side = left ? -1 : right ? 1 : this.facing;
      this.shots.push({ x: this.player, y: 460, vx: side * 480 });
      this.papers--;
      this.cooldown = 0.4;
    }
    if (this.mailTimer <= 0) {
      this.mailTimer = 1.1;
      this.mailboxes.push({
        x: Math.floor(this.clock) % 2 ? 225 : 575,
        y: -30,
        hit: false,
      });
    }
    if (this.obstacleTimer <= 0) {
      this.obstacleTimer = 1.7;
      this.obstacles.push({
        x: 300 + Math.random() * 200,
        y: -50,
        kind: Math.random() < 0.5 ? 0 : 1,
      });
    }
    for (const m of this.mailboxes) m.y += 175 * dt;
    for (const o of this.obstacles) o.y += 185 * dt;
    for (const p of this.shots) {
      p.x += p.vx * dt;
      p.y += 20 * dt;
      const m = this.mailboxes.find(
        (m) => !m.hit && Math.abs(m.x - p.x) < 25 && Math.abs(m.y - p.y) < 28,
      );
      if (m) {
        m.hit = true;
        p.x = -100;
        this.delivered++;
        this.score += 100;
      }
    }
    this.shots = this.shots.filter((p) => p.x > 0 && p.x < 800);
    this.mailboxes = this.mailboxes.filter((m) => m.y < 650);
    this.obstacles = this.obstacles.filter((o) => o.y < 650);
    if (
      this.safe <= 0 &&
      this.obstacles.some(
        (o) => Math.abs(o.x - this.player) < 30 && Math.abs(o.y - 460) < 40,
      )
    ) {
      this.lives--;
      this.safe = 2;
      if (!this.lives) this.over = true;
    }
    if (this.delivered >= 12) {
      this.score += this.papers * 10;
      this.won = this.over = true;
    }
    if (this.time <= 0 || (!this.papers && !this.shots.length))
      this.over = true;
    this.status = `${this.lives} vidas · ${this.delivered}/12 entregas · ${this.papers} periódicos`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#74907a";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#b9b6a1";
    c.fillRect(200, 0, 65, 600);
    c.fillRect(535, 0, 65, 600);
    c.fillStyle = "#43515c";
    c.fillRect(265, 0, 270, 600);
    c.strokeStyle = "#b3bcae";
    c.setLineDash([25, 30]);
    c.beginPath();
    c.moveTo(400, -60 + ((this.clock * 175) % 55));
    c.lineTo(400, 650);
    c.stroke();
    c.setLineDash([]);
    for (const m of this.mailboxes) {
      const hx = m.x < 400 ? 80 : 630;
      c.fillStyle = "#a8b9a0";
      c.fillRect(hx, m.y - 50, 90, 90);
      c.fillStyle = "#987c6d";
      c.beginPath();
      c.moveTo(hx - 8, m.y - 50);
      c.lineTo(hx + 45, m.y - 85);
      c.lineTo(hx + 98, m.y - 50);
      c.fill();
      c.fillStyle = m.hit ? "#d6c78e" : "#6b8791";
      c.fillRect(m.x - 13, m.y - 16, 26, 24);
      c.fillStyle = "#735e47";
      c.fillRect(m.x - 3, m.y + 8, 6, 28);
      c.fillStyle = "#c68f79";
      c.fillRect(m.x + 7, m.y - 23, 15, 6);
    }
    for (const o of this.obstacles) {
      c.fillStyle = o.kind ? "#9a7d5a" : "#b28f80";
      c.beginPath();
      c.roundRect(o.x - (o.kind ? 20 : 25), o.y - 30, o.kind ? 40 : 50, 60, 7);
      c.fill();
    }
    for (const p of this.shots) {
      c.fillStyle = "#e6dfc8";
      c.fillRect(p.x - 8, p.y - 5, 16, 10);
    }
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      c.strokeStyle = "#b4c6c5";
      c.lineWidth = 4;
      c.beginPath();
      c.ellipse(this.player, 479, 8, 14, 0, 0, 7);
      c.stroke();
      c.ellipse(this.player, 444, 8, 14, 0, 0, 7);
      c.stroke();
      c.fillStyle = "#d0ae87";
      c.fillRect(this.player - 12, 448, 24, 24);
      c.fillStyle = "#a7bfc2";
      c.beginPath();
      c.arc(this.player, 443, 10, 0, 7);
      c.fill();
    }
  }
}
