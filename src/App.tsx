// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Stories } from "../src/pages/";
import MapLatitude from "./components/maps/LatitudeMap";
import GridMap from "./components/maps/GridMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="stories" element={<Stories />} />
          <Route path="map/grid" element={<GridMap />} />
          <Route path="map/latitude" element={<MapLatitude />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
