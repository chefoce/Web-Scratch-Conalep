// src/components/TopRanking.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import projects from "../data/projects";
import { FaMedal } from "react-icons/fa";
import { HashLink as Link } from "react-router-hash-link";

function TopRanking() {
  const [topProjects, setTopProjects] = useState([]);
  const [hasVotes, setHasVotes] = useState(true);

  useEffect(() => {
    const fetchTopProjects = async () => {
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, orderBy("likes", "desc"), limit(3));
      const querySnapshot = await getDocs(q);

      const topProjectsData = querySnapshot.docs.map((doc) => {
        const project = projects.find((p) => p.id === doc.id);
        return {
          id: doc.id,
          title: project ? project.title : "Proyecto desconocido",
          likes: doc.data().likes || 0,
        };
      });

      // Verificar si hay al menos un proyecto con likes mayores a cero
      const hasLikes = topProjectsData.some((project) => project.likes > 0);
      setHasVotes(hasLikes);

      setTopProjects(topProjectsData);
    };

    fetchTopProjects();
  }, []);

  const medalColors = ["text-yellow-500", "text-gray-400", "text-orange-700"];

  return (
    <div className="p-4 text-center">
      <h3 className="text-animation text-white mb-10">
        Demostración de <span></span>
      </h3>
      <h2 className="text-7xl font-bold text-white mb-4">Ranking</h2>

      {hasVotes ? (
        <ol className="list-none mb-9">
          {topProjects.map((project, index) => (
            <li
              key={project.id}
              className="text-white flex items-center justify-center mb-2"
            >
              <FaMedal className={`mr-2 ${medalColors[index]} text-2xl`} />
              <span>
                {index + 1}er lugar: {project.title} - {project.likes} likes
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-white text-lg mb-9">Aún no hay votos suficientes</p>
      )}
      <Link smooth to="#project-gallery">
        <a
          href="#project-gallery"
          className="rgb-button text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
        >
          Ver juegos
        </a>
      </Link>
      <p className="text-white mt-6 text-xl">¡Vota por tu favorito!</p>
      <p className="text-white mt-10 text-xl">Programación Conalep Escuinapa</p>
      <p className="text-white mt-1 text-xl">Docente: Ing. Carlos Oceguera</p>
    </div>
  );
}

export default TopRanking;
