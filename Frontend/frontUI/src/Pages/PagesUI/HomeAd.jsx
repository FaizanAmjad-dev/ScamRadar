
import { useState, useEffect } from "react"
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import '../../index.css'
function HomeAd() {
    const [loadedImages, setLoadedImages] = useState({})
    // ya part banner yani add ko show karny ka leya hai 
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const Banner = `${BASE_URL}/api/banner/`;

    // const Banner = 'http://127.0.0.1:8000/api/banner/'
    const [banner, setBanner] = useState([])
    useEffect(() => {
        fetch(Banner)
            .then((data) => data.json())
            .then((res) => {
                setBanner(res)
            })
    }, [])


    return (
        <>
            {/* image outer layer */}
            {banner.length > 0 && (
                <div className="relative mt-6 rounded-2xl w-full max-w-[660px] aspect-[16/6] sm:aspect-[16/5] overflow-hidden shadow-xl mx-auto">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        speed={500}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        className="w-full h-full "
                    >
                        {banner.map((item, index) => (
                            <SwiperSlide key={index}>
                                <a
                                    href={item.banner_url}
                                    className="block w-full h-full overflow-hidden " target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className={`w-full h-full bg-gray-300 ${!loadedImages[index] ? "animate-pulse" : ""
                                        }`}>
                                        <img
                                            loading="lazy"
                                            src={item.banner_image}
                                            onLoad={() => {
                                                setLoadedImages((prev) => ({
                                                    ...prev,
                                                    [index]: true,
                                                }));
                                            }}
                                            alt=""
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[index]
                                                ? "opacity-100"
                                                : "opacity-0"
                                                }`}
                                        />
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            )
            }

        </>
    )
}
export default HomeAd
// ya part next image ka leya hia 
// const [count, setcount] = useState(0)
// const Images = banner.map((item) => {
//     if (!item || !item.banner_image) return null
//     return item.banner_image
// }).filter(Boolean)

// useEffect(() => {
//     if (Images.length > 0) {
//         const timer = setInterval(() => {
//             setcount((prv) => (prv + 1) % Images.length)
//         }, 5000);
//         return () => clearInterval(timer)
//     }
// }, [banner, Images])


{/* <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
        {Images.map((_, index) => (
            <button
                key={index}
                onClick={() => setcount(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer
    ${count === index
                        ? "bg-white scale-110 shadow-md"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
            >
            </button>
        ))}
    </div> */}