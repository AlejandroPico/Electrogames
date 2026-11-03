export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <filter id="breakout-shadow">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodOpacity=".16" />
        </filter>
      </defs>
      <rect width="400" height="400" fill="#e9dbd5" />
      <g transform="translate(55 36) rotate(-5 145 145)">
        <rect
          width="290"
          height="292"
          rx="8"
          fill="#b5a4a2"
          filter="url(#breakout-shadow)"
        />
        <rect x="9" y="9" width="272" height="274" rx="3" fill="#313d50" />
        {["#d59a91", "#ddba8c", "#ded29a", "#9dbdb3"].map((color, row) => (
          <g key={color} fill={color}>
            {Array.from(
              { length: 6 },
              (_, col) =>
                !(row === 3 && (col === 2 || col === 3)) && (
                  <g key={col}>
                    <rect
                      x={22 + col * 42}
                      y={32 + row * 23}
                      width="37"
                      height="17"
                      rx="2"
                    />
                    <path
                      d={`M${25 + col * 42} ${35 + row * 23}h31`}
                      stroke="#ffffff35"
                      strokeWidth="2"
                    />
                  </g>
                ),
            )}
          </g>
        ))}
        <path
          d="m177 222-40-72 23-26"
          stroke="#e3c99d"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
          opacity=".35"
        />
        <circle cx="177" cy="222" r="6" fill="#f1dcb4" />
        <rect x="148" y="253" width="77" height="8" rx="4" fill="#b9ccd4" />
        <path d="m119 124-7 10m35-15 7 8" stroke="#d6b58a" strokeWidth="2" />
      </g>
    </svg>
  );
}
