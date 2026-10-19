import { RiDashboardHorizontalLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { FaChevronRight, FaCrown } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { IoHelpBuoyOutline } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'
import { FiSidebar } from "react-icons/fi";
import scam from '../assets/scam.jpg'
import { MyContext } from "../Context/context";

function Side_nav() {
    const currentToken = localStorage.getItem('access-token')
    const { setMenuClose, menuclose, is_sub, seDrop, setSeDrop, sideDrop, setsideDrop } = useContext(MyContext)
    const is_superuser = localStorage.getItem('superuser') === "true"
    return (
        <>
            {/* main div */}
            <div className="h-screen flex flex-col overflow-y-auto ">
                <div className="sm:overflow-hidden h-screen pt-6 pl-6 flex flex-col bg-gray-200/40 pr-4 w-full md:max-w-[255px] md:w-auto">
                    <div className="flex justify-between items-center">
                        {/* second div for logo and name */}
                        <div className="flex flex-row items-center">
                            {/* logo */}
                            <div className="w-8 sm:w-10 pr-0.5 overflow-hidden">
                                <img src={scam} className="w-full h-full object-cover" />
                            </div>
                            {/* second name div */}
                            <div className="flex flex-col">
                                <div className="text-xs sm:text-sm font-semibold">ScamRadar</div>
                                <div className="text-[10px] sm:text-xs ">Enterprise</div>
                            </div>
                        </div>
                        {/* ya mobile par togal ka leya ia  */}
                        <div onClick={() => setMenuClose(!menuclose)} className="md:hidden sm:block cursor-pointer">
                            <FiSidebar className={`cursor-pointer size-4 sm:size-5 ${menuclose ? "text-green-600" : "text-gray-600"}`} />
                        </div>
                    </div>

                    {/* third nav link div for Platform */}
                    <div className="flex flex-col pt-4 flex-1">
                        {/* name plateform */}
                        <div className="text-xs sm:text-sm text-gray-600">
                            Platform
                        </div>
                        {/* NavLInk part */}
                        <nav className="flex flex-col pt-2 h-full">
                            {/* dasboard first part */}
                            <div className="flex items-center justify-start md:justify-center hover:bg-gray-400/20 rounded py-1 gap-4 sm:gap-25">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {/* logo */}
                                    <span>
                                        <RiDashboardHorizontalLine className="size-4 sm:size-5" />
                                    </span>
                                    {/* name Dashboard */}
                                    <NavLink onClick={() => setMenuClose(!menuclose)} to={is_sub ? "dashboard" : "/Home/subscription"} className="text-xs sm:text-sm cursor-pointer">
                                        Dashboard
                                    </NavLink>
                                </div>
                                {/* arrow for DropDown */}
                                <button onClick={() => setsideDrop(!sideDrop)} className="cursor-pointer hover:bg-gray-400/40 hover:rounded-full">
                                    <MdOutlineKeyboardArrowDown className="size-3.5 sm:size-4" />
                                </button>
                            </div>

                            {/* right border div */}
                            {!sideDrop && (
                                <div className="border-l ml-2 mt-2 mb-2 border-gray-400/40">
                                    {/* second main part */}
                                    <div className="flex flex-col w-full md:max-w-[200px]">
                                        {/* nav link */}
                                        <div className="flex flex-col w-full ml-2 space-y-1 pr-2 sm:pr-4">
                                            {/* dahboard */}
                                            {/* Dashboard with Direct Data Check */}
                                            <div className="flex items-center justify-between ml-2 hover:bg-gray-400/20 rounded py-1 pr-2">
                                                <NavLink
                                                    onClick={() => setMenuClose(!menuclose)}
                                                    to={is_sub ? "dashboard" : "/Home/subscription"}
                                                    className="cursor-pointer text-xs sm:text-sm flex-grow flex items-center justify-between"
                                                >
                                                    <span>Dashboard</span>

                                                    {/* Agar data aa chuka hai aur kisi ki bhi is_active true nahi hai */}

                                                </NavLink>
                                                {!is_sub && (
                                                    <span
                                                        title="Upgrade to Premium"
                                                        className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs"
                                                    >
                                                        <FaCrown className="size-2.5 sm:size-3" />

                                                    </span>
                                                )}
                                            </div>

                                            {currentToken && is_superuser ? (

                                                <>
                                                    {/*  User Search*/}
                                                    <NavLink onClick={() => setMenuClose(!menuclose)} to="user_Search" className="cursor-pointer ml-2 text-xs sm:text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                        User Search
                                                    </NavLink>
                                                    {/*  Users*/}
                                                    <NavLink onClick={() => setMenuClose(!menuclose)} to="user" className="cursor-pointer ml-2 text-xs sm:text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                        Users
                                                    </NavLink>

                                                    {/*Flags*/}
                                                    <NavLink onClick={() => setMenuClose(!menuclose)} to="flags" className="cursor-pointer ml-2 text-xs sm:text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                        Flags
                                                    </NavLink>
                                                </>
                                            ) : (
                                                <div className="hidden">
                                                </div>
                                            )}


                                            {/*Blacklist*/}
                                            <NavLink onClick={() => setMenuClose(!menuclose)} to="blacklist" className="cursor-pointer ml-2 text-xs sm:text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                Blacklist
                                            </NavLink>

                                            {/* Suggestions */}
                                            <div className="flex items-center justify-between ml-2 hover:bg-gray-400/20 rounded py-1 pr-2">
                                                <NavLink
                                                    onClick={() => setMenuClose(!menuclose)}
                                                    to={is_sub ? "suggestions" : "/Home/subscription"}
                                                    className="cursor-pointer text-xs sm:text-sm flex-grow flex items-center justify-between"
                                                >
                                                    <span>Suggestions</span>
                                                </NavLink>
                                                {!is_sub && (
                                                    <span
                                                        title="Upgrade to Premium"
                                                        className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs"
                                                    >
                                                        <FaCrown className="size-2.5 sm:size-3" />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Chat Room Control Link with Crown */}
                                            <div className="flex items-center justify-between ml-2 hover:bg-gray-400/20 rounded py-1 pr-2">
                                                <NavLink
                                                    onClick={() => setMenuClose(!menuclose)}
                                                    to={is_sub ? "chat_room_control" : "/Home/subscription"}
                                                    className="cursor-pointer text-xs sm:text-sm flex-grow flex items-center justify-between"
                                                >
                                                    <span>Chat Room Control</span>
                                                </NavLink>
                                                {!is_sub && (
                                                    <span
                                                        title="Upgrade to Premium"
                                                        className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs"
                                                    >
                                                        <FaCrown className="size-2.5 sm:size-3" />
                                                    </span>
                                                )}
                                            </div>

                                            {/*Annoucement Banner*/}
                                            <NavLink onClick={() => setMenuClose(!menuclose)} to="announcement_banner" className="cursor-pointer ml-2 text-xs sm:text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                Annoucement Banner
                                            </NavLink>
                                            {/* Rules Pages */}
                                            <div className="flex items-center justify-between ml-2 hover:bg-gray-400/20 rounded py-1 pr-2">
                                                <NavLink
                                                    onClick={() => setMenuClose(!menuclose)}
                                                    to={is_sub ? "rules_pages" : "/Home/subscription"}
                                                    className="cursor-pointer text-xs sm:text-sm flex-grow flex items-center justify-between"
                                                >
                                                    <span>Rules Pages</span>
                                                </NavLink>
                                                {!is_sub && (
                                                    <span
                                                        title="Upgrade to Premium"
                                                        className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs"
                                                    >
                                                        <FaCrown className="size-2.5 sm:size-3" />
                                                    </span>
                                                )}
                                            </div>


                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            <div onClick={() => setSeDrop(!seDrop)} className="relative flex items-center justify-start md:justify-center mt-2 hover:bg-gray-400/20 rounded py-1 gap-4 sm:gap-30">
                                <div className="flex items-center gap-1.5 sm:gap-2 ">
                                    {/* logo */}
                                    <span>
                                        <LuSettings2 className="size-4 sm:size-5" />
                                    </span>
                                    {/* name Settings */}
                                    <span className=" cursor-pointer text-xs sm:text-sm">
                                        Settings
                                    </span>
                                </div>
                                {/* arrow for DropDown */}
                                <button className="cursor-pointer hover:bg-gray-400/40 hover:rounded-full">
                                    <FaChevronRight className="size-2 sm:size-2.5 m-1" />
                                </button>
                            </div>

                            {/* Setting Other part */}
                            {seDrop && (
                                <div className="border-l ml-2 mt-2 mb-2 border-gray-400/40">
                                    {/* second div */}
                                    <div className="flex flex-col max-w-[200px] w-full">
                                        {/* main nav link */}
                                        <div className="flex flex-col w-full ml-2 space-y-1 pr-2 sm:pr-4">
                                            <div className="flex items-center justify-between ml-2 hover:bg-gray-400/20 rounded py-1 pr-2">
                                                <NavLink
                                                    onClick={() => setMenuClose(!menuclose)}
                                                    to={is_sub ? "billing" : "/Home/subscription"}
                                                    className="cursor-pointer text-xs sm:text-sm flex-grow flex items-center justify-between"
                                                >
                                                    <span>Billing</span>
                                                </NavLink>
                                                {!is_sub && (
                                                    <span
                                                        title="Upgrade to Premium"
                                                        className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs"
                                                    >
                                                        <FaCrown className="size-2.5 sm:size-3" />
                                                    </span>
                                                )}
                                            </div>

                                            {/*Limits*/}
                                            {is_superuser && (
                                                <NavLink onClick={() => setMenuClose(!menuclose)} to="limits" className="cursor-pointer ml-2 text-xs sm:text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                    Limits
                                                </NavLink>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* last part */}
                            <div className="mt-auto pb-6 pt-4 w-full">
                                {/* Support */}
                                <NavLink onClick={() => setMenuClose(!menuclose)} to="support" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer mt-2 hover:bg-gray-400/20 rounded py-1 px-2 w-full">
                                    {/* logo */}
                                    <span>
                                        <LuSend className="size-4 sm:size-5" />
                                    </span>
                                    {/* name Support */}
                                    <span className="text-xs sm:text-sm">
                                        Support
                                    </span>
                                </NavLink>
                                {/* feedback */}
                                <NavLink onClick={() => setMenuClose(!menuclose)} to="feedBack" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer mt-2 hover:bg-gray-400/20 rounded py-1 px-2 w-full">
                                    {/* logo */}
                                    <span>
                                        <IoHelpBuoyOutline className="size-4 sm:size-5" />
                                    </span>
                                    {/* name feedback */}
                                    <span className="text-xs sm:text-sm">
                                        FeedBack
                                    </span>
                                </NavLink>
                            </div>
                        </nav>

                    </div>

                </div>
            </div>
        </>
    )
} export default Side_nav

{/* <NavLink
    to={is_sub ? "export_Data" : "/Home/subscription"}
    className="cursor-pointer text-sm flex-grow flex items-center justify-between"
    >
    <span>Export Data</span>
    </NavLink> */}
{/* Feeds*/ }
{/* <NavLink to="feeds" className="cursor-pointer ml-2 text-sm hover:bg-gray-400/20 rounded justify-center py-1">
        Feeds
    </NavLink> */}
{/* Export Data */ }
{/* <div className="flex items-center justify-between ml-2 hover:bg-gray-400/20 rounded py-1 pr-2"> */ }
{/* {!is_sub && ( */ }
{/* // <span */ }
{/* // title="Upgrade to Premium" */ }
{/* className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-xs font-bold bg-amber-100 px-1.5 py-0.5 rounded-full shadow-xs" */ }
{/* > */ }
{/* <FaCrown className="size-3" /> */ }
{/* </span> */ }
{/* )} */ }
{/* </div> */ }
{/* General*/ }
{/* <NavLink to="general" className="cursor-pointer ml-2 text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                General
                                            </NavLink> */}
{/*Team*/ }
{/* <NavLink to="team"  className="cursor-pointer ml-2 text-sm hover:bg-gray-400/20 rounded justify-center py-1">
                                                Team
                                            </NavLink> */}
{/*Billing*/ }
{/* Billing Link with Crown */ }