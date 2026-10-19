import { Outlet, useNavigate } from "react-router-dom"
import Top_nav from "../Component/Top_nav"
import Side_nav from "../Component/Side_nav"
import Bottom_nav from "../Component/Bottom_nav"
import { useContext, useEffect } from "react"
import { MyContext } from "../Context/context"

function Lay_out() {
    const currentToken = localStorage.getItem('access-token')
    const { setMenuClose, menuclose } = useContext(MyContext)
    return (
        <>
            <div className="min-h-screen flex box-border relative overflow-x-hidden">
                {/* sidebar  */}
                {currentToken && (
                    <aside className={`transition-transform duration-500 ease-in-out flex flex-col flex-shrink-0 fixed top-0 left-0 h-full z-40 bg-white w-full md:w-64
                                        ${menuclose ? "translate-x-0  md:translate-x-0" : "-translate-x-full md:w-0 "}
                                        `}>
                        <Side_nav />
                    </aside>
                )}
                <div className={`transition-transform duration-500 ease-in-out flex flex-col flex-1 min-w-0 z-30 box-border top-0 min-h-screen overflow-hidden 
                    ${menuclose ? 'md:ml-64 ml-0' : "ml-0"}`}>
                    {/* TopBar */}
                    <div className="bg-white pt-1 w-full px-1 box-border ">
                        <Top_nav />
                    </div>
                    {/* Main content */}
                    <div className="bg-white flex flex-1 flex-col box-border pb-14 md:pb-1 px-1 min-h-0">
                        <Outlet />
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 w-full z-30 md:hidden">
                    <Bottom_nav />
                </div>
            </div>
        </>
    )
} export default Lay_out