// src/components/Carousel.jsx
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Carousel() {
  const images = [
    "/images/imagen1.jpg",
    "/images/imagen2.jpg",
    "/images/imagen3.jpg",
  ];

  return (
    <div className="relative" style={{ height: "60vh" }}>
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        style={{ height: "100%" }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={img}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-10 pointer-events-none"></div>
    </div>
  );
}

export default Carousel;
