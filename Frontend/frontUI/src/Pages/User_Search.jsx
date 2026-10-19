import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



function User_Search() {
    const currentToken = localStorage.getItem('access-token')
    const is_superuser = localStorage.getItem("superuser") === 'true'
    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken && !is_superuser) {
            window.alert("you don't have access so get lost")
            navigation('/')
            return
        }
    }, [currentToken])


    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    // const API = `${BASE_URL}/api/feed/`;

    const [checkData, setCheckData] = useState([])
    const api = `${BASE_URL}/api/profile/`;
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
    const QueryFilter = checkData.filter((item) => {
        const query = searchQuery.trim().toLocaleLowerCase()
        if (!query) return true

        const email = String(item?.email || "").toLowerCase().includes(query)
        const id = String(item?.id || "").toLowerCase().includes(query)
        const username = String(item?.username || "").toLowerCase().includes(query)
        return email || id || username
    })

    const ShowStatus = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-600"
            case "Inactive": return "bg-yellow-100 text-yellow-600"
            case "Pending": return "bg-red-100 text-red-600"
            case "Banned": return "bg-gray-100 text-gray-600"
            default: return "bg-green-100 text-green-600"
        }
    }

    return (
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 border border-gray-200 rounded-xl-b">

            <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-[800px] flex flex-col gap-3 sm:gap-4 md:gap-5">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600">
                    User Search
                </h1>

                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 md:pl-5 text-gray-400 pointer-events-none text-sm sm:text-base">
                        🔍
                    </span>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Search by email, user name or ID"
                        className="w-full border border-blue-400 rounded-lg pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </form>

            <div className="overflow-x-auto w-full bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 mt-3 sm:mt-4 md:mt-6">
                <table className="w-full text-left min-w-[600px]">
                    {/* Table Header */}
                    <thead>
                        <tr className="bg-gray-100/70 text-gray-700 font-bold">
                            <th className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Name</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Email</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Posts</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Risk Score</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Status</th>
                        </tr>
                    </thead>

                    {/* Table Body */}

                    <tbody className="text-gray-700">
                        {QueryFilter.map((item) => (
                            <tr key={item.id} className="border-t border-gray-100/70 hover:bg-gray-100/20">
                                <td className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm text-gray-800 whitespace-nowrap">{item.username}</td>
                                <td className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">{item.email}</td>
                                <td className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">{item.post}</td>
                                <td className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[11px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">{item.risk}</td>
                                <td className="px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 whitespace-nowrap">
                                    <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 text-[9px] sm:text-[10px] md:text-xs font-semibold rounded-full inline-block ${ShowStatus(item.Status)}`}>
                                        {item.Status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} export default User_Search

{/* ya mobile ka leya hai  */ }
{/* <div className="md:hidden flex flex-col gap-3 mt-6 max-w-[800px] mx-auto">
                {QueryFilter.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">

                        <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-800 text-sm truncate">
                                    {item.username}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                    {item.email}
                                </p>
                            </div>
                            <span className={`inline-block px-2 py-1 font-semibold rounded-full text-[11px] whitespace-nowrap shrink-0 ${ShowStatus(item.Status)}`}>
                                {item.Status}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-2">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">Posts:</span>
                                <span className="font-semibold text-gray-700">
                                    {item.post ?? 0}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">Risk Score:</span>
                                <span className={`font-semibold ${item.risk > 70 ? 'text-red-600' :
                                    item.risk > 40 ? 'text-amber-600' :
                                        'text-green-600'
                                    }`}>
                                    {item.risk ?? 0}
                                </span>
                            </div>
                        </div>

                    </div>
                ))}
            </div> */}