export default function Art() {
  const rows = [
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000000000",
    "0000001100",
    "2200031100",
    "2200333440",
    "5550366440",
    "5557766440",
  ];
  const colors = [
    "none",
    "#a5bd9a",
    "#e2c78a",
    "#a898bc",
    "#88adb5",
    "#cf9a8d",
    "#9ebbb1",
    "#9caccb",
  ];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#ded9e6" />
      <g transform="rotate(5 200 200)">
        <rect x="76" y="33" width="248" height="334" rx="7" fill="#a3a0ae" />
        <rect x="86" y="43" width="181" height="314" fill="#26364a" />
        <rect x="275" y="43" width="39" height="76" fill="#35465b" />
        {rows.map((r, y) =>
          [...r].map(
            (v, x) =>
              Number(v) > 0 && (
                <rect
                  key={`${x},${y}`}
                  x={90 + x * 17.3}
                  y={76 + y * 17.3}
                  width="16"
                  height="16"
                  fill={colors[Number(v)]}
                />
              ),
          ),
        )}
        <g fill="#b9a4c9">
          <rect x="159" y="92" width="17" height="17" />
          <rect x="142" y="109" width="17" height="17" />
          <rect x="159" y="109" width="17" height="17" />
          <rect x="176" y="109" width="17" height="17" />
        </g>
        <path
          d="m169 161 0 49m-6-6 6 6 6-6"
          stroke="#9daec1"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        <g fill="#dcbb85">
          <rect x="282" y="58" width="12" height="12" />
          <rect x="295" y="58" width="12" height="12" />
          <rect x="282" y="71" width="12" height="12" />
          <rect x="295" y="71" width="12" height="12" />
        </g>
      </g>
    </svg>
  );
}
