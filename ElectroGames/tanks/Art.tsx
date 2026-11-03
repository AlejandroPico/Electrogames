export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e1dfce" />
      <g transform="rotate(-5 200 200)">
        <rect x="38" y="43" width="324" height="314" rx="6" fill="#9aab91" />
        <rect x="48" y="53" width="304" height="294" rx="3" fill="#395448" />
        {[
          [84, 111],
          [226, 111],
          [84, 243],
          [226, 243],
        ].map(([x, y], i) => (
          <g key={i} fill="#ac9270" stroke="#6d7256" strokeWidth="1">
            {Array.from({ length: 6 }, (_, n) => (
              <rect
                key={n}
                x={x + (n % 3) * 18}
                y={y + Math.floor(n / 3) * 18}
                width="17"
                height="17"
              />
            ))}
          </g>
        ))}
        {[
          [166, 283, 0, "#c2ce9d"],
          [164, 95, 180, "#d1af80"],
          [305, 203, 90, "#b7b8a0"],
        ].map(([x, y, a, col], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
            <path d="M-20-22h9v44h-9m31-44h9v44h-9" fill="#263e33" />
            <rect
              x="-12"
              y="-18"
              width="24"
              height="36"
              rx="3"
              fill={String(col)}
            />
            <circle r="9" fill="#61775a" />
            <path d="M-3-32h6V0h-6z" fill={String(col)} />
          </g>
        ))}
        <path d="M166 210v-12m0-27v-12" stroke="#ead3a0" strokeWidth="4" />
        <path d="m281 215 7 8m5-18 6 2" stroke="#d5ac80" strokeWidth="2" />
      </g>
    </svg>
  );
}
