export function space(c: CanvasRenderingContext2D, bg = "#142233") {
  c.fillStyle = bg;
  c.fillRect(0, 0, 800, 600);
  c.fillStyle = "#c7d4df";
  for (let i = 0; i < 70; i++) {
    const x = (i * 137.51) % 800,
      y = (i * i * 31.73) % 600;
    c.globalAlpha = 0.18 + (i % 4) * 0.13;
    c.fillRect(x, y, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
  }
  c.globalAlpha = 1;
}
export function label(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "#b9cbd2",
  size = 14,
) {
  c.fillStyle = color;
  c.font = `${size}px system-ui`;
  c.textAlign = "center";
  c.fillText(text, x, y);
}
