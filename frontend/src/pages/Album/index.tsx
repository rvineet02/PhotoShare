import { Box, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { AlbumType, UserType } from "../../interfaces";
import Photo from "./Photo";

interface PropTypes {
  user: UserType | undefined;
}

export default function Album({ user }: PropTypes) {
  const [currImg, setImage] = useState(0);
  const [album, setAlbum] = useState<AlbumType>();
  const [album_id, setAlbumId] = useState<number>();

  const [user_is_owner, setUserIsOwner] = useState<boolean>(false);

  const getAlbumPics = async () => {
    // GET LIST OF PICTURES IN ALBUM
    const query = window.location.search;
    const res = await axios.get(`/albums${query}`, {
      withCredentials: true,
    });


    setAlbum(res.data);
    setUserIsOwner(res.data.user_id === user?.user_id)
  };

  useEffect(() => {
    const query = window.location.search;
    const params = new URLSearchParams(query);

    getAlbumPics();
    setAlbumId(Number(params.get("album_id")));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        background: blue[50],
      }}
    >
      <Box
        sx={{
          padding: 5,
          paddingTop: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "40%",
        }}
      >
        {/* IMAGE CAROUSSEL */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1">
            {album && album.album_name}
          </Typography>
          <Typography
            component="p"
            variant="body1"
            sx={{ pb: 3, pt: 1, color: grey[600], fontStyle: "italic" }}
          >
            by {album && album.user_name}
          </Typography>
          {album &&
            album.images &&
            album.images.map((img, key) => (
              <Photo
                current_user={user}
                user_name={album.user_name}
                album_id={album_id}
                image={img}
                display={key === currImg}
                key={key}
                id={key}
                edit={user_is_owner}
              />
            ))}
        </Box>

        {/* CAROUSSEL NAVIGATION */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <IoIosArrowRoundBack
            style={{ fontSize: "40px" }}
            onClick={() => setImage(Math.max(currImg - 1, 0))}
          />
          <IoIosArrowRoundForward
            style={{ fontSize: "40px" }}
            onClick={() =>
              setImage(
                Math.min(currImg + 1, (album && album.images.length - 1) || 0)
              )
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
