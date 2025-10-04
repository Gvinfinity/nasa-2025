// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Stories, GridMap } from "../src/pages/";
import MapOceans from "./pages/map/temperature/Map";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="stories" element={<Stories />} />
          <Route path="map/oceans" element={<MapOceans />} />
          <Route path="map/grid" element={<GridMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
