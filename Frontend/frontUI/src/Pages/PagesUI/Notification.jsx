import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MyContext } from "../../Context/context"

function Notification() {
    const { notifications, setNotifications, fetchNotifications } = useContext(MyContext)
    const currentToken = localStorage.getItem('access-token')
    const navigation = useNavigate()

    useEffect(() => {
        fetchNotifications()
    }, [])


    // Notification redirection
    const handleNavigation = (item) => {
        const type = item.notification_type;

        if (type === "post_like" || type === "repost") {
            navigation(`/Home/post_details/${item.post}`);
        }
        else if (type === "comment") {
            navigation(`/Home/post_details/${item.post}?comment=${item.comment}`);
        }
        else if (type === "chat" || type === "message") {
            navigation("/Home/blacklist");
        }
        else if (type === "group") {
            navigation("/Home/chat_room_control");
        }
        else if (type === "subscription") {
            navigation("/Home/subscription");
        }
        else {
            navigation("/Home");
        }
    };

    // Saari notifications ek sath delete karne ka function 
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Notification/`;

    // const API = 'http://127.0.0.1:8000/api/Notification/'
    const ClearAllNotifications = () => {
        notifications.forEach((item) => {
            fetch(`${API}${item.id}/`, {
                method: "DELETE",
                headers: currentToken ?
                    {
                        Authorization: `jwt ${currentToken}`,
                    } : {},
            });
        });
        setNotifications([]);
    };

    // notification read or not read
    const isAdmin = localStorage.getItem('superuser') === 'true'

    const isUnread = (item) => {
        return isAdmin ? item.is_admin === false : item.is_User === true
    }
    const markAsRead = (item) => {
        if (!isUnread(item)) return

        const body = isAdmin ? { is_admin: true } : { is_User: false }

        fetch(`${API}${item.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `jwt ${currentToken}`,
            },
            body: JSON.stringify(body),
        })

        setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, ...body } : n))
        )
    }

    return (
        <div className="bg-white rounded-xl">
            <div className="w-full max-w-sm sm:w-80 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden text-black">

                {/* Header */}
                <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-gray-200 flex justify-between items-center gap-2 bg-gray-100">
                    <h3 className="font-bold text-sm sm:text-base text-black">Notifications</h3>
                    <span className="text-[11px] sm:text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        {notifications.length} new
                    </span>
                </div>

                {/* Notifications */}
                <div className="overflow-y-auto max-h-60 sm:max-h-72">

                    {notifications.length === 0 ? (
                        <p className="text-center text-xs sm:text-sm text-gray-500 py-6">No notifications</p>
                    ) : (
                        notifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    markAsRead(item)
                                    handleNavigation(item)
                                }}
                                className={`p-2.5 sm:p-3 flex items-start sm:items-center justify-between gap-2 cursor-pointer border-b border-gray-200
    ${isUnread(item) ? "bg-green-100" : "bg-white hover:bg-gray-100"}`}
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-700 text-xs sm:text-sm">🔔</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-black">Notification</h4>
                                    <p className="text-[11px] sm:text-xs text-gray-700 font-medium break-words leading-snug">
                                        {item.text}
                                    </p>
                                    <span className="text-[10px] sm:text-[11px] text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="text-gray-400 text-xs shrink-0">&gt;</span>
                            </div>
                        ))
                    )}

                </div>

                <div className="px-3 py-2 sm:px-4 bg-gray-100 border-t border-gray-200 text-xs sm:text-sm flex justify-end sm:justify-start">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            ClearAllNotifications();
                        }}
                        className="text-gray-700 font-bold cursor-pointer hover:text-black"
                    >
                        Clear
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Notification