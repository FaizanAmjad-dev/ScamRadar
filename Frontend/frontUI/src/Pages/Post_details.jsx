import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoChatboxOutline } from "react-icons/io5";
import { CiRepeat } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsBarChart } from "react-icons/bs";
// comment context part
import { useContext, useEffect, useState, useRef } from "react";
import { MyContext } from "../Context/context";
import { data, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Comment_List from "./PagesUI/Comment_List";
import anonymous from "../assets/anonymous.png";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

function Post_details() {
  const currentToken = localStorage.getItem("access-token");

  // ya share ka leya hia
  const [share, setShare] = useState(false);
  const ShareUrl = window.location.href;
  const PostTitle = "ya post check kary";

  const { id } = useParams();
  if (!id) {
    return navigation('/Home')
  }
  // navigation for post detail page
  const navigation = useNavigate();

  // context api use ho rahi hai yaha par
  const { fetchNotifications, comDown, setcomDown, postedit, setPostedit } = useContext(MyContext);

  const [loading, setLoading] = useState({})
  const [load, setLoad] = useState(true)
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
  const API = `${BASE_URL}/api/post/${id}/`;

  // ya part fetch ka hai
  // const API = `http://127.0.0.1:8000/api/post/${id}/`;
  const [realApi, setRealApi] = useState({});
  const POST = () => {
    fetch(API, {
      headers: currentToken
        ? {
          Authorization: `jwt ${currentToken}`,
        }
        : {},
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("access-token");
          return fetch(API).then((r) => r.json());
        }
        return res.json();
      })
      .then((data) => {
        setRealApi(data);
        fetchNotifications()
        setTimeout(() => {
          setLoad(false);
        }, 1000)
      })
  };

  // data refresh karny ka leya
  useEffect(() => {
    POST();
  }, []);

  const DeletePost = (postId) => {
    fetch(`${BASE_URL}/api/post/${postId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `jwt ${currentToken}`,
      },
    }).then((res) => {
      if (res.ok) {
        fetchNotifications()
        navigation("/");
      } else {
        alert("Failed to delete the post.");
      }
    });
  };

  // yaha sa comment ka part shuru hota hai
  const CommentAPI = `${BASE_URL}/api/comment/?post_id=${id}`;
  const [commentData, setCommentData] = useState([]);
  const fetchCommen = async () => {
    try {
      const response = await fetch(CommentAPI);
      const data = await response.json();
      setCommentData(data);
    } catch {
      if (!commentData) {
        console.error("api ma sa data nahi a raha hai ");
      }
    }
  };

  // data ko refresh karny ka leya hia
  useEffect(() => {
    fetchCommen();
    fetchNotifications()
  }, [id]);

  // yaha sa hum parent comment create kary ge
  const [mainMessage, setMainMessage] = useState("");
  const Comment_submit = async (e) => {
    e.preventDefault();
    if (!mainMessage.trim()) return;
    if (!currentToken) {
      alert("Aap logged in nahi hain! Pehle login karein.");
      return;
    }
    try {
      const response = await fetch(CommentAPI, {
        method: "POST",
        headers: {
          Authorization: `jwt ${currentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: id,
          parent: null,
          message: mainMessage,
        }),
      });
      if (response.ok) {
        (setMainMessage(""), fetchNotifications(), fetchCommen(), setcomDown(), POST());
        // direct comment ko update karny ka leya hai
        setRealApi((prv) => ({
          ...prv,
          comment: (prv.comment || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("error backend par hai ", error);
    }
  };

  // ya function like ka hai
  const likeAPi = `${BASE_URL}/api/like/`;
  // const likeAPi = "http://127.0.0.1:8000/api/like/";
  const handleLike = async (postId) => {
    if (!currentToken) {
      toast.error("Please login first");
      window.location.href = '/login'
      return;
    }

    fetch(likeAPi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `jwt ${currentToken}`,
      },
      body: JSON.stringify({
        post: postId,
      }),
    }).then((res) => {
      if (res.ok) {
        // direct repost ko update karny ka leya
        setRealApi((prv) => ({
          ...prv,
          like: (prv.like || 0) + 1,
        }));
        POST();
        fetchNotifications()
      }
    });
  };


  // ya  part websocket ka hai 
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsHost = new URL(BASE_URL).host
    const postSocket = new WebSocket(`${wsProtocol}//${wsHost}/ws/homefeed/`)

    postSocket.onmessage = (event) => {
      const liveData = JSON.parse(event.data)

      // agar koi home par how to wha kisy or post ko like key to is ki post ki ginit galat ho skati hai or is ley yalagya hia tkay check kary ke koin si post hia 
      if (String(liveData.post_id) !== String(id)) return

      // like ka leya hai 
      if (liveData.kind === 'like') {
        setRealApi((prev) => ({ ...prev, like: liveData.count }))
      }

      // viwe ka leay hai 
      if (liveData.kind === 'view') {
        setRealApi((prev) => ({ ...prev, views: liveData.count }))
      }

      // ya repost ka leay hai 
      if (liveData.kind === 'repost') {
        setRealApi((prev) => ({ ...prev, repost: liveData.count }))
      }

      // ya comment ka leya hia
      if (liveData.kind === 'comment') {
        setRealApi((prev) => ({ ...prev, comment: liveData.count }))
        fetchCommen()
      }

      // comment delete hony par
      if (liveData.kind === 'comment_deleted') {
        setRealApi((prev) => ({ ...prev, comment: liveData.count }))
        fetchCommen()
      }
    }
    return () => {
      postSocket.close()
    }
  }, [id])

  // ya function toggle ko auto colse karny ka leya hia \
  const editref = useRef(null);
  useEffect(() => {
    //   ya dekhna ka mouse kaha par clik kar raha hai
    const handleclickevent = (event) => {
      if (editref.current && !editref.current.contains(event.target)) {
        setPostedit(null);
      }
    };
    // ya part toggle ko check or pc or phone ke leya hai
    if (postedit !== null) {
      document.addEventListener("mousedown", handleclickevent);
      document.addEventListener("touchstart", handleclickevent);
    }
    return () => {
      document.removeEventListener("mousedown", handleclickevent);
      document.removeEventListener("touchstart", handleclickevent);
    };
  }, [postedit]);

  // ya scroll ko hony say rok ta hai
  useEffect(() => {
    if (share) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [share]);

  return (
    <>
      {/* mian div */}
      {load ? (
        <div className="min-h-screen flex items-center justify-center">
          <button
            type="button"
            className="inline-flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-sm font-medium rounded-lg text-sm px-4 py-2.5"
          >
            <span className="w-4 h-4 me-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            Loading...
          </button>
        </div>
      ) : (
        <div className="relative min-h-screen bg-white border border-gray-200 border-t-0 rounded-b-xl pb-6 sm:pb-10">
          {/* second div for center */}
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex justify-center">
              <div className="mt-4 sm:mt-6 border-gray-200 border shadow px-3 sm:px-4 py-3 sm:py-4 bg-white w-full max-w-[580px] h-auto mx-2 sm:mx-0">
                <div className="flex justify-between items-center">
                  {/* first detail */}
                  <div className="flex gap-x-2">
                    {/*profile logo */}
                    {realApi.anonymous ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow flex justify-center items-center shrink-0">
                        <img
                          src={anonymous}
                          loading="lazy"
                          alt=""
                          className="object-fill w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-400 overflow-hidden shadow flex justify-center items-center shrink-0
                          ${!loading[`${realApi.id}-userPic`] ? "animate-pulse" : ""}
                        `}>
                        <img
                          loading="lazy"
                          src={realApi.userPic}
                          onLoad={() => {
                            setLoading((prev) => ({
                              ...prev, [`${realApi.id}-userPic`]: true
                            }))
                          }}
                          alt=""
                          className={`object-fill w-full h-full ${loading[`${realApi.id}-userPic`] ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>
                    )}

                    {/* name /date part */}
                    <div className="flex flex-col min-w-0">
                      {/* name and email */}
                      <div className="flex flex-wrap gap-x-1 items-center">
                        {/* user name */}
                        <span>
                          <h1 className="font-semibold text-sm sm:text-base truncate">{realApi.username}</h1>
                        </span>
                        {/* user email */}
                        <span className="min-w-0">
                          <p className="text-gray-400 font-semibold text-xs sm:text-sm truncate">
                            {realApi.email}
                          </p>
                        </span>
                      </div>

                      {/* date/time */}
                      <span>
                        <p className="text-gray-400 text-[10px] sm:text-xs">
                          {new Date(realApi.createdat).toDateString()}
                        </p>
                      </span>
                    </div>
                  </div>
                  {/* user ban part */}
                  <div className="flex justify-center items-center gap-x-1 sm:gap-x-2 shrink-0">
                    {/* ban button */}
                    <span>
                      <button
                        hidden
                        className="cursor-pointer rounded-3xl px-2 sm:px-3 py-1 bg-yellow-500 text-white "
                      ></button>
                    </span>
                    {/* infomation  */}
                    <span className="relative" ref={editref}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setPostedit(postedit === realApi.id ? null : realApi.id)
                        }
                        }
                        className="cursor-pointer"
                      >
                        <HiOutlineDotsVertical />
                      </button>
                      {/* Update and send */}
                      {postedit === realApi.id && (
                        <div
                          className="absolute right-0 top-8 bg-white border border-gray-200 shadow-lg rounded-lg py-1 w-24 sm:w-28 z-50 flex flex-col text-[11px] sm:text-xs font-medium text-gray-700"
                        >
                          {currentToken && localStorage.getItem('username') === realApi.username && (
                            <button
                              onClick={() => navigation(`/Home/post_update/${realApi.id}`)}
                              className="text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer">
                              Update
                            </button>
                          )}
                          <button
                            onClick={() => setShare(true)}
                            className="text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            Share
                          </button>
                          {currentToken && localStorage.getItem('username') === realApi.username && (
                            <button
                              onClick={() => DeletePost(realApi.id, false)}
                              className="text-left px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}

                        </div>
                      )}
                    </span>
                  </div>
                </div>

                {/* text section */}
                <div className="mt-3 sm:mt-4">
                  <p className="w-full break-words whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                    {realApi.text}
                  </p>
                </div>
                {/* image section */}
                <div className="flex relative items-center justify-center mt-3 sm:mt-4 mb-3 sm:mb-4 w-full">
                  <div className="grid grid-cols-2 grid-row-2 gap-1 sm:gap-1.5 w-full max-w-[500px] rounded-xl overflow-hidden flex items-center">
                    <div className={`w-full h-full overflow-hidden bg-gray-300 
                    ${!loading[`${realApi.id}-image1`] ? "animate-pulse" : ""}`}>
                      <img
                        src={realApi.image1}
                        onLoad={() => {
                          setLoading((prev) => ({
                            ...prev, [`${realApi.id}-image1`]: true
                          }))
                        }}
                        alt=""
                        className={`w-full h-full object-cover 
                        ${loading[`${realApi.id}-image1`] ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>

                    <div className={`w-full h-full overflow-hidden bg-gray-300 ${!loading[`${realApi.id}-image2`] ? "animate-pulse" : ""}`}>
                      <img
                        src={realApi.image2}
                        onLoad={() => {
                          setLoading((prev) => ({
                            ...prev, [`${realApi.id}-image2`]: true
                          }))
                        }}
                        alt=""
                        className={`w-full h-full object-cover ${loading[`${realApi.id}-image2`] ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>

                    <div className={`w-full h-full overflow-hidden bg-gray-300 ${!loading[`${realApi.id}-image3`] ? "animate-pulse" : ""}`}>
                      <img
                        src={realApi.image3}
                        onLoad={() => {
                          setLoading((prev) => ({
                            ...prev, [`${realApi.id}-image3`]: true
                          }))
                        }}
                        alt=""
                        className={`w-full h-full object-cover ${loading[`${realApi.id}-image3`] ? "opacity-100" : "opacity-0"}`}

                      />
                    </div>

                    {realApi.image4 && (
                      <div className={`w-full h-full overflow-hidden bg-gray-300 ${!loading[`${realApi.id}-image4`] ? "animate-pulse" : ""}`}>
                        <img
                          src={realApi.image4}
                          onLoad={() => {
                            setLoading((prev) => ({
                              ...prev, [`${realApi.id}-image4`]: true
                            }))
                          }}
                          alt=""
                          className={`w-full h-full object-cover ${loading[`${realApi.id}-image4`] ? "opacity-100" : "opacity-0"}`}

                        />
                      </div>
                    )}

                    {realApi.image5 && (
                      <div className={`w-full h-full overflow-hidden bg-gray-300 ${!loading[`${realApi.id}-image5`] ? "animate-pulse" : ""}`}>
                        <img
                          src={realApi.image5}
                          onLoad={() => {
                            setLoading((prev) => ({
                              ...prev, [`${realApi.id}-image5`]: true
                            }))
                          }}
                          alt=""
                          className={`w-full h-full object-cover ${loading[`${realApi.id}-image5`] ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>
                    )}

                    {realApi.image6 && (
                      <div className={`w-full h-full overflow-hidden bg-gray-300 ${!loading[`${realApi.id}-image6`] ? "animate-pulse" : ""}`}>
                        <img
                          src={realApi.image6}
                          alt=""
                          onLoad={() => {
                            setLoading((prev) => ({
                              ...prev, [`${realApi.id}-image6`]: true
                            }))
                          }}
                          className={`w-full h-full object-cover ${loading[`${realApi.id}-image6`] ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>
                    )}

                  </div>
                </div>

                {/* last comment and repost like and views */}
                <div className="flex flex-wrap justify-start items-center gap-x-3 sm:gap-x-4 gap-y-2 mb-1">
                  {/* Comment section */}
                  <div className="flex justify-center items-center text-gray-600 gap-x-1">
                    {/*icons */}
                    <button
                      onClick={() =>
                        setcomDown(comDown === realApi.id ? null : realApi.id)
                      }
                      className="cursor-pointer"
                    >
                      <IoChatboxOutline className="text-lg sm:text-xl" />
                    </button>
                    {/* total comment */}
                    <span>
                      <p className="text-xs sm:text-sm font-semibold">{realApi.comment}</p>
                    </span>
                  </div>

                  {/* repost section */}
                  <div className="flex justify-center items-center text-gray-600 gap-x-1">
                    <span className="cursor-pointer">
                      <CiRepeat
                        className={`text-lg sm:text-xl transition-colors duration-200 ${realApi.is_repost
                          ? "text-green-600 fill-green-600 font-bold"
                          : "text-gray-600 font-bold"
                          }`}
                      />
                    </span>
                    {/* total repost */}
                    <span>
                      <p className="text-xs sm:text-sm font-semibold">{realApi.repost}</p>
                    </span>
                  </div>

                  {/* like section */}
                  <div className="flex justify-center items-center text-gray-600 gap-x-1">
                    <button
                      onClick={() => handleLike(realApi.id)}
                      className="cursor-pointer"
                    >
                      <IoIosHeartEmpty
                        className={`text-lg sm:text-xl transition-colors duration-200 ${realApi.is_like
                          ? "text-red-600 fill-red-600 font-bold"
                          : "text-gray-600 font-bold"
                          }`}
                      />
                    </button>
                    {/* total like */}
                    <span>
                      <p className="text-xs sm:text-sm font-semibold">{realApi.like}</p>
                    </span>
                  </div>
                  {/* views section section */}
                  <div className="flex justify-center items-center text-gray-600 gap-x-1">
                    <span className="cursor-pointer">
                      <BsBarChart className="text-lg sm:text-xl" />
                    </span>
                    {/* total views */}
                    <span>
                      <p className="text-xs sm:text-sm font-semibold">{realApi.views}</p>
                    </span>
                  </div>
                </div>

                {/* comment section */}
                {comDown === realApi.id && (
                  <form
                    onSubmit={Comment_submit}
                    className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 w-full max-w-[550px]"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        onChange={(e) => setMainMessage(e.target.value)}
                        value={mainMessage}
                        className="w-full rounded-3xl border border-gray-300 shadow px-3 sm:px-4 py-1.5 sm:py-2 bg-white outline-none text-[11px] sm:text-xs font-light focus:border-blue-500 transition duration-300"
                        placeholder="Write a Comment..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-3xl px-3 sm:px-5 py-1.5 sm:py-2 cursor-pointer bg-blue-700 text-white shadow hover:bg-blue-800 transition duration-300 shrink-0 text-xs sm:text-sm"
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            </div>
            {/* comment ko toggle karny ka leya hia // ya parent comment ka leya hai  */}
            <div className="w-full max-w-[580px] flex flex-col items-center space-y-3 pt-2 px-4 sm:px-0 mx-2 sm:mx-0">
              {commentData.map((item) => (
                <Comment_List
                  key={item.id}
                  postId={id}
                  comment={item}
                  refreshComments={fetchCommen}
                  depth={0}
                  onCommentAdd={POST}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* share */}
      {share && (
        <div className="inset-0 z-[999] fixed flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-0">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-[440px] p-4 sm:p-6 relative flex flex-col ">
            {/* Header with Title and Close Button */}
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Share post</h3>
              <button
                onClick={() => setShare(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Social Share Icons Grid */}
            <div className="py-4 sm:py-6 flex justify-around items-center gap-1 sm:gap-2 overflow-x-auto">
              {/* WhatsApp */}
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0">
                <WhatsappShareButton
                  url={ShareUrl}
                  title={PostTitle}
                  separator=" - "
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 ">
                    <WhatsappIcon size={40} round={true} className="sm:hidden" />
                    <WhatsappIcon size={48} round={true} className="hidden sm:block" />
                  </div>
                </WhatsappShareButton>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  WhatsApp
                </span>
              </div>

              {/* Facebook */}
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0">
                <FacebookShareButton url={ShareUrl} quote={PostTitle}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <FacebookIcon size={40} round={true} className="sm:hidden" />
                    <FacebookIcon size={48} round={true} className="hidden sm:block" />
                  </div>
                </FacebookShareButton>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  Facebook
                </span>
              </div>

              {/* Twitter / X */}
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0">
                <TwitterShareButton url={ShareUrl} title={PostTitle}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <TwitterIcon size={40} round={true} className="sm:hidden" />
                    <TwitterIcon size={48} round={true} className="hidden sm:block" />
                  </div>
                </TwitterShareButton>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  Twitter
                </span>
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0">
                <LinkedinShareButton url={ShareUrl} title={PostTitle}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <LinkedinIcon size={40} round={true} className="sm:hidden" />
                    <LinkedinIcon size={48} round={true} className="hidden sm:block" />
                  </div>
                </LinkedinShareButton>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  LinkedIn
                </span>
              </div>

              {/* Reddit */}
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0">
                <RedditShareButton url={ShareUrl} title={PostTitle}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <RedditIcon size={40} round={true} className="sm:hidden" />
                    <RedditIcon size={48} round={true} className="hidden sm:block" />
                  </div>
                </RedditShareButton>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  Reddit
                </span>
              </div>
            </div>

            {/* Copy Link Input Section */}
            <div className="flex items-center justify-between border border-gray-300 rounded-xl px-2 sm:px-3 py-2 bg-gray-50 mt-2">
              <input
                type="text"
                readOnly
                value={ShareUrl}
                className="bg-transparent text-[10px] sm:text-xs text-gray-600 w-full outline-none truncate mr-2"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ShareUrl);
                  alert("Link copied to clipboard!");
                }}
                className="bg-black hover:bg-gray-800 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Post_details;

// ya part image ka slider ko handle karny ka leya hai
// const [currentIndex, setCurrenIndex] = useState(0)
// next image ka leya
// const Images = [
//     realApi.image1,
//     realApi.image2,
//     realApi.image3,
//     realApi.image4,
//     realApi.image5,
//     realApi.image6,
// ].filter(Boolean)

// next images ka leya ya functin hai
// const nextImage = () => {
//     setCurrenIndex((prev) => (prev + 1) % Images.length)
// }
// ya functin pre image ka leya hai
// const PrevImage = () => {
//     setCurrenIndex((prev) => (prev == 0 ? Images.length - 1 : prev - 1))
// }

// ya part delete ka hai
