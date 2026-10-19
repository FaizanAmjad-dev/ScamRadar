import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function Limits() {
    const navigation = useNavigate()
    const currentToken = localStorage.getItem('access-token')
    const is_superuser = localStorage.getItem('superuser') == 'true'

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const api = `${BASE_URL}/api/Limit/`;

    // const api = 'http://127.0.0.1:8000/api/Limit/'
    const [limit, setLimit] = useState('')

    useEffect(() => {
        if (!is_superuser && !currentToken) {
            return navigation('/')
        }
    }, [currentToken, is_superuser])

    const handlesubmit = (e) => {
        e.preventDefault();
        if (!currentToken && !is_superuser) {
            return window.alert("Please login and admin can access this feature")
        }
        if (!limit.trim()) return null

        try {
            fetch(api, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `jwt ${currentToken}`
                },
                body: JSON.stringify({
                    limit_per_day: Number(limit)
                })
            })
                .then((res) => res.json())
                .then(() => {
                    setLimit('')
                    toast.success("limit set ho gye hai ")
                })
        }
        catch (error) {
            console.error("Error submitting limit:", error);
        }
    }

    return (
        <div className="min-h-screen bg-white p-3 sm:p-5 md:p-6 border-gray-200 rounded-b-xl">
            {/* w-full rakha hai taaki mobile par horizontal scroll na aaye, aur sm ya usse ooper min-w-[770px] ho */}
            <div className="w-full max-w-4xl mx-auto">
                <ToastContainer position="top-center" autoClose={3000} />

                {/* Main Heading */}
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                    Settings Limits
                </h1>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 md:p-10 flex flex-col items-start">

                    {/* Form */}
                    <form onSubmit={handlesubmit} className="w-full flex flex-col gap-3 sm:gap-5 md:gap-6">
                        {/* Message Limits */}
                        <div className="flex flex-col gap-1 sm:gap-1.5">
                            <label htmlFor="limit" className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                                Post Limits
                            </label>
                            <p className="text-gray-500 mb-1 text-[10px] sm:text-xs md:text-sm">
                                Set the maximum number of Post a user can send per day.
                            </p>
                            <input
                                id="limit"
                                onChange={(e) => setLimit(e.target.value)}
                                value={limit}
                                type="number"
                                min="1"
                                placeholder="Enter daily Post limit"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 outline-none text-xs sm:text-sm md:text-base focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex sm:justify-start justify-start mt-1 sm:mt-2">
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors cursor-pointer text-xs sm:text-sm md:text-base"
                            >
                                Save Limits
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Limits;