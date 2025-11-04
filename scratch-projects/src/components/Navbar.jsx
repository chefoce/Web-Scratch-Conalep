/* eslint-disable react/prop-types */
// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { FaGamepad } from "react-icons/fa";
// Button import removed because menu no longer uses the shared Button component here

function Navbar({ year, setYear }) {
  const navigate = useNavigate();

  const YearButton = ({ y }) => (
    <button
      onClick={() => {
        if (setYear) setYear(y);
        navigate("/");
      }}
      className={`py-2 px-4 rounded-full font-bold transition-colors duration-200 ${
        year === y
          ? "bg-green-500 text-black"
          : "rgb-button text-white hover:scale-105"
      }`}
    >
      {y}
    </button>
  );

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
        {/* Selector de año: 2025 / 2024 - 2025 primero */}
        <div className="flex items-center space-x-2">
          <YearButton y="2025" />
          <YearButton y="2024" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
