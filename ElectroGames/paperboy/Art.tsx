export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#dce3d7" />
      <g transform="rotate(-5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#99ab94" />
        <rect x="49" y="53" width="302" height="294" fill="#a5ba8e" />
        <path d="M171 53h108v294H171z" fill="#b6b8a4" />
        <path d="M189 53h90v294h-90z" fill="#5f6e72" />
        <path d="M268 53v294" stroke="#d2c9a9" strokeWidth="2" />
        {[
          [67, 82],
          [72, 233],
          [289, 147],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0 23h60v48H0z" fill={i % 2 ? "#d0ba94" : "#c1c5ae"} />
            <path d="m-7 25 37-28 37 28z" fill="#9f8470" />
            <path d="M11 36h13v14H11m22-14h13v14H33" fill="#6d9296" />
            <path d="M26 53h12v18H26z" fill="#837c62" />
          </g>
        ))}
        <path
          d="M154 148v35m-9-34h19v13h-19z"
          fill="#779caa"
          stroke="#536e6c"
          strokeWidth="2"
        />
        <g transform="translate(223 240)">
          <circle
            cx="-20"
            cy="30"
            r="16"
            fill="none"
            stroke="#c3d0bd"
            strokeWidth="3"
          />
          <circle
            cx="22"
            cy="30"
            r="16"
            fill="none"
            stroke="#c3d0bd"
            strokeWidth="3"
          />
          <path
            d="m-20 30 17-28 25 28H-20l12-18H9m13 18-5-41h-8"
            fill="none"
            stroke="#ccad7d"
            strokeWidth="3"
          />
          <circle cx="-2" cy="-24" r="8" fill="#d8bc94" />
          <path
            d="M-7-15 9-1-4 12"
            fill="none"
            stroke="#9eb4bf"
            strokeWidth="10"
          />
          <path
            d="m2-6-20-9-16 7"
            fill="none"
            stroke="#d6c19b"
            strokeWidth="4"
          />
          <path d="m-2 12 11 17" stroke="#d0ccad" strokeWidth="5" />
        </g>
        <path d="m167 209 16-9 10 7-16 9z" fill="#e5e2d0" />
        <path d="m173 207 11-5" stroke="#9da6a0" strokeWidth="1" />
      </g>
    </svg>
  );
}
