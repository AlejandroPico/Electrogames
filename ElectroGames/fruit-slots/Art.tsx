export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e8ded2" />
      <g transform="rotate(5 200 200)">
        <rect x="50" y="52" width="289" height="296" rx="11" fill="#a48d77" />
        <rect x="62" y="65" width="265" height="271" rx="7" fill="#c8b390" />
        <rect x="75" y="105" width="239" height="128" rx="6" fill="#4f625c" />
        {[83, 160, 237].map((x) => (
          <g key={x}>
            <rect x={x} y="113" width="69" height="112" rx="4" fill="#e1dcc3" />
            <path
              d={`M${x + 3} 122h63m-63 94h63`}
              stroke="#b5bda7"
              strokeWidth="2"
            />
          </g>
        ))}
        <g transform="translate(116 175)">
          <circle cx="-10" cy="5" r="13" fill="#bb8074" />
          <circle cx="12" cy="8" r="13" fill="#c98c78" />
          <path
            d="m-10-7 9-25 13 27"
            fill="none"
            stroke="#748e62"
            strokeWidth="3"
          />
          <path d="m-1-29 13-5-3 10z" fill="#95ad78" />
        </g>
        <g transform="translate(195 175)">
          <ellipse
            rx="22"
            ry="14"
            fill="#d9c278"
            stroke="#b5a461"
            strokeWidth="2"
          />
          <path
            d="m-18-3 6-6"
            stroke="#f1df9c"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(271 174)">
          <path
            d="M-20-11q8 31 38 20-7 27-29 12-13-9-9-32"
            fill="#d8c17b"
            stroke="#b79e62"
            strokeWidth="2"
          />
          <path d="m-20-13 3-5m35 27 5-3" stroke="#789167" strokeWidth="3" />
        </g>
        <path
          d="M340 134h14v91h-14"
          fill="none"
          stroke="#a9b7af"
          strokeWidth="8"
        />
        <circle cx="354" cy="129" r="14" fill="#ca927c" />
        <rect x="84" y="252" width="132" height="39" rx="4" fill="#425951" />
        <circle
          cx="270"
          cy="271"
          r="20"
          fill="#b4c3a2"
          stroke="#e5ddba"
          strokeWidth="3"
        />
        <path
          d="M98 310h196"
          stroke="#9b8e73"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
