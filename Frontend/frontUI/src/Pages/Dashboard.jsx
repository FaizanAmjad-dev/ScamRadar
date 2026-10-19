import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiUsers,
    FiUserX,
    FiFlag,
    FiEye,
    FiBarChart2,
    FiAlertTriangle,
    FiShield,
    FiActivity,
    FiCheckCircle
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function Dashboard() {
    // ya check karna ka user na  subscritpin bye kar raky hia ya phir nahi
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Subscription/`;

    // const API = 'http://127.0.0.1:8000/api/Subscription/'
    const currentToken = localStorage.getItem('access-token')
    useEffect(() => {
        if (!currentToken) {
            return navigate('/')
        }
    }, [currentToken])
    const is_superuser = localStorage.getItem('superuser') == 'true'

    //   conditon for user ka alredy buy kar raky hia ya nahi
    useEffect(() => {
        if (is_superuser) {
            return
        }
        fetch(API, {
            headers: {
                'Authorization': `jwt ${currentToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const already_Buy = data.some((sub) => sub.is_active === true)
                if (!already_Buy) {
                    toast.warning("phaly ap hamary packages ko buy kary phir ap is ko access kar sakty hai ")
                    navigate("/Home/subscription")
                }
            })
    }, [navigate, is_superuser])


    const [data, setData] = useState({})
    const [charts, setCharts] = useState([])

    const api = `${BASE_URL}/api/dashboard/`;

    // const api = 'http://127.0.0.1:8000/api/dashboard/'
    useEffect(() => {
        try {
            fetch(api, {
                headers: {
                    'Authorization': `jwt ${currentToken}`
                }
            })
                .then((res) => res.json())
                .then((data) => setData(data))
        }
        catch {
            console.error("data not fetch")
        }
    }, [])

    const high_risk_activity = ["Phishing", "Order Scam", "Spam Complaints"];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-800 border  border-gray-200 rounded-b-xl">

            {/* Top Stats Grid */}
            {is_superuser ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 sm:gap-4 gap-3 mb-6">

                    {/* Total Users */}
                    <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Users</p>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{data.total_user ?? 0}</h2>
                        </div>
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
                            <FiUsers size={22} />
                        </div>
                    </div>

                    {/* Blacklisted Users */}
                    <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Blacklisted</p>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{data.blacklist_user ?? 0}</h2>
                        </div>
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-xs">
                            <FiUserX size={22} />
                        </div>
                    </div>

                    {/* Flagged Users */}
                    <div className="bg-white p-4 p-3 sm:p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Flagged Users</p>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{data.risk ?? 0}</h2>
                        </div>
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-xs">
                            <FiFlag size={22} />
                        </div>
                    </div>

                    <div className="bg-white p-4 p-3 sm:p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Views / Reposts</p>
                            {data.post_repost !== undefined && data.post_views !== undefined ? (
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{data.post_views} / {data.post_repost}</h2>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">No records</p>
                            )}
                        </div>
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
                            <FiEye size={22} />
                        </div>
                    </div>

                </div>
            ) : (
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide">
                        Dashboard
                    </h1>
                    <span className="text-xs bg-emerald-50 text-emerald-600 font-medium px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                        <FiCheckCircle size={14} /> Active Subscription
                    </span>
                </div>
            )}


            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs text-center transition-all hover:shadow-md">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Posts</p>
                    <h3 className="text-xl font-bold text-gray-900">{data.total_posts ?? 0}</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs text-center transition-all hover:shadow-md">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Views</p>
                    <h3 className="text-xl font-bold text-gray-900">{data.total_views ?? 0}</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs text-center transition-all hover:shadow-md">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Comments</p>
                    <h3 className="text-xl font-bold text-gray-900">{data.total_comments ?? 0}</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs text-center transition-all hover:shadow-md">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Likes</p>
                    <h3 className="text-xl font-bold text-gray-900">{data.total_likes ?? 0}</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs text-center transition-all hover:shadow-md col-span-2 sm:col-span-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Reposts</p>
                    <h3 className="text-xl font-bold text-gray-900">{data.total_reposts ?? 0}</h3>
                </div>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-indigo-600">
                            <FiActivity size={18} />
                            <h3 className="text-sm font-bold text-gray-900">Platform Activity Overview</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-6">
                            Monitor real-time security alerts, user flags, and engagement metrics seamlessly from your centralized control panel. All modules are currently operating normally with active API synchronization.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                                <span className="text-[11px] text-gray-400 block font-medium">System Status</span>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Fully Operational
                                </span>
                            </div>
                            <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                                <span className="text-[11px] text-gray-400 block font-medium">Security Mode</span>
                                <span className="text-xs font-bold text-gray-700 mt-1 block">Active Protection</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                        <span>Last synchronized: Just now</span>
                        <span className="text-indigo-600 hover:underline cursor-pointer">Refresh Data</span>
                    </div>
                </div>

                {/* Flagged Blacklist Summaries */}
                <div className="flex flex-col gap-6">

                    {/* Recently Flagged High Risk Activity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-red-500">
                                <FiFlag size={16} />
                                <h3 className="text-sm font-bold text-gray-900">Recently Flagged</h3>
                            </div>
                            {Array.isArray(data.recent_flagged) && data.recent_flagged.length > 0 ? (
                                <div className="flex flex-col space-y-2">
                                    {data.recent_flagged.map((user, index) => (
                                        <div key={index} className="text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                                            <span className="font-medium">{user}</span>
                                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-gray-400">No flagged users found</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-amber-500">
                                <FiAlertTriangle size={16} />
                                <h3 className="text-sm font-bold text-gray-900">High Risk Activity</h3>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {high_risk_activity.map((item, index) => (
                                    <div key={index} className="text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                                        <span className="font-medium">{item}</span>
                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-semibold">Alert</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Quick Blacklist Summary Card */}
                    {is_superuser && (
                        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-blue-600">
                                <FiShield size={16} />
                                <h3 className="text-sm font-bold text-gray-900">Quick Blacklist Summary</h3>
                            </div>
                            {Array.isArray(data?.blacklist_summary) && data.blacklist_summary.length > 0 ? (
                                <div className="flex flex-col space-y-2">
                                    {data.blacklist_summary.map((user, index) => (
                                        <div key={index} className="text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                                            <span className="font-medium">{user}</span>
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-gray-400">No blacklisted users currently recorded</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}
export default Dashboard;

{/* graph */ }
{/* <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between  mb-4 sm:gap-9 gap-3 sm:items-center sm:mb-6">
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600">
                            <FiBarChart2 size={22} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">User & Feed Activity</h3>
                            <p className="text-xs text-gray-400">Live activity (Auto-Update)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span> Active Users
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block"></span> Flagged User
                        </span>
                    </div>
                </div> */}

{/* Simple Box Placeholder instead of graph */ }
{/* <div className="h-60 sm:h-72 w-full border border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={charts}
                             margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >

                            <XAxis
                                dataKey="name"
                            />

                            <YAxis />

                            <Tooltip />

                            <Legend />


                            <Line
                                type="monotone"
                                dataKey="total_user"
                                name="Total Users"
                                stroke="blue"
                                strokeWidth={2}
                            />

                            <Line
                                type="monotone"
                                dataKey="blacklist_user"
                                name="Blacklist Users"
                                stroke="red"
                                strokeWidth={2}
                            />


                            <Line
                                type="monotone"
                                dataKey="risk"
                                name="High Risk Users"
                                stroke="orange"
                                strokeWidth={2}
                            />


                        </LineChart>
                    </ResponsiveContainer>
                </div> */}

{/* </div> */ }

{/* <FiBarChart2 size={32} className="mb-2 text-gray-300" />
                    <span>(Activity Chart Placeholder Box)</span> */}

{/* Left Card: Example User Profile Control */ }
{/* <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                                                            A
                                                        </div>
                                                        <div>
                                                            <h2 className="font-bold text-gray-900 text-sm">Example User</h2>
                                                            <p className="text-xs text-gray-400">example@email.com</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-semibold bg-red-50 text-red-500 px-2 py-0.5 rounded-md border border-red-100">
                                                        High Risk
                                                    </span>
                                                </div>
                        
                                                <div className="border border-gray-100 rounded-lg p-3 text-xs text-gray-400 my-4 bg-gray-50/50">
                                                    (Order Details Placeholder)
                                                </div>
                                            </div>
                        
                                            <div className="flex gap-2 pt-2">
                                                <button className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                                                    <FiFlag size={13} /> Flag
                                                </button>
                                                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                                                    <FiUserX size={13} /> Blacklist
                                                </button>
                                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                                                    <FiEye size={13} /> View / Repost
                                                </button>
                                            </div> */}
{/* </div> */ }