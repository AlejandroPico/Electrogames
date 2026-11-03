export default function Art() {
  const values: Record<number, string> = {
    0: "1",
    1: "1",
    5: "1",
    6: "2",
    7: "1",
    10: "1",
    11: "⚑",
    12: "2",
    15: "1",
    16: "2",
    17: "2",
    18: "1",
    20: "1",
    21: "1",
    22: "1",
  };
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <filter id="mines-shadow">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodOpacity=".15" />
        </filter>
      </defs>
      <rect width="400" height="400" fill="#e7dece" />
      <g transform="translate(78 37) rotate(7 122 140)">
        <rect
          width="244"
          height="289"
          rx="6"
          fill="#c2baaa"
          filter="url(#mines-shadow)"
        />
        <rect x="10" y="10" width="224" height="43" fill="#e4ddcf" />
        <rect x="19" y="17" width="58" height="27" fill="#4c514b" />
        <text
          x="48"
          y="36"
          textAnchor="middle"
          fontSize="20"
          fontFamily="monospace"
          fill="#e6b58b"
        >
          010
        </text>
        <circle cx="122" cy="31" r="12" fill="#e7c675" />
        <path
          d="M116 34q6 6 12 0"
          stroke="#7d714c"
          fill="none"
          strokeWidth="1.5"
        />
        <path d="M117 27v2m10-2v2" stroke="#7d714c" strokeWidth="2" />
        <rect x="167" y="17" width="58" height="27" fill="#4c514b" />
        <text
          x="196"
          y="36"
          textAnchor="middle"
          fontSize="20"
          fontFamily="monospace"
          fill="#e6b58b"
        >
          024
        </text>
        {Array.from({ length: 25 }, (_, i) => (
          <g
            key={i}
            transform={`translate(${14 + (i % 5) * 44} ${64 + Math.floor(i / 5) * 43})`}
          >
            <rect
              width="41"
              height="40"
              fill={i < 10 || i % 5 < 2 ? "#dfd9cb" : "#b5b6a5"}
            />
            <path
              d="M1 39V1h39"
              fill="none"
              stroke={i < 10 || i % 5 < 2 ? "#e8e3d8" : "#e7e4d6"}
              strokeWidth="3"
            />
            <text
              x="20"
              y="27"
              textAnchor="middle"
              fill={
                values[i] === "2"
                  ? "#6c8766"
                  : values[i] === "⚑"
                    ? "#ad6b5c"
                    : "#648193"
              }
              fontSize="24"
              fontWeight="600"
              fontFamily="monospace"
            >
              {values[i] ?? ""}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
