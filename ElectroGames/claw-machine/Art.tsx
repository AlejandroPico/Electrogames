export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e6dbe3" />
      <g transform="rotate(5 200 200)">
        <rect x="66" y="31" width="268" height="338" rx="9" fill="#b19ba9" />
        <rect x="79" y="45" width="242" height="244" rx="3" fill="#a5b8be" />
        <path d="M88 54h224v222H88z" fill="#314b59" />
        <path d="M88 264h224v12H88z" fill="#718f98" />
        <path d="M99 62h202" stroke="#cbd1c1" strokeWidth="5" />
        <path d="M202 62v88" stroke="#bcc8be" strokeWidth="3" />
        <path
          d="m202 146-17 18-5 29 16 11m6-58 17 18 5 29-16 11"
          fill="none"
          stroke="#d3d3bf"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="202" cy="146" r="8" fill="#b5aaa2" />
        {[
          [125, 240, "#c69b8f"],
          [181, 251, "#a5bb98"],
          [247, 245, "#d3bd87"],
          [283, 232, "#9facbd"],
        ].map(([x, y, col], i) => (
          <g key={i} transform={`translate(${x} ${y})`} fill={String(col)}>
            <circle cx="-12" cy="-16" r="8" />
            <circle cx="12" cy="-16" r="8" />
            <circle cy="-8" r="17" />
            <ellipse cy="15" rx="20" ry="22" />
            <circle cx="-14" cy="32" r="10" />
            <circle cx="14" cy="32" r="10" />
            <path d="M-6-11v4m12-4v4" stroke="#52666a" strokeWidth="2" />
          </g>
        ))}
        <path d="M79 297h242v57H79z" fill="#8b8190" />
        <path d="M90 307h100v36H90z" fill="#394d58" />
        <path
          d="M238 325h43"
          stroke="#dac1a0"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M247 325v-14" stroke="#c5cbb7" strokeWidth="5" />
        <circle cx="247" cy="307" r="8" fill="#d4aa83" />
        <circle cx="295" cy="326" r="8" fill="#b9c7ab" />
      </g>
    </svg>
  );
}
