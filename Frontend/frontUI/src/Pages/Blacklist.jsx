import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { MyContext } from "../Context/context"

function Blacklist() {
    const { fetchNotifications } = useContext(MyContext);
    const currentToken = localStorage.getItem('access-token')
    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken) {
            return navigation('/')
        }
    }, [currentToken])

    const [close, setClose] = useState(null)

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/profileUNbanned/`;

    // const API = 'http://127.0.0.1:8000/api/profileUNbanned/'
    const [everything, setEverything] = useState([])
    const response = () => {
        fetch(API, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `jwt ${currentToken}`
            }
        })
            .then((res) => res.json())
            .then((prev) => {
                setEverything(prev)
            })
    }
    useEffect(() => {
        response()
    }, [])



    // ya unban karny ka leya hia 
    const handleUnbanned = (id) => {
        fetch(`${BASE_URL}/api/profile/${id}/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `jwt ${currentToken}`
            },
            body: JSON.stringify({
                Status: "Active",
                isBanned: true,
                risk: "Not Flagged",
            })
        })
            .then((res) => {
                if (res) {
                    setEverything((prevList) => prevList.filter((item) => item.id !== id));
                    fetchNotifications();
                }
            })
    }


    // ya variable conversation ki id ko save karny ka leya hai 
    const [conversationId, setConversationID] = useState(null)
    // ya part conversation ko get karny ka ley hai
    const ConversationAPI = `${BASE_URL}/api/Conversation/`;

    // const ConversationAPI = 'http://127.0.0.1:8000/api/Conversation/'
    const [conversation, setConversation] = useState([])
    const conversationGet = (bannUserID) => {
        fetch(`${ConversationAPI}?user=${bannUserID}`, {
            headers: {
                Authorization: `jwt ${currentToken}`
            },

        })
            .then((res) =>
                res.json()
            )
            .then((prev) => {
                setConversation(prev)
                // yaha hum conversation ki id ko store kary gy
                if (prev.length > 0) {
                    setConversationID(prev[0].id)
                } else {
                    // is ka kam hai ka agar conversation create nahi howi hia to is ko null kar dayna taky past use ki id save na ho
                    setConversationID(null)
                }
            })
    }


    // ya par yaha par text is leya nahi likha hai ku ka humary pas multipal use hai to har use ka leya alag fields nahi bana saktyhai is leya 
    const [chat, setChat] = useState({})

    const handleInpute = (e, userID) => {
        setChat({ ...chat, [userID]: e.target.value })
    }

    const handleSubmit = (e, userID) => {
        e.preventDefault();

        let carrybox = new FormData();
        carrybox.append("text", chat[userID]);
        carrybox.append("conversations", conversationId);

        fetch(`${BASE_URL}/api/Chat/`, {
            method: "POST",
            headers: {
                Authorization: `jwt ${currentToken}`
            },

            body: carrybox
        })
            .then((res) => {
                toast.success('successfully')
                return res.json
            })
            .then(() => {
                conversationGet(close)
                fetchNotifications();
                setChat({
                    text: ""
                })
            })

    }


    // ay part web socke ka hia 
    useEffect(() => {
        const wsProtocol = document.location.protocol === 'https:' ? "wss:" : "ws:"
        const wsHost = new URL(BASE_URL).host
        const websocket = new WebSocket(`${wsProtocol}//${wsHost}/ws/conversation/${conversationId}/`)
        
        websocket.onmessage = (event) => {
            const rowData = JSON.parse(event.data)
            if (rowData.kind !== 'chat') return

            // Naya message jo backend se aaya hai
            const newMessage = rowData.payload

            setConversation((prev) => {
                if (!prev || prev.length === 0) return prev;

                return prev.map((room, index) => {
                    // Pehle wale room mein naya message add kar do
                    if (index === 0) {
                        return { ...room, chat: [...room.chat, newMessage] };
                    }
                    return room;
                });
            });
        }

        return () => {
            websocket.close()
        }

    }, [conversationId, currentToken])


    // ya part search query ka leya hia
    const [query, setQuery] = useState('')
    const Handlequery = everything.filter((item) => {
        const userQuery = query.toLocaleLowerCase().trim();
        if (!userQuery) return true;

        const email = String(item?.email || "").toLowerCase().includes(userQuery)
        const Username = String(item?.username || "").toLowerCase().includes(userQuery)
        return email || Username
    })
    const is_superuser = localStorage.getItem('superuser') == "true"
    const [loading, setLoading] = useState({})
    return (
        <div className="min-h-screen bg-white p-3 sm:p-5 md:p-6 border rounded-b-xl border-gray-200">
            <ToastContainer />
            <div className="w-full max-w-[800px] flex flex-col gap-3 sm:gap-4 md:gap-5">

                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600">
                    Blacklist
                </h1>

                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-4 md:pl-5 text-gray-400 pointer-events-none text-xs sm:text-sm md:text-base">
                        🔍
                    </span>

                    <input
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                        type="text"
                        placeholder="Search by Name or Email"
                        className="w-full border border-blue-400 rounded-lg pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-base"
                    />

                </div>
            </div>

            {/* ya main div hia  */}
            <div className="mt-6 sm:mt-8 md:mt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 md:gap-6">

                {/* ya bann use ko show karny ka ley hai  */}
                {Handlequery.map((items, index) => (
                    <div key={index} className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs sm:text-sm md:text-base">
                            <span>🚫</span>
                            <span>User Blacklisted</span>
                        </div>


                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-400 overflow-hidden flex-shrink-0
                                    ${!loading[`${items.id}-userPic`] ? "animate-pluse" : ""}
                                    `}>
                                    <img
                                        src={items.userPic}
                                        onLoad={() => {
                                            setLoading((pre) => ({
                                                ...pre, [`${items.id}-userPic`]: true
                                            }))
                                        }}
                                        alt=""
                                        className={`w-full h-full object-cover ${loading[`${items.id}-userPic`] ? "opacity-100" : "opacity-0"}`} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base break-words truncate">
                                        {items.username}
                                    </h3>
                                    <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm break-words truncate">
                                        {items.email}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap shrink-0">
                                {new Date(items.CreatedAt).toLocaleDateString()}
                            </span>
                        </div>



                        {/* Status */}
                        <div className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                            Status: <span className="text-red-600 font-bold">{items.Status}</span>
                        </div>

                        {/* ya violation ka leya hia  */}
                        <div className="bg-red-50/80 border border-red-200 rounded-xl p-2.5 sm:p-3.5 md:p-4 flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-red-600 font-semibold text-xs sm:text-sm md:text-base">
                                <span>🚨</span>
                                <span>Violation</span>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600">
                                Breaking rules
                            </p>
                        </div>

                        {/* ya button un ban or converstion ka leya hia  */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                            {is_superuser && (
                                <button
                                    onClick={() => handleUnbanned(items.id)}
                                    type="button"
                                    className="bg-green-50 border border-green-400 text-green-600 hover:bg-green-100 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm flex items-center justify-center gap-1 w-full sm:w-auto"
                                >
                                    <span>✅</span> Unban
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    if (close === items.id) {
                                        setClose(null)
                                        setConversation([])

                                    } else {
                                        setClose(items.id)
                                        conversationGet(items.id)
                                    }
                                }
                                }
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded border text-xs sm:text-sm ${close === items.id
                                    ? "bg-red-100 text-red-700 border-red-600 hover:bg-red-200"
                                    : "bg-blue-100 text-blue-700 border-blue-600 hover:bg-blue-200"
                                    }`}
                            >
                                {close === items.id
                                    ? "❌ Close Chat"
                                    : "💬 View Conversation"}
                            </button>
                        </div>


                        {/* ya part conversation ka leya hai  */}
                        {close === items.id && (
                            <div className="border border-gray-400 rounded-lg bg-gray-50 p-2.5 sm:p-3.5 md:p-4">
                                <h1 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm md:text-base">
                                    Chat with Name
                                </h1>
                                <div className="h-36 sm:h-44 md:h-48 overflow-y-auto bg-white border border-gray-400 p-2 rounded mb-2 sm:mb-3">

                                    {conversation.map((items, index) => (
                                        <div key={index}>
                                            {items.chat.map((item, i) => (
                                                <div key={i} className="bg-white my-1.5 w-full border border-gray-400 rounded min-h-fit">

                                                    <div
                                                        className={`flex flex-col py-1.5 sm:py-2 px-2 sm:px-3 
                                             ${item.IsSuperUser === true
                                                                ? "w-full bg-gray-100 rounded text-left"
                                                                : "w-full bg-blue-100 rounded text-left"}`}>
                                                        <div className="rounded break-words whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                                                            {item.text}
                                                        </div>
                                                        <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
                                                            {item.Username} • {item.created_at.slice(0, 8)}
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>


                                {/* ya form ka part */}
                                <div className="w-full">
                                    <form onSubmit={(e) => handleSubmit(e, items.id)} action="" className="flex w-full">
                                        <input type="text"
                                            onChange={(e) => handleInpute(e, items.id)}
                                            value={chat[items.id] || ''}
                                            name="text"
                                            placeholder="Type a message..."
                                            className="bg-white flex-1 min-w-0 border border-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 rounded-l outline-none text-xs sm:text-sm md:text-base" />
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-r hover:bg-blue-700 text-xs sm:text-sm md:text-base flex-shrink-0">
                                            Send
                                        </button>
                                    </form>


                                </div>
                            </div>
                        )}
                        <hr className="border-gray-100" />
                    </div>
                ))}

                {/* button for refresh */}
                <div className="flex justify-center mt-2">
                    {/* ya button hia  */}
                    <button
                        onClick={() => response()}
                        type="button"
                        className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm shadow-sm"
                    >
                        Refresh List
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Blacklist;