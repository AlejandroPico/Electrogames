export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#d9e4d6" />
      <g transform="rotate(5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#92a78f" />
        <rect x="49" y="53" width="302" height="294" rx="4" fill="#283e3c" />
        {[
          [91, 157],
          [171, 131],
          [245, 187],
          [300, 244],
          [141, 254],
          [207, 285],
          [84, 285],
          [315, 131],
          [218, 109],
          [121, 201],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path
              d="M-13 0a13 11 0 0 1 26 0z"
              fill={i % 2 ? "#c49a88" : "#aab48a"}
            />
            <path d="M-4 0h8v11h-8z" fill="#d1c6a4" />
            <circle cx="-5" cy="-4" r="2" fill="#e3d5b6" />
            <circle cx="6" cy="-4" r="2" fill="#e3d5b6" />
          </g>
        ))}
        <path
          d="M84 90h159q46 0 46 31v29"
          stroke="#476e5c"
          strokeWidth="21"
          fill="none"
          strokeLinecap="round"
        />
        {[
          [86, 90],
          [111, 90],
          [136, 90],
          [161, 90],
          [186, 90],
          [211, 90],
          [236, 91],
          [261, 99],
          [282, 117],
          [289, 142],
        ].map(([x, y], i) => (
          <g key={i}>
            <path
              d={`m${x - 5} ${y - 10}-4-6m14 16 5 7`}
              stroke="#b9c59c"
              strokeWidth="2"
            />
            <circle
              cx={x}
              cy={y}
              r="11"
              fill={i === 9 ? "#d1ac77" : "#a0b48b"}
              stroke="#d2d9ae"
              strokeWidth="1.5"
            />
          </g>
        ))}
        <path d="M188 333v-14l12-12 12 12v14z" fill="#9bbcb8" />
        <path d="M200 286v-15m0-19v-15" stroke="#ebd8a5" strokeWidth="3" />
      </g>
    </svg>
  );
}
