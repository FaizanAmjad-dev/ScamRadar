import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



function Flags() {
    const currentToken = localStorage.getItem('access-token')
    const is_superuser = localStorage.getItem('superuser') === 'true'
    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken && !is_superuser) {
            window.alert("please login or get lost")
            navigation('/')
            return
        }
    }, [currentToken])

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const api = `${BASE_URL}/api/profile/`;

    const [checkData, setCheckData] = useState([])
    // const api = 'http://127.0.0.1:8000/api/profile/'
    useEffect(() => {
        fetch(api)
            .then((res) => res.json())
            .then((prv) => {
                setCheckData(prv)
            })
    }, [])
    // ya par multi search ka leya hai 
    const [searchQuery, setSearchQuery] = useState('')
    const [queryButton, setQueryButton] = useState('Not Flagged')
    const QueryFilter = checkData.filter((item) => {
        const query = searchQuery.toLocaleLowerCase()

        const QueryMatch = String(item?.email || "").toLowerCase().includes(query) || String(item?.username || "").toLowerCase().includes(query)
        //    ya risk ka hissa hai
        const RiskMatch = queryButton === "Not Flagged" || item.risk === queryButton
        return QueryMatch && RiskMatch
    })

    const risk_Status = (risk) => {
        switch (risk) {
            case "High": return "bg-green-700 text-white"
            case "Medium": return "bg-yellow-700 text-white"
            case "Low": return "bg-red-700 text-white"
            case "Not Flagged": return "bg-slate-600 text-white "
            default: return "bg-slate-600 text-white "
        }
    }

    const [loader, setLoader] = useState({})
    return (
        <div className="min-h-screen bg-white p-3 sm:p-5 md:p-8 border-gray-200 rounded-xl">
            <div className="w-full max-w-[1100px]">

                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                    User Flags Dashboard
                </h1>

                <div className="flex md:flex-row flex-col md:items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">

                    {/* Search */}
                    <form onSubmit={(e) => e.preventDefault()} className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center text-gray-400 text-sm sm:text-base">
                            🔍
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search by Name or Email"
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 sm:py-3 md:py-4 pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm md:text-base text-gray-700 outline-none shadow-sm focus:border-blue-500"
                        />
                    </form>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                        <button
                            onClick={() => setQueryButton("Not Flagged")}
                            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4  ${queryButton === "Not Flagged" ?
                                'bg-blue-600 text-white rounded-full border border-blue-500 text-[10px] sm:text-xs md:text-sm font-medium shadow-sm '
                                : 'bg-white border border-blue-500 text-blue-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-[10px] sm:text-xs md:text-sm font-medium'}`}>
                            All
                        </button>
                        <button
                            onClick={() => setQueryButton("Low")}
                            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4  ${queryButton === "Low" ?
                                'bg-blue-600 text-white rounded-full border border-blue-500 text-[10px] sm:text-xs md:text-sm font-medium shadow-sm '
                                : 'bg-white border border-blue-500 text-blue-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-[10px] sm:text-xs md:text-sm font-medium'}`}>

                            Low
                        </button>
                        <button
                            onClick={() => setQueryButton("Medium")}
                            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4  ${queryButton === "Medium" ?
                                'bg-blue-600 text-white rounded-full border border-blue-500 text-[10px] sm:text-xs md:text-sm font-medium shadow-sm '
                                : 'bg-white border border-blue-500 text-blue-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-[10px] sm:text-xs md:text-sm font-medium'}`}>

                            Medium
                        </button>
                        <button
                            key={"High"}
                            onClick={() => setQueryButton("High")}
                            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4  ${queryButton === "High" ?
                                'bg-blue-600 text-white rounded-full border border-blue-500 text-[10px] sm:text-xs md:text-sm font-medium shadow-sm '
                                : 'bg-white border border-blue-500 text-blue-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-[10px] sm:text-xs md:text-sm font-medium'}`}>

                            High
                        </button>
                    </div>

                </div>


            </div>
            <div className="flex flex-wrap w-full justify-center h-auto">
                {QueryFilter.map((items) => (
                    <div key={items.id} className="w-full max-w-[500px] px-2 sm:px-3 mb-4 sm:mb-5">
                        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-auto min-h-32 sm:min-h-36">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 bg-gray-400 text-white overflow-hidden rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0
                                        ${!loader[`${items.id}-userPic`] ? "animate-pulse" : ""}
                                        `}>
                                        <img src={items.userPic}
                                            loading="lazy"
                                            onLoad={() => {
                                                setLoader((prev) => ({
                                                    ...prev, [`${items.id}-userPic`]: true
                                                }))
                                            }}
                                            alt=""
                                            className={`w-full h-full ${loader[`${items.id}-userPic`] ? "opacity-100" : "opacity-0"}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">{items.username}</h3>
                                        <p className="text-[10px] sm:text-xs text-gray-400 truncate">{items.email}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap shrink-0">{new Date(items.CreatedAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className={`text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full inline-block ${risk_Status(items.risk)}`}>
                                    {items.risk}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Flags;