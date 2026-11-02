import { useEffect } from "react";
import Header from "./components/Header";
import { useIndex } from "./data";
import { formatDate } from "./format";
import Canon from "./pages/Canon";
import Library from "./pages/Library";
import Reader from "./pages/Reader";
import NotFound from "./components/NotFound";
import { useRoute } from "./router";
import { DEFAULT_PREFS, DEFAULT_READER, type Prefs, type ReaderSettings } from "./settings";
import { usePersistentState } from "./storage";
import { useTheme } from "./theme";

export default function App() {
  const route = useRoute();
  const [theme, setTheme] = useTheme();
  const [reader, setReader] = usePersistentState<ReaderSettings>("narralab:reader", DEFAULT_READER);
  const [prefs, setPrefs] = usePersistentState<Prefs>("narralab:prefs", DEFAULT_PREFS);
  const index = useIndex();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--reader-size", `${reader.fontSize}px`);
    root.dataset.width = reader.width;
    root.dataset.font = reader.font;
  }, [reader]);

  return (
    <>
      <Header page={route.page} theme={theme} onTheme={setTheme} reader={reader} onReader={setReader} />

      <main className="main">
        {index.status === "loading" && <p className="state muted">Memuat naskah…</p>}

        {index.status === "error" && (
          <div className="state">
            <h1>Naskah belum bisa dimuat</h1>
            <p>
              File <code>content/index.json</code> tidak ditemukan. Jalankan <code>npm run index</code> di folder{" "}
              <code>web/</code>, atau tunggu proses deploy selesai.
            </p>
            <p className="muted">{index.message}</p>
          </div>
        )}

        {index.status === "ready" && route.page === "library" && (
          <Library
            index={index.data}
            finalOnly={prefs.finalOnly}
            onFinalOnly={(finalOnly) => setPrefs({ ...prefs, finalOnly })}
          />
        )}

        {index.status === "ready" && route.page === "chapter" && (
          <Reader index={index.data} number={route.number} version={route.version} finalOnly={prefs.finalOnly} />
        )}

        {index.status === "ready" && route.page === "canon" && <Canon index={index.data} id={route.id} />}

        {index.status === "ready" && route.page === "notfound" && (
          <NotFound message="Alamat yang Anda buka tidak dikenali." />
        )}
      </main>

      {index.status === "ready" && (
        <footer className="site-footer">
          NarraLab · diperbarui {formatDate(index.data.generatedAt.slice(0, 10))}
        </footer>
      )}
    </>
  );
}
