import type { Engine, Input } from "../../src/shared/Arcade";
import { label } from "../../src/shared/drawing";
export const floors = [540, 420, 300, 180],
  ladders = [650, 150, 650];
type Barrel = {
  x: number;
  y: number;
  dir: number;
  level: number;
  fall: boolean;
  vy: number;
};
export class TowerEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  time = 100;
  player = { x: 105, y: 540, vy: 0 };
  barrels: Barrel[] = [];
  timer = 1;
  safe = 1;
  climbing = false;
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys,
      taps = input.pressed?.splice(0) ?? [];
    this.safe -= dt;
    this.time -= dt;
    this.timer -= dt;
    const dx =
      (k.has("ArrowRight") || k.has("d") ? 1 : 0) -
      (k.has("ArrowLeft") || k.has("a") ? 1 : 0);
    this.player.x = Math.max(68, Math.min(732, this.player.x + dx * 210 * dt));
    const ladder = ladders.findIndex(
        (x, i) =>
          Math.abs(this.player.x - x) < 18 &&
          this.player.y <= floors[i] + 3 &&
          this.player.y >= floors[i + 1] - 3,
      ),
      vertical =
        (k.has("ArrowDown") || k.has("s") ? 1 : 0) -
        (k.has("ArrowUp") || k.has("w") ? 1 : 0);
    this.climbing = ladder >= 0 && vertical !== 0;
    if (this.climbing) {
      this.player.vy = 0;
      this.player.y = Math.max(
        floors[ladder + 1],
        Math.min(floors[ladder], this.player.y + vertical * 115 * dt),
      );
    } else {
      const ground =
        floors.some((y) => Math.abs(this.player.y - y) < 0.5) &&
        this.player.vy === 0;
      if (taps.includes(" ") && ground) this.player.vy = -315;
      const before = this.player.y;
      this.player.vy += 700 * dt;
      this.player.y += this.player.vy * dt;
      if (this.player.vy >= 0)
        for (const y of floors)
          if (before <= y && this.player.y >= y) {
            this.player.y = y;
            this.player.vy = 0;
            break;
          }
    }
    if (this.timer <= 0) {
      this.timer = Math.max(1.3, 2.8 - (100 - this.time) / 70);
      this.barrels.push({
        x: 710,
        y: 168,
        dir: -1,
        level: 3,
        fall: false,
        vy: 0,
      });
    }
    for (const b of this.barrels) {
      b.x += b.dir * 125 * dt;
      if (!b.fall && (b.x < 65 || b.x > 735)) {
        b.x = Math.max(65, Math.min(735, b.x));
        b.level--;
        b.dir *= -1;
        b.fall = true;
        b.vy = 20;
      }
      if (b.fall) {
        b.vy += 500 * dt;
        b.y += b.vy * dt;
        if (b.level >= 0 && b.y >= floors[b.level] - 12) {
          b.y = floors[b.level] - 12;
          b.fall = false;
        }
      }
    }
    this.barrels = this.barrels.filter((b) => b.y < 620);
    if (
      this.safe <= 0 &&
      this.barrels.some(
        (b) =>
          Math.abs(b.x - this.player.x) < 24 &&
          Math.abs(b.y - (this.player.y - 17)) < 24,
      )
    ) {
      this.lives--;
      this.player = { x: 105, y: 540, vy: 0 };
      this.safe = 2;
      if (!this.lives) this.over = true;
    }
    this.score = Math.max(
      this.score,
      Math.floor((540 - this.player.y) / 120) * 100,
    );
    if (this.player.y === 180 && this.player.x > 700) {
      this.score += 500 + Math.floor(this.time) * 5;
      this.won = this.over = true;
    }
    if (this.time <= 0) this.over = true;
    this.status = `${this.lives} vidas · ${Math.ceil(this.time)} s · Sube a la plataforma superior`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#253343";
    c.fillRect(0, 0, 800, 600);
    for (const y of floors) {
      c.fillStyle = "#a3776d";
      c.fillRect(55, y, 690, 12);
      c.strokeStyle = "#d4a38c";
      for (let x = 60; x < 740; x += 35) {
        c.beginPath();
        c.moveTo(x, y + 12);
        c.lineTo(x + 17, y);
        c.lineTo(x + 34, y + 12);
        c.stroke();
      }
    }
    ladders.forEach((x, i) => {
      c.strokeStyle = "#8aa7ab";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x - 12, floors[i]);
      c.lineTo(x - 12, floors[i + 1]);
      c.moveTo(x + 12, floors[i]);
      c.lineTo(x + 12, floors[i + 1]);
      for (let y = floors[i + 1] + 10; y < floors[i]; y += 15) {
        c.moveTo(x - 12, y);
        c.lineTo(x + 12, y);
      }
      c.stroke();
    });
    for (const b of this.barrels) {
      c.fillStyle = "#be986a";
      c.strokeStyle = "#6b513e";
      c.beginPath();
      c.arc(b.x, b.y, 13, 0, 7);
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(b.x - 8, b.y - 8);
      c.lineTo(b.x + 8, b.y + 8);
      c.moveTo(b.x + 8, b.y - 8);
      c.lineTo(b.x - 8, b.y + 8);
      c.stroke();
    }
    c.fillStyle = "#b1bd95";
    c.fillRect(700, 135, 30, 45);
    label(c, "META", 715, 126, "#dce0b9", 11);
    c.fillStyle = "#775c4c";
    c.fillRect(65, 125, 50, 55);
    c.fillStyle = "#c8a780";
    c.fillRect(74, 132, 30, 22);
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0) {
      c.fillStyle = "#a5bdc9";
      c.fillRect(this.player.x - 10, this.player.y - 27, 20, 27);
      c.fillStyle = "#e0b18c";
      c.beginPath();
      c.arc(this.player.x, this.player.y - 34, 9, 0, 7);
      c.fill();
    }
  }
}
