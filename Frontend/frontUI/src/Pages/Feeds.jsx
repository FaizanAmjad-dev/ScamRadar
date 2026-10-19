


function Feeds() {
    return (
        <div className="min-h-screen bg-white p-3 sm:p-5 md:p-8 border-gray-200 rounded-xl">
            <div className="w-full max-w-[800px] flex flex-col gap-3 sm:gap-4 md:gap-5">

                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600">
                    Feeds
                </h1>

                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-3 md:pl-3.5 text-slate-400 pointer-events-none text-xs sm:text-sm md:text-base">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Email, user  name or ID"
                        className="w-full border border-blue-400 rounded-lg pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-base"
                    />
                </div>
            </div>

            <div className="flex flex-col ">
                <div className="bg-white p-3 sm:p-4 md:p-5 rounded-2xl shadow-sm border border-gray-200 shadow hover:shadow-xl mt-4 sm:mt-5 md:mt-6 flex items-start sm:items-center justify-between gap-3">
                    {/* Left Content */}
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2 min-w-0">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base truncate">
                            Jane Smith
                        </h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate">
                            jane.smith@gmail.com
                        </p>
                        <p className="text-gray-600 pt-1 text-xs sm:text-sm md:text-base break-words">
                            Placed an order of 3 items
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 pt-0.5">
                            2 min ago
                        </p>
                    </div>

                    {/* Right Badge */}
                    <div className="shrink-0">
                        <span className="bg-emerald-100 text-emerald-600 text-[10px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap">
                            New
                        </span>
                    </div>
                </div>
            </div>


        </div>
    )
} export default Feeds