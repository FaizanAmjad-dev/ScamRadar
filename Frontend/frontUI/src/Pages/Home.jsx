import HomeAd from "./PagesUI/HomeAd";
import MainForm from "./MainForm";
import { PostSkeleton } from "../Loading/Loader";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoChatboxOutline } from "react-icons/io5";
import { CiRepeat } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsBarChart } from "react-icons/bs";
// comment context part
import { useContext, useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import ReadMore from "./PagesUI/ReadMore";
import anonymous from "../assets/anonymous.png";

// react toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

// zoom image section
import "react-medium-image-zoom/dist/styles.css";
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
import { MyContext } from "../Context/context";

function Home() {
  const loginuser = localStorage.getItem('username')
  // share
  const [ShareUrl, setShareUrl] = useState(null);
  const PostTitle = "ya post check kary";

  const currentToken = localStorage.getItem("access-token");
  const user = localStorage.getItem("superuser");
  // navigation for post detail page
  const navigation = useNavigate();
  // context api use ho rahi hai yaha par
  const { fetchNotifications, postedit, setPostedit } = useContext(MyContext);
  // ya post section ka leya hai
  const [home, setHome] = useState(false);
  // ya loadin ka leya hia 
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  // fix url 
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  const API = `${BASE_URL}/api/feed/`;

  // ya repeat api ki call ko rokny ka lay hai 
  const isFetchingRef = useRef(false);
  // ya part pagination ka leya hia 
  const [page, setPage] = useState(1)
  const [onhas, setOnhas] = useState(true)
  // ya part fetch ka hai
  // const API = "http://127.0.0.1:8000/api/feed/";
  const [FakeApi, setFakeApi] = useState([]);

  const POST = (inInitial = false, pageNumber = 1) => {
    if (inInitial) setLoading(true);

    fetch(`${API}?page=${pageNumber}`, {
      headers: currentToken
        ? {
          Authorization: `jwt ${currentToken}`,
        }
        : {},
    })
      .then((res) => {
        // agar backend say page na mila to page ko rook do
        if (res.status === 404) {
          setOnhas(false);
          return null;
        }

        if (res.status === 401) {
          localStorage.removeItem("access-token");
          return fetch(`${API}?page=${pageNumber}`).then((r) => r.json());
        }
        return res.json();
      })
      .then((data) => {
        // agar 404 shuru ma agya ho to 
        if (!data) return;

        const postarry = Array.isArray(data) ? data : (data?.results || [])
        if (pageNumber === 1) {
          setFakeApi(postarry)
        }
        else { setFakeApi((oldData) => [...oldData, ...postarry]) }
        setOnhas(data?.next !== null);
      })
      .finally(() => {
        setLoading(false)
        isFetchingRef.current = false
      })
  };

  useEffect(() => {
    POST(true, 1);
  }, []);

  // yaha par search part hai
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPosts = FakeApi.filter((items) => {
    const post = items?.post;
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    const Number = String(post?.username || post?.user?.username || "").toLowerCase().includes(query);
    const PayPal = String(post?.paypal || "").toLowerCase().includes(query);
    const Name = String(post?.user?.username || "").toLowerCase().includes(query);
    const Post = String(post?.text || "").toLowerCase().includes(query);
    const Email = String(post?.email || post?.user?.email || "").toLowerCase().includes(query);

    return (Number || PayPal || Name || Post || Email)
  });

  // ya pagination ka leya useefect hia 
  useEffect(() => {
    const handleScroll = () => {
      if (searchQuery.trim() !== "") return;

      const bottom = window.innerHeight + window.scrollY
        >= document.documentElement.scrollHeight - 300;

      if (bottom && !loading && onhas && !isFetchingRef.current) {
        // is ka kam hai data any tak sury functin ko rok kay rakna jay mazedd request backend ko na send hony dany 
        isFetchingRef.current = true
        const nextpage = page + 1;
        setPage(nextpage);
        POST(false, nextpage);
      }
    };

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)

  }, [page, loading, onhas, searchQuery])



  // ya part websocke ka hia 
  useEffect(() => {
    const wsProtocol = document.location.protocol === 'https:' ? "wss:" : "ws:"
    const wsHost = new URL(BASE_URL).host
    const websocket = new WebSocket(`${wsProtocol}//${wsHost}/ws/homefeed/`)

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // Naya Post aane par feed ke shuru mein add kar do
      if (data.kind === 'post_created') {
        const newPost = data.payload || data;
        const feedItem = {
          is_repost: false,
          timestamp: newPost.createdat,
          post: newPost,
          repost_user: null,
        };
        setFakeApi((prev) => [feedItem, ...prev]);
      }

      //  ya part like ka leya hia 
      if (data.kind === 'like') {
        setFakeApi((prev) =>
          prev.map((item) => {
            if (item.post?.id === data.post_id) {
              return {
                ...item,
                post: { ...item.post, like: data.count }
              }
            }
            return item;
          })
        )
      }
      // Repost remove ya add ka leya 
      if (data.kind === 'repost') {
        setFakeApi((prev) =>
          prev.map((item) => {
            if (item.post?.id === data.post_id) {
              return {
                ...item,
                post: { ...item.post, repost: data.count }
              }
            }
            return item;
          })
        )
      }
      //  ya par commet ka leya hai 
      if (data.kind === 'comment' || data.kind === 'comment_deleted') {
        setFakeApi((prev) =>
          prev.map((item) => {
            if (item.post?.id === data.post_id) {
              return {
                ...item,
                post: { ...item.post, comment: data.count }
              };
            }
            return item;
          })
        );
      }

      // ya view ko live update ka leay hai 
      if (data.kind === 'view') {
        setFakeApi((prev) =>
          prev.map((item) => {
            if (item.post?.id === data.post_id) {
              return {
                ...item,
                post: { ...item.post, views: data.count }
              };
            }
            return item;
          })
        );
      }
    }
    // agar user page ko close karta hai ya dosry page cahala jata hai to 
    return () => {
      websocket.close()
    }
  }, [])


  // post Banned karny ka function
  const Banned = async (id, currentStatus) => {
    const API = `${BASE_URL}/api/post/`;
    // const API = "http://127.0.0.1:8000/api/post/";
    const main = await fetch(`${API}${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `jwt ${currentToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isBanned: !currentStatus,
        Status: "Banned",
        risk: "High",
      }),
    });
    if (main.ok) {
      fetch(`${BASE_URL}/api/evalution/`, {
        method: "POST",
        headers: {
          Authorization: `jwt ${currentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: id,
        }),
      });
      POST(false, 1);
    }
  };

  // ya part delete ka hai
  const DeletePost = (id) => {
    const API = `${BASE_URL}/api/post/`;
    // const API = "http://127.0.0.1:8000/api/post/";
    fetch(`${API}${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `jwt ${currentToken}`,
      },
    }).then((res) => {

      if (res.ok) {

        // Home feed se post immediately remove
        setFakeApi((prev) =>
          prev.filter((item) => item.post?.id !== id)
        );

        toast.success("Post deleted");
      } else {
        toast.error("Post delete nahi hui");
      }

    });
  };

  // ya function repost ka hai
  const RepostAPI = `${BASE_URL}/api/repost/`;
  // const RepostAPI = "http://127.0.0.1:8000/api/repost/";
  const handleRepost = async (postId) => {
    if (!currentToken) {
      toast.error("Please login first");
      window.location.href = "/login"

      return;
    }
    const res = await fetch(RepostAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `jwt ${currentToken}`,
      },
      body: JSON.stringify({
        post: postId,
      }),
    });

    if (res.ok) {
      // direct repost ko update karny ka leya
      setFakeApi((prv) => {
        return prv.map((item) => {
          if (item.post?.id !== postId) return item;
          const wasReposted = item.post.is_repost;
          return {
            ...item,
            post: {
              ...item.post,
              is_like: !item.post.is_like,
            },
          };
        }
        );
      });
      fetchNotifications();
      toast.success("Successfully");
    }

  };


  // ya function like ka hai
  const likeAPi = `${BASE_URL}/api/like/`;
  // const likeAPi = "http://127.0.0.1:8000/api/like/";
  const handleLike = async (postId) => {
    if (!currentToken) {
      toast.error("Please login first");
      window.location.href = "/login"

      return;
    }

    const res = await fetch(likeAPi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `jwt ${currentToken}`,
      },
      body: JSON.stringify({
        post: postId,
      }),
    })
    if (res.ok) {
      setFakeApi((prev) =>
        prev.map((item) => {
          if (item.post?.id !== postId) return item;

          const wasLiked = item.post.is_like;
          return {
            ...item,
            post: {
              ...item.post,
              is_like: !item.post.is_like
            },
          };
        })
      );
      fetchNotifications();
    }
  };


  const ViewAPI = `${BASE_URL}/api/view/`;

  // ya funciton view ka leya hai
  // const ViewAPI = "http://127.0.0.1:8000/api/view/";
  const handleView = async (postId) => {

    fetch(ViewAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `jwt ${currentToken}`,
      },
      body: JSON.stringify({
        post: postId,
      }),
    }).then((res) => res.json());
  };

  // ya funciton post ko bann karny ka leya hai
  const handleHidden = async (id) => {
    if (!currentToken) {
      toast.error("Please login first");
      window.location.href = "/login"
      return;
    }

    const API = `${BASE_URL}/api/hidden/`;
    const main = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `jwt ${currentToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: id,
      }),
    });
    if (main.ok) {
      setFakeApi((prev) =>
        prev.filter((item) => item.post?.id !== id)
      );

      toast.success("Post hidden");
    }
  };

  // ya funciton toggel ko auto close karny ka leya hai
  const editref = useRef(null);
  useEffect(() => {
    const handleClickEvent = (event) => {
      if (editref.current && !editref.current.contains(event.target)) {
        setPostedit(null);
      }
    };
    if (postedit !== null) {
      document.addEventListener("mousedown", handleClickEvent);
    }
    // data leak or browser slow hony sa backny ka leay is ko close karna remove karn zaruri ahi
    return () => {
      document.removeEventListener("mousedown", handleClickEvent);
    };
  }, [postedit]);

  // ya part form open hony ka bad page scrool ko rokny ka leya hia 
  useEffect(() => {
    if (home || ShareUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [home, ShareUrl]);

  return (
    <>
      {loading ? (
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
        <div className="relative overflow-y-hidden box-border overflow-hidden min-h-screen bg-white border border-gray-200 border-t-0 rounded-b-xl pb-10">
          {/* first div */}
          <ToastContainer position="top-center" autoClose={3000} />
          {/* second div /center items*/}
          <div className="w-full flex flex-col">
            {/* Ad Section */}
            <div className="p-0.5 px-2 sm:px-0">
              <HomeAd />
            </div>

            {/* Search and Content/post section */}
            <div>
              {/* search section */}
              <div className="w-full flex justify-center py-4">
                <form onSubmit={(e) => e.preventDefault()} className="relative w-[90%] sm:w-[400px] md:w-[580px]" action="">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none text-sm md:text-base">
                    🔍
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="search"
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-xs sm:text-sm md:text-base shadow-sm outline-none transition "
                    placeholder="Search by Name, Post, Phone or PayPal..."
                  />
                </form>
              </div>

              {/* Post section */}
              {loading ? (
                <div className="w-full mx-auto sm:max-w-[580px] space-y-4">
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="">
                  {filteredPosts.map((items, index) => {
                    // is ma post ka data nikal leya hai
                    const post = items.post;
                    // ya repost ka data nikal leay hai
                    const repostUser = items.repost_user;

                    if (!post) return null;
                    return (
                      <div
                        key={index}
                        className="w-full mx-auto border-b-2 border-gray-300 px-2 py-2 sm:py-4 sm:px-4 bg-white sm:max-w-[580px] h-auto "
                      >
                        {/* Repost show */}
                        {repostUser && (
                          <div className="w-full flex items-center border-b pb-0.5 border-gray-400/60">
                            {/* image */}
                            <span className={`w-5 h-5 overflow-hidden rounded-full mr-1 bg-gray-400
                            ${!loadedImages[`${repostUser.id}-Userpic`] ? "animate-pulse " : ""}
                            `}>
                              <img
                                loading="lazy"
                                src={repostUser.Userpic}
                                onLoad={() => {
                                  setLoadedImages((prev) => ({
                                    ...prev, [`${repostUser.id}-Userpic`]: true
                                  }))
                                }}
                                alt=""
                                className={`w-full h-full object-cover
                                 ${loadedImages[`${repostUser.id}-Userpic`] ? "opacity-100 " : "opacity-0"}
                                `}
                              />
                            </span>
                            {/* who repost this */}
                            <span className="font-semibold text-xs text-gray-600 sm:text-sm mr-1">
                              {repostUser.username}
                            </span>
                            {/* text Scection */}
                            <span className="text-xs sm:text-sm text-gray-400">
                              reposted this
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-1">
                          {/* first detail */}
                          <div className="flex gap-x-2">
                            {/*profile logo */}
                            {post.anonymous ? (
                              <div className="w-8 h-8 sm:w-10 rounded-full sm:h-10 overflow-hidden shadow flex justify-center items-center">
                                <img
                                  src={anonymous}
                                  loading="lazy"
                                  alt=""
                                  className="object-fill w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className={`w-8 h-8 sm:w-10 rounded-full sm:h-10 overflow-hidden shadow flex justify-center items-center bg-gray-400
                            ${!loadedImages[`${post.id}-userPic`] ? "animate-pulse" : ""}
                            `}>
                                <img
                                  src={post?.userPic}
                                  loading="lazy"
                                  onLoad={() => {
                                    setLoadedImages((prev) => ({
                                      ...prev, [`${post.id}-userPic`]: true
                                    }))
                                  }}
                                  alt=""
                                  className={`object-fill w-full h-full ${loadedImages[`${post.id}-userPic`] ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                              </div>
                            )}

                            {/* name /date part */}
                            <div className="flex flex-col">
                              {/* name and email */}
                              {post?.anonymous ? (
                                <div className="flex gap-x-1 items-center justify-center">
                                  {/* user name */}
                                  <span>
                                    <h1 className="font-semibold text-sm sm:text-base">Anonymous</h1>
                                  </span>
                                  {/* user email */}
                                  <span>
                                    <p className="text-gray-400 font-semibold text-xs sm:text-sm">
                                      Anonymous@gmail.com
                                    </p>
                                  </span>
                                </div>
                              ) : (
                                <div className="flex gap-x-1 items-center justify-center">
                                  {/* user name */}
                                  <span>
                                    <h1 className="font-semibold text-gray-600 text-sm sm:text-base">
                                      {post?.username}
                                    </h1>
                                  </span>
                                  {/* user email */}
                                  <span>
                                    <p className="text-gray-400 text-xs sm:text-sm">
                                      {post.email}
                                    </p>
                                  </span>
                                </div>
                              )}
                              {/* date/time */}
                              <span>
                                <p className="text-gray-400 text-xs sm:text-xs">
                                  {new Date(post?.createdat).toDateString()}
                                </p>
                              </span>
                            </div>
                          </div>



                          {/* user ban part */}
                          <div className="flex justify-center items-center gap-3">
                            {/* ban button */}
                            <span>
                              {user === "true" ? (
                                <button
                                  onClick={() =>
                                    Banned(
                                      post?.id || items?.id,
                                      post?.isBanned || items?.isBanned,
                                    )
                                  }
                                  className="cursor-pointer  rounded-xl sm:rounded-3xl px-1.5 sm:px-3 sm:text-base text-xs py-1 bg-yellow-500 text-white shrink-0 "
                                >
                                  Ban User
                                </button>
                              ) : (
                                <div className="px-3 py-1"></div>
                              )}
                            </span>


                            {/* Edit /share /remove/hide  */}
                            {!repostUser && (
                              <span
                                ref={postedit === post.id ? editref : null}
                                className="relative"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPostedit(
                                      postedit === post.id ? null : post.id,
                                    );
                                  }} className="cursor-pointer">
                                  <HiOutlineDotsVertical />
                                </button>

                                {/* Update and send */}
                                <div className={`origin-top-right transition-transform duration-500 ease-out absolute right-0 top-8 bg-white border border-gray-200 shadow-lg rounded-lg py-1 w-18 sm:w-28 z-50 flex flex-col text-xs font-medium text-gray-700
                                ${postedit === post.id ? "scale-100 visible opacity-100" : "invisible scale-90 opacity-0"}
                                `}>
                                  {currentToken && loginuser === post.username && (
                                    <button
                                      onClick={() => navigation(`/Home/post_update/${post.id}`)}
                                      className="text-left text-xs text-gray-600 sm:text-base sm:px-4 sm:py-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer">
                                      Update
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPostedit(null); // Close the dropdown menu
                                      setShareUrl(
                                        `${window.location.origin}/Home/post_details/${post.id}`,
                                      );
                                    }}
                                    className="text-left text-xs text-gray-600 sm:text-base sm:px-4 sm:py-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                                  >
                                    Share
                                  </button>
                                  {currentToken && loginuser !== post.username ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPostedit(null);
                                        handleHidden(post.id);
                                      }}
                                      className="text-left text-xs text-gray-600 sm:text-base sm:px-4 sm:py-2 px-2 py-1.5  hover:bg-gray-100 cursor-pointer"
                                    >
                                      Hide
                                    </button>
                                  ) :
                                    (
                                      null
                                    )}
                                  {currentToken && (loginuser === post.username || user === "true") && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPostedit(null);
                                        DeletePost(post.id);
                                      }}
                                      className="text-left text-xs text-gray-600 sm:text-base sm:px-4 sm:py-2 px-2 py-1.5  text-red-600 hover:bg-gray-100 cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* text section */}
                        <div
                          onClick={() => {
                            handleView(post?.id);
                            navigation(`/Home/post_details/${post.id}`);
                          }}
                          className="cursor-pointer mt-2 sm:mt-4 w-full"
                        >
                          <p className="w-full hover:bg-gray-100 rounded p-1 break-words whitespace-pre-wrap sm:text-base text-sm text-gray-600">
                            <ReadMore letter={post?.text} />
                          </p>
                        </div>
                        {/* image section */}
                        <div className="w-full">
                          <div className="flex justify-center mt-2 sm:mt-4 mb-2 sm:mb-4 w-full">
                            <div className="w-full max-w-[580px] h-[260px] sm:h-[380px] rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-1.5">

                              {/* Image 1 */}
                              {post?.image1 && (
                                <div className={`w-full h-full overflow-hidden bg-gray-400 
                              ${!loadedImages[`${post.id}-image1`] ? "animate-pulse blur-sm" : ""}
                              `}>
                                  <img
                                    loading="lazy"
                                    src={post.image1}
                                    onLoad={() => {
                                      setLoadedImages((prev) => ({
                                        ...prev, [`${post.id}-image1`]: true
                                      }))
                                    }}
                                    alt=""
                                    className={`w-full h-full object-cover cursor-pointer
                                     ${loadedImages[`${post.id}-image1`] ? "opacity-100" : "opacity-0"}
                                    `}
                                  />
                                </div>
                              )}

                              {/* Image 2 */}
                              {post?.image2 && (
                                <div className={`w-full h-full overflow-hidden bg-gray-400 
                              ${!loadedImages[`${post.id}-image2`] ? "animate-pulse blur-sm" : ""}
                              `}>
                                  <img
                                    loading="lazy"
                                    src={post.image2}
                                    onLoad={() => {
                                      setLoadedImages((prev) => ({
                                        ...prev, [`${post.id}-image2`]: true
                                      }))
                                    }}
                                    alt=""
                                    className={`w-full h-full object-cover cursor-pointer
                                     ${loadedImages[`${post.id}-image2`] ? "opacity-100" : "opacity-0"}
                                    `}
                                  />
                                </div>
                              )}

                              {/* Image 3 */}
                              {post?.image3 && (
                                <div className={`w-full h-full overflow-hidden bg-gray-400 
                              ${!loadedImages[`${post.id}-image3`] ? "animate-pulse blur-sm" : ""}
                              `}>
                                  <img
                                    loading="lazy"
                                    src={post.image3}
                                    onLoad={() => {
                                      setLoadedImages((prev) => ({
                                        ...prev, [`${post.id}-image3`]: true
                                      }))
                                    }}
                                    alt=""
                                    className={`w-full h-full object-cover cursor-pointer
                                     ${loadedImages[`${post.id}-image3`] ? "opacity-100" : "opacity-0"}
                                    `}
                                  />
                                </div>
                              )}

                              {/* Image 4  */}
                              {post?.image4 && (
                                <div className={`w-full h-full overflow-hidden relative bg-gray-400
                              ${!loadedImages[`${post.id}-image4`] ? "animate-pulse blur-sm" : ""}
                              `}>
                                  <img
                                    loading="lazy"
                                    src={post.image4}
                                    onLoad={() => {
                                      setLoadedImages((prev) => ({
                                        ...prev, [`${post.id}-image4`]: true
                                      }))
                                    }}
                                    alt=""
                                    className={`w-full h-full object-cover cursor-pointer
                                     ${loadedImages[`${post.id}-image4`] ? "opacity-100" : "opacity-0"}
                                    `}
                                  />

                                  {(post?.image5 || post?.image6) && (
                                    <button
                                      loading="lazy"
                                      onClick={() => {
                                        handleView(post?.id);
                                        navigation(`/Home/post_details/${post?.id}`);
                                      }}
                                      className="absolute bg-black/40 inset-0 backdrop-blur-[1px] flex justify-center items-center cursor-pointer"
                                    >
                                      <span className="text-white text-center text-3xl font-bold">
                                        +
                                        {
                                          [post?.image5, post?.image6].filter(Boolean)
                                            .length
                                        }
                                      </span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* last comment and repost like and views */}
                        <div className="flex justify-start items-center gap-x-3 sm:gap-x-4">
                          {/* Comment section */}
                          <div className="flex justify-center items-center text-gray-600 gap-x-1">
                            {/*icons */}
                            <button
                              onClick={() => {
                                handleView(post?.id);
                                navigation(`/Home/post_details/${post?.id}`);
                              }}
                              className="cursor-pointer"
                            >
                              <IoChatboxOutline className="text-sm sm:text-xl" />
                            </button>
                            {/* total comment */}
                            <span>
                              <p className="text-xs sm:text-sm font-semibold">
                                {post?.comment}
                              </p>
                            </span>
                          </div>

                          {/* repost section */}
                          <div className="flex justify-center items-center text-gray-600 gap-x-1">
                            <button
                              onClick={() => handleRepost(post?.id)}
                              className="cursor-pointer"
                            >
                              <CiRepeat
                                className={`text-sm sm:text-xl transition-colors duration-200 ${post.is_repost
                                  ? "text-green-600 fill-green-600 font-bold"
                                  : "text-gray-600 font-bold"
                                  }`}
                              />
                            </button>
                            {/* total repost */}
                            <span>
                              <p className="text-xs sm:text-sm font-semibold">
                                {post?.repost}
                              </p>
                            </span>
                          </div>

                          {/* like section */}
                          <div className="flex justify-center items-center text-gray-600 gap-x-1">
                            <button
                              onClick={() => handleLike(post?.id)}
                              className="cursor-pointer"
                            >
                              <IoIosHeartEmpty
                                className={`text-sm sm:text-xl transition-colors duration-200 ${post.is_like
                                  ? "text-red-600 fill-red-600 font-bold"
                                  : "text-gray-600 font-bold"
                                  }`}
                              />
                            </button>
                            {/* total like */}
                            <span>
                              <p className="text-xs sm:text-sm font-semibold">
                                {post?.like}
                              </p>
                            </span>
                          </div>
                          {/* views section section */}
                          <h1 className="flex justify-center items-center text-gray-600 gap-x-1">
                            <span className="cursor-pointer">
                              <BsBarChart className="text-sm sm:text-xl" />
                            </span>
                            {/* total views */}
                            <span>
                              <p className="text-xs sm:text-sm font-semibold">
                                {post?.views}
                              </p>
                            </span>
                          </h1>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                searchQuery.trim() !== "" ? (
                  <div className="max-w-xl mx-auto bg-green-100 text-sm sm:text-base mt-4 text-green-800 p-2 break-words sm:p-4 rounded-xl shadow text-center mb-8">
                    🎉 This person seems honest! No scam reports found.
                  </div>
                ) : (
                  !loading && (
                    <div className="text-center text-gray-500 py-10">
                      No posts available right now.
                    </div>
                  )
                )
              )}
              {/* ya loader hai more post keay leya */}
              {loading && (
                <div className="flex justify-center items-center py-6">
                  <div className="inline-flex items-center text-gray-700 bg-white border border-gray-200 shadow-sm font-medium rounded-lg text-sm px-4 py-2">
                    <span className="w-4 h-4 me-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    Loading more posts...
                  </div>
                </div>
              )}
              {/* ya rokny ka lya hia taky pata chal saky itni hi post hia  */}
              {!onhas && filteredPosts.length > 0 && (
                <p className="text-center text-gray-400 my-6 text-sm">
                  No more posts to load.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* floating form botton  */}
      {currentToken && (
        <div className="fixed box-border bottom-16 sm:bottom-5 right-4 sm:right-6 z-[999]">
          {!home && (
            <button
              onClick={() => setHome(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white sm:px-4 px-2 text-xs sm:text-base py-2
                  rounded-full shadow-2xl font-semibold flex items-center gap-2 transition duration-200"
            >
              + Create Post
            </button>
          )}
          {home && (
            <>
              <div
                onClick={() => setHome(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 right-0 z-[999] w-[92vw] sm:w-[450px] max-w-[610px]"
              >
                <div className="relative">
                  <button
                    onClick={() => setHome(false)}
                    className="absolute -top-3 -right-3 z-50 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md hover:bg-black transition-colors cursor-pointer"
                  >
                    ×
                  </button>

                  <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden bg-white rounded-2xl shadow-2xl border border-slate-200">
                    <MainForm
                      onPostCreated={() => {
                        setHome(false);
                        POST();
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <>
        {ShareUrl && (
          <div className="inset-0 z-[999] fixed flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-[440px] p-4 sm:p-6 relative flex flex-col max-h-[90vh] overflow-y-auto">
              {/* Header with Title and Close Button */}
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Share post</h3>
                <button
                  onClick={() => setShareUrl(!ShareUrl)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Social Share Icons Grid */}
              <div className="py-4 sm:py-6 flex justify-around items-center gap-1 sm:gap-2 overflow-x-auto">
                {/* WhatsApp */}
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer shrink-0">
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
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer shrink-0">
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
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer shrink-0">
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
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer shrink-0">
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
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer shrink-0">
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
                  className="bg-transparent text-[10px] sm:text-xs text-gray-600 w-full outline-none mr-2 truncate"
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

    </>
  );
}
export default Home;
