import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function FeedBack() {
    const currentToken = localStorage.getItem('access-token')
    const navigate = useNavigate()
    useEffect(() => {
        if (!currentToken) {
            return navigate('/')
        }
    }, [currentToken])
    const [ok, setOk] = useState(false)
    // ya part fetch ka hai 
     const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/feedback/`;

    // const API = 'http://127.0.0.1:8000/api/feedback/'
    const [data, setData] = useState({
        message: ''
    })
    const handleInpute = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const HandleSubmit = async (e) => {
        e.preventDefault();
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
                if (res) {
                    setOk(true)
                }
            })
    }

    return (
        <div className="min-h-screen bg-white flex justify-center items-center p-4 border-gray-200 border-t-none shadow-xl rounded-b-xl border">
            {/* Main div */}
            {!ok ? (
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-[650px] px-5 sm:px-10 py-8 sm:py-12 flex flex-col items-center">

                    {/* name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                        Feedback
                    </h1>

                    {/* Form*/}
                    <form onSubmit={HandleSubmit} className="w-full flex flex-col gap-5">

                        {/* Feedback */}
                        <div className="flex flex-col gap-2">
                            <label className=" font-semibold text-gray-700">
                                Your Feedback
                            </label>
                            <textarea
                                onChange={handleInpute}
                                value={data.message}
                                name="message"
                                rows="6"
                                placeholder="Share your thoughts or suggestions..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none resize-none text-sm sm:text-base"
                            ></textarea>
                        </div>

                        {/* Submit*/}
                        <div className="flex justify-stretch sm:justify-start mt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 sm:w-auto w-full rounded-lg"
                            >
                                Submit Feedback
                            </button>
                        </div>

                    </form>
                </div>
            ) : (
                <div className="text-green-600 font-semibold text-center text-lg">
                    ✅ Thank you for your feedback!
                </div>
            )}
        </div>
    );
}

export default FeedBack;