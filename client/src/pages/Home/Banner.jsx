import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules'; // <-- Add Autoplay
import 'swiper/css';
import 'swiper/css/navigation';
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { motion } from "motion/react";

const Banner = () => {
  const swiperRef = useRef();

  const slides = [
    {
      id: 1,
      image: "https://i.ibb.co/ccTcn2TL/marriage7.jpg",
      heading: "Find Your Perfect Match",
      subtext: "Join Bengal Matrimony and start your journey towards a happy life."
    },
    {
      id: 2,
      image: "https://i.ibb.co/k29XTr02/marriage6.jpg",
      heading: "Verified & Trusted Profiles",
      subtext: "We ensure genuine connections with verified members."
    },
    {
      id: 3,
      image: "https://i.ibb.co/G4pMVqM0/marriage5.jpg",
      heading: "Connect, Chat & Meet",
      subtext: "Build meaningful connections with ease and security."
    }
  ];

  return (
    <section className="w-11/12 mx-auto flex justify-center items-center gap-3 my-10">
      {/* Left Arrow */}
      <button onClick={() => swiperRef.current?.slidePrev()}>
        <IoIosArrowDropleft className="text-primary bg-white shadow-lg rounded-full w-10 h-10 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* Swiper */}
      <Swiper modules={[Navigation, Autoplay]} spaceBetween={20} slidesPerView={1} onSwiper={(swiper) => (swiperRef.current = swiper)} autoplay={{ delay: 2000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 }
        }}>
        {slides.map(slide => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden">
              <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover brightness-50" />
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.heading}</h2>
                <p className="text-base md:text-xl">{slide.subtext}</p>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right Arrow */}
      <button onClick={() => swiperRef.current?.slideNext()}>
        <IoIosArrowDropright className="text-primary bg-white shadow-lg rounded-full w-10 h-10 hover:scale-110 transition cursor-pointer" />
      </button>
    </section>
  );
};

export default Banner;