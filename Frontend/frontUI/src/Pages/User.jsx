import { useEffect, useState } from "react"
import login from '../assets/logo.jpg'
import { useNavigate } from "react-router-dom"
import imageCompression from 'browser-image-compression'
import { toast } from "react-toastify"


function User() {
    const [form, setForm] = useState(false)
    const currentToken = localStorage.getItem('access-token')
    const is_superuser = localStorage.getItem("superuser") === 'true'
    const navigation = useNavigate()
    // check if user is login or not
    useEffect(() => {
        if (!currentToken && !is_superuser) {
            window.alert("you don't have access so get lost")
            navigation('/')
            return
        }
    }, [currentToken])


    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    // const API = `${BASE_URL}/api/feed/`;

    const [checkData, setCheckData] = useState([])
    const api = `${BASE_URL}/api/profile/`;
    // const api = 'http://127.0.0.1:8000/api/profile/'
    useEffect(() => {
        fetch(api)
            .then((res) => res.json())
            .then((prv) => {
                setCheckData(prv)
            })
    }, [])

    // ya par multi search ka leya hai 
    const [searchQuery, setSearchQuery] = useState('')
    const QueryFilter = checkData.filter((item) => {
        const query = searchQuery.trim().toLocaleLowerCase()
        if (!query) return true

        const email = String(item?.email || "").toLowerCase().includes(query)
        const username = String(item?.username || "").toLowerCase().includes(query)
        return email || username
    })

    // yaha par user create karny ka code hai 
    // const user = 'http://127.0.0.1:8000/api/createuser/'
    const user = `${BASE_URL}/api/createuser/`;
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [checkpassword, setCheckpassword] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [compressing, setCompressing] = useState(0)
    // yaha par image ko access karny ka leya
    const [image, setImage] = useState(null)
    const option = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }

    const HandleCompression = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        if (!file) return;

        setCompressing((prev) => prev + 1)
        try {
            const compres = await imageCompression(file, option)
            const newFile = new File([compres], file.name)

            setImage(newFile)
        }
        catch {
            setImage(file)
        }
        finally {
            setCompressing((prev) => prev - 1)
        }
    }

    const HandleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const carrybox = new FormData();
        if (password == checkpassword) {
            carrybox.append('password', password)
        } else {
            return alert("password not match")
        }

        if (email) { carrybox.append('email', email) }
        if (username) { carrybox.append('username', username) }
        if (image) { carrybox.append('userPic', image) }
        carrybox.append('isBanned', "true")

        fetch(user, {
            method: "POST",
            headers: {
                'Authorization': `jwt ${currentToken}`
            },
            body: carrybox
        })
            .then(async (res) => {
                const data = await res.json()
                if (!res.ok) {
                    toast.error("User create nahi hua")
                    return
                }
                return data
            })

            .then((data) => {
                setUsername('')
                setPassword('')
                setCheckpassword('')
                setEmail('')
                setImage(null)
                // user create hone ke baad fresh list lao
                fetch(api)
                    .then((res) => res.json())
                    .then((newData) => {
                        setCheckData(newData)
                        setForm(false)
                    })

            }).finally(() => {
                setLoading(false)
            })
    }

    const ShowStatus = (Status) => {
        switch (Status) {
            case "Active": return "bg-green-700 text-white"
            case "Inactive": return "bg-yellow-700 text-white"
            case "Pending": return "bg-red-700 text-white"
            case "Banned": return "bg-gray-700 text-white"
            default: return "bg-green-700 text-white"
        }
    }

    const userapi = `${BASE_URL}/api/user/`;

    // const userapi = 'http://127.0.0.1:8000/api/user/'
    const HanldeUser = (id) => {
        if (!window.confirm("Kya aap waqai is user ko delete karna chahte hain?")) return;
        if (!currentToken) {
            return window.alert("please login first")
        }
        fetch(`${userapi}${id}/`, {
            method: "DELETE",
            headers: {
                'Authorization': `jwt ${currentToken}`
            }
        })
            .then(() => {
                setCheckData((item) => item.filter((data) => data.id !== id))
            })
    }

    // ya par stotus ko chage kany ka leya hia 
    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/api/profile/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `jwt ${currentToken}`
                },
                body: JSON.stringify({ Status: newStatus })
            });
            if (res.ok) {
                setCheckData(prev =>
                    prev.map(item => item.id === id ? { ...item, Status: newStatus } : item)
                );
            }
        } catch (err) {
            console.error("Status update failed:", err);
        }
    };

    // ya part risk ka leay hai 
    const handleRiskChange = async (id, newRisk) => {
        try {
            const res = await fetch(`${BASE_URL}/api/profile/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `jwt ${currentToken}`
                },
                body: JSON.stringify({ risk: newRisk })
            });
            if (res.ok) {
                setCheckData(prev =>
                    prev.map(item => item.id === id ? { ...item, risk: newRisk } : item)
                );
            }
        } catch (err) {
            console.error("Risk update failed:", err);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white p-3 sm:p-5 md:p-8 border-gray-200 border rounded-b-xl relative">
                <div className="w-full max-w-[1200px] flex flex-col gap-3 sm:gap-4">

                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                        User Management
                    </h1>

                    <div className="flex items-center gap-3">
                        <button onClick={(() => setForm(!form))} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg flex items-center justify-center sm:justify-start gap-1.5 shadow-sm text-xs sm:text-sm md:text-base">
                            <span>+</span> Add User
                        </button>
                        {/* <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span>🗑️</span> Remove First User
            </button> */}
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-[800px]">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-3 md:pl-4 text-gray-400 text-xs sm:text-sm md:text-base">
                            🔍
                        </span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full border border-blue-400 rounded-lg pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
                        />
                    </form>
                </div>

                {/* ya larg screen ka leya hia  */}
                <div className="w-full bg-white rounded-2xl rounded-b-none pb-2 shadow-sm border border-gray-100 overflow-x-auto mt-4 sm:mt-5 md:mt-6">
                    <table className="w-full text-left min-w-[700px] table-auto">
                        <thead>
                            <tr className="bg-gray-200 border-b border-gray-100 font-bold">
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-blue-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Name</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-green-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Status</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Email</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-blue-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Risk</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-700 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Action</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-700 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"></th>
                                <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-700 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"></th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700">
                            {QueryFilter.map((items) => (
                                <tr key={items.id} className="border-t border-gray-200">
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-800 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">{items.username}</td>
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 whitespace-nowrap">
                                        <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs md:text-sm ${ShowStatus(items.Status)}`}>
                                            {items.Status}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">{items.email}</td>
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">{items.risk}</td>
                                    {/* ya status ko update  */}
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 whitespace-nowrap">
                                        <select
                                            value={items.Status}
                                            onChange={(e) => handleStatusChange(items.id, e.target.value)}
                                            className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs md:text-sm border border-gray-200 outline-none cursor-pointer"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Banned">Banned</option>
                                        </select>
                                    </td>
                                    {/* ya risk ko updae  */}
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-gray-600 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
                                        <select
                                            value={items.risk}
                                            onChange={(e) => handleRiskChange(items.id, e.target.value)}
                                            className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs md:text-sm border border-gray-200 outline-none cursor-pointer"
                                        >
                                            <option className="bg-white text-gray-800" value="High">High</option>
                                            <option className="bg-white text-gray-800" value="Medium">Medium</option>
                                            <option className="bg-white text-gray-800" value="Low">Low</option>
                                            <option className="bg-white text-gray-800" value="Not Flagged">Not Flagged</option>
                                        </select>
                                    </td>
                                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 whitespace-nowrap">
                                        <button onClick={() => HanldeUser(items.id)} className="bg-red-500 hover:bg-red-600 text-white font-medium px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm shadow-sm">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            {/* User creation form */}
            {form && (
                <div onClick={() => setForm(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-3 sm:p-4">

                    <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[1100px] max-h-[95vh] bg-white rounded-xl shadow-xl overflow-hidden">

                        {/* Image */}
                        <div className="w-full max-w-[450px] h-auto overflow-hidden hidden sm:block">
                            <img
                                src={login}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Form */}
                        <div className="flex-1 bg-gray-100 p-3 sm:p-6 md:p-8 overflow-y-auto">

                            <form
                                onSubmit={HandleSubmit}
                                className="flex flex-col gap-3 sm:gap-4 md:gap-5">

                                {/* Title */}
                                <div className="text-center mb-1 sm:mb-2">
                                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">
                                        Create User Account
                                    </h1>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                        Create your account by filling the form below
                                    </p>
                                </div>


                                {/* Full Name + Image */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">

                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1.5 sm:gap-2 flex-1 min-w-0">
                                        <label className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                                            Full Name
                                        </label>

                                        <input
                                            onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            name="username"
                                            type="text"
                                            placeholder="Enter your full name..."
                                            className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-xs sm:text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Profile */}
                                    <div className="flex flex-col gap-1.5 sm:gap-2 sm:mt-8">
                                        <label
                                            htmlFor="profileImage"
                                            className="w-full sm:w-[100px] h-[40px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-white"
                                        >
                                            <span className="text-[10px] sm:text-xs text-gray-400 text-center">
                                                Choose Image
                                            </span>

                                            <input
                                                onChange={HandleCompression}
                                                id="profileImage"
                                                type="file"
                                                name="userPic"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>

                                    </div>

                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                                        Email
                                    </label>

                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email..."
                                        className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-xs sm:text-sm md:text-base"
                                    />
                                </div>


                                {/* Password */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                                        Password
                                    </label>

                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password..."
                                        className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-xs sm:text-sm md:text-base"
                                    />
                                </div>


                                {/* Confirm Password */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                                        Confirm Password
                                    </label>

                                    <input
                                        onChange={(e) => setCheckpassword(e.target.value)}
                                        value={checkpassword}
                                        name="checkpassword"
                                        type="password"
                                        placeholder="Confirm your password..."
                                        className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-xs sm:text-sm md:text-base"
                                    />
                                </div>


                                {/* Button */}
                                <div className="flex-1 flex justify-end mt-4 sm:mt-6 md:mt-10">
                                    <button
                                        disabled={compressing > 0 || loading}
                                        type="submit"
                                        className="w-full sm:w-[140px] bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 text-xs sm:text-sm md:text-base"
                                    >
                                        {compressing > 0 ? "compressing.." : loading ? "Creating.." : "Create New"}
                                    </button>
                                </div>
                            </form>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}

export default User;