import { createElement, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toPng } from 'html-to-image'

function Billing() {
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Subscription/`;

    // const API = 'http://127.0.0.1:8000/api/Subscription/'
    const currentToken = localStorage.getItem('access-token')
    const is_superuser = localStorage.getItem('superuser') == 'true'

    const [data, setData] = useState([])
    useEffect(() => {
        if (!currentToken) {
            return navigate('/Home')
        }
        try {
            fetch(API, {
                headers: {
                    'Authorization': `jwt ${currentToken}`
                }
            })

                .then((res) => res.json())
                .then((data) => {
                    setData(data)
                    const getSub = data.some((sub) => sub.is_active === true)
                    if (!is_superuser) {
                        if (!getSub) {
                            return navigate('/Home/subscription')
                        }
                    }
                })
        }
        catch (error) {
            console.log("fetching error")
        }
    }, [currentToken, navigate])

    // ya ma kudh say price di hai ku ka backend par ma nay ya field nahi banay hai 
    const switchFunction = (package_duration) => {
        switch (package_duration) {
            case "1 Month": return "29"
            case "3 Months": return "79"
            case "9 Months": return "199"
            default: return "29"
        }
    }

    // ya part invoce ho download karny ka leya hia 
    const refData = useRef({}) // <--is ka kam hia sary object matla say invoice ko apny ander store karn ya ik dictionary hia

    const Downloadinvoice = async (id, package_duration) => { //<--- yaha par user na jo id send ki hia or page ka name aye ga as a props ya parameter
        const getElement = refData.current[id] //<-- is ka through hum specific id ko get kary ga
        if (getElement) {
            const invoiceUrl = await toPng(getElement) //<-- is ka kam hai ka use data png file ma convert yani image ready karna hai 
            const link = document.createElement('a') // ay ys data ko <a><a/> anchor tage ma convet kar day gi 
            link.href = invoiceUrl // <-- is say browser ko pata chaly ga ke isy download karna hia ku ka jab tak koi <a> par click nahi karta hia to bowser ko nahi pata chalta hai ka isy download karna hai 
            link.download = `${package_duration}-receipt.png` // <-- ya invoice ka name hai 
            link.click() //<-- ya us say funciton ko calata hia 
        }
    }



    return (
        <div className="min-h-screen bg-white p-3 sm:p-5 md:p-6 rounded-b-xl border border-gray-200">

            <div className="w-full max-w-[770px] mx-auto">

                {/* Main  */}
                <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                    Billing Settings
                </h1>

                {data.length > 0 ?
                    data.map((items, index) => (
                        <div
                            ref={(el) => refData.current[items.id] = el} // ya dictionary ma ID (Key) ko use karke Element/object (Value) ko save kiya
                            key={index}
                            className="mb-4 sm:mb-5 md:mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-5 md:gap-6">

                            {/* Current Plan */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">
                                    Current Plan
                                </label>
                                <span className="px-2 sm:px-2.5 max-w-full w-max inline-block py-1 sm:py-1.5 font-semibold text-slate-500 text-xs sm:text-sm rounded border-2 border-red-400 border-dashed">
                                    Status: {items.is_active ? "Active" : "Inactive"}
                                </span>
                                <div className="border border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base break-words">{items.package_duration} Plan</h3>
                                        <div className="font-semibold text-slate-500 text-[10px] sm:text-xs md:text-sm break-words">
                                            Billed monthly — ${switchFunction(items.package_duration)}/month
                                        </div>
                                    </div>
                                    <h1 className="text-blue-600 font-semibold text-[10px] sm:text-xs md:text-sm hover:underline sm:text-right self-start sm:self-auto whitespace-nowrap">
                                        Your plan for {items.package_duration}
                                    </h1>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">
                                    Payment Method
                                </label>
                                <div className="border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col gap-1 items-start">
                                    <h3 className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base break-words">Visa ending in {items.package_duration}</h3>
                                    <p className="font-semibold text-slate-500 text-[10px] sm:text-xs md:text-sm mb-2">
                                        Expires {new Date(items.expire_package).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => navigate('/Home/re_subscription')}
                                        type="button" className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base hover:underline cursor-pointer">
                                        Update Payment Method
                                    </button>
                                </div>
                            </div>

                            {/* Billing History */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">
                                    Billing History
                                </label>
                                <div className="border border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-4 flex flex-col gap-1 items-start">
                                    {/* Table Header */}
                                    <div className="hidden sm:grid bg-gray-50 border-b border-gray-200 
                              grid-cols-4 px-3 sm:px-4 py-2.5 sm:py-3 w-full font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                                        <div>Date</div>
                                        <div>Description</div>
                                        <div>Amount</div>
                                        <div>Receipt</div>
                                    </div>
                                    {/* Tabl*/}
                                    <div className="grid grid-cols-1 w-full sm:grid-cols-4 px-2 sm:px-4 py-2 sm:py-2.5 md:py-3 font-semibold text-gray-600 text-xs sm:text-sm md:text-base items-center space-y-1 sm:space-y-0 gap-x-2">
                                        <div className="break-words">{new Date(items.start_package).toLocaleDateString()}</div>
                                        <div className="break-words">Pro Plan -{items.package_duration}</div>
                                        <div>${switchFunction(items.package_duration)}</div>
                                        <div>
                                            <button
                                                onClick={() => Downloadinvoice(items.id, items.package_duration)}
                                                type="button" className="text-blue-600 hover:underline cursor-pointer">
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )) : (
                        <div className="text-center py-6 sm:py-8 md:py-10 px-4 text-slate-500 text-xs sm:text-sm md:text-base">
                            <p>Aapne abhi tak koi subscription buy nahi kiya.</p>
                        </div>
                    )}
            </div>
        </div>
    );
}

export default Billing;