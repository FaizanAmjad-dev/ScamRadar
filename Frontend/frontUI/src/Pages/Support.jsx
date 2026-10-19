import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


function Support() {
    const currentToken = localStorage.getItem('access-token')

    const navigation = useNavigate()
    useEffect(() => {
        if (!currentToken) {
            toast.warning("ap phaly login kary phir ap access kar sakty hai ")
            return navigation('/')
        }
    }, [currentToken])

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const API = `${BASE_URL}/api/Support/`;
    // const API = 'http://127.0.0.1:8000/api/Support/'
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
            })
    }


    return (
        <div className="min-h-screen bg-white flex justify-center items-center border-gray-200 rounded-b-xl border p-3 sm:p-4">
            <ToastContainer position="top-center" autoClose={2000} />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[700px] px-4 sm:px-8 md:px-10 py-5 sm:py-8 md:py-12 flex flex-col items-center max-h-[95vh] overflow-y-auto">

                {/* name */}
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-3">
                    Support
                </h1>

                <p className="text-gray-500 text-center mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">
                    If you need help or have any questions, feel free to reach out to our support team.
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
                            Subject
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
                    <div className="flex justify-center mt-2 sm:mt-3 md:mt-4">
                        <button
                            type="submit"
                            className="text-xs sm:text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg transition-colors"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Support;