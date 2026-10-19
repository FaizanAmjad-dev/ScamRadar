import { useState, useEffect, useRef } from "react"
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";



function Comment_List({ onCommentAdd, comment, depth, postId, refreshComments }) {
    const currentToken = localStorage.getItem('access-token');
    const loginuser = localStorage.getItem('username')
    const inputref = useRef(null)
    useEffect(() => {
        if (showReplyInput && inputref.current) {
            inputref.current.focus();
            setTimeout(() => {
                inputref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 300);
        }
    })
    // comment ko hide karny ka leya 
    const [commentHidde, setCommentHidden] = useState(false)

    // yaha sa hum parent comment create kary ge
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const API = `${BASE_URL}/api/comment/`;

    const mainComment = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return
        if (!currentToken) {
            alert("Aap logged in nahi hain! Pehle login karein.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/comment/`, {
                method: "POST",
                headers: {
                    'Authorization': `jwt ${currentToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post: postId,
                    parent: comment.id,
                    message: replyMessage,
                })
            })
            if (response.ok) {
                if (onCommentAdd) onCommentAdd();
                setReplyMessage(''),
                    setShowReplyInput(false)
                refreshComments()
            }
        }
        catch (error) {
            console.error(
                "error backend par hai ", error
            );
        }
    }

    // comment ko delet karny ka leya 
    const commentDelet = async (id) => {
        if (!currentToken) {
            alert("Aap logged in nahi hain!");
            return;
        }
        fetch(`${BASE_URL}/api/comment/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `jwt ${currentToken}`
            }
        })
            .then((prev) => {
                if (prev.ok) {
                    if (onCommentAdd) onCommentAdd();
                    refreshComments();
                }
            })
    }
    const [loading, setLoading] = useState({})

    return (
        <div className={`w-full ${depth > 0 ? 'min-w-0 flex-1 pl-1 sm:pl-2 border-l-2 border-gray-200' : ''} overflow-hidden box-border`}>
            <div className="flex flex-col justify-between w-full max-w-[600px] px-0.5 mt-3 sm:mt-4 md:mt-6 rounded py-1.5 sm:py-2">
                {/* comment parent */}
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center min-w-0 gap-1">
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-400 rounded-full mr-0.5 sm:mr-1 overflow-hidden shrink-0
                            ${!loading[`${comment.id}-userPic`] ? "animate-pluse" : ""}
                            `}>
                            <img
                                src={comment.userPic}
                                onLoad={() => {
                                    setLoading((pre) =>({
                                        ...pre,[`${comment.id}-userPic`]:true
                                    }))
                                }}
                                alt=""
                                className={`w-full h-full object-cover ${loading[`${comment.id}-userPic`] ?"opacity-100":"opacity-0"}`}
                            />
                        </span>
                        {/* name */}
                        <span className="font-semibold text-xs sm:text-sm mr-0.5 sm:mr-1 truncate">{comment?.Username}</span>
                        {/* date */}
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-700 whitespace-nowrap shrink-0">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    {/* delete */}
                    {currentToken && loginuser === comment?.Username && (
                        <button onClick={() => commentDelet(comment.id)} className="cursor-pointer text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[5px] bg-red-700 text-white font-semibold overflow-hidden shrink-0">
                            delete
                        </button>
                    )}
                </div>
                {/* text area */}
                <div className="w-full max-w-[550px] ml-1.5 sm:ml-2.5 md:ml-4 border border-gray-200/60 text-gray-800 rounded-xl mt-1.5 sm:mt-2 py-1 px-1.5 sm:px-2 overflow-hidden break-all whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                    {comment.message}
                </div>

                {/* button for reply */}
                <button
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="hover:bg-gray-100 w-fit px-1.5 sm:px-2 py-0.5 rounded font-semibold text-xs sm:text-sm ml-2 sm:ml-3 md:ml-4 my-0.5 sm:my-1 text-center">
                    reply
                </button>
            </div>

            {/* comment section */}
            {comment.replies && comment.replies.length > 0 && (
                <button
                    onClick={() => setCommentHidden(!commentHidde)}
                    className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 hover:bg-gray-200 px-1.5 sm:px-2 py-0.5 rounded-full cursor-pointer">
                    <span>{comment.replies.length} replies</span>
                    {commentHidde ? <MdOutlineKeyboardArrowUp className="size-3 sm:size-4" /> : <MdOutlineKeyboardArrowDown className="size-3 sm:size-4" />}
                </button>
            )}


            {/* reply input */}
            {showReplyInput && (
                <form onSubmit={mainComment} className="flex gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 pl-2 sm:pl-5 md:pl-9 w-full overflow-hidden">
                    <input
                        ref={inputref}
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Write a reply..."
                        className="border border-gray-300 rounded-lg px-1.5 sm:px-2 md:px-3 py-1 text-xs sm:text-sm flex-1 outline-none min-w-0 break-all"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg shrink-0 cursor-pointer">
                        Send
                    </button>
                </form>
            )}
            {/* ya child replies  ka leya hai  */}
            {commentHidde && comment.replies && comment.replies.length > 0 && (
                <div className="mt-1.5 sm:mt-2">
                    {comment.replies.map((child) => (
                        <Comment_List
                            key={child.id}
                            postId={postId}
                            comment={child}
                            refreshComments={refreshComments}
                            depth={depth + 1}
                            onCommentAdd={onCommentAdd}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
export default Comment_List