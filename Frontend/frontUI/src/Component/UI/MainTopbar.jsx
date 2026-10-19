import { FaCrown } from "react-icons/fa";
import { useContext, useState } from "react"
import { HiOutlineHome, HiOutlineClipboardDocumentCheck, HiOutlineWrenchScrewdriver, HiOutlineDocumentText, HiOutlineCpuChip } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { MyContext } from "../../Context/context";

function MainTopbar() {
    // pc laptop
    const getLinkStyle = ({ isActive }) =>
        isActive ? "bg-gray-200/50 rounded px-3 py-1" : "rounded px-3 py-1 hover:bg-gray-200/50"
    // mobile version
    const MobileLinkStyle = ({ isActive }) =>
        isActive ? "bg-gray-200/50 rounded px-3 py-1" : "rounded px-3 py-1 hover:bg-gray-200/50"
    // context for mobile
    const { is_sub, dropDown, setDropdown } = useContext(MyContext)
    const [serviceDrop, setServiceDrop] = useState(false)


    return (
        <>
            {/* it show on laptop pc */}
            <div className="hidden md:block">
                <nav className="flex w-auto px-1 lg:px-2 gap-x-3 lg:gap-x-6">
                    {/* home Page */}
                    <NavLink to="/Home" end className={getLinkStyle}>
                        <div className="flex justify-center items-center">
                            <span>
                                <HiOutlineHome className="size-4 lg:size-5 mr-1.5 lg:mr-2" />
                            </span>
                            <span className="text-xs lg:text-sm">
                                Home
                            </span>
                        </div>
                    </NavLink>

                    {/* Evaluation Page */}
                    <div className="flex items-center justify-between ml-1 lg:ml-2 hover:bg-gray-400/20 rounded pr-1 lg:pr-2">
                        <NavLink
                            to={is_sub ? "/Home/evalution" : "/Home/subscription"}
                            className={({ isActive }) => `${getLinkStyle({ isActive })} flex-grow flex items-center justify-between`}
                        >
                            <div className="flex justify-center items-center">
                                <span>
                                    <HiOutlineClipboardDocumentCheck className="size-4 lg:size-5 mr-1.5 lg:mr-2" />
                                </span>
                                <span className="text-xs lg:text-sm">
                                    Evaluation
                                </span>
                            </div>
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
                        className="relative inline-block "
                        onMouseEnter={() => setServiceDrop(true)}
                        onMouseLeave={() => setServiceDrop(false)}>
                        <div className="flex justify-center items-center cursor-pointer px-2 lg:px-3 py-1 rounded hover:bg-gray-200/50">
                            <span>
                                <IoSettingsOutline className="size-4 lg:size-5 mr-1.5 lg:mr-2" />
                            </span>
                            <span className="text-xs lg:text-sm">
                                Service
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        <div className={`transition-all duration-300 ease-in-out origin-top-center
                         absolute left-0 top-full flex flex-col space-y-3 border w-40 rounded border-gray-400 bg-white shadow-xl p-3 z-[999]
                           ${serviceDrop
                                ? "opacity-100 visible translate-y-0"
                                : "opacity-0 invisible -translate-y-2 pointer-events-none"
                            }
                            `}>
                            <NavLink to="/Home/alipay" className="text-sm text-gray-700 hover:text-blue-500">
                                AliPay
                            </NavLink>
                            <NavLink to="/Home/refund" className="text-sm text-gray-700 hover:text-gray-500">
                                Refund
                            </NavLink>
                            <NavLink to="/Home/webdeveloper" className="text-sm text-gray-700 hover:text-gray-500">
                                Website developer
                            </NavLink>
                            <NavLink to="/Home/reviews" className="text-sm text-gray-700 hover:text-gray-500">
                                Reviews
                            </NavLink>
                        </div>
                    </div>

                    {/* Article Page */}
                    <NavLink to="/Home/artical" className={getLinkStyle}>
                        <div className="flex justify-center items-center">
                            <span>
                                <HiOutlineDocumentText className="size-4 lg:size-5 mr-1.5 lg:mr-2" />
                            </span>
                            <span className="text-xs lg:text-sm">
                                Article
                            </span>
                        </div>
                    </NavLink>


                    {/* Tools Page */}
                    <NavLink to="/Home/tools" className={getLinkStyle}>
                        <div className="flex justify-center items-center">
                            <span>
                                <HiOutlineWrenchScrewdriver className="size-4 lg:size-5 mr-1.5 lg:mr-2" />
                            </span>
                            <span className="text-xs lg:text-sm">
                                Tools
                            </span>
                        </div>
                    </NavLink>

                </nav>
            </div>

            {/* mobile version */}
            {/* <div>
                <nav className="flex flex-col space-y-1 border w-44 sm:w-48 rounded-lg border-gray-200 bg-white shadow-lg p-2 md:hidden">

                    {/* Home */}
            {/* <NavLink onClick={() => setDropdown(false)} to="/Home" end className={MobileLinkStyle}>
                        <div className="flex justify-start items-center">
                            <HiOutlineHome className="size-4 sm:size-5 mr-2" />
                            <span className="text-xs sm:text-sm">Home</span>
                        </div>
                    </NavLink> */}

            {/* Evaluation */}
            {/* <NavLink
                        onClick={() => setDropdown(false)}
                        to={is_sub ? "/Home/evalution" : "/Home/subscription"}
                        className={MobileLinkStyle}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex justify-start items-center">
                                <HiOutlineClipboardDocumentCheck className="size-4 sm:size-5 mr-2" />
                                <span className="text-xs sm:text-sm">Evaluation</span>
                            </div>

                            {!is_sub && (
                                <span
                                    title="Upgrade to Premium"
                                    className="text-amber-500 flex items-center bg-amber-100 px-1.5 py-0.5 rounded-full"
                                >
                                    <FaCrown className="size-3" />
                                </span>
                            )}
                        </div>
                    </NavLink> */}

            {/* Service */}
            {/* <div className="relative">
                        <button
                            onClick={() => setServiceDrop(!serviceDrop)}
                            className="w-full rounded px-2 sm:px-3 py-2 hover:bg-gray-200/50 flex justify-start items-center"
                        >
                            <IoSettingsOutline className="size-4 sm:size-5 mr-2" />
                            <span className="text-xs sm:text-sm">Service</span>
                        </button> */}

            {/* Service Dropdown */}
            {/* <div className={`origin-top transition-all duration-100 ease-in-out mt-1 ml-2 flex flex-col space-y-1 border border-gray-200 rounded-lg bg-gray-50 p-2
                            ${serviceDrop ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}
                            `}>

                            <NavLink
                                to="/Home/alipay"
                                className="text-xs sm:text-sm text-gray-700 rounded px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-200/50"
                            >
                                AliPay
                            </NavLink>

                            <NavLink
                                to="/Home/refund"
                                className="text-xs sm:text-sm text-gray-700 rounded px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-200/50"
                            >
                                Refund
                            </NavLink>

                            <NavLink
                                to="/Home/webdeveloper"
                                className="text-xs sm:text-sm text-gray-700 rounded px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-200/50"
                            >
                                Website developer
                            </NavLink>

                            <NavLink
                                to="/Home/reviews"
                                className="text-xs sm:text-sm text-gray-700 rounded px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-200/50"
                            >
                                Reviews
                            </NavLink>

                        </div>
                    </div> */}

            {/* Article */}
            {/* <NavLink onClick={() => setDropdown(false)} to="/Home/artical" className={MobileLinkStyle}>
                        <div className="flex justify-start items-center">
                            <HiOutlineDocumentText className="size-4 sm:size-5 mr-2" />
                            <span className="text-xs sm:text-sm">Article</span>
                        </div>
                    </NavLink> */}

            {/* Tools */}
            {/* <NavLink onClick={() => setDropdown(false)} to="/Home/tools" className={MobileLinkStyle}>
                        <div className="flex justify-start items-center">
                            <HiOutlineWrenchScrewdriver className="size-4 sm:size-5 mr-2" />
                            <span className="text-xs sm:text-sm">Tools</span>
                        </div>
                    </NavLink> */}

            {/* </nav> */}
            {/* </div>  */}

        </>
    )
} export default MainTopbar