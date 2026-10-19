import { useEffect, useState } from "react"
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import '../../index.css'

function EvalutionAdvertisement() {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Advertisement/`

    const [data, setData] = useState([])
    const [loadedImages, setLoadedImages] = useState({})

    useEffect(() => {
        fetch(API)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error(err))
    }, [])

    return (
        <>
            <div>
                <h1 className="text-center font-semibold text-blue-700 my-4">
                    Advertiser Banner Running
                </h1>
            </div>

            {/* Jab tak API se data na mile TAB TAK kuch nahi dikhega */}
            {data.length > 0 && (
                /* Yahan se shadow-xl aur border wagaira sab hata diye hain */
                <div className="flex w-full max-w-[580px] aspect-[15/6] sm:aspect-[16/5] overflow-hidden mx-auto">
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
                        className="w-full h-full"
                    >
                        {data.map((item, index) => (
                            <SwiperSlide key={index}>
                                <a
                                    href={item.artical_url}
                                    className="block w-full h-full overflow-hidden"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {/* bg-gray-400 aur gray border completely remove kar diya hai */}
                                    <div className="w-full h-full bg-transparent">
                                        <img
                                            src={item.artical_image}
                                            loading="lazy"
                                            alt=""
                                            onLoad={() => {
                                                setLoadedImages((prev) => ({
                                                    ...prev,
                                                    [index]: true
                                                }))
                                            }}
                                            className={`object-cover h-full w-full rounded-2xl transition-opacity duration-300 ${loadedImages[index]
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
            )}
        </>
    )
}

export default EvalutionAdvertisement