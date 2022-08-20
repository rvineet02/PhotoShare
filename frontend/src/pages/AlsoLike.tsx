import React, { useState, useCallback, useEffect } from "react";
import { MightLikePhoto } from "../interfaces";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
const AlsoLike = () => {
    const [photos, setPhotos] = useState<MightLikePhoto[]>();

    const getPhotos = useCallback(async () => {
        const res = await axios.get("/recommendations/photos", {
            withCredentials: true,
        });
        if (res) setPhotos(res.data);
    }, []);

    useEffect(() => {
        getPhotos();
    }, [getPhotos]);

    const mightLikePhotos = photos?.map((photo, index) => {
        return (
            <a
                style={{ width: "47%", display: "block" }}
                href={`/album?album_id=${photo.album_id}`}
            >
                <img
                    key={index}
                    src={`http://127.0.0.1:5000/albums/imgs?album_id=${photo.album_id}&filename=${photo.photo_location}`}
                    style={{ width: "100%", height: "auto" }}
                    alt={photo.photo_location}
                />
            </a>
        );
    });

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: blue[50],
                paddingTop: "60px",
                height: "150vh",
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
                    Recommended Photos
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                >
                    {mightLikePhotos}
                </Box>
            </Box>
        </Box>
    );
};

export default AlsoLike;
