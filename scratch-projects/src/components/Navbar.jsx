// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { FaGamepad } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-1 left-1 right-1 z-50 bg-zinc-800 rounded-xl h-20 p-4 flex justify-between items-center border-white border-2">
      <div className="flex items-center space-x-4">
        {/* Enlace con icono */}
        <Link
          to="/"
          className="flex items-center font-extrabold text-white text-2xl font-mono"
        >
          <FaGamepad className="w-10 h-10 text-green-500 mr-2" />
          Cona<span className="text-green-500">Games</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4 ml-auto">
        {/* Botón "Inicio" */}
        <Button
          className="rgb-button text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
          onClick={() => navigate("/")}
        >
          Inicio
        </Button>
        {/* Enlace "Juegos" */}
        <Button
          className="rgb-button text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
          asChild
        >
          <Link to="/juegos">Juegos</Link>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
