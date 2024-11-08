// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function ProjectCard({ project }) {
  return (
    <div className="bg-gray-800 p-4 text-white flex">
      <div>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-40 object-cover rounded"
        />
      </div>
      <div className="ml-auto text-right">
        <h2 className="text-xl font-bold mt-2">{project.title}</h2>
        <p>Autor: {project.author}</p>
        <p className="mb-8 text-xl">Likes: {project.likes}</p>
        <Link
          to={`/project/${project.id}`}
          className="rgb-button text-white font-bold py-2 px-10 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
        >
          Jugar
        </Link>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
