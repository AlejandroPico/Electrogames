export default function Art() {
  const colors = ["#c99a91", "#91b5b4", "#dac28a", "#aaa0c3"];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e0dce8" />
      <g transform="rotate(-5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="9" fill="#a19aaf" />
        <rect x="49" y="53" width="302" height="294" rx="5" fill="#293d52" />
        {Array.from({ length: 33 }, (_, i) => {
          const row = Math.floor(i / 8),
            col = i % 8;
          return (
            <g key={i}>
              <circle
                cx={72 + col * 35 + (row % 2 ? 17 : 0)}
                cy={79 + row * 31}
                r="16"
                fill={colors[(i * 3 + row) % 4]}
                stroke="#d9d9c4"
                strokeWidth="1"
              />
              <path
                d={`M${66 + col * 35 + (row % 2 ? 17 : 0)} ${73 + row * 31}l4-3`}
                stroke="#f3e6d2"
                strokeWidth="3"
                strokeLinecap="round"
                opacity=".6"
              />
            </g>
          );
        })}
        <path
          d="m204 297 49-87"
          stroke="#b9c6bf"
          strokeWidth="2"
          strokeDasharray="5 9"
        />
        <path
          d="m181 322 21-38 22 38"
          fill="#9aafad"
          stroke="#c7d0bd"
          strokeWidth="2"
        />
        <circle
          cx="202"
          cy="302"
          r="17"
          fill="#d4ba80"
          stroke="#f0dbad"
          strokeWidth="2"
        />
        <circle cx="279" cy="320" r="12" fill="#8db1ae" />
      </g>
    </svg>
  );
}
