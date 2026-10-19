// icons
import { FiSidebar } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
// main top Nav link
import MainTopbar from "./UI/MainTopbar";
// usecontex api for top navbar
import { useContext, useEffect, useState, useRef } from "react";
import Notification from '../Pages/PagesUI/Notification'
import { useNavigate } from "react-router-dom";
import { HiLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { MyContext } from "../Context/context";

function Top_nav() {
    const navigation = useNavigate()
    const currentToken = localStorage.getItem("access-token");
    const {
        RefreshFetch,
        notifications,
        checkData,
        setMenuClose,
        menuclose,
        isUnread,
        unreadCount,
        loading, setLoading
    } = useContext(MyContext)
    const [noti, setNoti] = useState(false)
    const [log, setLog] = useState(false)
    const logRef = useRef(null)
    const notiRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (logRef.current && !logRef.current.contains(event.target)) {
                setLog(false);
            }
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setNoti(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* main div for topbar */}
            <div className="relative border shadow-t-xl border-gray-200 rounded-t-xl md:py-1 px-3 sm:px-4 bg-white flex justify-between items-center">
                {/* siderbar button Icon*/}

                {currentToken ? (
                    <div onClick={() => setMenuClose(!menuclose)} className="cursor-pointer">
                        <FiSidebar className={`cursor-pointer ${menuclose ? "text-green-600" : "text-gray-600"}`} />
                    </div>
                ) : (
                    <span></span>
                )}
                {/* main NavLink Desktop*/}
                <div className="hidden md:block">
                    <MainTopbar />
                </div>

                {/* Bell Icon */}
                <div className="cursor-pointer gap-x-1 sm:gap-x-2 flex justify-center items-center py-2">
                    {currentToken && (
                        <div className="relative inline-block" ref={notiRef} onClick={(e) => e.stopPropagation()}>
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNoti((prev) => !prev);
                                }}
                                className="p-1.5 relative inline-flex items-center justify-center cursor-pointer select-none"
                            >
                                <FaRegBell className="size-4 md:size-6 text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold pointer-events-none z-10">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                    <div className="relative" ref={logRef}>
                        <div
                            onClick={() => setLog((prev) => !prev)}
                            className="w-8 h-8 overflow-hidden rounded-full flex justify-center items-center cursor-pointer"
                        >
                            {currentToken && checkData?.[0]?.userPic ? (
                                <div
                                    className={`w-full h-full overflow-hidden bg-gray-300 rounded-full ${loading[!checkData[0].userPic] ? "animate-pulse" : ""
                                        }`}
                                >
                                    <img
                                        src={checkData[0].userPic}
                                        onLoad={() => {
                                            setLoading((prev) => ({
                                                ...prev, [checkData[0].userPic]: true
                                            }))
                                        }}
                                        alt="Profile"
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${loading[checkData[0].userPic] ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                </div>

                            ) : (
                                <CgProfile className="size-5 sm:size-6 text-gray-600" />
                            )}
                        </div>

                        <div className={`border border-gray-200 shadow transition-all duration-200 ease-out absolute right-0 mt-2 w-28 sm:w-32 bg-white rounded-md p-1 z-50
                            ${log ?
                                "visible opacity-100 scale-100 translate-y-0"
                                : "invisible opacity-0 scale-95 -translate-y-1"
                            }
                            `}>
                            {currentToken ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        localStorage.removeItem('access-token');
                                        localStorage.removeItem('refresh-token');
                                        localStorage.removeItem('username');
                                        localStorage.removeItem('superuser');
                                        localStorage.removeItem('active');

                                        RefreshFetch();
                                        setLog(false);
                                        navigation('/login');
                                    }}
                                    title="Logout"
                                    className="group w-full px-2 py-1.5 text-gray-700 hover:text-red-600 transition-colors duration-150 flex items-center justify-between text-xs sm:text-sm font-medium cursor-pointer"
                                >
                                    <span>Logout</span>
                                    <HiLogout className="size-4 sm:size-5 text-gray-500 group-hover:text-red-600" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLog(false);
                                        navigation('/login');
                                    }}
                                    title="Login"
                                    className="group w-full px-2 py-1.5 text-gray-700 hover:text-blue-600 transition-colors duration-150 flex items-center justify-between text-xs sm:text-sm font-medium cursor-pointer"
                                >
                                    <span>Login</span>
                                    <CgProfile className="size-4 sm:size-5 text-gray-500 group-hover:text-blue-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            {currentToken && (
                <div className={`origin-top-right transition-all duration-100 ease-out z-50 fixed top-14 left-3 right-3 sm:left-auto sm:right-3 flex justify-end
                         ${noti ? "opacity-100 visible scale-100" : "scale-95 opacity-0 invisible"}
                              `}>
                    <Notification />
                </div>
            )}
        </>
    )
} export default Top_nav


{/* dropdwon button */ }
{/* <button onClick={() => setDropdown(!dropDown)} */ }
{/* className="md:hidden block cursor-pointer"> */ }
{/* burger icons for dropdown */ }
{/* <span>
                            <RxHamburgerMenu className="size-4" />
                        </span> */}
{/* </button> */ }

{/* ya login button or logout button ka part hai  */ }