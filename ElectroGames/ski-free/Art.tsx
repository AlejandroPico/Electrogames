export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#dbe3e6" />
      <g transform="rotate(-5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#9aaeb6" />
        <rect x="49" y="53" width="302" height="294" fill="#dfe4dd" />
        <path
          d="M149 57q-34 50 31 79t21 76q-37 36 15 72"
          stroke="#adbfc1"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M158 57q-34 50 31 79t21 76q-37 36 15 72"
          stroke="#b8c7c6"
          strokeWidth="2"
          fill="none"
        />
        {[
          [91, 100],
          [284, 117],
          [102, 251],
          [309, 281],
          [143, 322],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M-3 14h6v14h-6z" fill="#8d8970" />
            <path
              d="m0-31 18 27H9l16 23h-50L-9-4h-9z"
              fill={i % 2 ? "#779780" : "#668c7d"}
            />
            <path d="m0-22 9 14H-9z" fill="#b5c8b6" />
          </g>
        ))}
        <g transform="translate(219 218) rotate(-23)">
          <path
            d="m-13 8-5 37m27-37 5 37"
            stroke="#ac8270"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cy="-18" r="9" fill="#d9bf99" />
          <path d="M-9-10H9L14 9l-14 7-14-7z" fill="#88a8bc" />
          <path d="m-8 9-5 16m21-16 5 16" stroke="#3f5f6a" strokeWidth="6" />
          <path d="m-13-1-17 22m43-22 17 22" stroke="#8b9d9b" strokeWidth="2" />
          <path d="m-12-20 4-7H7l6 7" fill="#c69081" />
        </g>
        <path d="m299 207 25 11-25 2z" fill="#d4a18a" />
        <path d="M299 207v37" stroke="#8b9e9e" strokeWidth="2" />
      </g>
    </svg>
  );
}
