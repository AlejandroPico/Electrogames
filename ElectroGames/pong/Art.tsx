export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <filter id="pong-shadow">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodOpacity=".16" />
        </filter>
      </defs>
      <rect width="400" height="400" fill="#d9e4ed" />
      <g transform="translate(36 58) rotate(6 164 130)">
        <rect
          width="328"
          height="258"
          rx="12"
          fill="#809ba9"
          filter="url(#pong-shadow)"
        />
        <rect x="10" y="10" width="308" height="238" rx="7" fill="#284957" />
        <rect
          x="21"
          y="21"
          width="286"
          height="216"
          rx="3"
          stroke="#6e929c"
          fill="none"
        />
        <path
          d="M164 23V235"
          stroke="#86a6aa"
          strokeWidth="2"
          strokeDasharray="6 9"
        />
        <text
          x="115"
          y="72"
          fontSize="34"
          fontFamily="monospace"
          fill="#afc7c1"
          textAnchor="middle"
        >
          3
        </text>
        <text
          x="212"
          y="72"
          fontSize="34"
          fontFamily="monospace"
          fill="#afc7c1"
          textAnchor="middle"
        >
          2
        </text>
        <rect x="38" y="116" width="9" height="58" rx="2" fill="#c6dbce" />
        <rect x="281" y="76" width="9" height="58" rx="2" fill="#e0b384" />
        <path
          d="m196 162 42-24"
          stroke="#c7d9d2"
          strokeWidth="3"
          opacity=".13"
        />
        <path
          d="m214 151 24-13"
          stroke="#c7d9d2"
          strokeWidth="3"
          opacity=".22"
        />
        <circle cx="240" cy="137" r="7" fill="#efdab3" />
        <circle cx="164" cy="251" r="2" fill="#c1d7cc" />
      </g>
    </svg>
  );
}
