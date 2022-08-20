import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useCallback, useEffect, useState } from "react";
import NewAlbum from "./NewAlbum";
import YourAlbums from "./YourAlbums";
import SearchBar from "./SearchBar";
import axios from "axios";
import { FriendType } from "../../interfaces";
import { log } from "console";

interface PropTypes {
  loggedIn: boolean;
}

export default function Profile({ loggedIn }: PropTypes) {
  const [friends, setFriends] = useState<FriendType[]>([]);

  const getFriends = useCallback(async () => {
    // Get list of friends
    // Using useCallback to avoid infinite rendering
    if (loggedIn) {
      const res = await axios.get("/friends", {
        withCredentials: true,
      });
      if (res) setFriends(res.data);
    }
  }, [loggedIn]);

  useEffect(() => {
    // Redirect to log in if not logged in
    if (!loggedIn) window.location.replace("/login");

    getFriends();
  }, [loggedIn, getFriends]);


  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: blue[50],
        paddingTop: "60px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxSizing: "border-box",
          padding: 5,
          width: "60%",
          height: "100%",
          background: "white",
        }}
      >
        <Typography component="h1" variant="h3">
          Your profile
        </Typography>

        {/* SEARCH BAR */}
        <Typography component="h2" variant="h4">
          Add/remove friends
        </Typography>
        <SearchBar friends={friends} getFriends={getFriends} />

        {/* CREATE A NEW ALBUM ALBUMS */}
        <Typography component="h2" variant="h4">
          Create a new album
        </Typography>
        <NewAlbum />

        {/* USER'S ALBUMS */}
        <Typography component="h2" variant="h4">
          Your albums
        </Typography>
        <YourAlbums />
      </Box>
    </Box>
  );
}
