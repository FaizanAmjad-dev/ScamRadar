










function Export_Data() {
    return (
        <div className="min-h-screen bg-white p-6">
            <div className="w-[770px] flex flex-col gap-5">

                <h1 className="text-3xl font-bold text-blue-600">
                    Export Data
                </h1>

                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Data file"
                        className="w-full border-2 border-blue-400 rounded-lg pl-10 pr-4 py-2.5 bg-white outline-none"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 grid grid-cols-2 gap-x-8 gap-y-6">

                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2">User Data</h3>
                            <ul className="list-disc list-inside text-gray-700 pace-y-1">
                                <li>All registered users</li>
                                <li>User activity logs</li>
                                <li>Login history</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2 ">Blacklist Records</h3>
                            <ul className="list-disc list-inside text-gray-700 pace-y-1">
                                <li>Flagged users</li>
                                <li>Reason for blacklisting</li>
                                <li>Date/time of blacklist entry</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2">Chat Room Data</h3>
                            <ul className="list-disc list-inside text-gray-700 pace-y-1">
                                <li>Chat transcripts</li>
                                <li>Active/inactive rooms</li>
                                <li>User participation logs</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2">Flags & Violations</h3>
                            <ul className="list-disc list-inside text-gray-700 pace-y-1">
                                <li>List of all flags</li>
                                <li>Reasons and actions taken</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2">Suggestions</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>All submitted suggestions</li>
                                <li>Status (Reviewed / Pending)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2 text-base">Reports</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Violation reports</li>
                                <li>Admin responses</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-blue-600 mb-2 text-base">System Logs</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Backend logs</li>
                                <li>Error reports</li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="bg-white border border-gray-300 text-slate-800 font-medium px-4 py-2 rounded hover:bg-gray-50"
                    >
                        Export as CSV
                    </button>
                    <button
                        type="button"
                        className="bg-white border border-gray-300 text-slate-800 font-medium px-4 py-2 rounded hover:bg-gray-50 "
                    >
                        Export as Excel
                    </button>
                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded "
                    >
                        Download All
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Export_Data;