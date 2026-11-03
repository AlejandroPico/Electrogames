import type { Engine, Input } from "../../src/shared/Arcade";
const W = 18,
  H = 13,
  S = 36,
  OX = 76,
  OY = 66;
export class BoulderEngine implements Engine {
  score = 0;
  over = false;
  won = false;
  status = "";
  time = 120;
  gems = 0;
  player = { x: 1, y: 1 };
  repeat = 0;
  gravity = 0;
  falling = new Set<string>();
  board: number[][] = [];
  constructor() {
    for (let y = 0; y < H; y++)
      this.board.push(
        Array.from({ length: W }, (_, x) =>
          !x || !y || x === W - 1 || y === H - 1
            ? 1
            : Math.random() < 0.18
              ? 3
              : 2,
        ),
      );
    this.board[1][1] = 0;
    for (let i = 0; i < 18; i++) {
      const x = 2 + ((i * 7) % 14),
        y = 2 + ((Math.floor(i / 3) * 2) % 9);
      this.board[y][x] = 4;
    }
    this.board[11][16] = 5;
  }
  move(dx: number, dy: number) {
    const x = this.player.x + dx,
      y = this.player.y + dy,
      v = this.board[y]?.[x];
    if (v === 1 || (v === 5 && this.gems < 10)) return;
    if (v === 3) {
      if (!dx || this.board[y]?.[x + dx] !== 0) return;
      this.board[y][x + dx] = 3;
    }
    if (v === 4) {
      this.gems++;
      this.score += 100;
    }
    if (v === 2) this.score++;
    if (v === 5) {
      this.score += Math.floor(this.time) * 5;
      this.won = this.over = true;
    }
    this.board[y][x] = v === 5 ? 5 : 0;
    this.player = { x, y };
  }
  update(dt: number, input: Input) {
    if (this.over) return;
    this.time -= dt;
    this.repeat -= dt;
    this.gravity += dt;
    const names = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"],
      letters = ["w", "d", "s", "a"];
    let d = -1;
    for (const key of input.pressed?.splice(0) ?? []) {
      const n = Math.max(names.indexOf(key), letters.indexOf(key));
      if (n >= 0) {
        d = n;
        break;
      }
    }
    if (d < 0 && this.repeat <= 0)
      d = names.findIndex(
        (k, i) => input.keys.has(k) || input.keys.has(letters[i]),
      );
    if (d >= 0) {
      this.repeat = 0.12;
      this.move([0, 1, 0, -1][d], [-1, 0, 1, 0][d]);
    }
    if (this.gravity >= 0.2) {
      this.gravity = 0;
      const next = new Set<string>();
      for (let y = H - 2; y > 0; y--)
        for (let x = 1; x < W - 1; x++)
          if (this.board[y][x] === 3) {
            const belowPlayer = this.player.x === x && this.player.y === y + 1;
            if (belowPlayer) {
              if (this.falling.has(`${x},${y}`)) this.over = true;
              continue;
            }
            if (this.board[y + 1][x] === 0) {
              this.board[y][x] = 0;
              this.board[y + 1][x] = 3;
              next.add(`${x},${y + 1}`);
            } else if ([1, 3].includes(this.board[y + 1][x])) {
              for (const dx of [-1, 1])
                if (
                  this.board[y][x + dx] === 0 &&
                  this.board[y + 1][x + dx] === 0
                ) {
                  this.board[y][x] = 0;
                  this.board[y + 1][x + dx] = 3;
                  next.add(`${x + dx},${y + 1}`);
                  if (this.player.x === x + dx && this.player.y === y + 1)
                    this.over = true;
                  break;
                }
            }
          }
      this.falling = next;
    }
    if (this.time <= 0) this.over = true;
    this.status = `${this.gems}/10 diamantes · ${Math.ceil(this.time)} s`;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#293c3b";
    c.fillRect(0, 0, 800, 600);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const v = this.board[y][x],
          px = OX + x * S,
          py = OY + y * S;
        c.fillStyle = v === 1 ? "#7f8b81" : v === 2 ? "#846a4f" : "#203934";
        c.fillRect(px + 1, py + 1, S - 2, S - 2);
        if (v === 2) {
          c.fillStyle = "#b3936a";
          c.fillRect(px + 8, py + 9, 3, 3);
          c.fillRect(px + 24, py + 25, 2, 2);
        }
        if (v === 3) {
          c.fillStyle = "#a5a894";
          c.beginPath();
          c.arc(px + 18, py + 18, 15, 0, 7);
          c.fill();
          c.strokeStyle = "#cbd0b4";
          c.beginPath();
          c.arc(px + 15, py + 14, 8, Math.PI, Math.PI * 1.6);
          c.stroke();
        }
        if (v === 4) {
          c.fillStyle = "#91c7c7";
          c.beginPath();
          c.moveTo(px + 18, py + 4);
          c.lineTo(px + 31, py + 16);
          c.lineTo(px + 18, py + 32);
          c.lineTo(px + 5, py + 16);
          c.closePath();
          c.fill();
        }
        if (v === 5) {
          c.fillStyle = this.gems >= 10 ? "#d5c877" : "#697260";
          c.fillRect(px + 7, py + 4, 22, 30);
        }
      }
    c.fillStyle = "#e7c598";
    c.beginPath();
    c.arc(
      OX + (this.player.x + 0.5) * S,
      OY + (this.player.y + 0.4) * S,
      10,
      0,
      7,
    );
    c.fill();
    c.fillStyle = "#9ab7ab";
    c.fillRect(OX + this.player.x * S + 9, OY + this.player.y * S + 19, 18, 14);
  }
}
