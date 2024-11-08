// src/components/Footer.jsx

function Footer() {
  return (
    <footer className="bg-zinc-800 rounded-xl p-4 text-center text-white border-white border-2">
      <p className="">
        &copy; {new Date().getFullYear()} ConaGames. Carlos Oceguera. Todos los
        derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
