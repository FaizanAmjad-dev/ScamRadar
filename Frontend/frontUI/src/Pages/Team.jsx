







function Team() {
    return (
        <div className="min-h-screen bg-white p-4 border-gray-200 rounded-xl">
            <div className="w-[770px]">

                <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                    Settings Team
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">

                    <div className="flex justify-between items-center pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                                JD
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 ">
                                    John Doe
                                </h3>
                                <p className="font-semibold text-gray-500 text-sm">
                                    johndoe@gmail.com
                                </p>
                            </div>
                        </div>
                        <button type="button" className="text-red-500 font-semibold text-sm">
                            Remove
                        </button>
                    </div>

                    <form className="flex flex-col gap-3">
                        <label className="text-base font-semibold text-gray-800">
                            Add New Member
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:border-2"
                        />

                        <div className="flex justify-start mt-1">
                            <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg text-sm"
                            >
                                Add Member
                            </button>
                        </div>
                    </form>

                </div>

            </div>
        </div>
    );
}

export default Team;