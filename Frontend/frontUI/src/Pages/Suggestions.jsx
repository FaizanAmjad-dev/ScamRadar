import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'




function Suggestions() {
    const currentToken = localStorage.getItem('access-token')
    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken) {
            return navigation('/')
        }
    }, [currentToken])
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const API = `${BASE_URL}/api/Suggestion/`
    // const API = 'http://127.0.0.1:8000/api/Suggestion/'
    const [everything, setEverything] = useState([])
    const response = () => {
        fetch(API, {
            headers: {
                Authorization: `jwt ${currentToken}`,
            },
        })
            .then((res) => res.json())
            .then((prev) => setEverything(prev))
    }
    useEffect(() => {
        response()
    }, [])



    // ya suggestion kary ka leya hai 
    const [get, setGet] = useState({
        title: "",
        description: "",
    })

    const handleInpute = (e) => {
        setGet({ ...get, [e.target.name]: e.target.value })
    }


    const HandleSubmit = (e) => {
        e.preventDefault();

        if (!currentToken) {
            return toast.error('please login first')
        }

        let carrybox = new FormData();
        Object.keys(get).forEach((keys) => {
            carrybox.append((keys), get[keys])
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
                    toast.success('successfull')
                }
                else {
                    toast.error('something wrong')
                }
                response();
            })
            .then(() => {
                setGet({
                    title: "",
                    description: "",
                })
            })
    }


    return (
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 border-gray-200 border rounded-b-xl">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="w-full max-w-[770px] flex flex-col gap-4 sm:gap-5">

                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600">
                    Suggestions
                </h1>

                <form onSubmit={HandleSubmit} className="flex flex-col gap-3 sm:gap-4">
                    <input
                        onChange={handleInpute}
                        value={get.title}
                        name="title"
                        type="text"
                        placeholder="Suggestion Title"
                        className="w-full bg-white border border-gray-200 rounded px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm placeholder-gray-400 outline-none focus:border-gray-500 shadow-sm"
                    />

                    <textarea
                        onChange={handleInpute}
                        value={get.description}
                        name="description"
                        rows={4}
                        placeholder="Suggestion Description"
                        className="w-full bg-white border border-gray-200 rounded p-3 sm:p-4 text-xs sm:text-sm placeholder-gray-400 outline-none focus:border-gray-500 transition-colors shadow-sm "
                    />

                    <div className="flex justify-start">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded text-xs sm:text-sm shadow-sm"
                        >
                            Submit Suggestion
                        </button>
                    </div>
                </form>
                {everything.map((items) => (
                    <div key={items.id} className="bg-white rounded shadow-sm border border-gray-200 p-3 sm:p-5 md:p-6 flex flex-col gap-1.5 sm:gap-2">
                        <h3 className="font-semibold text-blue-600 text-sm sm:text-base break-word">
                            {items.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-normal break-words">
                            {items.description}
                        </p>
                        <div className="flex flex-wrap justify-between items-center gap-1 text-[10px] sm:text-xs text-gray-400 pt-1.5 sm:pt-2">
                            <span>By: {items.Username}</span>
                            <span>{new Date(items.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Suggestions;