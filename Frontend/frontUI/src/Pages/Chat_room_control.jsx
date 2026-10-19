import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../Context/context'


function Chat_room_control() {
    const { fetchNotifications } = useContext(MyContext)
    const currentToken = localStorage.getItem('access-token')

    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken) {
            return navigation('/')
        }
    }, [currentToken])

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    // const API = `${BASE_URL}/api/post/`;


    const [close, setClose] = useState(false)
    // ya user ki ip hai
    const UserApi = `${BASE_URL}/api/user/`;

    // const UserApi = 'http://127.0.0.1:8000/api/user'
    const [userdata, setUserData] = useState([])
    useEffect(() => {
        fetch(UserApi, {
            headers: {
                Authorization: `jwt ${currentToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserData(data)
            })
    }, [])

    // ya funciton conversation group ko create karny ka leya hai
    const [groupname, setGroupname] = useState('')
    const [selectedid, setSelectedID] = useState([])
    // is function ma id save ho gi
    const SelectUser = (id) => {
        setSelectedID((prev) => {
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id)
            } else {
                return ([...prev, id])
            }
        })
    }

    // yaha main fuction shuru ho ga
    const HandleSubmit = (e) => {
        e.preventDefault();
        const api = `${BASE_URL}/api/conversationgroup/`;

        // const api = 'http://127.0.0.1:8000/api/conversationgroup/'
        if (selectedid.length < 2) {
            return alert('please attach altleast 2 user')
        }
        fetch(api, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `jwt ${currentToken}`,
            },
            body: JSON.stringify({
                user: selectedid,
                Group_title: groupname,
                isActive: true
            })
        })
            .then(() => {
                setGroupname('')
                setSelectedID([])
                setClose(!close)
                Conver()
                fetchNotifications();
            })
    }

    // ya part conversation ko show karny ka leya ia 
    const api = `${BASE_URL}/api/conversationgroup/`;
    // const api = 'http://127.0.0.1:8000/api/conversationgroup/'
    const [conv, setConv] = useState([])
    const Conver = () => {
        fetch(api, {
            headers: {
                Authorization: `jwt ${currentToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setConv(data)

            })
    }
    useEffect(() => {
        Conver()
    }, [])

    // ya part group chat create kary ka leya hai
    const chat = `${BASE_URL}/api/groupchat/`;

    // const chat = 'http://127.0.0.1:8000/api/groupchat/'
    const [conversation, setConversation] = useState(null)
    const [text, setText] = useState("")

    const HandleSubmitChat = (e) => {
        e.preventDefault();
        const carrybox = new FormData();
        carrybox.append('text', text)
        carrybox.append('conversation', conversation)

        fetch(chat, {
            method: "POST",
            headers: {
                'Authorization': `jwt ${currentToken}`,
            },
            body: carrybox
        })
            .then(() => {
                setText("")
                Room(conversation)
                fetchNotifications();
            })
    }

    // ya par chat ko show karny kal eya hia

    const [talk, setTalk] = useState([])

    const Room = (roomId) => {
        const Chatroom = `${BASE_URL}/api/groupchat/?conversation=${roomId}`

        fetch(Chatroom, {
            headers: {
                Authorization: `jwt ${currentToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTalk(data.map((item) => ({
                    ...item,
                    Username: item.Username || item.username || item.user?.username || "",
                    userPic: item.userPic || item.user_pic || item.profile_pic || "",
                })))
            })
            .catch((err) => console.error("Room Error:", err))
    }


    // ya par conversation room ko talash karny ka leya hia 
    const RoomFind = conv.find(
        (items) => items.id === conversation)


    // ya part chat room ko Disable Room
    const is_superuser = localStorage.getItem('superuser') == 'true'
    const HandleDisable = (id) => {
        const api = `${BASE_URL}/api/conversationgroup/${id}/`
        fetch(api, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `jwt ${currentToken}`,
            },
            body: JSON.stringify({
                isActive: false
            })
        })
            .then((res) => {
                if (res.ok) {
                    Conver()
                } else {
                    alert('Failed to disable the room')
                }
            })
            .catch((err) => console.error('Error:', err))
    }

    // ya funciton chat room ko enble karny ka ley hai 
    const HandleEnable = (id) => {
        const api = `${BASE_URL}/api/conversationgroup/${id}/`
        fetch(api, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `jwt ${currentToken}`,
            },
            body: JSON.stringify({
                isActive: true
            })
        })
            .then((res) => {
                if (res.ok) {
                    Conver()
                } else {
                    alert('Failed to Enable the room')
                }
            })
            .catch((err) => console.error('Error:', err))
    }
    const [loading, setLoading] = useState({})

    // ay websocke hai 
    useEffect(() => {
        // agar kisy room ko select nahi keay gya hai to kuch na karo
        if (conversation == null || !currentToken) return;

        const wsProtocol = window.location.protocol === 'https://' ? 'wss:' : 'ws:';
        const wsHost = new URL(BASE_URL).host
        const chatSocket = new WebSocket(`${wsProtocol}//${wsHost}/ws/group/${conversation}/`);

        chatSocket.onmessage = (event) => {
            const rawData = JSON.parse(event.data);
            console.log("Live Group Message:", rawData);
            if (rawData.kind !== "group_chat") return;
            const messageData = rawData.payload || rawData;
            const newMessage = {
                ...messageData,
                Username: messageData.Username || messageData.username || "",
                userPic: messageData.userPic || messageData.user_pic || "",
            };

            setTalk((prev) => {
                // Duplicate message se bachne ke liye check
                if (prev.some((item) => item.id === newMessage.id)) {
                    return prev;
                }
                return [...prev, newMessage];
            });
        };

        return () => {
            chatSocket.close();
        };
    }, [conversation, currentToken, BASE_URL]);


    return (
        <>
            <div className='border-gray-200 rounded-b-xl'>
                <div className="relative flex min-h-screen sm:flex-row gap-2 flex-col bg-white py-2.5 sm:py-4 px-3 sm:px-6 md:px-8 border-l border-gray-200">

                    {/* yaha par room show ho gy  */}
                    <div className="w-full max-w-[400px] rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col ">
                        {/* title and create button */}
                        <div className="w-full flex items-center justify-between gap-2">
                            <span className="font-semibold text-lg sm:text-xl">Chat Rooms</span>
                            <span
                                onClick={() => setClose(true)}
                                className="rounded-lg py-1.5 px-2 sm:px-2.5 bg-blue-600 text-white cursor-pointer hover:bg-blue-700 text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                                + Create
                            </span>
                        </div>

                        {/* yaha par chat room show ho gy */}
                        {conv.length > 0 ? (
                            <div className="flex flex-col mt-3 sm:mt-4 gap-y-2 max-h-[300px] overflow-y-auto">
                                {/* ya main div hai  */}
                                {conv.map((items, index) => (
                                    <div key={index} className="bg-blue-400/20 border border-blue-600 rounded-lg p-2 sm:p-2.5 space-y-2">

                                        {/* Part 1: Clickable Chat Room Card */}
                                        <div
                                            onClick={() => {
                                                setConversation(items.id);
                                                Room(items.id);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {/* Name or status */}
                                            <div className="flex justify-between items-center gap-2">
                                                <div className="font-medium text-gray-800 text-xs sm:text-sm md:text-base truncate">
                                                    {items.Group_title}
                                                </div>
                                                <div className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${items.isActive
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {items.isActive ? 'Active' : 'Disabled'}
                                                </div>
                                            </div>

                                            {/* Members count */}
                                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                                👥 {items.user.length} Members
                                            </div>
                                        </div>
                                        {/* Part 2: Dynamic Enable/Disable Button */}
                                        {is_superuser && (
                                            <button
                                                onClick={() => items.isActive ? HandleDisable(items.id) : HandleEnable(items.id)}
                                                className={`w-full text-center text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1 rounded-lg text-white ${items.isActive
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                    }`}
                                            >
                                                {items.isActive ? 'Disable Room' : 'Enable Room'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='text-gray-400 text-xs sm:text-sm mt-3'>
                                No room available
                            </div>
                        )}
                    </div>


                    {/* yaha par chat ho gi */}
                    <div className="flex flex-col flex-1 bg-white min-h-[400px] sm:ml-4 md:ml-6 rounded-2xl shadow-lg ">
                        {RoomFind ? (
                            <>
                                {/* ya title div hai  */}
                                <div className="border-b border-gray-200 text-sm sm:text-base md:text-lg font-semibold text-gray-800 p-3 sm:p-4 truncate">
                                    Room: {RoomFind?.Group_title}
                                </div>

                                {/* yaha par text or form show ho ga */}
                                {talk.length > 0 ? (
                                    <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 px-3 sm:px-4 py-3 sm:py-4">
                                        {talk.map((i) => (
                                            <div key={i.id} className="flex items-start gap-x-2">
                                                {/* ya image ka leya hai  */}
                                                <div className={`overflow-hidden w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0
                                                   ${!loading[`${i.id}-userPic`] ? "animate-pluse" : ""} 
                                                    `}>
                                                    <img
                                                        src={i.userPic}
                                                        onLoad={() => {
                                                            setLoading((pre) => ({
                                                                ...pre, [`${i.id}-userPic`]: true
                                                            }))
                                                        }}
                                                        className={`w-full h-full object-cover ${loading[`${i.id}-userPic`] ? "opacity-100" : "opacity-0"}`} alt="" />
                                                </div>
                                                {/* ya text or user name ka eya hia  ka leya hai  */}
                                                <div className="p-2 rounded-xl w-auto bg-gray-200 max-w-[80%] text-gray-800 break-words">
                                                    <h1 className="text-[10px] sm:text-xs font-semibold">
                                                        {i.Username}
                                                    </h1>
                                                    <p className="text-xs sm:text-sm md:text-base break-word ">
                                                        {i.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                                        Write someting...
                                    </div>
                                )}

                                {/* yaha pr form show ho ga */}
                                {RoomFind.isActive ? (
                                    <form onSubmit={HandleSubmitChat} action=""
                                        className="p-2.5 sm:p-3 md:p-4 border-t gray-100 border-gray-200 flex items-center gap-2 sm:gap-3">
                                        <input
                                            onChange={(e) => setText(e.target.value)}
                                            value={text}
                                            name='text'
                                            type="text"
                                            className="flex-1 border min-w-0 border-gray-200 rounded-lg px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 outline-none text-xs sm:text-sm md:text-base" />
                                        <button className="shrink-0 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 text-xs sm:text-sm md:text-base">
                                            Send
                                        </button>
                                    </form>
                                ) : (
                                    <div className="p-3 sm:p-4 border-t border-gray-200 text-center text-red-500 font-semibold bg-red-50 text-xs sm:text-sm">
                                        ya room disable hai
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-xs sm:text-sm px-3 text-center">

                                Select a room to start chatting

                            </div>
                        )}
                    </div>

                </div>

                {/* group create form  */}
                {close && (
                    <div className='fixed z-[999] inset-0 min-h-screen bg-black/40 flex justify-center items-center p-3 sm:p-0'>
                        {/* main div */}
                        <div className='bg-white rounded-2xl shadow-lg p-3 sm:p-5 md:p-6 shrink-0 w-full max-w-[400px] max-h-[90vh] overflow-y-auto'>
                            {/* title */}
                            <h1 className='text-base sm:text-lg mb-4 sm:mb-5 text-gray-700 font-semibold'>
                                Create New Room
                            </h1>
                            <form
                                onSubmit={HandleSubmit}
                                action="">
                                {/* group name */}
                                <input
                                    onChange={(e) => setGroupname(e.target.value)}
                                    value={groupname}
                                    name='Group_title'
                                    type="text"
                                    className='w-full rounded-lg px-3 py-2 mb-3 sm:mb-4 border outline-none border-gray-400 text-xs sm:text-sm md:text-base'
                                    placeholder='Enter room name'
                                />
                                <div className="h-40 border rounded-lg p-2 mb-3 sm:mb-4 border-gray-400 overflow-y-scroll space-y-2">
                                    {userdata
                                        .filter((item) => item.is_staff === false)
                                        .map((items, index) => (
                                            <div
                                                onClick={() => SelectUser(items.id)}
                                                key={index}
                                                className={`p-2 cursor-pointer rounded-lg w-full text-start space-y-2 text-xs sm:text-sm ${selectedid.includes(items.id) ? 'bg-blue-100 text-blue-600' : "bg-gray-100 text-gray-600"}`}>
                                                {items.username}
                                            </div>
                                        ))}
                                </div>
                                {/* yaha par button hai */}
                                <div className='flex flex-col-reverse sm:flex-row justify-stretch sm:justify-end gap-2'>
                                    <button type='button' onClick={() => {
                                        setSelectedID([]),
                                            setGroupname(''),
                                            setClose(false)
                                    }} className='rounded-lg bg-gray-300 px-4 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base'>
                                        Cancel
                                    </button>
                                    <button type='submit' className='rounded-lg text-xs sm:text-sm md:text-base bg-blue-600 px-4 py-2 sm:py-2.5 bg-blue-600 text-white'>
                                        Create
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
} export default Chat_room_control