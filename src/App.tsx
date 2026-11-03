import {
  Component,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Sun,
  Sunset,
  Moon,
  Info,
  Users,
  ArrowUpRight,
  X,
  Monitor,
  Github,
} from "lucide-react";
import { games, categories, filterGames } from "./catalog";
import Modal from "./shared/Modal";
import { read, write } from "./shared/storage";
class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty-state">
        <h2>No se ha podido abrir la partida</h2>
        <button onClick={() => location.reload()}>Volver a cargar</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function getRoute() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return "";
  }
}
export default function App() {
  const [route, setRoute] = useState(getRoute),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string[]>([]),
    [panel, setPanel] = useState<"search" | "filter" | "theme" | null>(null),
    [about, setAbout] = useState(false),
    [theme, setTheme] = useState(() => read("theme", "day"));
  const game = games.find((g) => g.id === route),
    filtered = filterGames(games, selected, query);
  useEffect(() => {
    if (panel || about) window.dispatchEvent(new Event("electrogames:pause"));
  }, [panel, about]);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      setPanel(null);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.view = game ? "game" : "catalog";
    document.title = game ? `${game.name} · ElectroGames` : "ElectroGames";
  }, [game]);
  useEffect(() => {
    function update() {
      const hour = new Date().getHours();
      document.documentElement.dataset.theme =
        theme === "auto"
          ? hour < 7 || hour >= 21
            ? "night"
            : hour >= 18
              ? "afternoon"
              : "day"
          : theme;
    }
    update();
    write("theme", theme);
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [theme]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const toggle = (name: typeof panel) =>
    setPanel((p) => (p === name ? null : name));
  function select(category: string) {
    setSelected((s) =>
      s.includes(category) ? s.filter((c) => c !== category) : [...s, category],
    );
  }
  return (
    <>
      <header className="site-header">
        {game && (
          <a className="icon back" href="#" aria-label="Volver a la colección">
            <ArrowLeft size={20} />
          </a>
        )}
        <a className="brand" href="#" aria-label="ElectroGames, inicio">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
          <span>ElectroGames</span>
        </a>
        {game && <h1 className="header-game-title">{game.name}</h1>}
        <nav aria-label="Herramientas">
          {!game && (
            <>
              <button
                className={`icon ${query ? "active" : ""}`}
                aria-label="Buscar juegos"
                aria-expanded={panel === "search"}
                onClick={() => toggle("search")}
              >
                <Search size={19} />
              </button>
              <button
                className={`icon ${selected.length ? "active" : ""}`}
                aria-label="Filtrar juegos"
                aria-expanded={panel === "filter"}
                onClick={() => toggle("filter")}
              >
                <SlidersHorizontal size={19} />
                {selected.length > 0 && (
                  <span className="filter-badge">{selected.length}</span>
                )}
              </button>
            </>
          )}
          <button
            className="icon"
            aria-label="Cambiar iluminación"
            aria-expanded={panel === "theme"}
            onClick={() => toggle("theme")}
          >
            {theme === "night" ? (
              <Moon size={19} />
            ) : theme === "afternoon" ? (
              <Sunset size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
          <button
            className="icon"
            aria-label="Acerca de ElectroGames"
            onClick={() => {
              setPanel(null);
              setAbout(true);
            }}
          >
            <Info size={19} />
          </button>
        </nav>
        {panel && (
          <section
            className="popover"
            aria-label={
              panel === "filter"
                ? "Filtros"
                : panel === "search"
                  ? "Búsqueda"
                  : "Iluminación"
            }
          >
            <div className="popover-heading">
              <strong>
                {panel === "filter"
                  ? "Filtros"
                  : panel === "search"
                    ? "Buscar juegos"
                    : "Iluminación"}
              </strong>
              <button
                className="icon"
                aria-label="Cerrar panel"
                onClick={() => setPanel(null)}
              >
                <X size={17} />
              </button>
            </div>
            {panel === "search" ? (
              <label className="search-box">
                <Search size={17} />
                <input
                  type="search"
                  autoFocus
                  aria-label="Nombre o tipo de juego"
                  placeholder="Buscar…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            ) : panel === "filter" ? (
              <>
                <div className="category-options">
                  {categories.map((category) => (
                    <label key={category}>
                      <input
                        type="checkbox"
                        checked={selected.includes(category)}
                        onChange={() => select(category)}
                      />
                      <span>{category}</span>
                      <small>
                        {games.filter((g) => g.category === category).length}
                      </small>
                    </label>
                  ))}
                </div>
                <div className="filter-actions">
                  <button
                    onClick={() => setSelected([])}
                    disabled={!selected.length}
                  >
                    Limpiar filtros
                  </button>
                  <button onClick={() => setPanel(null)}>Cerrar</button>
                </div>
              </>
            ) : (
              <>
                <div className="theme-options">
                  {[
                    { id: "day", name: "Día", Icon: Sun },
                    { id: "afternoon", name: "Tarde", Icon: Sunset },
                    { id: "night", name: "Noche", Icon: Moon },
                    { id: "auto", name: "Automático", Icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.id}
                      className={theme === t.id ? "selected" : ""}
                      aria-pressed={theme === t.id}
                      onClick={() => setTheme(t.id)}
                    >
                      <t.Icon size={17} />
                      {t.name}
                    </button>
                  ))}
                </div>
                <p className="small">El modo automático sigue la hora local.</p>
              </>
            )}
          </section>
        )}
      </header>
      <main>
        {game ? (
          <Boundary key={game.id}>
            <Suspense fallback={<div className="empty-state">Cargando…</div>}>
              <game.Game />
            </Suspense>
          </Boundary>
        ) : (
          <div className="collection">
            {(selected.length > 0 || query) && (
              <div className="active-filters">
                <span>
                  {filtered.length} juegos
                  {selected.length ? ` · ${selected.join(", ")}` : ""}
                  {query ? ` · «${query}»` : ""}
                </span>
                <button
                  onClick={() => {
                    setSelected([]);
                    setQuery("");
                  }}
                >
                  Limpiar <X size={13} />
                </button>
              </div>
            )}
            <div className="game-grid" aria-label="Colección de juegos">
              {filtered.map((g) => (
                <a
                  className="game-tile"
                  key={g.id}
                  href={`#${g.id}`}
                  aria-label={`Jugar a ${g.name}`}
                  title={g.name}
                >
                  <div className="tile-art">
                    <g.Art />
                  </div>
                  <span className="tile-title">{g.name}</span>
                  <span className="tile-players">
                    <Users size={12} />
                    {g.players}
                  </span>
                  <span className="tile-category">{g.category}</span>
                </a>
              ))}
            </div>
            {!filtered.length && (
              <div className="empty-state">
                <h2>No hay juegos con esos filtros</h2>
                <button
                  onClick={() => {
                    setSelected([]);
                    setQuery("");
                  }}
                >
                  Ver todos
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      {about && (
        <Modal title="Acerca de ElectroGames" close={() => setAbout(false)}>
          <p>
            Juegos electrónicos clásicos para navegador. La colección contiene{" "}
            {games.length} juegos con teclado y controles táctiles.
          </p>
          <p>
            Los récords se guardan en este navegador. Cada juego incluye sus
            instrucciones. Las versiones utilizan programación e ilustraciones
            propias.
          </p>
          <div className="about-links">
            <a
              href="https://alejandropico.github.io/Games/"
              target="_blank"
              rel="noreferrer"
            >
              Games <ArrowUpRight size={16} />
            </a>
            <a
              href="https://github.com/AlejandroPico/Electrogames"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} />
              Repositorio
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
