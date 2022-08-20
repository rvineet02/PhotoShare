import { Grid, Box, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import React from "react";

import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { AlbumType } from "../interfaces";

interface PropTypes {
  album: AlbumType;
  del: boolean;
}

export default function AlbumPreview({ album, del }: PropTypes) {
  const handleDelete = (e: React.MouseEvent) => {
    // ALBUM IS DELETED (ONLY IN PROFILE TAB)
    if (!del) return;

    e.stopPropagation();
    axios.post(
      "/albums/delete",
      { album_id: album.album_id },
      {
        withCredentials: true,
      }
    );
  };

  const handleLink = (e: React.MouseEvent) => {
    // REDIRECT TO ALBUM'S PAGE
    e.stopPropagation();
    window.location.replace(`/album?album_id=${album.album_id}`);
  };

  return (
    <Grid
      item
      xs={6}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        textDecoration: "none",
      }}
      onClick={handleLink}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          cursor: "pointer",
          boxShadow: 1,
          "&:hover": {
            boxShadow: 3,
          },
        }}
      >
        {/* DELETE ICON (IF ON PROFILE) */}
        <Box
          sx={{
            position: "absolute",
            display: del ? "block" : "none",
            cursor: "pointer",
            zIndex: 10,
            top: 0,
            left: 0,
            p: 2,
            "&:hover": {
              color: red[500],
            },
          }}
        >
          <FaTrashAlt onClick={handleDelete} />
        </Box>

        {/* IMAGE GRID */}
        <Grid container columns={12}>
          {album.images.slice(0, 4).map((pic, key) => (
            <Grid
              key={key}
              item
              xs={6}
              sx={{
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ width: "100%" }}
                src={`http://127.0.0.1:5000/albums/imgs?album_id=${album.album_id}&filename=${pic.filename}`}
                loading="lazy"
                alt={pic.filename}
              />
            </Grid>
          ))}
        </Grid>

        {/* ALBUM NAME */}
        <Typography component="p" variant="h6" sx={{ pt: 2 }}>
          {album.album_name}
        </Typography>

        {/* AUTHER NAME */}
        <Typography
          component="p"
          variant="body1"
          sx={{ pb: 2, color: grey[600], fontStyle: "italic" }}
        >
          by {album.user_name}
        </Typography>
      </Box>
    </Grid>
  );
}
