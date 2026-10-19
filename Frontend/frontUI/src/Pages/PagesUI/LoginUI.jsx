
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';

// ya section toastify notification ko show karna ka leya hai 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import logo from "../../assets/logo.jpg"
import { MyContext } from '../../Context/context';

function LoginUI() {

    const { RefreshFetch } = useContext(MyContext);
    // ya navigation ka leya hai 
    const navigation = useNavigate()

    // ya termina ka kma hai 
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const login_api = `${BASE_URL}/api/login/access/`;

    // yaha sa login ka funciton shuru hota hai 
    // const login_api = 'http://127.0.0.1:8000/api/login/access/'
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const Login = async (e) => {
        e.preventDefault();

        const response = await fetch(login_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
        const data = await response.json()
        if (response.ok) {
            localStorage.setItem('access-token', data.access)
            localStorage.setItem('refresh-token', data.refresh)
            localStorage.setItem('username', data.username)
            localStorage.setItem("superuser", data.is_superuser);
            localStorage.setItem("active", data.is_active);
            RefreshFetch()
            toast.success("Login Successfully")
            setTimeout(() => {
                navigation('/Home')
            }, 2000);
        }
        else {
            toast.error("Login Failed! Galat email ya password.");
        }
    }

    return (
        <>
            {/* Main background */}
            <div className="min-h-screen bg-gray-100 md:flex md:items-center md:justify-center 
               p-0 md:p-6 lg:p-10">

                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    className="text-sm sm:text-base"
                    toastClassName="mx-2 sm:mx-0"
                />

                {/* Card with MEDIUM fixed height on desktop */}
                <div className="min-h-screen md:min-h-0 flex justify-center items-center md:w-full max-w-[850px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row md:h-[450px] lg:h-[500px] xl:h-[520px]">
                    <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-8 lg:p-10 flex flex-col justify-center overflow-y-auto">
                        {/* Header */}
                        <div className="mb-4 sm:mb-6 text-center md:text-left">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                Welcome back
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
                                Login to your Acme Inc account
                            </p>
                        </div>
                        {/* Form */}
                        <form onSubmit={Login}
                            className="flex flex-col gap-3 sm:gap-4">

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="username"
                                    className="text-xs sm:text-sm font-semibold text-gray-700">
                                    UserName
                                </label>
                                <input id="username" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username.." className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm md:text-base text-gray-800 outline-none"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <label
                                        htmlFor="password"
                                        className="text-xs sm:text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                </div>
                                <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm md:text-base text-gray-800 outline-none"
                                />
                            </div>
                            {/* Login Button */}
                            <button
                                type="submit"
                                className="mt-1 cursor-pointer w-full bg-black hover:bg-blue-700 text-white py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold hover:bg-gray-800 shadow-md">
                                Login
                            </button>
                        </form>
                    </div>
                    <div className="hidden md:block md:w-[50%] bg-gray-50 overflow-hidden">
                        <img
                            src={logo}
                            alt="Login Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>
            </div>
        </>
    )
}
export default LoginUI