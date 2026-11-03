export type Cell = {
  mine: boolean;
  open: boolean;
  flag: boolean;
  adjacent: number;
};
export type Board = {
  width: number;
  height: number;
  mines: number;
  cells: Cell[];
  started: boolean;
  over: boolean;
  won: boolean;
};
export function neighbors(i: number, w: number, h: number) {
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const x = (i % w) + dx,
        y = Math.floor(i / w) + dy;
      if ((dx || dy) && x >= 0 && y >= 0 && x < w && y < h) out.push(y * w + x);
    }
  return out;
}
export function board(width = 9, height = 9, mines = 10): Board {
  return {
    width,
    height,
    mines,
    cells: Array.from({ length: width * height }, () => ({
      mine: false,
      open: false,
      flag: false,
      adjacent: 0,
    })),
    started: false,
    over: false,
    won: false,
  };
}
export function reveal(
  state: Board,
  index: number,
  random = Math.random,
): Board {
  const b = { ...state, cells: state.cells.map((c) => ({ ...c })) };
  if (b.over || !b.cells[index] || b.cells[index].flag || b.cells[index].open)
    return b;
  if (!b.started) {
    const safe = new Set([index, ...neighbors(index, b.width, b.height)]);
    const pool = b.cells.map((_, i) => i).filter((i) => !safe.has(i));
    for (let n = 0; n < b.mines; n++) {
      const pos = Math.min(pool.length - 1, Math.floor(random() * pool.length));
      b.cells[pool.splice(pos, 1)[0]].mine = true;
    }
    for (let i = 0; i < b.cells.length; i++)
      b.cells[i].adjacent = neighbors(i, b.width, b.height).filter(
        (j) => b.cells[j].mine,
      ).length;
    b.started = true;
  }
  if (b.cells[index].mine) {
    b.cells[index].open = true;
    b.over = true;
    return b;
  }
  const queue = [index];
  const seen = new Set<number>();
  while (queue.length) {
    const i = queue.pop()!;
    if (seen.has(i)) continue;
    seen.add(i);
    const c = b.cells[i];
    if (c.flag || c.mine) continue;
    c.open = true;
    if (!c.adjacent) queue.push(...neighbors(i, b.width, b.height));
  }
  b.won = b.cells.every((c) => c.mine || c.open);
  b.over = b.won;
  return b;
}
export function flag(state: Board, index: number): Board {
  if (state.over || !state.cells[index] || state.cells[index].open)
    return state;
  const cells = state.cells.map((c) => ({ ...c }));
  if (!cells[index].flag && cells.filter((c) => c.flag).length >= state.mines)
    return state;
  cells[index].flag = !cells[index].flag;
  return { ...state, cells };
}
