import { useState, useEffect } from "react";
import { MyContext } from "./context";

function UseAblefunction({ children }) {

    // const api = 'http://127.0.0.1:8000/api/Subscription/'
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const api = `${BASE_URL}/api/Subscription/`;
    const notificationApi = `${BASE_URL}/api/Notification/`

    // drop down button
    const [dropDown, setDropdown] = useState(false)
    const [comDown, setcomDown] = useState(null)
    const [postedit, setPostedit] = useState(null)
    const [sideDrop, setsideDrop] = useState(false)
    const [menuclose, setMenuClose] = useState(false)
    const [seDrop, setSeDrop] = useState(false)

    // user /super user
    const [is_superuser, setIs_superuser] = useState(localStorage.getItem('superuser') === 'true')
    const [currentToken, setCurrentToken] = useState(localStorage.getItem('access-token'))
    const [loading, setLoading] = useState(false)

    // ya use ka leya hai 
    const [checkData, setCheckData] = useState([])
    const profile = `${BASE_URL}/api/SpecificProfile/`;
    const fetchProfile = () => {
        const token = localStorage.getItem('access-token');
        if (!token) return;
        fetch(profile, {
            headers: {
                Authorization: `jwt ${token}`,
            }
        })
            .then((res) => res.json())
            .then((prv) => {
                setCheckData(prv)
            })
    }
    useEffect(() => {
        if (currentToken) {
            fetchProfile();
        } else {
            setCheckData([]);
        }
    }, [currentToken]);



    // ya notification ka part hia 
    const [notifications, setNotifications] = useState([]);

    //  chck kaor ka admin hia ya user
    const isUnread = (item) => is_superuser ? item.is_admin === false : item.is_User === true
    // sirf unread ka count
    const unreadCount = notifications.filter(isUnread).length



    const fetchNotifications = () => {
        const token = localStorage.getItem('access-token');
        if (token) {
            fetch(notificationApi, {
                headers: {
                    'Authorization': `jwt ${token}`,
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    const finalData = Array.isArray(result) ? result : (result?.results || []);
                    setNotifications(finalData);
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        if (currentToken) {
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [currentToken]);

    // Token se direct user id nikalne ka tareeqa
    const getUserIdFromToken = (token) => {
        if (!token) return null;
        try {
            const middlePart = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(middlePart)).user_id;
        } catch {
            return null;
        }
    };

    // yah par websocket ka hia 
    useEffect(() => {
        const userId = getUserIdFromToken(currentToken);
        if (!currentToken || !userId) return

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = new URL(BASE_URL).host
        const notificationSocket = new WebSocket(`${wsProtocol}//${wsHost}/ws/notification/${userId}/`);

        notificationSocket.onmessage = ((event) => {
            const data = JSON.parse(event.data)
            // agar message notification ka nahi hia to chor do
            if (data.kind !== 'notification') return
            setNotifications((prev) => {
                // ya check karta hia ka keya is phaly sa ya id mojud to nahi hai 
                if (prev.some((item) => item.id == data.id)) return prev
                const newItem = {
                    id: data.id,
                    notification_type: data.type,
                    text: data.text,
                    post: data.post_id,
                    comment: data.comment_id,
                    conversation: data.conversation_id,
                    group: data.group_id,
                    is_admin: data.is_admin,
                    is_User: data.is_User,
                    created_at: data.created_at
                }
                return [newItem, ...prev]
            })
        })

        return () => {
            notificationSocket.close()
        }
    }, [currentToken, checkData?.id, checkData?.pk])


    // ya subscrip ka part hia 
    const [subscriptionData, setSubscriptionData] = useState([]);
    const refreshSUB = () => {
        const token = localStorage.getItem('access-token');
        fetch(api, {
            method: "GET",
            headers: {
                'Authorization': `jwt ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setSubscriptionData(data))
    }

    // App load hone par subscription check
    useEffect(() => {
        if (currentToken && !is_superuser) {
            refreshSUB();
        } else if (!currentToken) {
            setSubscriptionData([]);
        }
    }, [currentToken, is_superuser]);


    const latestSubscription = subscriptionData[0]
    const is_sub = is_superuser || latestSubscription?.is_active === true
    //  ya function bana ya hia taky refresh ak bad sub kuch fetch akry page ko reload kary bagar
    const RefreshFetch = () => {
        const newToken = localStorage.getItem('access-token');
        const newSuperuser = localStorage.getItem('superuser') === 'true';

        setCurrentToken(newToken);
        setIs_superuser(newSuperuser);

        if (!newToken) {
            setCheckData([]);
            setNotifications([]);
            setSubscriptionData([]);
        }
    }

    return (
        <MyContext.Provider value={{
            isUnread,
            unreadCount,
            loading, setLoading,
            RefreshFetch,
            checkData,
            setCheckData,
            fetchProfile,
            notifications,
            setNotifications,
            fetchNotifications,
            subscriptionData,
            setSubscriptionData,
            refreshSUB,
            is_sub,
            menuclose,
            setMenuClose,
            seDrop,
            setSeDrop,
            sideDrop,
            setsideDrop,
            postedit,
            setPostedit,
            comDown,
            setcomDown,
            dropDown,
            setDropdown,
            currentToken
        }}>
            {children}
        </MyContext.Provider>
    )
}
export default UseAblefunction