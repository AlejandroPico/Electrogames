export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#e7dcd0" />
      <g transform="rotate(5 200 200)">
        <rect x="38" y="42" width="324" height="316" rx="8" fill="#a6947c" />
        <rect x="49" y="53" width="302" height="294" fill="#3e4e49" />
        {[103, 166, 229, 292].map((y, i) => (
          <g key={y}>
            <path d={`M66 ${y + 11}h268v14H66z`} fill="#a68b65" />
            <path d={`M66 ${y + 11}h268`} stroke="#d6be91" strokeWidth="3" />
            <g transform={`translate(${91 + (i % 2) * 28} ${y - 7})`}>
              <circle cy="-13" r="9" fill="#d7bc94" />
              <path
                d="M-13-2h26v19h-26z"
                fill={["#8caaa3", "#b3b78f", "#a19bb1", "#b5a18a"][i]}
              />
              <path d="M-12-20h24v7h-24z" fill="#657a70" />
            </g>
            <g transform={`translate(${198 - (i % 2) * 31} ${y - 6})`}>
              <rect
                x="-7"
                y="-9"
                width="15"
                height="21"
                rx="2"
                fill="#d5b978"
              />
              <path
                d="M9-6h6v13H9"
                fill="none"
                stroke="#d8d8b6"
                strokeWidth="3"
              />
              <rect
                x="-8"
                y="-12"
                width="17"
                height="5"
                rx="2"
                fill="#e7e1c7"
              />
            </g>
          </g>
        ))}
        <g transform="translate(307 218)">
          <circle cy="-22" r="10" fill="#ddc49c" />
          <path d="M-13-10h26v26h-26z" fill="#b3c4ac" />
          <path d="M-9-7H9v30H-9z" fill="#ddd9bd" />
          <path
            d="m-12-2-19-8m43 8 14-12"
            stroke="#dcc49d"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M-13-30h26v8h-26z" fill="#bfcbb8" />
        </g>
      </g>
    </svg>
  );
}
