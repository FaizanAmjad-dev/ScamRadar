import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"



function Artical_Details() {
    const { id } = useParams()
    const navigation = useNavigate()
    
    if (!id) {
        return navigation('/Home')
    }
    
    const [loadedImages, setLoadedImages] = useState(false);
    const [loading, setLoading] = useState({})
    const [FakeApi, setFakeApi] = useState({})
    
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Artical/${id}/`
    const POST = () => {
        setLoadedImages(true)
        fetch(API)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setFakeApi(data)
            }).finally(() => {
                setLoadedImages(false)
            })
    }
    useEffect(() => {
        POST()
    }, [])


    return (
        <>
            {loadedImages ? (
                <div className="min-h-screen flex items-center justify-center">
                    <button
                        type="button"
                        className="inline-flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-sm font-medium rounded-lg text-sm px-4 py-2.5"
                    >
                        <span className="w-4 h-4 me-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                    </button>
                </div>
            ) : (
                <div className="min-h-screen flex border-gray-200 border rounded-b-xl justify-center items-center bg-white">
                    {/* Article main div */}
                    <div className="w-full max-w-[700px] mx-auto p-3 sm:p-5 md:p-8">
                        {/* Title */}
                        <h1 className="text-center text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
                            {FakeApi.artical_title}
                        </h1>
                        {/* User name */}
                        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                            Written by: {FakeApi.Username}
                        </p>

                        {/* First section */}
                        <div className="mt-5 sm:mt-8 md:mt-10">
                            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 break-words">
                                {FakeApi.introduce}
                            </h2>

                            {/* First image */}
                            <div className={`w-full h-40 sm:h-64 md:h-80 overflow-hidden bg-gray-400
                            ${!loading[`${FakeApi.id}-pic1`] ? "animate-pulse" : ""}
                            `}>
                                <img
                                    src={FakeApi.pic1}
                                    onLoad={() => {
                                        setLoading((prev) => ({
                                            ...prev, [`${FakeApi.id}-pic1`]: true
                                        }))
                                    }}
                                    alt=""
                                    className={`w-full h-full object-cover shadow 
                                    ${!loading[`${FakeApi.id}-pic1`] ? "opacity-0" : "opacity-100"}`}
                                />
                            </div>

                            {/* First detail */}
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 md:mt-5 break-words">
                                {FakeApi.detail1}
                            </p>

                        </div>

                        {/* Second section */}
                        <div className="mt-5 sm:mt-8 md:mt-10">
                            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 break-words">
                                {FakeApi.title}
                            </h2>

                            {/* Second image */}
                            <div className={`w-full h-40 sm:h-64 md:h-80 overflow-hidden bg-gray-400
                            ${!loading[`${FakeApi.id}-pic2`] ? "animate-pulse" : ""}
                            `}>
                                <img
                                    src={FakeApi.pic2}
                                    onLoad={() => {
                                        setLoading((prev) => ({
                                            ...prev, [`${FakeApi.id}-pic2`]: true
                                        }))
                                    }}
                                    alt=""
                                    className={`w-full h-full object-cover shadow 
                                    ${!loading[`${FakeApi.id}-pic2`] ? "opacity-0" : "opacity-100"}`}
                                />
                            </div>


                            {/* Second detail */}
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 md:mt-5 break-words">
                                {FakeApi.detail2}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} export default Artical_Details