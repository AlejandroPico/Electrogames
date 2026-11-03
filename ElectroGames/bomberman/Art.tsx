export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#dce5d7" />
      <g transform="rotate(5 200 200)">
        <rect x="37" y="39" width="326" height="322" rx="8" fill="#93a58a" />
        <rect x="48" y="50" width="304" height="300" fill="#5d7a5e" />
        {Array.from({ length: 25 }, (_, i) => (
          <rect
            key={i}
            x={63 + (i % 5) * 60}
            y={64 + Math.floor(i / 5) * 57}
            width="34"
            height="33"
            rx="3"
            fill="#a8b19b"
            stroke="#ccd0b7"
            strokeWidth="2"
          />
        ))}
        <g fill="#b59d77" stroke="#7d8465" strokeWidth="2">
          <path d="M108 104h34v33h-34zM228 104h34v33h-34zM168 218h34v33h-34zM288 275h34v33h-34z" />
        </g>
        <path
          d="M185 137v84m-42-42h84"
          stroke="#dfbd76"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M185 149v60m-30-30h60"
          stroke="#f1d49e"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="305" cy="237" r="14" fill="#2b4445" />
        <path d="m310 224 8-12" stroke="#dccaa5" strokeWidth="3" />
        <path d="m316 208 9 3m-6-10 3 4" stroke="#e4ad74" strokeWidth="2" />
        <g transform="translate(123 294)">
          <rect x="-13" y="-20" width="26" height="24" rx="7" fill="#e5e1cc" />
          <path d="M-9-14H9v12H-9z" fill="#47676d" />
          <path d="M-10 5h20v18h-20z" fill="#a4b5c2" />
          <circle cy="-24" r="5" fill="#d4a28c" />
          <path
            d="M-13 23h10m6 0h10"
            stroke="#d6a48c"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
