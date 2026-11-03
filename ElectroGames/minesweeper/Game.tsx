import { useEffect, useRef, useState } from "react";
import { Flag, Bomb, RotateCcw, HelpCircle, Timer, Trophy } from "lucide-react";
import { board, reveal, flag } from "./engine";
import Modal from "../../src/shared/Modal";
import { read, write } from "../../src/shared/storage";
const levels = [
  { name: "Iniciación", w: 9, h: 9, m: 10 },
  { name: "Intermedio", w: 12, h: 12, m: 24 },
  { name: "Experto", w: 16, h: 16, m: 40 },
];
export default function Game() {
  const [level, setLevel] = useState(0),
    [state, setState] = useState(() => board()),
    [mark, setMark] = useState(false),
    [time, setTime] = useState(0),
    [help, setHelp] = useState(false),
    [best, setBest] = useState(read("mines:0"));
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (!state.started || state.over || help) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [state.started, state.over, help]);
  useEffect(() => {
    if (state.won) {
      const old = Number(read(`mines:${level}`));
      if (!old || time < old) {
        write(`mines:${level}`, String(time));
        setBest(String(time));
      }
    }
  }, [state.won, level, time]);
  function reset(n = level) {
    const l = levels[n];
    setLevel(n);
    setState(board(l.w, l.h, l.m));
    setTime(0);
    setBest(read(`mines:${n}`));
  }
  return (
    <div className="play-page mines-page">
      <div className="scorebar">
        <span>
          <small>MINAS POR MARCAR</small>
          <strong>
            <Flag size={20} />{" "}
            {state.mines - state.cells.filter((c) => c.flag).length}
          </strong>
        </span>
        <span>
          <small>
            <Timer size={12} /> TIEMPO
          </small>
          <strong>{String(time).padStart(3, "0")} s</strong>
        </span>
        <span>
          <small>
            <Trophy size={12} /> MEJOR TIEMPO
          </small>
          <strong>{best ? `${best} s` : "—"}</strong>
        </span>
      </div>
      <div className="mines-area">
        <div className="mines-options">
          <label>
            Dificultad{" "}
            <select
              value={level}
              onChange={(e) => reset(Number(e.target.value))}
            >
              {levels.map((l, i) => (
                <option key={l.name} value={i}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className={mark ? "selected" : ""}
            aria-pressed={mark}
            onClick={() => setMark(!mark)}
          >
            <Flag size={16} />
            {mark ? "Marcar banderas" : "Descubrir casillas"}
          </button>
        </div>
        <div className="mines-message" aria-live="polite">
          {state.over
            ? state.won
              ? "¡Campo despejado! Has encontrado todas las casillas seguras."
              : "¡Una mina! Pulsa Nueva partida para volver a intentarlo."
            : state.started
              ? "Cada número cuenta las minas de su alrededor."
              : "Tu primera casilla y sus vecinas siempre son seguras."}
        </div>
        <div
          className="mine-grid"
          role="group"
          aria-label="Campo de minas"
          style={{
            gridTemplateColumns: `repeat(${state.width},1fr)`,
            width: `min(100%, ${state.width * 36}px)`,
          }}
        >
          {state.cells.map((c, i) => (
            <button
              ref={(el) => {
                cells.current[i] = el;
              }}
              key={i}
              className={`cell ${c.open ? "open" : ""} ${state.over && c.mine ? "mine" : ""}`}
              data-number={c.adjacent}
              aria-label={`Fila ${Math.floor(i / state.width) + 1}, columna ${(i % state.width) + 1}: ${c.flag ? "bandera" : c.open ? (c.mine ? "mina" : c.adjacent ? `${c.adjacent} minas cercanas` : "vacía") : "oculta"}`}
              onClick={() =>
                setState((s) => (mark ? flag(s, i) : reveal(s, i)))
              }
              onContextMenu={(e) => {
                e.preventDefault();
                setState((s) => flag(s, i));
              }}
              onKeyDown={(e) => {
                let next = i;
                if (e.key === "f" || e.key === "F") {
                  e.preventDefault();
                  setState((s) => flag(s, i));
                } else {
                  if (e.key === "ArrowRight")
                    next = Math.min(state.cells.length - 1, i + 1);
                  else if (e.key === "ArrowLeft") next = Math.max(0, i - 1);
                  else if (e.key === "ArrowDown")
                    next = Math.min(state.cells.length - 1, i + state.width);
                  else if (e.key === "ArrowUp")
                    next = Math.max(0, i - state.width);
                  else return;
                  e.preventDefault();
                  cells.current[next]?.focus();
                }
              }}
            >
              {state.over && c.mine ? (
                <Bomb size={16} />
              ) : c.flag ? (
                <Flag size={14} />
              ) : c.open && c.adjacent ? (
                c.adjacent
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="play-toolbar">
        <button onClick={() => setHelp(true)}>
          <HelpCircle size={17} />
          Cómo jugar
        </button>
        <span className="keyboard-hint">
          Clic: descubrir · Clic derecho o F: bandera
        </span>
        <button onClick={() => reset()}>
          <RotateCcw size={17} />
          Nueva partida
        </button>
      </div>
      {help && (
        <Modal title="Cómo jugar · Buscaminas" close={() => setHelp(false)}>
          <p>
            Descubre todas las casillas sin minas. Cada número indica cuántas
            minas hay en las ocho casillas de alrededor. Al abrir una casilla
            vacía se descubre automáticamente la zona conectada.
          </p>
          <p>
            Marca una sospecha con clic derecho, la tecla F o el botón de
            banderas en móvil. Las banderas protegen las casillas de clics
            accidentales; no es obligatorio marcar todas las minas para ganar.
          </p>
          <p>
            La primera casilla y sus vecinas no contienen minas. Las flechas
            mueven el foco y Enter o Espacio actúan sobre una casilla. Cambiar
            la dificultad inicia una partida nueva. El mejor tiempo se guarda
            por dificultad en este navegador.
          </p>
        </Modal>
      )}
    </div>
  );
}
