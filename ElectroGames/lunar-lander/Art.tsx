export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#dce0e5" />
      <g transform="rotate(6 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#95a3b3" />
        <clipPath id="lunar-art-clip">
          <rect x="49" y="53" width="302" height="294" rx="3" />
        </clipPath>
        <g clipPath="url(#lunar-art-clip)">
          <rect x="49" y="53" width="302" height="294" fill="#25364b" />
          {Array.from({ length: 25 }, (_, i) => (
            <circle
              key={i}
              cx={61 + ((i * 79) % 278)}
              cy={65 + ((i * i * 19) % 190)}
              r="1"
              fill="#a8bdca"
            />
          ))}
          <circle cx="287" cy="104" r="24" fill="#8395a6" />
          <path
            d="m49 290 39-34 44 28 42-14 25 42h86l31-58 35 28v65H49z"
            fill="#65717a"
          />
          <path
            d="m49 290 39-34 44 28 42-14 25 42h86l31-58 35 28"
            fill="none"
            stroke="#adb4ac"
            strokeWidth="2"
          />
          <path d="M199 311h86" stroke="#c9d09a" strokeWidth="4" />
          <path d="m213 311v-15m57 15v-15" stroke="#c9d09a" strokeWidth="2" />
          <g transform="translate(211 196) rotate(-12)">
            <path d="m-8 10 8 34 8-34" fill="#ddb17c" />
            <path
              d="M-18 7v-22L0-27l18 12V7z"
              fill="#d5d0b5"
              stroke="#f0d7a5"
              strokeWidth="2"
            />
            <path d="M-8-16H8v10H-8z" fill="#698c9f" />
            <path
              d="m-13 5-15 17h-9m50-17 15 17h9"
              stroke="#c3c4b3"
              strokeWidth="3"
              fill="none"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
