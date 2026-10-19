import { useState } from "react";

function Tools() {
    // from
    const [base, setBase] = useState('USD')
    // to
    const [qoute, setQoute] = useState('PKR')
    // amount
    const [amount, setAmount] = useState(1)
    // data collector 
    const [result, setResult] = useState('')

    const HanldeCurrency = (e) => {
        e.preventDefault()
        const api = "https://api.frankfurter.dev";
        const fullAPi = `${api}/v2/rate/${base}/${qoute}`
        try {
            fetch(fullAPi)
                .then((res) => res.json())
                .then((data) => {
                    const currencyRate = data.rate;
                    const conversion = (amount * currencyRate).toFixed(2)
                    setResult(`${amount} ${base}= ${conversion} ${qoute}`)
                })
        }
        catch (error) {
            console.log('fetching error')
        }
    }
    return (
        <>
            <div className="min-h-screen flex border-gray-200 rounded-b-xl border justify-center items-center bg-white px-3 sm:px-4">
                <div className="w-full max-w-[600px] min-h-[300px] p-3 sm:p-5 md:p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-blue-600 text-center">
                        Currency Converter
                    </h1>

                    <form onSubmit={HanldeCurrency} className="space-y-4 sm:space-y-5">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                            {/* amount */}
                            <input
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                                type="number"
                                className="w-full sm:w-28 border border-gray-300 outline-none rounded-lg px-3 py-2 bg-white text-xs sm:text-sm md:text-base"
                                placeholder="Amount"
                            />
                            {/* to */}
                            <select onChange={(e) => setBase(e.target.value)} value={base}
                                className="w-full sm:w-auto border border-gray-300 outline-none rounded-lg px-2.5 sm:px-3 py-2 text-xs sm:text-sm md:text-base bg-white shadow-sm">
                                <option value="USD">USD (US Dollar)</option>
                                <option value="EUR">EUR (Euro)</option>
                                <option value="GBP">GBP (British Pound)</option>
                                <option value="PKR">PKR (Pakistani Rupee)</option>
                                <option value="INR">INR (Indian Rupee)</option>
                                <option value="AUD">AUD (Australian Dollar)</option>
                                <option value="CAD">CAD (Canadian Dollar)</option>
                                <option value="JPY">JPY (Japanese Yen)</option>
                                <option value="CNY">CNY (Chinese Yuan)</option>
                                <option value="SAR">SAR (Saudi Riyal)</option>
                                <option value="AED">AED (UAE Dirham)</option>
                                <option value="CHF">CHF (Swiss Franc)</option>
                            </select>

                            <span className="text-blue-500 font-bold text-base sm:text-lg">→</span>
                            {/* from */}
                            <select onChange={(e) => setQoute(e.target.value)} value={qoute}
                                className="w-full sm:w-auto border border-gray-300 outline-none rounded-lg px-2.5 sm:px-3 py-2 text-xs sm:text-sm md:text-base bg-white shadow-sm">
                                <option value="PKR">PKR (Pakistani Rupee)</option>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="EUR">EUR (Euro)</option>
                                <option value="GBP">GBP (British Pound)</option>
                                <option value="INR">INR (Indian Rupee)</option>
                                <option value="AUD">AUD (Australian Dollar)</option>
                                <option value="CAD">CAD (Canadian Dollar)</option>
                                <option value="JPY">JPY (Japanese Yen)</option>
                                <option value="CNY">CNY (Chinese Yuan)</option>
                                <option value="SAR">SAR (Saudi Riyal)</option>
                                <option value="AED">AED (UAE Dirham)</option>
                                <option value="CHF">CHF (Swiss Franc)</option>
                            </select>
                        </div>

                        {/* Convert Button */}
                        <div className="flex justify-center">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 sm:px-8 rounded-lg shadow text-xs sm:text-sm md:text-base">
                                Convert
                            </button>
                        </div>

                        {/* Result box */}
                        <div className="text-center bg-gray-50 rounded-xl py-3 sm:py-4 px-2 border border-gray-200 shadow-inner">
                            {result === '' ? (
                                <p className="text-xs sm:text-sm md:text-lg font-medium text-gray-700">
                                    Enter amount and select currencies
                                </p>
                            ) : (
                                <p className="font-semibold text-blue-600 mt-1 break-words text-xs sm:text-sm md:text-base">
                                    {result}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Tools;