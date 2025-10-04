// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Stories } from "../src/pages/";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="stories" element={<Stories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
