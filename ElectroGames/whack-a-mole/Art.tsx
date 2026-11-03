export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e5dfcf" />
      <g transform="rotate(-5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#a69d7c" />
        <rect x="49" y="53" width="302" height="294" fill="#adc08e" />
        {Array.from({ length: 9 }, (_, i) => (
          <g
            key={i}
            transform={`translate(${99 + (i % 3) * 100} ${128 + Math.floor(i / 3) * 86})`}
          >
            <ellipse cy="9" rx="34" ry="16" fill="#7f8968" />
            <ellipse cy="7" rx="27" ry="11" fill="#3e5648" />
            {[1, 3, 8].includes(i) && (
              <g>
                <path d="M-21 7V-12a21 21 0 0 1 42 0V7z" fill="#a78b69" />
                <circle cx="-15" cy="-20" r="7" fill="#ad9370" />
                <circle cx="15" cy="-20" r="7" fill="#ad9370" />
                <ellipse cy="-3" rx="13" ry="9" fill="#d0b797" />
                <path d="M-7-15v4m14-4v4" stroke="#3d5650" strokeWidth="3" />
                <circle cy="-5" r="4" fill="#826d5b" />
              </g>
            )}
          </g>
        ))}
        <g transform="translate(288 90) rotate(-29)">
          <rect x="-6" y="-8" width="12" height="83" rx="4" fill="#b99b6c" />
          <rect
            x="-29"
            y="-30"
            width="58"
            height="35"
            rx="8"
            fill="#a9b8bc"
            stroke="#d3d7c5"
            strokeWidth="2"
          />
          <path d="M-17-27V2m34-29V2" stroke="#7f989f" strokeWidth="3" />
        </g>
        <path
          d="m232 67-9-10m-1 24-15-2m26-24-3-13"
          stroke="#d1a777"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
