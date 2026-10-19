function General() {
    return (
        <div className="min-h-screen bg-white p-2 border-gray-200 rounded-xl">
            <div className="w-[700px]">

                <h1 className="text-sm font-bold text-gray-900 mb-6">
                    General Settings
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">

                    {/* Form Elements */}
                    <form className="w-full flex flex-col gap-6">

                        {/* Site Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-base font-semibold text-sm text-gray-800">
                                Site Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter site name"
                                className="w-full border border-gray-300 rounded-lg focus:border-blue-500 px-3 py-2 outline-none "
                            />
                        </div>

                        {/* Admin Contact Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base text-sm font-semibold text-gray-800">
                                Admin Contact Email
                            </label>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                className="w-full border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 outline-none "
                            />
                        </div>

                        {/* Timezone Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base text-sm font-semibold text-gray-800">
                                Timezone
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500 text-gray-700"
                            >
                                <option value="UTC">UTC</option>
                                <option value="PST">Pacific Standard Time (PST)</option>
                                <option value="EST">Eastern Standard Time (EST)</option>
                                <option value="IST">India Standard Time (IST)</option>
                            </select>
                        </div>

                        {/* Save Changes Button */}
                        <div className="flex justify-start mt-2">
                            <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default General;