// src/pages/Home.jsx
import Carousel from "../components/Carousel";
import TopRanking from "../components/TopRanking";
import ProjectGallery from "../components/ProjectGallery";

function Home() {
  return (
    <div className="relative">
      <div className="relative">
        <Carousel />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="pointer-events-auto">
            <TopRanking />
          </div>
        </div>
      </div>
      <div id="project-gallery">
        <h2 className="text-5xl font-bold text-white text-center mt-8">
          Juegos
        </h2>
        <ProjectGallery />
      </div>
    </div>
  );
}

export default Home;
