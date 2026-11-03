export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#dbe4d1" />
      <g transform="rotate(-6 200 200)">
        <rect x="40" y="42" width="320" height="316" rx="6" fill="#879c84" />
        <clipPath id="road-art-clip">
          <rect x="49" y="51" width="302" height="298" rx="3" />
        </clipPath>
        <g clipPath="url(#road-art-clip)">
          <rect x="49" y="51" width="302" height="298" fill="#617d55" />
          <path d="M49 73h302v100H49z" fill="#426d7b" />
          <g fill="#aa8c64">
            <rect x="28" y="87" width="111" height="23" rx="10" />
            <rect x="203" y="87" width="111" height="23" rx="10" />
            <rect x="101" y="133" width="111" height="23" rx="10" />
            <rect x="272" y="133" width="111" height="23" rx="10" />
          </g>
          <path d="M49 200h302v112H49z" fill="#48515b" />
          <path
            d="M49 255h302"
            stroke="#b3b3a0"
            strokeWidth="2"
            strokeDasharray="12 15"
          />
          {[
            [83, 215, "#cfa77c"],
            [247, 215, "#94b1bd"],
            [156, 270, "#b7bf91"],
          ].map(([x, y, color], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect width="62" height="27" rx="5" fill={String(color)} />
              <path d="M10 5h11v17H10m32-17h10v17H42" fill="#435e6b" />
            </g>
          ))}
          <g transform="translate(211 187)">
            <rect
              x="-11"
              y="-10"
              width="22"
              height="23"
              rx="6"
              fill="#c0cf8b"
            />
            <path d="M-15-7h7v17h-7m23-17h7v17H8" fill="#adc780" />
            <circle cx="-6" cy="-10" r="5" fill="#e9e9b6" />
            <circle cx="6" cy="-10" r="5" fill="#e9e9b6" />
            <path d="M-7-12h2v3h-2m12-3h2v3H5" fill="#3b5840" />
          </g>
        </g>
      </g>
    </svg>
  );
}
