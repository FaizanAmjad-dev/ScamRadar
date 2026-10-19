import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MyContext } from '../Context/context';

const Subscription = () => {
    const { refreshSUB, fetchNotifications } = useContext(MyContext)

    const navigate = useNavigate()
    const currentToken = localStorage.getItem('access-token')
    useEffect(() => {
        if (!currentToken) {
            toast.warning("phaly ap login karo phir ap access ka sakty hai ")
            return navigate('/login')
        }
    }, [currentToken])

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const api = `${BASE_URL}/api/Subscription/`;
    // const api = 'http://127.0.0.1:8000/api/Subscription/'


    // ya buy kary ka leya hai
    const handlesubmit = (selectPackage) => {
        if (!currentToken) {
            return !window.alert("Please login")
        }

        try {
            fetch(api, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `jwt ${currentToken}`
                },
                body: JSON.stringify({
                    package_duration: selectPackage
                })
            })
                .then((res) => {
                    if (res.ok) {
                        refreshSUB();
                        fetchNotifications();
                        toast.success("Subscription successfully created!");
                        window.location.href = "/Home";
                    }
                    else {
                        toast.error("ap ki information galat hai")
                    }
                })
        }
        catch (error) {
            console.error("Error submitting limit:", error);
        }
    }

    return (
        <div className="bg-white py-10 sm:py-16 md:py-20 px-3 sm:px-4 flex flex-col items-center justify-center border-gray-200 rounded-xl min-h-screen font-sans">
            <ToastContainer position="top-center" autoClose={3000} />
            {/* Title Section */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 sm:mb-3">Pricing Plans</h2>
                <p className="text-slate-500 text-xs sm:text-sm md:text-base">Choose the right package duration to protect and report safely.</p>
            </div>

            {/* Main Cards Container */}
            <div className="flex md:flex-row items-center flex-col gap-5 sm:gap-6 md:gap-8 md:items-stretch justify-center max-w-6xl w-full">

                {/* Card 1: 1 Month Plan */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full sm:w-72 md:w-80 border border-slate-200/80">
                    <div>
                        <span className="inline-block bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-5 md:mb-6 uppercase tracking-wider">
                            1 Month
                        </span>
                        <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                            $29<span className="text-xs sm:text-sm font-medium text-slate-400">/mo</span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mb-5 sm:mb-6 md:mb-8">Perfect for short-term investigation & usage.</p>

                        <button type='submit' onClick={() => handlesubmit("1 Month")} className="w-full bg-slate-900 text-white font-semibold py-2.5 sm:py-3 rounded-xl mb-5 sm:mb-6 md:mb-8 hover:bg-slate-800 transition shadow-sm cursor-pointer text-sm sm:text-base">
                            Choose Plan
                        </button>

                        <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4 sm:pt-6">
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Limited Posts (10 per day)
                            </li>
                            <li className="files flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Limited Dashboard Access
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Basic Scam Alerts
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Card 2: 3 Months Plan (Highlighted Unique Card) */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl flex flex-col justify-between w-full sm:w-72 md:w-80 border border-slate-800 relative md:transform md:scale-105 mt-4 md:mt-0">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                    </div>
                    <div>
                        <span className="inline-block bg-slate-800 text-indigo-400 text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-5 md:mb-6 uppercase tracking-wider">
                            3 Months
                        </span>

                        <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                            $79<span className="text-xs sm:text-sm font-medium text-slate-400">/quarter</span>
                        </div>

                        <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-6 md:mb-8">Ideal for active investigators and businesses.</p>

                        <button type='submit' onClick={() => handlesubmit("3 Months")} className="w-full bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 rounded-xl mb-5 sm:mb-6 md:mb-8 hover:bg-indigo-500 transition shadow-md cursor-pointer text-sm sm:text-base">
                            Choose Plan
                        </button>

                        <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800 pt-4 sm:pt-6">
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-indigo-400 font-bold">✓</span> Unlimited Posts
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-indigo-400 font-bold">✓</span> Full Dashboard Access
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-indigo-400 font-bold">✓</span> Priority Scammer Radar
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-indigo-400 font-bold">✓</span> Risk-Free Guarantee
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Card 3: 9 Months Plan */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full sm:w-72 md:w-80 border border-slate-200/80">
                    <div>
                        <span className="inline-block bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-5 md:mb-6 uppercase tracking-wider">
                            9 Months
                        </span>
                        <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                            $199<span className="text-xs sm:text-sm font-medium text-slate-400">/9 mos</span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mb-5 sm:mb-6 md:mb-8">Best value for long-term organizations.</p>

                        <button type='submit' onClick={() => handlesubmit("9 Months")} className="w-full bg-slate-900 text-white font-semibold py-2.5 sm:py-3 rounded-xl mb-5 sm:mb-6 md:mb-8 hover:bg-slate-800 transition shadow-sm cursor-pointer text-sm sm:text-base">
                            Choose Plan
                        </button>

                        <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4 sm:pt-6">
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Unlimited Posts & Reports
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Complete All Access Dashboard
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Custom Scam Detection Tools
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3">
                                <span className="text-emerald-500 font-bold">✓</span> Dedicated Support Team
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Subscription;

//   conditon for user ka alredy buy kar raky hia ya nahi
// useEffect(() => {
//     if (!currentToken) {
//         return navigate('/Home')
//     }
//     fetch(api, {
//         method: "GET",
//         headers: {
//             'Authorization': `jwt ${currentToken}`
//         }
//     })
//         .then((res) => res.json())
//         .then((data) => {
// const already_Buy = data.some((sub) => sub.is_active === true)
// const latestSubscription = data[0]
//             const already_Buy =
//                 data.length > 0 &&
//                 latestSubscription.is_active === true

//             if (already_Buy) {
//                 toast.warning("ap na phaly hi sub scription bye kar raki hai")
//                 window.location.href = "/Home";
//             }
//         })
// }, [currentToken, navigate])