import { useEffect, useState } from "react"
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import '../../index.css'

function Artical_advertisement() {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Advertisement/`

    // const API = 'http://127.0.0.1:8000/api/Advertisement/'
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(API)
            .then((res) => res.json())
            .then((data) => setData(data))
    }, [])
    const [loadedImages, setLoadedImages] = useState({})
    return (
        <>
            <div>
                <h1 className="text-center font-semibold text-blue-700 my-4">
                    Advertiser Banner Running
                </h1>
            </div>
            {data.length > 0 && (
                <div className="flex rounded-2xl w-full max-w-[580px] aspect-[15/6] sm:aspect-[16/5] overflow-hidden shadow-xl mx-auto">

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
                        className=" w-full h-full"
                    >
                        {data.map((item, index) => (
                            <SwiperSlide key={index}>
                                <a
                                    href={item.artical_url}
                                    className="block w-full h-full overflow-hidden"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div
                                        className={`w-full h-full bg-gray-400 ${!loadedImages[index]
                                            ? "animate-pulse"
                                            : ""
                                            }`}
                                    >
                                        <img
                                            src={item.artical_image}
                                            alt=""
                                            loading="lazy"
                                            onLoad={() => {
                                                setLoadedImages((prev) => ({
                                                    ...prev,
                                                    [index]: true
                                                }))
                                            }}
                                            className={`object-cover h-full w-full ${loadedImages[index]
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
} export default Artical_advertisement