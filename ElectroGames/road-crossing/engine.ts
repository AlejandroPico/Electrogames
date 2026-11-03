import type { Engine, Input } from "../../src/shared/Arcade";
export const STEP = 36,
  LEFT = 130,
  TOP = 30,
  WIDTH = 540;
export const goals = [1, 4, 7, 10, 13];
type Lane = {
  row: number;
  speed: number;
  length: number;
  offset: number;
  river: boolean;
};
export class RoadEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  lives = 3;
  time = 90;
  clock = 0;
  player = { x: 270, row: 14 };
  homes = new Set<number>();
  delay = 0;
  repeat = 0;
  furthest = 14;
  lanes: Lane[] = Array.from({ length: 10 }, (_, i) => ({
    row: i < 5 ? i + 2 : i + 3,
    speed: (i % 2 ? -1 : 1) * (37 + i * 4),
    length: i < 5 ? 132 : 58 + (i % 2) * 20,
    offset: i * 71,
    river: i < 5,
  }));
  objects(l: Lane) {
    const period = WIDTH + l.length;
    return Array.from(
      { length: 4 },
      (_, i) =>
        (((((i * period) / 3 + l.offset + this.clock * l.speed) % period) +
          period) %
          period) -
        l.length,
    ).slice(0, 3);
  }
  reset() {
    this.player = { x: 270, row: 14 };
    this.delay = 0.7;
    this.repeat = 0;
    this.furthest = 14;
  }
  die() {
    this.lives--;
    if (!this.lives) this.over = true;
    else this.reset();
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.clock += dt;
    this.time -= dt;
    if (this.time <= 0) {
      this.time = 0;
      this.over = true;
      return;
    }
    this.status = `${this.lives} vidas · ${this.homes.size}/5 cruces · ${Math.ceil(this.time)} s`;
    if (this.delay > 0) {
      this.delay -= dt;
      input.pressed?.splice(0);
      return;
    }
    this.repeat -= dt;
    const names = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"],
      letters = ["w", "d", "s", "a"];
    let action = -1;
    const tap = input.pressed?.shift();
    if (tap) {
      action = names.indexOf(tap);
      if (action < 0) action = letters.indexOf(tap);
    }
    if (action < 0 && this.repeat <= 0)
      action = names.findIndex(
        (n, i) => input.keys.has(n) || input.keys.has(letters[i]),
      );
    if (action >= 0) {
      this.repeat = 0.17;
      const dx = [0, 1, 0, -1][action],
        dy = [-1, 0, 1, 0][action];
      this.player.x = Math.max(
        18,
        Math.min(WIDTH - 18, this.player.x + dx * STEP),
      );
      this.player.row = Math.max(0, Math.min(14, this.player.row + dy));
      if (this.player.row < this.furthest) {
        this.score += 10;
        this.furthest = this.player.row;
      }
    }
    if (this.player.row === 0) {
      const g = goals.findIndex(
        (col) => Math.abs(this.player.x - (col + 0.5) * STEP) < 17,
      );
      if (g < 0 || this.homes.has(g)) {
        this.die();
        return;
      }
      this.homes.add(g);
      this.score += 200;
      if (this.homes.size === 5) {
        this.score += Math.ceil(this.time) * 5;
        this.won = this.over = true;
      } else {
        this.time += 15;
        this.reset();
      }
      return;
    }
    const lane = this.lanes.find((l) => l.row === this.player.row);
    if (!lane) return;
    const on = this.objects(lane).some(
      (x) => this.player.x > x + 5 && this.player.x < x + lane.length - 5,
    );
    if (lane.river) {
      if (!on) {
        this.die();
        return;
      }
      this.player.x += lane.speed * dt;
      if (this.player.x < 10 || this.player.x > WIDTH - 10) this.die();
    } else if (
      this.objects(lane).some(
        (x) => this.player.x + 11 > x && this.player.x - 11 < x + lane.length,
      )
    )
      this.die();
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#283c39";
    c.fillRect(0, 0, 800, 600);
    c.fillStyle = "#425e4b";
    c.fillRect(LEFT, TOP, WIDTH, 15 * STEP);
    for (const l of this.lanes) {
      const y = TOP + l.row * STEP;
      c.fillStyle = l.river ? "#244d60" : "#303a45";
      c.fillRect(LEFT, y, WIDTH, STEP);
      if (!l.river) {
        c.strokeStyle = "#89948b66";
        c.setLineDash([15, 20]);
        c.beginPath();
        c.moveTo(LEFT, y + STEP);
        c.lineTo(LEFT + WIDTH, y + STEP);
        c.stroke();
        c.setLineDash([]);
      }
      c.save();
      c.beginPath();
      c.rect(LEFT, y, WIDTH, STEP);
      c.clip();
      for (const x of this.objects(l)) {
        c.fillStyle = l.river ? "#9f825e" : l.row % 2 ? "#d2ab80" : "#8fa9b3";
        c.beginPath();
        c.roundRect(LEFT + x, y + 6, l.length, 24, l.river ? 9 : 4);
        c.fill();
        if (l.river) {
          c.strokeStyle = "#705b42";
          for (let z = 13; z < l.length; z += 22) {
            c.beginPath();
            c.moveTo(LEFT + x + z, y + 9);
            c.lineTo(LEFT + x + z, y + 27);
            c.stroke();
          }
        } else {
          c.fillStyle = "#344f5d";
          c.fillRect(LEFT + x + 10, y + 9, 12, 18);
          c.fillRect(LEFT + x + l.length - 22, y + 9, 12, 18);
        }
      }
      c.restore();
    }
    for (let i = 0; i < goals.length; i++) {
      const x = LEFT + goals[i] * STEP;
      c.fillStyle = this.homes.has(i) ? "#c7cc81" : "#254638";
      c.beginPath();
      c.roundRect(x + 2, TOP + 3, 32, 30, 8);
      c.fill();
    }
    if (this.delay <= 0 || Math.floor(this.delay * 10) % 2 === 0) {
      const x = LEFT + this.player.x,
        y = TOP + this.player.row * STEP + 18;
      c.fillStyle = "#b6cb87";
      c.beginPath();
      c.roundRect(x - 10, y - 10, 20, 22, 6);
      c.fill();
      c.fillRect(x - 15, y - 7, 7, 17);
      c.fillRect(x + 8, y - 7, 7, 17);
      c.fillStyle = "#edf0bd";
      c.beginPath();
      c.arc(x - 6, y - 9, 5, 0, 7);
      c.arc(x + 6, y - 9, 5, 0, 7);
      c.fill();
      c.fillStyle = "#203e38";
      c.fillRect(x - 7, y - 11, 2, 3);
      c.fillRect(x + 5, y - 11, 2, 3);
    }
  }
}
