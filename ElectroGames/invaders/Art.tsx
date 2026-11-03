export default function Art() {
  const sprite = "00111000111110011111111101011010010010";
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#d7e4dc" />
      <g transform="rotate(5 200 200)">
        <rect x="39" y="40" width="322" height="320" rx="12" fill="#90aa9c" />
        <rect x="50" y="51" width="300" height="298" rx="7" fill="#213d3d" />
        {Array.from({ length: 15 }, (_, i) => (
          <g
            key={i}
            fill={["#d6bb87", "#a5c8a2", "#85b7b7"][Math.floor(i / 5)]}
          >
            {[...sprite].map(
              (v, n) =>
                v === "1" && (
                  <rect
                    key={n}
                    x={77 + (i % 5) * 51 + (n % 7) * 4}
                    y={78 + Math.floor(i / 5) * 48 + Math.floor(n / 7) * 4}
                    width="3.5"
                    height="3.5"
                  />
                ),
            )}
          </g>
        ))}
        <g fill="#6e9a80">
          <path d="M83 251v-23h51v23h-15v-10h-22v10z" />
          <path d="M175 251v-23h51v23h-15v-10h-22v10z" />
          <path d="M267 251v-23h51v23h-15v-10h-22v10z" />
        </g>
        <path d="M176 313v-10h9v-8h10v-9h10v9h10v8h9v10z" fill="#c4d7b8" />
        <path d="M200 272v-17m-60-45v12" stroke="#dfb989" strokeWidth="3" />
        <path d="M65 331h270" stroke="#7c9b83" />
      </g>
    </svg>
  );
}
