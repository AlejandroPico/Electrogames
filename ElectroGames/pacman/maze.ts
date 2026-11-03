export const COLS = 23,
  ROWS = 19,
  CELL = 26,
  OX = 101,
  OY = 53;
const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];
export function makeMaze() {
  const walls = Array.from(
    { length: ROWS },
    () => Array(COLS).fill(true) as boolean[],
  );
  let seed = 421;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const stack = [{ x: 1, y: 1 }];
  walls[1][1] = false;
  while (stack.length) {
    const p = stack[stack.length - 1];
    const choices = dirs.filter(
      (d) =>
        p.x + d.x * 2 > 0 &&
        p.x + d.x * 2 < COLS - 1 &&
        p.y + d.y * 2 > 0 &&
        p.y + d.y * 2 < ROWS - 1 &&
        walls[p.y + d.y * 2][p.x + d.x * 2],
    );
    if (!choices.length) {
      stack.pop();
      continue;
    }
    const d = choices[Math.floor(rand() * choices.length)];
    walls[p.y + d.y][p.x + d.x] = false;
    walls[p.y + d.y * 2][p.x + d.x * 2] = false;
    stack.push({ x: p.x + d.x * 2, y: p.y + d.y * 2 });
  }
  for (let y = 1; y < ROWS - 1; y++)
    for (let x = 1; x < COLS - 1; x++)
      if (
        walls[y][x] &&
        rand() < 0.3 &&
        ((!walls[y - 1][x] && !walls[y + 1][x]) ||
          (!walls[y][x - 1] && !walls[y][x + 1]))
      )
        walls[y][x] = false;
  return walls;
}
