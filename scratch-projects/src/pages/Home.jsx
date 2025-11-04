// src/pages/Home.jsx
/* eslint-disable react/prop-types */
import Carousel from "../components/Carousel";
import TopRanking from "../components/TopRanking";
import ProjectGallery from "../components/ProjectGallery";

function Home({ year = "2025" }) {
  return (
    <div className="relative">
      <div className="relative">
        <Carousel />
        {/* Hero overlay: edition title + top ranking (positioned toward top, less tall hero) */}
        <div className="absolute inset-0 flex flex-col items-center justify-start z-20 pt-8">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-200">Edición</p>
            <h1 className="text-5xl font-extrabold text-white">{year}</h1>
          </div>
          <div className="pointer-events-auto mt-2">
            <TopRanking year={year} />
          </div>
        </div>
      </div>
      <div id="project-gallery">
        <h2 className="text-5xl font-bold text-white text-center mt-8">
          Juegos
        </h2>
        <ProjectGallery year={year} />
      </div>
    </div>
  );
}

export default Home;
