import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AlbumPreview from "../../components/AlbumPreview";

export default function Feed({ loggedIn }: { loggedIn: boolean }) {
  const [albums, setAlbums] = useState([]);
  const [feedType, setFeedType] = useState("General");

  const getFriendFeed = async () => {
    // GET FRIEND'S POSTS
    setFeedType("Your friend's");

    const res = await axios.get("/albums/friends-feed", {
      withCredentials: true,
    });

    setAlbums(res.data);
  };

  const getGeneralFeed = async () => {
    // GET MOST RECENT POSTS
    setFeedType("General");

    const res = await axios.get("/albums/general-feed", {
      withCredentials: true,
    });

    if (res) setAlbums(res.data);
  };

  useEffect(() => {
    if (loggedIn) getFriendFeed();
    else getGeneralFeed();
  }, [loggedIn]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        {feedType} feed
      </Typography>
      <Grid container justifyContent="center" columns={12} spacing={4}>
        {albums.map((a, key) => (
          <AlbumPreview album={a} key={key} del={false} />
        ))}
      </Grid>
    </Box>
  );
}
