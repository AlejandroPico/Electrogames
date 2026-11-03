import type { Engine, Input } from "../../src/shared/Arcade";
import { space } from "../../src/shared/drawing";
type Alien = { x: number; y: number; row: number };
type Shot = { x: number; y: number; enemy: boolean };
export class InvadersEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  wave = 1;
  player = 400;
  direction = 1;
  cooldown = 0;
  enemyTimer = 1;
  safe = 0;
  aliens: Alien[] = [];
  shots: Shot[] = [];
  shields: { x: number; y: number }[] = [];
  constructor() {
    this.spawn();
    for (let g = 0; g < 3; g++)
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 7; col++)
          if (!(row === 2 && col > 1 && col < 5))
            this.shields.push({
              x: 165 + g * 205 + col * 12,
              y: 445 + row * 12,
            });
  }
  spawn() {
    this.aliens = Array.from({ length: 32 }, (_, i) => ({
      x: 135 + (i % 8) * 72,
      y: 65 + Math.floor(i / 8) * 52,
      row: Math.floor(i / 8),
    }));
    this.direction = 1;
    this.shots = [];
    this.safe = 1.5;
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys;
    const fire = k.has(" ") || !!input.pressed?.includes(" ");
    input.pressed?.splice(0);
    if (k.has("ArrowLeft") || k.has("a")) this.player -= 350 * dt;
    if (k.has("ArrowRight") || k.has("d")) this.player += 350 * dt;
    this.player = Math.max(30, Math.min(770, this.player));
    this.safe -= dt;
    this.cooldown -= dt;
    this.enemyTimer -= dt;
    if (fire && this.cooldown <= 0) {
      this.cooldown = 0.25;
      this.shots.push({ x: this.player, y: 530, enemy: false });
    }
    const speed = 24 + this.wave * 8 + (32 - this.aliens.length) * 2.4;
    for (const a of this.aliens) a.x += speed * this.direction * dt;
    if (this.aliens.some((a) => a.x < 30 || a.x > 770)) {
      this.direction *= -1;
      for (const a of this.aliens) {
        a.x = Math.max(30, Math.min(770, a.x));
        a.y += 21;
      }
    }
    if (this.enemyTimer <= 0 && this.aliens.length) {
      this.enemyTimer = Math.max(0.3, 1.05 - this.wave * 0.12);
      const columns = this.aliens.filter(
        (a) => !this.aliens.some((b) => Math.abs(a.x - b.x) < 10 && b.y > a.y),
      );
      const a = columns[Math.floor(Math.random() * columns.length)];
      this.shots.push({ x: a.x, y: a.y + 18, enemy: true });
    }
    for (const s of this.shots) {
      s.y += (s.enemy ? 215 + this.wave * 20 : -480) * dt;
      const shield = this.shields.findIndex(
        (b) => Math.abs(s.x - (b.x + 5)) < 9 && Math.abs(s.y - (b.y + 5)) < 10,
      );
      if (shield >= 0) {
        this.shields.splice(shield, 1);
        s.y = -100;
        continue;
      }
      if (!s.enemy) {
        const hit = this.aliens.findIndex(
          (a) => Math.abs(a.x - s.x) < 22 && Math.abs(a.y - s.y) < 17,
        );
        if (hit >= 0) {
          this.score += (4 - this.aliens[hit].row) * 10;
          this.aliens.splice(hit, 1);
          s.y = -100;
        }
      } else if (
        this.safe <= 0 &&
        Math.abs(s.x - this.player) < 24 &&
        Math.abs(s.y - 542) < 17
      ) {
        s.y = 700;
        this.lives--;
        this.safe = 1.8;
        if (!this.lives) this.over = true;
      }
    }
    this.shots = this.shots.filter((s) => s.y > -20 && s.y < 620);
    if (this.aliens.some((a) => a.y > 510)) this.over = true;
    if (!this.aliens.length) {
      if (this.wave === 3) this.won = this.over = true;
      else {
        this.wave++;
        this.spawn();
      }
    }
    this.status = `${this.lives} vidas · Oleada ${this.wave}/3`;
  }
  draw(c: CanvasRenderingContext2D) {
    space(c, "#142d30");
    const patterns = [
      "00111000111110011111111101011010010010",
      "01000101111101110111011111110101000100",
      "00111001111101111111001010011000110010",
      "00111001111101010101011111010000010000",
    ];
    for (const a of this.aliens) {
      const p = patterns[a.row];
      c.fillStyle = ["#e0c68d", "#a4c6a1", "#88bcb6", "#91a9cb"][a.row];
      for (let i = 0; i < 35; i++)
        if (p[i] === "1")
          c.fillRect(
            a.x - 20 + (i % 7) * 6,
            a.y - 13 + Math.floor(i / 7) * 5,
            5,
            4,
          );
    }
    for (const b of this.shields) {
      c.fillStyle = "#648f78";
      c.fillRect(b.x, b.y, 11, 11);
    }
    c.strokeStyle = "#49675c";
    c.beginPath();
    c.moveTo(20, 575);
    c.lineTo(780, 575);
    c.stroke();
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      c.fillStyle = "#bbd8c7";
      c.fillRect(this.player - 24, 542, 48, 13);
      c.fillRect(this.player - 17, 535, 34, 7);
      c.fillRect(this.player - 4, 525, 8, 10);
    }
    for (const s of this.shots) {
      c.fillStyle = s.enemy ? "#ecad91" : "#f0dfb6";
      c.fillRect(s.x - 2, s.y - 7, 4, 14);
    }
  }
}
