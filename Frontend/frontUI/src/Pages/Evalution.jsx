import { useEffect, useState } from "react"
import { IoIosHeartEmpty } from "react-icons/io";
import EvalutionAdvertisement from "./PagesUI/evalutionAdvertisement";
import imageCompression from 'browser-image-compression'
import Artical_advertisement from "./PagesUI/Artical_advertisement";
function Evalution() {

    const currentToken = localStorage.getItem('access-token')
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/evalution/`;
    const [loading, setLoading] = useState(false)

    // const API = 'http://127.0.0.1:8000/api/evalution/'
    const [realApi, setRealApi] = useState([])
    useEffect(() => {
        setLoading(true)
        fetch(API)
            .then((res) => res.json())
            .then((data) => {
                setRealApi(data)
            }).finally(() => {
                setLoading(false)
            })
    }, [])
    const [loader, setloader] = useState({})

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
                    <div className="w-full flex flex-col justify-center items-center px-2 sm:px-0">
                        <Artical_advertisement />
                    </div>
                    <div className="w-full flex flex-col justify-center items-center gap-y-3 sm:gap-y-4 px-2 sm:px-0">
                        {/* yaha par evalution post show ho gi */}
                        {realApi.map((items, index) => (
                            <div key={index} className="w-full max-w-[500px] p-2 sm:p-2.5 bg-white border-b border-gray-200 border shadow-xl rounded-xl mt-4 sm:mt-6 md:mt-10">

                                <div className="flex items-center mb-2 sm:mb-3 ml-2 sm:ml-3 mt-2 sm:mt-3">
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-[35px] bg-gray-400 md:h-[35px] overflow-hidden bg-gray-200 rounded-full flex items-center justify-center mr-2 sm:mr-2.5 text-sm sm:text-base shrink-0
                                    ${!loader[`${items.id}-userPic`] ? "animate-pulse blur-sm" : ""}
                                    `}>
                                        <img src={items.post?.userPic}
                                            onLoad={() => {
                                                setloader((prev) => ({
                                                    ...prev, [`${items.id}-userPic`]: true
                                                }))
                                            }}
                                            alt=""
                                            className={`w-full h-full object-cover ${loader[`${items.id}-userPic`] ? "opacity-100" : "opacity-0"}`} />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-gray-800 truncate">{items.post?.username}</span>
                                </div>

                                <div className="text-[11px] sm:text-xs md:text-[13px] text-gray-900 mb-2 sm:mb-3 ml-2 sm:ml-3 mt-2 sm:mt-3">
                                    <p className="my-1 font-bold break-words">Exposed Person: {items.post?.username}</p>
                                    <p className="my-1 break-words">WhatsApp:{items.post?.phone} </p>
                                    <p className="my-1 break-words">Paypal:{items.post?.paypal} </p>
                                    <p className="my-1 break-words">Mail: {items.post?.email}</p>
                                </div>
                                <div className="my-2 sm:my-3 flex justify-center flex-wrap gap-1.5 sm:gap-2 overflow-hidden">
                                    <div className={`w-full max-w-[160px] bg-gray-400 sm:max-w-[180px] h-[140px] sm:h-[160px] overflow-hidden border border-gray-200 bg-gray-50
                                    ${!loader[`${items.id}-image1`] ? "animate-pulse blur-sm" : ""}
                                    `}>
                                        <img src={items.post?.image1}
                                            loading="lazy"
                                            onLoad={() => {
                                                setloader((prev) => ({
                                                    ...prev, [`${items.id}-image1`]: true
                                                }))
                                            }}
                                            className={`w-full h-full object-contain ${loader[`${items.id}-image1`] ? "opacity-100" : "opacity-0"}`} />
                                    </div>

                                    <div className={`w-full max-w-[160px] bg-gray-400 sm:max-w-[180px] h-[140px] sm:h-[160px] overflow-hidden border border-gray-200 bg-gray-50
                                    ${!loader[`${items.id}-image2`] ? "animate-pulse blur-sm" : ""}
                                    `}>
                                        <img src={items.post?.image2}
                                            loading="lazy"
                                            onLoad={() => {
                                                setloader((prev) => ({
                                                    ...prev, [`${items.id}-image2`]: true
                                                }))
                                            }}
                                            className={`w-full h-full object-contain ${loader[`${items.id}-image2`] ? "opacity-100" : "opacity-0"}`} />
                                    </div>

                                    <div className={`w-full max-w-[160px] bg-gray-400 sm:max-w-[180px] h-[140px] sm:h-[160px] overflow-hidden border border-gray-200 bg-gray-50
                                    ${!loader[`${items.id}-image3`] ? "animate-pulse blur-sm" : ""}
                                    `}>
                                        <img src={items.post?.image3}
                                            loading="lazy"
                                            onLoad={() => {
                                                setloader((prev) => ({
                                                    ...prev, [`${items.id}-image3`]: true
                                                }))
                                            }}
                                            className={`w-full h-full object-contain ${loader[`${items.id}-image3`] ? "opacity-100" : "opacity-0"}`} />
                                    </div>

                                    {items.post?.image4 && (
                                        <div className={`w-full max-w-[160px] bg-gray-400 sm:max-w-[180px] h-[140px] sm:h-[160px] overflow-hidden border border-gray-200 bg-gray-50
                                    ${!loader[`${items.id}-image4`] ? "animate-pulse blur-sm" : ""}
                                    `}>
                                            <img src={items.post?.image4}
                                                loading="lazy"
                                                onLoad={() => {
                                                    setloader((prev) => ({
                                                        ...prev, [`${items.id}-image4`]: true
                                                    }))
                                                }}
                                                className={`w-full h-full object-contain ${loader[`${items.id}-image4`] ? "opacity-100" : "opacity-0"}`} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-2 sm:mt-2.5 text-[10px] sm:text-xs text-gray-500 px-3 sm:px-4 md:px-6">
                                    <div>
                                        {new Date(items.post?.createdat).toLocaleTimeString()}
                                    </div>

                                    {/* ya part  post ka hia  */}
                                    <div className="flex justify-start items-center gap-x-2 sm:gap-x-2.5 my-3 sm:my-4 ">

                                        {/* Comment section */}
                                        <div className="flex justify-center items-center text-gray-600 gap-x-1">
                                        </div>

                                        {/* repost section */}
                                        <div className="flex justify-center items-center text-gray-600 gap-x-1">
                                        </div>

                                        {/* like section */}
                                        <div className="flex justify-center items-center text-gray-600 gap-x-1">
                                            <IoIosHeartEmpty className={`text-base sm:text-lg md:text-xl transition-color duration-200 ${items.post.like ? "text-red-600 font-bold" : "text-gray-600 font-bold"}`} />
                                            {/* total like */}
                                            <span>
                                                <p className="text-xs sm:text-sm font-semibold">{items.post?.like}</p>
                                            </span>
                                        </div>
                                        {/* views section section */}
                                        <h1 className="flex justify-center items-center text-gray-600 gap-x-1">
                                        </h1>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
export default Evalution
{/* <span className="cursor-pointer">
<BsBarChart className="text-xl" />
</span> */}
{/* total views */ }
{/* <span>
<p className="text-sm font-semibold">{items.post?.views}</p>
</span> */}
{/*icons */ }
{/* <IoChatboxOutline className="text-xl" /> */ }
{/* total comment */ }
{/* <span>
<p className="text-sm font-semibold">{items.post?.comment}</p>
</span> */}
{/* <CiRepeat className={`text-xl transition-colors duration-200 ${items.repostUser ? "text-green-500 font-bold" : "text-gray-600"
}`} /> */}
{/* total repost */ }
{/* <span>
<p className="text-sm font-semibold">{items.post?.repost}</p>
</span> */}