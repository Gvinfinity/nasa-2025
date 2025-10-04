// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../src/pages/";
import { SoundProvider } from "./contexts/SoundContext";
import Cover from "./pages/Cover";

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="cover" element={<Cover />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
