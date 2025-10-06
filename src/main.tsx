import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PaletteProvider } from "./contexts/PaletteContext";
import { BackgroundMusicProvider } from "./contexts/BackgroundMusicContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BackgroundMusicProvider>
      <PaletteProvider>
        <App />
      </PaletteProvider>
    </BackgroundMusicProvider>
  </StrictMode>
);
