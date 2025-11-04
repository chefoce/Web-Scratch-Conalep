// src/components/ProjectGallery.jsx
import { useEffect, useState } from "react";
/* eslint-disable react/prop-types */
import ProjectCard from "./ProjectCard";
import projectsByYear from "../data/projectsByYear";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function ProjectGallery({ year = "2024" }) {
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    const fetchLikesForProjects = async () => {
      // Seleccionamos los proyectos según el año (por defecto 2024)
      const baseProjects = projectsByYear[year] || projectsByYear["2024"] || [];

      const updatedProjects = await Promise.all(
        baseProjects.map(async (project) => {
          const projectDocRef = doc(db, "projects", project.id);
          const projectDoc = await getDoc(projectDocRef);

          let likes = 0;
          if (projectDoc.exists()) {
            likes = projectDoc.data().likes || 0;
          } else {
            await setDoc(projectDocRef, { likes: 0 });
          }

          return { ...project, likes };
        })
      );

      setProjectsData(updatedProjects);
    };

    fetchLikesForProjects();
  }, [year]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {projectsData.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectGallery;
