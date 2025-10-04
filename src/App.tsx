// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, SharksImportance } from "../src/pages/";
import MapOceans from "./pages/map/temperature/Map";
import { SoundProvider } from "./contexts/SoundContext";

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="stories" element={<SharksImportance />} />
            <Route path="map/oceans" element={<MapOceans />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
