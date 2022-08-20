import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nav from "./components/Nav";
import Profile from "./pages/Profile";
import Album from "./pages/Album";
import Active from "./pages/Active";
import SearchComments from "./pages/SearchComments";
import AlsoLike from "./pages/AlsoLike";
import FriendRecommend from "./pages/FriendRecommend";
import SearchTags from "./pages/SearchTags";
import PopularTags from "./pages/PopularTags";

import axios from "axios";

import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserType } from "./interfaces";



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';






axios.defaults.baseURL = "http://127.0.0.1:5000";

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const logIn = async () => {
      try {
        // Try getting user's info
        const res = await axios.get("/whoami", {
          withCredentials: true,
        });

        // If successful login -> store data and set state
        if (res) {
          setLoggedIn(true);
          setUser(res.data);
        }
      } catch (e) {
        // If not logged in -> reset data and set state
        setLoggedIn(false);
      }
      setLoaded(true);
    };
    logIn();
  }, []);

  // To avoid components depending on user to load
  if (!loaded) return <></>;

  return (
    <>
      <Nav user={user} loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Home loggedIn={loggedIn} />} />
        <Route path="/register" element={<Register loggedIn={loggedIn} />} />
        <Route path="/login" element={<Login loggedIn={loggedIn} />} />
        <Route path="/profile" element={<Profile loggedIn={loggedIn} />} />
        <Route path="/album" element={<Album user={user} />} />
        <Route path="/active" element={<Active />} />
        <Route path="/search/comments" element={<SearchComments />} />
        <Route path="/also-like" element={<AlsoLike />} />
        <Route path="/friend-recommendation" element={<FriendRecommend />} />
        <Route path="/search/tags" element={<SearchTags />} />
        <Route path="/tags/popular" element={<PopularTags />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
