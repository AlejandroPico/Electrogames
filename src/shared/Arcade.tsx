import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, HelpCircle, Trophy } from "lucide-react";
import Modal from "./Modal";
import { read, record } from "./storage";
export type Input = {
  keys: Set<string>;
  pointer: number | null;
  pointerY?: number | null;
  pressed?: string[];
};
export type Engine = {
  score: number;
  over: boolean;
  won?: boolean;
  status?: string;
  update: (dt: number, input: Input) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};
export type ArcadeProps = {
  id: string;
  title: string;
  instructions: string;
  hint: string;
  create: () => Engine;
  controls?: "arrows" | "paddle" | "vertical";
  buttons?: { key: string; label: string }[];
  dimensions?: { width: number; height: number };
};
export default function Arcade({
  id,
  title,
  instructions,
  hint,
  create,
  controls = "paddle",
  buttons,
  dimensions,
}: ArcadeProps) {
  const canvasWidth = dimensions?.width ?? 800,
    canvasHeight = dimensions?.height ?? 600;
  const canvas = useRef<HTMLCanvasElement>(null),
    engine = useRef<Engine | null>(null),
    input = useRef<Input>({ keys: new Set(), pointer: null, pressed: [] });
  const [phase, setPhase] = useState<"ready" | "playing" | "paused" | "over">(
      "ready",
    ),
    [score, setScore] = useState(0),
    [best, setBest] = useState(() => Number(read(`best:${id}`, "0")) || 0),
    [help, setHelp] = useState(false),
    [status, setStatus] = useState("");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  function restart() {
    engine.current = create();
    input.current.keys.clear();
    input.current.pressed = [];
    input.current.pointer = null;
    input.current.pointerY = null;
    setScore(0);
    setStatus("");
    setPhase("ready");
  }
  function toggle() {
    setPhase((p) =>
      p === "playing" ? "paused" : p === "over" ? "over" : "playing",
    );
  }
  useEffect(() => {
    engine.current = create();
    let frame = 0,
      last = 0;
    const ctx = canvas.current!.getContext("2d")!;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.025);
      last = now;
      const e = engine.current!;
      if (phaseRef.current === "playing") {
        e.update(dt, input.current);
        setScore(e.score);
        setStatus(e.status ?? "");
        if (e.over) {
          setBest(record(id, e.score));
          setPhase("over");
        }
      }
      e.draw(ctx);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [create, id]);
  useEffect(() => {
    const allowed = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "w",
      "a",
      "s",
      "d",
      "W",
      "A",
      "S",
      "D",
      " ",
      "p",
      "P",
      "z",
      "Z",
      "x",
      "X",
    ];
    const down = (e: KeyboardEvent) => {
      if (
        help ||
        document.querySelector("dialog[open]") ||
        e.target instanceof HTMLInputElement
      )
        return;
      if (allowed.includes(e.key)) {
        if (
          e.key === " " &&
          e.target instanceof HTMLButtonElement &&
          !buttons?.some((b) => b.key === " ")
        )
          return;
        e.preventDefault();
        if (
          e.key.toLowerCase() === "p" ||
          (e.key === " " &&
            (!buttons?.some((b) => b.key === " ") ||
              phaseRef.current !== "playing"))
        ) {
          if (!e.repeat) toggle();
        } else {
          const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
          input.current.pointer = null;
          input.current.pointerY = null;
          input.current.keys.add(key);
          if (!e.repeat && input.current.pressed!.length < 12)
            input.current.pressed!.push(key);
        }
      }
    };
    const up = (e: KeyboardEvent) =>
      input.current.keys.delete(
        e.key.length === 1 ? e.key.toLowerCase() : e.key,
      );
    const blur = () => {
      input.current.keys.clear();
      input.current.pressed = [];
      setPhase((p) => (p === "playing" ? "paused" : p));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    window.addEventListener("electrogames:pause", blur);
    document.addEventListener("visibilitychange", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      window.removeEventListener("electrogames:pause", blur);
      document.removeEventListener("visibilitychange", blur);
    };
  }, [help, buttons]);
  function pad(key: string, label: string) {
    return (
      <button
        aria-label={label}
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          input.current.keys.add(key);
          input.current.pointer = null;
          input.current.pointerY = null;
          if (input.current.pressed!.length < 12)
            input.current.pressed!.push(key);
        }}
        onPointerUp={() => input.current.keys.delete(key)}
        onPointerCancel={() => input.current.keys.delete(key)}
      >
        {label}
      </button>
    );
  }
  return (
    <div className="play-page">
      <div className="scorebar">
        <span>
          <small>PUNTOS</small>
          <strong>{String(score).padStart(4, "0")}</strong>
        </span>
        <span className="game-status" aria-live="polite">
          {status || title}
        </span>
        <span>
          <small>
            <Trophy size={12} /> RÉCORD
          </small>
          <strong>{String(best).padStart(4, "0")}</strong>
        </span>
      </div>
      <div className="arena">
        <div
          className="canvas-wrap"
          style={
            dimensions
              ? {
                  aspectRatio: `${canvasWidth}/${canvasHeight}`,
                  width: `min(100cqw, ${(canvasWidth / canvasHeight) * 100}cqh, ${canvasWidth * 1.25}px)`,
                }
              : undefined
          }
        >
          <canvas
            width={canvasWidth}
            height={canvasHeight}
            ref={canvas}
            aria-label={`${title}: ${hint}`}
            onPointerMove={(e) => {
              if (e.pointerType === "mouse" || e.buttons) {
                input.current.pointer =
                  ((e.clientX - e.currentTarget.getBoundingClientRect().left) /
                    e.currentTarget.getBoundingClientRect().width) *
                  canvasWidth;
                input.current.pointerY =
                  ((e.clientY - e.currentTarget.getBoundingClientRect().top) /
                    e.currentTarget.getBoundingClientRect().height) *
                  canvasHeight;
              }
            }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              input.current.pointer =
                ((e.clientX - e.currentTarget.getBoundingClientRect().left) /
                  e.currentTarget.getBoundingClientRect().width) *
                canvasWidth;
              input.current.pointerY =
                ((e.clientY - e.currentTarget.getBoundingClientRect().top) /
                  e.currentTarget.getBoundingClientRect().height) *
                canvasHeight;
            }}
          />
          {phase !== "playing" && (
            <div className="game-overlay">
              <h2>
                {phase === "ready"
                  ? title
                  : phase === "paused"
                    ? "En pausa"
                    : engine.current?.won
                      ? "Victoria"
                      : "Partida terminada"}
              </h2>
              <p>
                {phase === "ready"
                  ? hint
                  : phase === "over"
                    ? `${score} puntos`
                    : hint}
              </p>
              <button
                className="primary"
                onClick={() => {
                  if (phase === "over") {
                    restart();
                    setPhase("playing");
                  } else setPhase("playing");
                }}
              >
                <Play size={17} />
                {phase === "ready"
                  ? "Empezar a jugar"
                  : phase === "paused"
                    ? "Continuar"
                    : "Volver a jugar"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`touch-controls ${buttons ? "custom" : controls}`}>
        {buttons ? (
          buttons.map((b) => <span key={b.key}>{pad(b.key, b.label)}</span>)
        ) : controls === "arrows" ? (
          <>
            {pad("ArrowUp", "↑")}
            <div>
              {pad("ArrowLeft", "←")}
              {pad("ArrowDown", "↓")}
              {pad("ArrowRight", "→")}
            </div>
          </>
        ) : controls === "vertical" ? (
          <>
            {pad("ArrowUp", "↑")}
            {pad("ArrowDown", "↓")}
          </>
        ) : (
          <>
            {pad("ArrowLeft", "←")}
            {pad("ArrowRight", "→")}
          </>
        )}
      </div>
      <div className="play-toolbar">
        <button
          onClick={() => {
            setPhase((p) => (p === "playing" ? "paused" : p));
            setHelp(true);
          }}
        >
          <HelpCircle size={17} />
          <span>Cómo jugar</span>
        </button>
        <span className="keyboard-hint">{hint}</span>
        <div>
          <button onClick={toggle} disabled={phase === "over"}>
            {phase === "playing" ? <Pause size={17} /> : <Play size={17} />}
            <span>{phase === "playing" ? "Pausar" : "Continuar"}</span>
          </button>
          <button onClick={restart}>
            <RotateCcw size={17} />
            <span>Nueva partida</span>
          </button>
        </div>
      </div>
      {help && (
        <Modal title={`Cómo jugar · ${title}`} close={() => setHelp(false)}>
          <p>{instructions}</p>
          <p>
            P: pausar o continuar. La partida se pausa al cambiar de ventana.
            Nueva partida conserva el récord.
          </p>
          <p>Tu récord se guarda solo en este navegador.</p>
        </Modal>
      )}
    </div>
  );
}
