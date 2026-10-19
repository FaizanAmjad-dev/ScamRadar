import Artical_advertisement from "./PagesUI/Artical_advertisement"
import { useState, useEffect } from "react"
import Artical_text from "./PagesUI/Artical_text"
import posticon from '../assets/posticon.png'
import Artical_post from "./PagesUI/Artical_post"
import { useNavigate } from "react-router-dom"
function Artical() {
    const navigation = useNavigate()
    const is_superuser = localStorage.getItem('superuser') === 'true'
    const currentToken = localStorage.getItem('access-token')

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Artical/`;

    // const API = 'http://127.0.0.1:8000/api/Artical/'
    const [realApi, setRealApi] = useState([])
    const [FakeApi, setFakeApi] = useState([])
    const [loading, setLoading] = useState(false)
    const POST = () => {
        setLoading(true)
        fetch(API)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setRealApi(data),
                    setFakeApi(data)
            }).finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        POST()
    }, [])


    const [close, setClose] = useState(false)


    const [searchQuery, setSearchQuery] = useState('')
    const filteredArticles = realApi.filter((item) => {
        const term = searchQuery.toLowerCase().trim()
        if (!term) return true

        const titleMatch = String(item?.artical_title || '').toLowerCase().includes(term)
        const usernameMatch = String(item?.Username || '').toLowerCase().includes(term)

        return titleMatch || usernameMatch
    })
    const [loader, setloader] = useState({})


    // ya bagroud scroo say rokny ka leya hia 
    useEffect(() => {
        if (close) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [close]);
    return (
        <>
            {loading ? (
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
                <div className="relative min-h-screen bg-white border border-gray-200 border-t-0 rounded-b-xl pb-6 sm:pb-8 md:pb-10">
                    {/*main div */}
                    {/* ya part search ka leya hai */}
                    <div className="w-full">
                        {/* search section */}
                        <form onSubmit={(e) => e.preventDefault()} className="sm:w-full flex justify-center items-center px-3 sm:px-4">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                id=""
                                className="mt-4 sm:mt-6 rounded-3xl border border-gray-300 shadow px-3 sm:px-4 w-full max-w-[580px] py-2 bg-white outline-none mx-auto block text-xs sm:text-sm md:text-base"
                                placeholder="Search..."
                            />
                        </form>
                    </div>
                    {/* second div for  advertisement */}
                    <div className="w-full flex flex-col justify-center items-center px-2 sm:px-0">
                        <Artical_advertisement />
                    </div>
                    {/* ya part card kaleya hai  */}
                    <div className="w-full flex flex-col bg-white p-3 sm:p-5 md:p-6 justify-center items-center mt-4 sm:mt-5 gap-3 sm:gap-5 md:gap-6">

                        {/*card */}
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((items, index) => (
                                <div key={index} className="flex flex-col w-full max-w-[580px] gap-2 sm:gap-3">
                                    <div className="flex gap-2 sm:gap-3 items-start">
                                        <div className={`w-14 h-14 sm:w-20 bg-gray-400 sm:h-20 rounded-lg object-cover shadow-xl flex-shrink-0
                                        ${!loader[`${items.id}-pic1`] ? "animate-pulse" : ""}
                                        `}>
                                            <img
                                                loading="lazy"
                                                src={items.pic1}
                                                onLoad={() => {
                                                    setloader((prev) => ({
                                                        ...prev, [`${items.id}-pic1`]: true
                                                    }))
                                                }}
                                                alt=""
                                                className={`w-full h-full object-cover ${loader[`${items.id}-pic1`] ? "opacity-100" : "opacity-0"}`}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 break-words">{items.artical_title}</h2>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 truncate">{items.Username}</p>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 text-wrap"><Artical_text
                                                letter={items?.detail1}
                                            /></p>
                                            <button
                                                onClick={() => navigation(`/Home/artical_Details/${items.id}/`)}
                                                className="text-start text-blue-600 text-[10px] sm:text-xs md:text-sm cursor-pointer mt-1">
                                                Read More
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="border-gray-200 mt-1.5 sm:mt-2" />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm mt-4">No articles found matching your search.</p>
                        )}
                    </div>
                </div>
            )}
            {/* ya part floating window ka hai  */}
            {currentToken && (
                <div className="fixed bottom-16 sm:bottom-4 md:bottom-5 right-3 sm:right-4 md:right-6 z-[999]">
                    {!close && (
                        <button
                            onClick={() => setClose(true)}
                            type="button"
                            className="bg-blue-600 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-lg overflow-hidden bg-white flex justify-center items-center cursor-pointer hover:scale-105 transition-transform"
                        >
                            <img src={posticon} alt="" className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-cover" />
                        </button>
                    )}

                    {close && (
                        <div className="fixed inset-0 bg-black/50 md:bg-transparent flex items-center justify-center md:absolute md:bottom-0 md:right-0 md:inset-auto z-[999] p-3 sm:p-4 md:p-0">
                            <div className="relative w-[92vw] md:w-[450px] max-w-[610px]">
                                <button
                                    onClick={() => setClose(false)}
                                    type="button"
                                    className="absolute -top-3 -right-3 z-50 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-slate-900 text-white font-bold shadow-lg hover:bg-black cursor-pointer text-sm sm:text-base"
                                >
                                    ×
                                </button>

                                <div className="w-full h-[75vh] sm:h-[70vh] md:h-[650px] overflow-y-auto overflow-x-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
                                    <Artical_post
                                        onArticalCreated={() => {
                                            setClose(false);
                                            POST();
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
} export default Artical