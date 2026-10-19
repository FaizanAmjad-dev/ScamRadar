import { useEffect, useState } from "react"
import { FaAngleDoubleDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify/unstyled";
import 'react-toastify/dist/ReactToastify.css'
import { data, useNavigate, useParams } from "react-router-dom";

function Post_Update() {
    const { id } = useParams()
    const navigate = useNavigate();
    const currentToken = localStorage.getItem('access-token')
    // yaha say data la kain field ma fill keya jye ga
    const [oldImages, setOldImages] = useState({});
    useEffect(() => {
        if (!currentToken) {
            return navigate('/Home')
        }
        fetch(API)
            .then((res) => res.json())
            .then((data) => {
                setAllitems({
                    text: data.text,
                    paypal: data.paypal,
                    phone: data.phone,
                });
                setOldImages({
                    image1: data.image1,
                    image2: data.image2,
                    image3: data.image3,
                    image4: data.image4,
                    image5: data.image5,
                    image6: data.image6,
                });
            })

    }, [id, currentToken])

    // ab ma post update karny ka leya funciton likh raha ho 
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    // const api = `${BASE_URL}/api/Subscription/`;

    const API = `${BASE_URL}/api/post/${id}/`
    const [allitems, setAllitems] = useState({
        text: '',
        paypal: '',
        phone: '',
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
        setAllitems({ ...allitems, [e.target.name]: e.target.value });
    };

    const submitForm = (e) => {
        e.preventDefault();

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
                carrybox.append(key, images[key])
            }
        })

        fetch(API, {
            method: "PATCH",
            headers: {
                'Authorization': `jwt ${currentToken}`,
            },
            body: carrybox
        })
            .then((response) => {
                if (response.ok) {
                    toast.success('Post Update successfully');
                    setTimeout(() => {
                        navigate('/Home')
                    }, 1500);

                } else {
                    toast.error('Post Update failed');
                }
                return response.json();

            })
    }




    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden my-4 sm:my-6">
                <ToastContainer position="top-center" autoClose={1400} />
                {/* Top Header */}
                <div className="px-3 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center gap-2 bg-gray-50">
                    <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800">Update Post</h2>
                        <p className="text-[10px] sm:text-xs text-gray-500">Modify your post details, contact info, and proofs below.</p>
                    </div>
                    <button onClick={() => navigate('/Home')} className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold cursor-pointer shrink-0 text-sm sm:text-base">
                        &times;
                    </button>
                </div>

                {/* Form Container with Pixel Max-Height */}
                <form onSubmit={submitForm} className="flex flex-col max-h-[85vh] sm:max-h-[600px] overflow-y-auto">

                    {/* Section 1: Post Content */}
                    <div className="p-3 sm:p-5 md:p-6 border-b border-gray-200 flex flex-col gap-2.5 sm:gap-3">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800">Post Content</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500">Write your main description or update about the scammer.</p>
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase mb-1">Post Text</label>
                            <textarea
                                name="text"
                                value={allitems.text}
                                onChange={handleinpute}
                                className="w-full border border-gray-200 bg-gray-50 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm outline-none"
                                rows="3"
                                placeholder="You can write about scammers here...."
                            />
                        </div>
                    </div>

                    {/* Section 2: Contact Information */}
                    <div className="p-3 sm:p-5 md:p-6 border-b border-gray-200 flex flex-col gap-2.5 sm:gap-3">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800">Contact Details</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500">Provide PayPal and phone details for records.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase mb-1">PayPal Account</label>
                                <input
                                    name="paypal"
                                    value={allitems.paypal}
                                    onChange={handleinpute}
                                    type="text"
                                    className="w-full border border-gray-200 bg-gray-50 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm outline-none "
                                    placeholder="paypal..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                                <input
                                    name="phone"
                                    value={allitems.phone}
                                    onChange={handleinpute}
                                    type="text"
                                    className="w-full border border-gray-200 bg-gray-50 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm outline-none "
                                    placeholder="Phone..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Required Proof Images (1 to 3) */}
                    <div className="p-3 sm:p-5 md:p-6 border-b border-gray-200 flex flex-col gap-2.5 sm:gap-3">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800">Required Proofs</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500">Please attach at least 3 clear images as supporting proof.</p>
                            <div className="mt-2 bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-800 text-[10px] sm:text-xs font-medium ">
                                ⚠️ Min 3 images required.
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5 sm:gap-3">
                            <div>
                                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Image 1 (Required)</label>
                                {oldImages.image1 && (
                                    <div className="mb-1">
                                        <a href={oldImages.image1} target="_blank" className="text-[10px] sm:text-xs text-blue-600 underline cursor-pointer">
                                            View current Image 1
                                        </a>
                                    </div>
                                )}
                                <input onChange={HandleCompression} name="image1" type="file" className="w-full text-[10px] sm:text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700" />
                            </div>
                            <div>
                                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Image 2 (Required)</label>
                                {oldImages.image2 && (
                                    <div className="mb-1">
                                        <a href={oldImages.image2} target="_blank" className="text-[10px] sm:text-xs text-blue-600 underline cursor-pointer">
                                            View current Image 2
                                        </a>
                                    </div>
                                )}
                                <input type="file" onChange={HandleCompression} name="image2" className="w-full text-[10px] sm:text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700" />
                            </div>
                            <div>
                                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Image 3 (Required)</label>
                                {oldImages.image3 && (
                                    <div className="mb-1">
                                        <a href={oldImages.image3} target="_blank" className="text-[10px] sm:text-xs text-blue-600 underline cursor-pointer">
                                            View current Image 3
                                        </a>
                                    </div>
                                )}
                                <input type="file" onChange={HandleCompression} name="image3" className="w-full text-[10px] sm:text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Optional Images (4 to 6) */}
                    <div className="p-3 sm:p-5 md:p-6 flex flex-col gap-2.5 sm:gap-3">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800">Additional Proofs</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500">You can add up to 3 more optional images.</p>
                        </div>
                        <div className="flex flex-col gap-2.5 sm:gap-3">
                            <div>
                                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Image 4 (Required)</label>
                                {oldImages.image4 && (
                                    <div className="mb-1">
                                        <a href={oldImages.image4} target="_blank" className="text-[10px] sm:text-xs text-blue-600 underline cursor-pointer">
                                            View current Image 4
                                        </a>
                                    </div>
                                )}
                                <input type="file" onChange={HandleCompression} name="image4" className="w-full text-[10px] sm:text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700" />
                            </div>
                            <div>
                                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Image 5 (Required)</label>
                                {oldImages.image5 && (
                                    <div className="mb-1">
                                        <a href={oldImages.image5} target="_blank" className="text-[10px] sm:text-xs text-blue-600 underline cursor-pointer">
                                            View current Image 5
                                        </a>
                                    </div>
                                )}
                                <input type="file" onChange={HandleCompression} name="image5" className="w-full text-[10px] sm:text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700" />
                            </div>
                            <div>
                                <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Image 6 (Required)</label>
                                {oldImages.image6 && (
                                    <div className="mb-1">
                                        <a href={oldImages.image6} target="_blank" className="text-[10px] sm:text-xs text-blue-600 underline cursor-pointer">
                                            View current Image 6
                                        </a>
                                    </div>
                                )}
                                <input type="file" onChange={HandleCompression} name="image6" className="w-full text-[10px] sm:text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/**/}
                    <div className="px-3 sm:px-5 md:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex gap-2 sm:gap-3 sticky bottom-0 z-10">
                        <button
                            type="submit"
                            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold"
                        >
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Post_Update;