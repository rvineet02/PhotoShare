import { Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AlbumPreview from "../../components/AlbumPreview";

export default function YourAlbums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // GET USER'S ALBUMS
    const getUserAlbums = async () => {
      const res = await axios.get("/albums/mine", {
        withCredentials: true,
      });

      if (res) setAlbums(res.data);
    };
    getUserAlbums();
  }, []);

  return (
    <Grid container justifyContent="center" columns={12} spacing={4}>
      {albums.map((a, key) => (
        <AlbumPreview album={a} key={key} del={true} />
      ))}
    </Grid>
  );
}
