// lazy or suspense react ka built in method for auto loading or sary page ko ik sath load hony sa rokny ka leay 
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// ya loader hai ja ma na alag page ma banya hai 
import { PageLoader } from "./Loading/Loader";

import Login from "./Pages/Login"
import Lay_out from "./Outlet/Lay_out";
import UseAblefunction from "./Context/UseAblefunction";

// yaha ma react ka built in loader uesr karo jo click hony par hi page ko render karta hia 
const Home = lazy(() => import("./Pages/Home"));
const Artical = lazy(() => import("./Pages/Artical"));
const Artical_Details = lazy(() => import("./Pages/PagesUI/Artical_Details"));
const Evalution = lazy(() => import("./Pages/Evalution"));
const Post_details = lazy(() => import("./Pages/Post_details"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const User_Search = lazy(() => import("./Pages/User_Search"));
const User = lazy(() => import("./Pages/User"));
const Flags = lazy(() => import("./Pages/Flags"));
const Blacklist = lazy(() => import("./Pages/Blacklist"));
const Suggestions = lazy(() => import("./Pages/Suggestions"));
const Chat_room_control = lazy(() => import("./Pages/Chat_room_control"));
const Announcement_banner = lazy(() => import("./Pages/Announcement_banner"));
const Rules_pages = lazy(() => import("./Pages/Rules_pages"));
const Export_Data = lazy(() => import("./Pages/Export_Data"));
const Billing = lazy(() => import("./Pages/Billing"));
const Limits = lazy(() => import("./Pages/Limits"));
const Support = lazy(() => import("./Pages/Support"));
const FeedBack = lazy(() => import("./Pages/FeedBack"));
const AliPay = lazy(() => import("./Pages/AliPay"));
const Reviews = lazy(() => import("./Pages/Reviews"));
const WebDeveloper = lazy(() => import("./Pages/WebDeveloper"));
const Refund = lazy(() => import("./Pages/Refund"));
const Tools = lazy(() => import("./Pages/Tools"));
const Subscription = lazy(() => import("./Pages/Subscription"));
const Re_subscription = lazy(() => import("./Pages/PagesUI/Re_subscription"));
const Post_Update = lazy(() => import("./Pages/PagesUI/Post_Update"));

function App() {
  return (
    <>
      <BrowserRouter>

        <UseAblefunction>
          {/* agar page load na ho to loader ho ga  */}
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* / par Home show hoga */}
              <Route path="/" element={<Navigate to="/Home" replace />} />

              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* layout */}
              <Route path="/Home" element={<Lay_out />}>

                {/* home page */}
                <Route index element={<Home />} />

                {/* artical */}
                <Route path="artical" element={<Artical />} />

                {/* ya part artical ki details ka hai */}
                <Route path="artical_Details/:id" element={<Artical_Details />} />

                {/* evalution */}
                <Route path="evalution" element={<Evalution />} />

                {/* post details page */}
                <Route path="post_details/:id" element={<Post_details />} />

                {/* Dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* User_Search */}
                <Route path="user_Search" element={<User_Search />} />

                {/* User */}
                <Route path="user" element={<User />} />

                {/* Flags */}
                <Route path="flags" element={<Flags />} />

                {/* Blacklist */}
                <Route path="blacklist" element={<Blacklist />} />

                {/* Suggestions */}
                <Route path="suggestions" element={<Suggestions />} />

                {/* Chat_room_control */}
                <Route path="chat_room_control" element={<Chat_room_control />} />

                {/* Announcement_banner */}
                <Route path="announcement_banner" element={<Announcement_banner />} />

                {/* Rules_pages */}
                <Route path="rules_pages" element={<Rules_pages />} />

                {/* Export_Data */}
                <Route path="export_Data" element={<Export_Data />} />

                {/* General */}
                {/* <Route path="general" element={<General />} /> */}

                {/* Team */}
                {/* <Route path="team" element={<Team />} /> */}

                {/* Billing */}
                <Route path="billing" element={<Billing />} />

                {/* limits */}
                <Route path="limits" element={<Limits />} />

                {/* Support */}
                <Route path="support" element={<Support />} />

                {/* Feedback */}
                <Route path="feedBack" element={<FeedBack />} />

                {/* AliPay */}
                <Route path="alipay" element={<AliPay />} />

                {/* Reviews */}
                <Route path="reviews" element={<Reviews />} />

                {/* WebDeveloper */}
                <Route path="webdeveloper" element={<WebDeveloper />} />

                {/* Refund */}
                <Route path="refund" element={<Refund />} />

                {/* Tools */}
                <Route path="tools" element={<Tools />} />

                {/* Subscription */}
                <Route path="subscription" element={<Subscription />} />

                {/* Re_subscription */}
                <Route path="re_subscription" element={<Re_subscription />} />
                {/* Post_Update */}
                <Route path="Post_Update/:id" element={<Post_Update />} />
              </Route>

            </Routes>
          </Suspense>
        </UseAblefunction>

      </BrowserRouter>
    </>
  )
}

export default App