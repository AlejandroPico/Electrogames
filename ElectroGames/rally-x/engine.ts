import type { Engine, Input } from "../../src/shared/Arcade";
const W = 19,
  H = 15,
  S = 32,
  OX = 96,
  OY = 60;
type Pos = { x: number; y: number };
const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
export class RallyEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  fuel = 100;
  player = { x: 1, y: 1 };
  dir = 1;
  wanted = 1;
  step = 0;
  enemyStep = 0;
  safe = 2;
  cooldown = 0;
  enemies: Pos[] = [
    { x: 17, y: 13 },
    { x: 17, y: 1 },
    { x: 1, y: 13 },
  ];
  smoke: { x: number; y: number; life: number }[] = [];
  flags: Pos[] = [
    { x: 5, y: 1 },
    { x: 11, y: 1 },
    { x: 17, y: 3 },
    { x: 1, y: 5 },
    { x: 7, y: 5 },
    { x: 13, y: 7 },
    { x: 3, y: 9 },
    { x: 9, y: 11 },
    { x: 17, y: 13 },
    { x: 5, y: 13 },
  ];
  road(x: number, y: number) {
    return (
      x > 0 && x < W - 1 && y > 0 && y < H - 1 && (x % 2 === 1 || y % 2 === 1)
    );
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.fuel -= 1.4 * dt;
    this.safe -= dt;
    this.cooldown -= dt;
    this.step += dt;
    this.enemyStep += dt;
    const taps = input.pressed?.splice(0) ?? [],
      names = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"],
      letters = ["w", "d", "s", "a"];
    for (const key of taps) {
      const d = Math.max(names.indexOf(key), letters.indexOf(key));
      if (d >= 0) this.wanted = d;
    }
    for (let i = 0; i < 4; i++)
      if (input.keys.has(names[i]) || input.keys.has(letters[i]))
        this.wanted = i;
    if (
      (taps.includes(" ") || input.keys.has(" ")) &&
      this.cooldown <= 0 &&
      this.fuel > 4
    ) {
      this.fuel -= 4;
      this.cooldown = 0.7;
      this.smoke.push({ ...this.player, life: 3.5 });
    }
    for (const s of this.smoke) s.life -= dt;
    this.smoke = this.smoke.filter((s) => s.life > 0);
    if (this.step >= 0.115) {
      this.step = 0;
      if (
        this.road(
          this.player.x + dirs[this.wanted][0],
          this.player.y + dirs[this.wanted][1],
        )
      )
        this.dir = this.wanted;
      if (
        this.road(
          this.player.x + dirs[this.dir][0],
          this.player.y + dirs[this.dir][1],
        )
      ) {
        this.player.x += dirs[this.dir][0];
        this.player.y += dirs[this.dir][1];
      }
      this.flags = this.flags.filter((f) => {
        if (f.x === this.player.x && f.y === this.player.y) {
          this.score += 100;
          this.fuel = Math.min(100, this.fuel + 5);
          return false;
        }
        return true;
      });
    }
    if (this.enemyStep >= 0.21) {
      this.enemyStep = 0;
      const distances = new Map<string, number>(),
        q = [this.player];
      distances.set(`${this.player.x},${this.player.y}`, 0);
      for (let n = 0; n < q.length; n++)
        for (const [dx, dy] of dirs) {
          const x = q[n].x + dx,
            y = q[n].y + dy,
            key = `${x},${y}`;
          if (this.road(x, y) && !distances.has(key)) {
            distances.set(key, distances.get(`${q[n].x},${q[n].y}`)! + 1);
            q.push({ x, y });
          }
        }
      for (const e of this.enemies) {
        if (this.smoke.some((s) => s.x === e.x && s.y === e.y)) continue;
        const options = dirs
          .map(([dx, dy]) => ({ x: e.x + dx, y: e.y + dy }))
          .filter(
            (p) =>
              this.road(p.x, p.y) &&
              !this.smoke.some((s) => s.x === p.x && s.y === p.y),
          );
        options.sort(
          (a, b) =>
            (distances.get(`${a.x},${a.y}`) ?? 999) -
            (distances.get(`${b.x},${b.y}`) ?? 999),
        );
        if (options[0]) Object.assign(e, options[0]);
      }
    }
    if (
      this.safe <= 0 &&
      this.enemies.some((e) => e.x === this.player.x && e.y === this.player.y)
    ) {
      this.lives--;
      this.player = { x: 1, y: 1 };
      this.safe = 3;
      this.enemies = [
        { x: 17, y: 13 },
        { x: 17, y: 1 },
        { x: 1, y: 13 },
      ];
      if (!this.lives) this.over = true;
    }
    if (!this.flags.length) {
      this.score += Math.ceil(this.fuel) * 5;
      this.won = this.over = true;
    }
    if (this.fuel <= 0) this.over = true;
    this.status = `${this.lives} vidas · ${10 - this.flags.length}/10 banderas · Gasolina ${Math.ceil(this.fuel)}%`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#2d4141";
    c.fillRect(0, 0, 800, 600);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        c.fillStyle = this.road(x, y) ? "#46515a" : "#73917c";
        c.fillRect(OX + x * S, OY + y * S, S - 1, S - 1);
      }
    for (const f of this.flags) {
      c.strokeStyle = "#dfcba0";
      c.beginPath();
      c.moveTo(OX + f.x * S + 10, OY + f.y * S + 5);
      c.lineTo(OX + f.x * S + 10, OY + f.y * S + 27);
      c.stroke();
      c.fillStyle = "#e0b778";
      c.fillRect(OX + f.x * S + 11, OY + f.y * S + 5, 14, 9);
    }
    for (const s of this.smoke) {
      c.fillStyle = "#b6c7b7aa";
      c.beginPath();
      c.arc(OX + (s.x + 0.5) * S, OY + (s.y + 0.5) * S, 18, 0, 7);
      c.fill();
    }
    const car = (p: Pos, color: string, d = 0) => {
      c.save();
      c.translate(OX + (p.x + 0.5) * S, OY + (p.y + 0.5) * S);
      c.rotate((d * Math.PI) / 2);
      c.fillStyle = color;
      c.beginPath();
      c.roundRect(-9, -13, 18, 26, 4);
      c.fill();
      c.fillStyle = "#29424a";
      c.fillRect(-6, -6, 12, 7);
      c.restore();
    };
    for (const e of this.enemies) car(e, "#cb9686");
    if (this.safe <= 0 || Math.floor(this.safe * 8) % 2 === 0)
      car(this.player, "#d8c68a", this.dir);
  }
}
