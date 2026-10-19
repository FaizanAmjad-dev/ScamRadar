import { useState } from "react"
import { FaAngleDoubleDown } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import imageCompression from 'browser-image-compression'

function PostFrom({ onPostCreated }) {
    // close fuction
    const [close, setClose] = useState(false)
    const [loading, setLoading] = useState(false)
    const currentToken = localStorage.getItem('access-token')
    // ab ma post karny ka leya funciton likh raha ho 
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/post/`;
    // const API = 'http://127.0.0.1:8000/api/post/'

    const [allitems, setAllitems] = useState({
        text: '',
        paypal: '',
        phone: '',
        anonymous: false,
    })

    const [compressing, setCompressing] = useState(0)
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image6: null,
    })
    // ya part image ko compression ka option hia 
    const option = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/avif'
    }
    // ya part image  ko compress kar  kay images ma dal dya ga
    const HandleCompression = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        if (!file) return;
        setCompressing((prev) => prev + 1)
        try {
            const compres = await imageCompression(file, option)
            const newFile = new File([compres], file.name)

            setImages((prev) => ({
                ...prev,
                [name]: newFile
            }))
        }
        catch {
            setImages((prev) => ({
                ...prev, [name]: file
            }))
        }
        finally {
            setCompressing((prev) => prev - 1)
        }
    }


    const handleinpute = (e) => {
        setAllitems({ ...allitems, [e.target.name]: e.target.value })
    };
    const handleCheckbox = (e) => {
        setAllitems({ ...allitems, anonymous: e.target.checked })
    }

    const submitForm = (e) => {
        e.preventDefault();

        if (!currentToken) {
            toast.error('Please Login first');
            return;
        }
        // ya loading ka leya
        setLoading(true)

        let carrybox = new FormData();

        Object.keys(allitems).forEach((items) => {
            if (items === 'anonymous') {
                carrybox.append(items, allitems.anonymous ? true : false);
            } else {
                carrybox.append(items, allitems[items]);
            }
        });

        // ya part image ka leya hai 
        Object.keys(images).forEach((key) => {
            if (images[key]) {
                carrybox.append(key, images[key])
            }
        })

        fetch(API, {
            method: "POST",
            headers: {
                'Authorization': `jwt ${currentToken}`,
            },
            body: carrybox
        })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}))

                if (response.ok) {
                    toast.success('Post created successfully');
                    setAllitems({
                        text: '',
                        paypal: '',
                        phone: '',
                        anonymous: false
                    })
                    setImages({
                        image1: null,
                        image2: null,
                        image3: null,
                        image4: null,
                        image5: null,
                        image6: null,
                    })

                    if (onPostCreated) {
                        onPostCreated()
                    }
                }
                else {
                    toast.error("fetching error ...!");
                }
            })
            .catch((err) => {
                console.error("Post Creation Error:", err);
                toast.error("Something went wrong!");
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            {/* first div */}
            <div className="bg-white">
                <ToastContainer position='top-center' autoClose={3000} />
                {/* Second main div */}
                <div className="w-full">
                    {/* Form part */}
                    <form
                        onSubmit={submitForm}
                        action=""
                        className="box-border mx-auto w-full max-w-[600px] space-y-4 rounded-2xl border border-slate-300 bg-white px-3 py-4 shadow-xl sm:space-y-6 sm:px-8 sm:py-6">

                        {/* Header Title Accent */}
                        <div className="mb-2 border-b border-slate-100 pb-3 sm:pb-4">
                            <h2 className="text-base font-bold tracking-tight text-slate-800 sm:text-xl">Report Form</h2>
                            <p className="text-xs text-slate-500 sm:text-sm">Please provide accurate details below.</p>
                        </div>

                        <div className="flex w-full max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm transition-colors hover:bg-slate-100/60 sm:gap-x-3 sm:p-3.5">
                            <input
                                checked={allitems.anonymous}
                                onChange={handleCheckbox}
                                name="anonymous"
                                placeholder="paypal..."
                                type="checkbox"
                                id="ans"
                                className="h-4 w-4 shrink-0 cursor-pointer rounded accent-indigo-600"
                            />
                            <label htmlFor="ans"
                                className="cursor-pointer select-none text-sm font-semibold text-slate-700">anonymous</label>
                        </div>

                        {/* text inpute div*/}
                        <div className="flex flex-col gap-y-2">
                            {/* Lable for inpute */}
                            <label htmlFor="Text" className="text-xs font-semibold text-slate-700 sm:text-sm">You can write here</label>
                            {/* text area */}
                            <textarea
                                value={allitems.text}
                                onChange={handleinpute}
                                placeholder="You can write about scammers here...."
                                name="text"
                                id='Text'
                                className="w-full max-w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 sm:px-4 sm:py-3" rows="4"></textarea>
                        </div>

                        {/* pay pal section */}
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor=""
                                className="text-xs font-semibold text-slate-700 sm:text-sm">Paypal</label>
                            <input
                                value={allitems.paypal}
                                onChange={handleinpute}
                                name="paypal"
                                placeholder="paypal..."
                                type="text"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 sm:px-4 sm:py-3"
                            />
                        </div>

                        {/* Phone number section */}
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor=""
                                className="text-xs font-semibold text-slate-700 sm:text-sm">Phone</label>
                            <input
                                name="phone"
                                value={allitems.phone}
                                onChange={handleinpute}
                                placeholder="Phone..."
                                type="text"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 sm:px-4 sm:py-3"
                            />
                        </div>

                        {/* Image Section */}
                        <div className="flex flex-col">
                            {/* notic one */}
                            <h1 className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200/60 bg-amber-50 px-3 py-2.5 text-[11px] font-medium leading-snug text-amber-700 sm:mb-4 sm:items-center sm:px-4 sm:py-3 sm:text-xs">
                                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 sm:mt-0"></span>
                                "Please attach at least 3 clear images as supporting proof...
                            </h1>

                            {/* image section */}
                            <div className="my-2 flex flex-col space-y-3 sm:space-y-4">
                                {/* image tow section */}
                                {[1, 2, 3].map((items, index) => {
                                    const filename = `image${index + 1}`
                                    return (
                                        <div key={index} className="flex flex-col space-y-2">
                                            <h1 className="text-xs font-semibold text-slate-700 sm:text-sm">Upload Image</h1>
                                            <label htmlFor={filename} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm transition-colors hover:bg-slate-100/50 sm:px-3 sm:py-2.5">
                                                <input
                                                    onChange={HandleCompression}
                                                    type="file"
                                                    name={filename}
                                                    id={filename}
                                                    className="w-full cursor-pointer text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-slate-200 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-slate-700 sm:text-sm sm:file:mr-4 sm:file:px-3.5 sm:file:py-1.5 sm:file:text-xs
                                        " />
                                            </label>
                                        </div>
                                    )
                                })}
                                {/* additioal information */}
                                <div
                                    className='flex w-max cursor-pointer select-none items-center pl-1 pt-3 text-indigo-600 transition-colors hover:text-indigo-700'
                                    onClick={() => setClose(!close)}>
                                    <h1 className="mr-2 text-xs font-semibold sm:text-sm">
                                        choose more
                                    </h1>
                                    <FaAngleDoubleDown className={`text-sm transition-transform duration-300
                            ${close ? "rotate-180" : "rotate-0"}`} />
                                </div>

                                {close && (
                                    <div className="mt-2 space-y-3 border-t border-slate-100 pt-2 sm:space-y-4">
                                        {/* image four section */}
                                        {[4, 5, 6].map((items, index) => {
                                            const filenames = `image${index + 4}`
                                            return (
                                                <div key={index} className="flex flex-col space-y-2">
                                                    <h1 className="text-xs font-semibold text-slate-700 sm:text-sm">Upload Image</h1>
                                                    <label htmlFor={filenames} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm transition-colors hover:bg-slate-100/50 sm:px-3 sm:py-2.5">
                                                        <input
                                                            onChange={HandleCompression}
                                                            type="file"
                                                            name={filenames}
                                                            id={filenames}
                                                            className="w-full cursor-pointer text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-slate-200 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-slate-700 sm:text-sm sm:file:mr-4 sm:file:px-3.5 sm:file:py-1.5 sm:file:text-xs
                                                  "  />
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                <div className="flex w-full items-center justify-end pt-3 sm:pt-4">
                                    <button
                                        disabled={compressing > 0 || loading}
                                        className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 outline-none transition-all duration-300 hover:bg-indigo-600 active:scale-95 sm:px-8 sm:py-2.5 sm:text-base">
                                        {compressing > 0 ? "Compressing..." : loading ? "Loading..." : "Post"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default PostFrom