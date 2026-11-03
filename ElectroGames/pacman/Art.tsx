import { makeMaze } from "./maze";
const maze = makeMaze();
export default function Art() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <rect width="400" height="400" fill="#dedbe8" />
      <g transform="rotate(-5 200 200)">
        <rect x="34" y="55" width="332" height="290" rx="8" fill="#969ab2" />
        <rect x="44" y="65" width="312" height="270" rx="4" fill="#1e2d46" />
        {maze.map((r, y) =>
          r.map((wall, x) =>
            wall ? (
              <rect
                key={`${x},${y}`}
                x={62 + x * 12}
                y={86 + y * 12}
                width="10"
                height="10"
                rx="2"
                fill="#42627f"
              />
            ) : (
              <circle
                key={`${x},${y}`}
                cx={67 + x * 12}
                cy={91 + y * 12}
                r="1"
                fill="#ddc995"
              />
            ),
          ),
        )}
        <path d="m79 115 13-8a15 15 0 1 0 0 16z" fill="#e8c468" />
        <g transform="translate(260 226)">
          <path
            d="M-12 13V0a12 12 0 0 1 24 0v13l-6-4-6 4-6-4z"
            fill="#d39089"
          />
          <path d="M-6-2h4v5h-4m8-5h4v5H2" fill="#f4eed4" />
        </g>
        <g transform="translate(188 141)">
          <path
            d="M-11 12V0a11 11 0 0 1 22 0v12l-6-4-5 4-5-4z"
            fill="#86b9b9"
          />
          <path d="M-6-2h4v5h-4m8-5h4v5H2" fill="#f4eed4" />
        </g>
      </g>
    </svg>
  );
}
