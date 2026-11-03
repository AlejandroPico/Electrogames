export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <pattern
          id="snake-grid"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path d="M22 0H0V22" fill="none" stroke="#a8c2b2" strokeWidth=".7" />
        </pattern>
        <filter id="snake-shadow">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodOpacity=".14" />
        </filter>
      </defs>
      <rect width="400" height="400" fill="#dce6df" />
      <g transform="translate(43 48) rotate(-7 155 150)">
        <rect
          x="0"
          y="0"
          width="314"
          height="278"
          rx="9"
          fill="#b8cdbc"
          filter="url(#snake-shadow)"
        />
        <rect x="12" y="12" width="290" height="254" rx="3" fill="#d3e0cf" />
        <rect x="12" y="12" width="290" height="254" fill="url(#snake-grid)" />
        <path
          d="M69 204H135V160H223V94H179V116H113V72H69"
          stroke="#567b62"
          strokeWidth="23"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M69 202H135V158H223V92H179V114H113V70H69"
          stroke="#779b70"
          strokeWidth="19"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect x="50" y="57" width="30" height="28" rx="8" fill="#3c654d" />
        <circle cx="57" cy="64" r="3" fill="#eaf0d6" />
        <circle cx="57" cy="77" r="3" fill="#eaf0d6" />
        <path d="M48 70H37" stroke="#aa6658" strokeWidth="3" />
        <circle cx="245" cy="204" r="13" fill="#ca8963" />
        <path
          d="M244 191q-4-13 8-16"
          stroke="#527357"
          strokeWidth="3"
          fill="none"
        />
        <path d="M251 184q15-7 17 2-10 7-17-2" fill="#779b70" />
      </g>
    </svg>
  );
}
