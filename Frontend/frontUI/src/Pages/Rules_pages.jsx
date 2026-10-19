import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from "react-router-dom";

function Rules_pages() {
    const [drop, setDrop] = useState(false)
    const currentToken = localStorage.getItem('access-token')
    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken) {
            return navigation('/')
        }
    }, [currentToken])

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const API = `${BASE_URL}/api/reportroll/`;

    // const API = 'http://127.0.0.1:8000/api/reportroll/'
    const [data, setData] = useState({
        email: '',
        subject: '',
        message: '',
    })
    const handleInpute = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const submitForm = (e) => {
        e.preventDefault();
        if (!currentToken) {
            toast.error("Please login first");
            return;
        }

        const carrybox = new FormData();
        Object.keys(data).forEach((keys) => {
            carrybox.append(keys, data[keys])
        })

        fetch(API, {
            method: "POST",
            headers: {
                'Authorization': `jwt ${currentToken}`,
            },
            body: carrybox
        })
            .then((res) => {
                if (res.ok) {
                    toast.success("thanks for reach")
                }
                else {
                    toast.error("somethig wrong")
                }
            })
            .then(() => {
                setData({
                    email: '',
                    subject: '',
                    message: '',
                })
                setDrop(false)
            })
    }




    return (
        <>
            <div className="relative min-h-screen bg-white p-3 sm:p-5 md:p-6 border rounded-b-xl border-gray-200">
                <ToastContainer position="top-center" autoClose={2000} />
                <h1 className="text-lg sm:text-3xl md:text-4xl font-bold text-gray-900 text-center sm:text-left">
                    Rules & Guidelines
                </h1>
                <div className="justify-center items-center flex">
                    <div className="max-w-[1040px] w-full mt-4 sm:mt-6 md:mt-8 flex flex-col gap-6 sm:gap-12 mx-auto">
                        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-5 md:gap-6">

                            <div>
                                <h3 className="font-semibold text-sm sm:text-lg md:text-xl text-blue-600 mb-2 sm:mb-3 md:mb-4">
                                    General Conduct Rules
                                </h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base">
                                    <li>Be respectful to all users.</li>
                                    <li>Hate speech, harassment, or threats will not be tolerated.</li>
                                    <li>Follow all applicable local laws.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm sm:text-lg md:text-xl text-blue-600 mb-2 sm:mb-3 md:mb-4">
                                    Account Usage
                                </h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base">
                                    <li>Do not share login credentials.</li>
                                    <li>One account per user policy.</li>
                                    <li>Report any suspicious activity immediately.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm sm:text-lg md:text-xl text-blue-600 mb-2 sm:mb-3 md:mb-4">
                                    Chat Room Guidelines
                                </h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base">
                                    <li>No spamming or flooding the chat.</li>
                                    <li>Keep discussions relevant to the room topic.</li>
                                    <li>Use appropriate language.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm sm:text-lg md:text-xl text-blue-600 mb-2 sm:mb-3 md:mb-4">
                                    Violations & Penalties
                                </h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base">
                                    <li>First violation: Warning</li>
                                    <li>Second violation: Temporary Suspension</li>
                                    <li>Third violation: Permanent Ban</li>
                                </ul>
                            </div>

                            <div className="pt-4 sm:pt-6 md:pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center text-[10px] sm:text-xs text-gray-400 font-medium gap-2 sm:gap-0">
                                <span>Last Updated: May 20, 2025</span>
                                <button
                                    onClick={() => setDrop(true)}
                                    type="button"
                                    className="border border-blue-500 text-blue-600 font-medium px-4 sm:px-6 py-2 sm:py-3 rounded text-xs sm:text-sm"
                                >
                                    Report Violation
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            {/* ya repost form hai  */}
            {drop && (
                <div onClick={() => setDrop(false)} className="min-h-screen fixed inset-0 z-[999] flex justify-center items-center bg-gray-500/50 shadow-xl p-3 sm:p-0">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-[700px] px-4 sm:px-8 md:px-10 py-4 sm:py-8 md:py-12 flex flex-col items-center max-h-[90vh] overflow-y-auto">

                        {/* name */}
                        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
                            Report Violation
                        </h1>

                        <p className="text-gray-500 text-center mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">
                            If you believe this content violates our community rules, please report it to our support team. Our team will review the report and take appropriate action if necessary.
                        </p>

                        {/* Form  */}
                        <form onSubmit={submitForm} className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5">

                            {/* Email */}
                            <div className="flex flex-col gap-1 sm:gap-1.5">
                                <label htmlFor="email" className="font-semibold text-xs sm:text-sm text-gray-700">
                                    Your Email
                                </label>
                                <input
                                    onChange={handleInpute}
                                    value={data.email}
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 md:py-3 outline-none text-xs sm:text-sm md:text-base"
                                />
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col gap-1 sm:gap-1.5">
                                <label className=" font-semibold text-xs sm:text-sm text-gray-700">
                                    Report Subject
                                </label>
                                <input
                                    onChange={handleInpute}
                                    value={data.subject}
                                    name="subject"
                                    type="text"
                                    placeholder="Subject of your message"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 md:py-3 outline-none text-xs sm:text-sm md:text-base"
                                />
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-1 sm:gap-1.5">
                                <label className="font-semibold text-xs sm:text-sm text-slate-700">
                                    Message
                                </label>
                                <textarea
                                    onChange={handleInpute}
                                    value={data.message}
                                    name="message"
                                    rows="6"
                                    placeholder="Write your message here..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 md:py-3 outline-none resize-none text-xs sm:text-sm md:text-base"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="flex sm:justify-center justify-stretch mt-2 sm:mt-3 md:mt-4">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto text-xs sm:text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg transition-colors"
                                >
                                    Submit
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Rules_pages;