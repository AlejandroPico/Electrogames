import type { Engine, Input } from "../../src/shared/Arcade";
type Tank = {
  x: number;
  y: number;
  dir: number;
  hp: number;
  turn: number;
  fire: number;
};
type Shot = { x: number; y: number; vx: number; vy: number; enemy: boolean };
type Wall = { x: number; y: number; hp: number };
const dx = [0, 1, 0, -1],
  dy = [-1, 0, 1, 0];
export class TanksEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  wave = 1;
  player = { x: 400, y: 535, dir: 0 };
  safe = 2;
  cooldown = 0;
  enemies: Tank[] = [];
  shots: Shot[] = [];
  walls: Wall[] = [];
  constructor() {
    for (const [ox, oy] of [
      [130, 160],
      [330, 160],
      [570, 160],
      [130, 370],
      [330, 370],
      [570, 370],
    ])
      for (let y = 0; y < 2; y++)
        for (let x = 0; x < 2; x++)
          this.walls.push({ x: ox + x * 28, y: oy + y * 28, hp: 3 });
    this.spawn();
  }
  spawn() {
    this.enemies = Array.from({ length: 2 + this.wave }, (_, i) => ({
      x: 80 + (i * 640) / (1 + this.wave),
      y: 65,
      dir: 2,
      hp: 2,
      turn: 0.6 + i * 0.3,
      fire: 1 + i * 0.5,
    }));
    this.shots = [];
    this.safe = 2;
  }
  can(x: number, y: number) {
    return (
      x > 35 &&
      x < 765 &&
      y > 35 &&
      y < 565 &&
      !this.walls.some(
        (w) =>
          x + 16 > w.x &&
          x - 16 < w.x + 27 &&
          y + 16 > w.y &&
          y - 16 < w.y + 27,
      )
    );
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    const k = input.keys;
    const fire = k.has(" ") || !!input.pressed?.includes(" ");
    input.pressed?.splice(0);
    let dir = -1;
    if (k.has("ArrowUp") || k.has("w")) dir = 0;
    else if (k.has("ArrowRight") || k.has("d")) dir = 1;
    else if (k.has("ArrowDown") || k.has("s")) dir = 2;
    else if (k.has("ArrowLeft") || k.has("a")) dir = 3;
    if (dir >= 0) {
      this.player.dir = dir;
      const x = this.player.x + dx[dir] * 155 * dt,
        y = this.player.y + dy[dir] * 155 * dt;
      if (
        this.can(x, y) &&
        !this.enemies.some((e) => Math.hypot(e.x - x, e.y - y) < 32)
      ) {
        this.player.x = x;
        this.player.y = y;
      }
    }
    this.safe -= dt;
    this.cooldown -= dt;
    if (fire && this.cooldown <= 0) {
      this.cooldown = 0.3;
      this.fire(this.player, false);
    }
    for (const e of this.enemies) {
      e.turn -= dt;
      e.fire -= dt;
      const x = e.x + dx[e.dir] * (55 + this.wave * 9) * dt,
        y = e.y + dy[e.dir] * (55 + this.wave * 9) * dt;
      if (
        this.can(x, y) &&
        Math.hypot(x - this.player.x, y - this.player.y) > 34
      ) {
        e.x = x;
        e.y = y;
      } else e.turn = 0;
      if (e.turn <= 0) {
        e.turn = 0.8 + Math.random() * 1.2;
        if (Math.random() < 0.65)
          e.dir =
            Math.abs(e.x - this.player.x) > Math.abs(e.y - this.player.y)
              ? e.x < this.player.x
                ? 1
                : 3
              : e.y < this.player.y
                ? 2
                : 0;
        else e.dir = Math.floor(Math.random() * 4);
      }
      if (e.fire <= 0) {
        e.fire = 1.2 + Math.random() * 1.2;
        this.fire(e, true);
      }
    }
    for (const s of this.shots) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const wall = this.walls.find(
        (w) =>
          s.x > w.x - 3 && s.x < w.x + 30 && s.y > w.y - 3 && s.y < w.y + 30,
      );
      if (wall) {
        wall.hp--;
        s.x = -100;
        continue;
      }
      if (s.enemy) {
        if (
          this.safe <= 0 &&
          Math.abs(s.x - this.player.x) < 19 &&
          Math.abs(s.y - this.player.y) < 19
        ) {
          this.lives--;
          s.x = -100;
          this.safe = 2;
          if (!this.lives) this.over = true;
        }
      } else {
        const e = this.enemies.find(
          (e) => Math.abs(s.x - e.x) < 19 && Math.abs(s.y - e.y) < 19,
        );
        if (e) {
          e.hp--;
          s.x = -100;
          if (e.hp === 0) this.score += 100;
        }
      }
    }
    this.walls = this.walls.filter((w) => w.hp > 0);
    this.enemies = this.enemies.filter((e) => e.hp > 0);
    this.shots = this.shots.filter(
      (s) => s.x > 20 && s.x < 780 && s.y > 20 && s.y < 580,
    );
    if (!this.enemies.length) {
      if (this.wave === 3) this.won = this.over = true;
      else {
        this.wave++;
        this.spawn();
      }
    }
    this.status = `${this.lives} vidas · Oleada ${this.wave}/3 · ${this.enemies.length} tanques`;
  }
  fire(t: { x: number; y: number; dir: number }, enemy: boolean) {
    this.shots.push({
      x: t.x + dx[t.dir] * 25,
      y: t.y + dy[t.dir] * 25,
      vx: dx[t.dir] * (enemy ? 240 : 430),
      vy: dy[t.dir] * (enemy ? 240 : 430),
      enemy,
    });
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#263b35";
    c.fillRect(0, 0, 800, 600);
    c.strokeStyle = "#63726266";
    c.strokeRect(20, 20, 760, 560);
    c.fillStyle = "#ffffff05";
    for (let y = 0; y < 600; y += 30)
      for (let x = 0; x < 800; x += 30) c.fillRect(x, y, 1, 1);
    for (const w of this.walls) {
      c.fillStyle = w.hp === 3 ? "#a6896b" : w.hp === 2 ? "#8e775e" : "#706652";
      c.fillRect(w.x, w.y, 27, 27);
      c.strokeStyle = "#c2a17a";
      c.beginPath();
      c.moveTo(w.x, w.y + 13);
      c.lineTo(w.x + 27, w.y + 13);
      c.moveTo(w.x + 13, w.y);
      c.lineTo(w.x + 13, w.y + 13);
      c.moveTo(w.x + 7, w.y + 13);
      c.lineTo(w.x + 7, w.y + 27);
      c.stroke();
    }
    const tank = (t: { x: number; y: number; dir: number }, color: string) => {
      c.save();
      c.translate(t.x, t.y);
      c.rotate((t.dir * Math.PI) / 2);
      c.fillStyle = "#152923";
      c.fillRect(-19, -19, 9, 38);
      c.fillRect(10, -19, 9, 38);
      c.fillStyle = color;
      c.beginPath();
      c.roundRect(-12, -15, 24, 30, 4);
      c.fill();
      c.fillStyle = "#344a3c";
      c.beginPath();
      c.arc(0, 0, 9, 0, 7);
      c.fill();
      c.fillStyle = color;
      c.fillRect(-3, -28, 6, 29);
      c.restore();
    };
    for (const e of this.enemies) {
      tank(e, "#c0a17b");
      if (e.hp === 1) {
        c.fillStyle = "#f2d6a4";
        c.fillRect(e.x - 3, e.y + 6, 6, 3);
      }
    }
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0)
      tank(this.player, "#abc592");
    for (const s of this.shots) {
      c.fillStyle = s.enemy ? "#e8a288" : "#ebdbad";
      c.beginPath();
      c.arc(s.x, s.y, 3, 0, 7);
      c.fill();
    }
  }
}
