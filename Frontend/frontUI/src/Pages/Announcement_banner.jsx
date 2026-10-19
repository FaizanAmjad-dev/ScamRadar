import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Announcement_banner() {
    const currentToken = localStorage.getItem('access-token')
    const navigation = useNavigate()

    // cheak if user is login or not 
    useEffect(() => {
        if (!currentToken) {
            return navigation('/')
        }
    }, [currentToken])

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Annoucement/`;


    // const API = 'http://127.0.0.1:8000/api/Annoucement/'
    const [realApi, setRealApi] = useState([])
    const [searchApi, setSearchApi] = useState([])
    useEffect(() => {
        fetch(API)
            .then((res) => res.json())
            .then((data) => {
                setRealApi(data)
                setSearchApi(data)
            })
    }, [])

    // search ka leya code
    const SearchQuery = (e) => {
        const term = e.toLowerCase().trim()
        if (!term) {
            return setSearchApi(realApi)
        }
        const filter = realApi.filter((items) => items.text.toLowerCase().includes(term))
        setSearchApi(filter)
    }
    const [loading, setLoading] = useState({})
    return (
        <div className="min-h-screen bg-white p-3 sm:p-5 md:p-6 border border-gray-200 rounded-b-xl">
            {/* Main Centered Wrapper Container */}
            <div className="w-full max-w-[800px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-5">

                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600 text-center sm:text-left">
                    Announcement Banner
                </h1>

                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-3 md:pl-4 text-gray-400 text-xs sm:text-sm md:text-base">
                        🔍
                    </span>
                    <input
                        onChange={SearchQuery}
                        type="text"
                        placeholder="Search announcements..."
                        className="w-full border-2 border-blue-400 rounded-lg pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-white outline-none text-xs sm:text-sm md:text-base"
                    />
                </div>
            </div>

            {searchApi.length > 0 ? (
                <div className="flex flex-col justify-center items-center mt-6 sm:mt-8 md:mt-10">
                    {searchApi.map((items, index) => (
                        <div key={index} className="w-full max-w-[1000px] bg-white mt-4 sm:mt-5 md:mt-6 rounded-xl shadow border border-gray-100 p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6 flex flex-col">
                            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-xl flex flex-col gap-2 sm:gap-3">
                                <div className="flex justify-between items-start gap-2 sm:gap-4 md:gap-6 mt-3 sm:mt-6 md:mt-10">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-400 overflow-hidden shrink-0
                                            ${!loading[`${items.id}-userPic`] ? "animate-pluse" : ""}
                                            `}>
                                            <img
                                                src={items.userPic}
                                                onLoad={() => {
                                                    setLoading((pre) => ({
                                                        ...pre, [`${items.id}-userPic`]: true
                                                    }))
                                                }}
                                                className={`h-full w-full object-cover ${loading[`${items.id}-userPic`] ? 'opacity-100' : "opacity-0"}`} alt="" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate">
                                                {items.Username}
                                            </h3>
                                            <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm truncate">
                                                {items.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm whitespace-nowrap shrink-0">
                                        {new Date(items.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="bg-emerald-100 text-emerald-600 font-semibold px-2 py-1 rounded text-[9px] sm:text-[10px] md:text-[11px]">
                                        {items.status}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-bold text-blue-600 text-sm sm:text-base md:text-lg mb-1 break-words overflow-hidden">
                                        {items.title}
                                    </h4>
                                    <p className="text-gray-600 overflow-hidden text-break text-xs sm:text-sm md:text-base break-words">
                                        {items.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm md:text-base">Koi announcement nahi mili</p>
            )}

        </div>
    );
}

export default Announcement_banner;