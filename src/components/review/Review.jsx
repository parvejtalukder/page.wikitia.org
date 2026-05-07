import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import img1 from "../../assets/r1.jpg";
import img2 from "../../assets/r2.jpg";
import img3 from "../../assets/r3.jpg";

const reviews = [
  {
    id: 1,
    img: img1,
  },
  {
    id: 2,
    img: img2,
  },
  {
    id: 3,
    img: img3,
  },
];

export default function Review() {
  return (
    <section className="w-full py-10 px-4">
      
      <div className="max-w-5xl mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay]}
          className="pb-14 bg-white rounded-3xl w-2xl"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              
              <div className="w-full flex justify-center items-center bg-white rounded-2xl">
                <img
                  src={review.img}
                  alt="review"
                  className="w-2xl h-full rounded-2xl p-3 object-cover transition duration-500 hover:scale-105"
                />
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}