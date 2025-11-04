// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectGallery from "./components/ProjectGallery";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  // Estado para seleccionar la sección (año)
  const [year, setYear] = useState("2025");

  return (
    <Router>
      <div className="bg-zinc-950 min-h-screen flex flex-col font-mono">
        <div className="m-auto">
          <Navbar year={year} setYear={setYear} />
        </div>

        <div className="flex-grow mt-20">
          <Routes>
            <Route path="/" element={<Home year={year} />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            {/* Pasamos el año seleccionado a la galería de proyectos */}
            <Route path="/juegos" element={<ProjectGallery year={year} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
