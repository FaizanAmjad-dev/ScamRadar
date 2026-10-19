import { FaCrown } from "react-icons/fa";
import { useContext, useState, useRef, useEffect } from "react"
import { HiOutlineHome, HiOutlineClipboardDocumentCheck, HiOutlineWrenchScrewdriver, HiOutlineDocumentText, HiOutlineCpuChip } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { MyContext } from "../Context/context";

function Bottom_nav() {
    // mobile
    const getLinkStyle = ({ isActive }) =>
        isActive ? "bg-gray-200/50 rounded px-3 py-1 text-green-700" : "rounded px-3 py-1 hover:bg-gray-200/50"
    const servic = ({ isActive }) => isActive ? "text-xs sm:text-sm hover:text-blue-500 text-blue-700" : "text-xs sm:text-sm text-gray-700 hover:text-blue-500"
    // context for mobile
    const { is_sub } = useContext(MyContext)
    const [serviceDrop, setServiceDrop] = useState(false)
    const service = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (service.current && !service.current.contains(event.target)) {
                setServiceDrop(false);
            }
        };
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);


   useEffect(() => {
        const handleClickOutside = (event) => {
            if (service.current && !service.current.contains(event.target)) {
                setServiceDrop(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [])

    return (
        <>
            {/* Bottom bar*/}
            <nav className="flex flex-row border-gray-200 rounded-t-sm border-t justify-between bg-white w-auto px-1 py-3 lg:px-2 gap-x-3 lg:gap-x-6">
                {/* home Page */}
                <NavLink to="/Home" end className={getLinkStyle}>
                    <div className="flex justify-center items-center">
                        <span>
                            <HiOutlineHome className="size-6 lg:size-7" />
                        </span>
                    </div>
                </NavLink>

                {/* Evaluation Page */}
                <div className="flex items-center justify-between ml-1 lg:ml-2 hover:bg-gray-400/20 rounded pr-1 lg:pr-2">
                    <NavLink
                        to={is_sub ? "/Home/evalution" : "/Home/subscription"}
                        className={({ isActive }) => `${getLinkStyle({ isActive })} flex-grow flex items-center justify-between`}
                    >
                        <span>
                            <HiOutlineClipboardDocumentCheck className="size-6 lg:size-7" />
                        </span>
                    </NavLink>

                    {!is_sub && (
                        <span
                            title="Upgrade to Premium"
                            className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs"
                        >
                            <FaCrown className="size-3" />
                        </span>
                    )}
                </div>


                {/* Service Page*/}
                <div
                    ref={service}
                    className="relative inline-block "
                    onClick={() => setServiceDrop((prev) => !prev)}>
                    <div className="flex justify-center items-center cursor-pointer px-2 lg:px-3 py-1 rounded hover:bg-gray-200/50">
                        <span>
                            <IoSettingsOutline className="size-6 lg:size-7 active:text-green-700" />
                        </span>
                    </div>

                    {/* Dropdown Menu */}
                    <div className={`transition-all duration-300 ease-in-out origin-bottom-center
                         absolute left-0 bottom-12 flex flex-col space-y-3 border w-40 rounded border-gray-200 bg-white shadow p-3 z-[999]
                             ${serviceDrop
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible translate-y-2 pointer-events-none"
                        }
                            `}>
                        <NavLink to="/Home/alipay" className={servic}>
                            AliPay
                        </NavLink>
                        <NavLink to="/Home/refund" className={servic}>
                            Refund
                        </NavLink>
                        <NavLink to="/Home/webdeveloper" className={servic}>
                            Website developer
                        </NavLink>
                        <NavLink to="/Home/reviews" className={servic}>
                            Reviews
                        </NavLink>
                    </div>
                </div>

                {/* Article Page */}
                <NavLink to="/Home/artical" className={getLinkStyle}>
                    <span>
                        <HiOutlineDocumentText className="size-6 lg:size-7" />
                    </span>
                </NavLink>


                {/* Tools Page */}
                <NavLink to="/Home/tools" className={getLinkStyle}>
                    <span>
                        <HiOutlineWrenchScrewdriver className="size-6 lg:size-7" />
                    </span>
                </NavLink>

            </nav>
        </>
    )
} export default Bottom_nav