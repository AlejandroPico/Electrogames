export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e3dfce" />
      <g transform="rotate(5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#a49c81" />
        <rect x="49" y="53" width="302" height="294" fill="#34413b" />
        {Array.from({ length: 63 }, (_, i) => {
          const x = 64 + (i % 9) * 31,
            y = 68 + Math.floor(i / 9) * 37;
          return i % 9 === 3 ||
            Math.floor(i / 9) === 4 ||
            i === 38 ||
            i === 39 ? null : (
            <g key={i}>
              <rect x={x} y={y} width="28" height="34" fill="#8b7959" />
              <path
                d={`m${x + 4} ${y + 9} 5-3m9 12 5-4m-17 12 5-3`}
                stroke="#b39b70"
                strokeWidth="2"
              />
            </g>
          );
        })}
        <g fill="#9fa9a1" stroke="#c6c6b2" strokeWidth="2">
          <path d="m88 181 12-13 17 6 5 20-13 11-18-8z" />
          <path d="m244 254 10-15 19 5 7 18-12 12-18-4z" />
          <path d="m213 108 11-14 18 5 7 17-13 15-17-5z" />
        </g>
        {[
          [269, 219],
          [173, 220],
          [141, 294],
          [300, 108],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path
              d="m0-14 14 11-14 18L-14-3z"
              fill="#90bab6"
              stroke="#d2dfcf"
              strokeWidth="1.5"
            />
            <path
              d="m-14-3 14 4 14-4M0-14v15l-4 12"
              fill="none"
              stroke="#d2dfcf"
              strokeWidth="1"
            />
          </g>
        ))}
        <g transform="translate(167 182)">
          <circle cy="-9" r="9" fill="#dfc39b" />
          <path d="M-10-16H9v6h-19z" fill="#e0b97d" />
          <path d="M-9 1H9v20H-9z" fill="#b2c396" />
          <path d="m-5 19-7 10m17-10 7 10" stroke="#d7cfac" strokeWidth="5" />
        </g>
      </g>
    </svg>
  );
}
