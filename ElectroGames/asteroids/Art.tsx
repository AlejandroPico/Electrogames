export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#d7dfe8" />
      <g transform="rotate(-6 200 200)">
        <rect x="39" y="42" width="322" height="316" rx="8" fill="#9aabb9" />
        <rect x="49" y="52" width="302" height="296" rx="4" fill="#223446" />
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={61 + ((i * 83) % 278)}
            cy={65 + ((i * i * 23) % 270)}
            r={i % 4 === 0 ? 1.5 : 0.8}
            fill="#b0c8d1"
            opacity=".5"
          />
        ))}
        <g fill="#44596b" stroke="#a6bdc7" strokeWidth="2">
          <path d="m101 85 29-12 29 18 7 29-19 28-36 3-27-26z" />
          <path d="m277 224 31-8 25 30-6 30-25 16-32-12-10-29z" />
          <path d="m88 259 19-14 23 6 9 21-15 22-29-6z" />
        </g>
        <g transform="translate(212 204) rotate(-28)">
          <path
            d="m0-33-23 53 23-11 23 11z"
            fill="#b0d0c4"
            stroke="#dde5ce"
            strokeWidth="2"
          />
          <path d="m-8 19 8 28 8-28" fill="#d6ad77" />
        </g>
        <path
          d="m231 147 7-18m11-34 5-13"
          stroke="#e6d3a2"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="m273 119 10-9m-11-9 7 2" stroke="#d3a27c" strokeWidth="2" />
      </g>
    </svg>
  );
}
