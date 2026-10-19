import { useState } from "react"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import imageCompression from "browser-image-compression"

function Artical_post({ onArticalCreated }) {

    const currentToken = localStorage.getItem('access-token')
    const [loading, setLoading] = useState(false)
    // ab ma post karny ka leya funciton likh raha ho
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/Artical/`;

    // const API = 'http://127.0.0.1:8000/api/Artical/'

    const [allitems, setAllitems] = useState({
        artical_title: '',
        detail1: '',
        detail2: '',
        introduce: '',
        title: '',
    })
    const [images, setImages] = useState({
        pic1: null,
        pic2: null,
    })
    const option = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebView: true,
        fileType: 'image/avif',
    }
    const [compresloader, setCompresloader] = useState(0)
    const handlecompression = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        if (file) {
            setCompresloader((compresloader) => compresloader + 1)
            try {
                const compression = await imageCompression(file, option)
                const filename = new File([compression], file.name)
                setImages((prev) => ({
                    ...prev, [name]: filename
                }))
            } catch {
                setImages((prev) => ({
                    ...prev, [name]: file
                }))
            } finally {
                setCompresloader((prev) => prev - 1)
            }
        }
    }
    const handleinpute = (e) => {
        setAllitems({ ...allitems, [e.target.name]: e.target.value })
    }

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true)

        if (!currentToken) {
            alert('Please Login first')
            return
        }

        let carrybox = new FormData();
        Object.keys(allitems).forEach((items) => {
            carrybox.append(items, allitems[items])
        })
        Object.keys(images).forEach((key) => {
            if (images[key]) {
                carrybox.append((key), images[key])
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
                    toast.success('Artical created successfully');
                    if (onArticalCreated) {
                        onArticalCreated();
                    }
                    setAllitems({
                        artical_title: '',
                        detail1: '',
                        detail2: '',
                        introduce: '',
                        title: '',
                    })
                    setImages({
                        image1: null,
                        image2: null
                    })
                } else {
                    toast.error('Artical creation failed');
                }
            }).finally(() => {
                setLoading(false)
            })

    }

    return (
        <>
            {/* first div */}
            <div className="min-h-screen bg-gray-50">
                <ToastContainer position='top-center' autoClose={2000} />

                {/* Second main div */}
                <div className="flex justify-center items-start sm:items-center p-3 sm:p-0">

                    {/* Form part */}
                    <form
                        onSubmit={submitForm}
                        action=""
                        className="border border-gray-200 rounded-xl w-full max-w-[650px] px-3 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white shadow-sm space-y-3 sm:space-y-5 md:space-y-6 mx-auto sm:mx-0">

                        {/* title*/}
                        <div className="flex flex-col gap-y-1.5 sm:gap-y-2">
                            <label htmlFor=""
                                className="text-gray-700 font-semibold text-xs sm:text-sm">Title</label>
                            <input
                                name="artical_title"
                                value={allitems.artical_title}
                                onChange={handleinpute}
                                placeholder="title..."
                                type="text"
                                className="outline-none w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm rounded-xl transition-all text-slate-800 text-xs sm:text-sm md:text-base"
                            />
                        </div>

                        {/* yaha par introduction title likhty hai */}
                        <div className="flex flex-col gap-y-1.5 sm:gap-y-2">
                            <label htmlFor="" className="text-gray-700 font-semibold text-xs sm:text-sm">Introduction Title</label>
                            <input
                                name="introduce"
                                value={allitems.introduce}
                                onChange={handleinpute}
                                placeholder="title..."
                                type="text"
                                className="outline-none w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm rounded-xl transition-all text-slate-800 text-xs sm:text-sm md:text-base"
                            />
                        </div>

                        {/* Image Section */}
                        <div className="flex flex-col">

                            {/* notic one */}
                            <h1 className="text-blue-500 font-semibold text-[11px] sm:text-xs md:text-sm bg-blue-50 rounded px-2.5 sm:px-3 py-1.5 sm:py-2 mb-3 sm:mb-4">
                                yaha par ap artical ka bary ma likh sakty hai
                            </h1>

                            {/* image section */}
                            <div className="flex flex-col space-y-3 sm:space-y-4">

                                {/* image one section */}
                                <div className="flex flex-col space-y-1.5 sm:space-y-2">
                                    <h1 className="text-gray-700 font-semibold text-xs sm:text-sm">Upload Image</h1>
                                    <label htmlFor="pic1" className="border border-dashed border-gray-300 block rounded-lg bg-gray-50 p-2 sm:p-3 cursor-pointer">
                                        <input
                                            onChange={handlecompression}
                                            type="file"
                                            name="pic1"
                                            id='pic1'
                                            multiple
                                            accept="image/*"
                                            className="w-full cursor-pointer text-[10px] sm:text-xs md:text-sm text-slate-700 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3.5 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-700 file:font-semibold file:text-[10px] sm:file:text-xs "
                                        />
                                    </label>
                                </div>


                                {/* textArea 1 div*/}
                                <div className="flex flex-col gap-y-1.5 sm:gap-y-2">
                                    {/* Lable for inpute */}
                                    <label htmlFor="Text" className="text-gray-700 font-semibold text-xs sm:text-sm">You can write here</label>
                                    {/* text area */}
                                    <textarea
                                        value={allitems.detail1}
                                        onChange={handleinpute}
                                        placeholder="You can write about artical here...."
                                        name="detail1"
                                        id='Text'
                                        className="border border-slate-200 shadow-sm rounded-xl resize-none outline-none px-3 sm:px-4 w-full py-2 sm:py-3 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 max-w-full text-xs sm:text-sm md:text-base" rows="4"></textarea>
                                </div>

                                {/* yaha par introduction title likhty hai */}
                                <div className="flex flex-col gap-y-1.5 sm:gap-y-2">
                                    <label htmlFor="" className="text-gray-700 font-semibold text-xs sm:text-sm">Second introduction Title</label>
                                    <input
                                        name="title"
                                        value={allitems.title}
                                        onChange={handleinpute}
                                        placeholder="title..."
                                        type="text"
                                        className="outline-none w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm rounded-xl transition-all text-slate-800 text-xs sm:text-sm md:text-base"
                                    />
                                </div>

                                {/* image tow section */}
                                <div className="flex flex-col space-y-1.5 sm:space-y-2">
                                    <h1 className="text-gray-700 font-semibold text-xs sm:text-sm">Upload Image</h1>
                                    <label htmlFor="pic2" className="border border-dashed border-gray-300 rounded-lg bg-gray-50 p-2 sm:p-3 cursor-pointer">
                                        <input
                                            onChange={handlecompression}
                                            type="file"
                                            name="pic2"
                                            id='pic2'
                                            multiple
                                            accept="image/*"
                                            className="w-full cursor-pointer text-[10px] sm:text-xs md:text-sm text-slate-700 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3.5 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-700 file:font-semibold file:text-[10px] sm:file:text-xs "
                                        />
                                    </label>
                                </div>

                                {/* Textarea 2 div*/}
                                <div className="flex flex-col gap-y-1.5 sm:gap-y-2">
                                    {/* Lable for inpute */}
                                    <label htmlFor="Text" className="text-gray-700 font-semibold text-xs sm:text-sm">You can write here</label>
                                    {/* text area */}
                                    <textarea
                                        value={allitems.detail2}
                                        onChange={handleinpute}
                                        placeholder="You can write about artical here...."
                                        name="detail2"
                                        id='Text'
                                        className="border border-slate-200 shadow-sm rounded-xl resize-none outline-none px-3 sm:px-4 w-full py-2 sm:py-3 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 max-w-full text-xs sm:text-sm md:text-base" rows="4"></textarea>
                                </div>

                                <div className="w-full flex justify-end items-center pt-1.5 sm:pt-2">
                                    <button
                                        disabled={compresloader > 0 || loading}
                                        className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-black text-white font-semibold rounded-lg shadow cursor-pointer hover:bg-blue-600 text-xs sm:text-sm md:text-base">
                                        {compresloader > 0 ? "Compressing..." : loading ? "Uploading..." : "Post"}
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
export default Artical_post