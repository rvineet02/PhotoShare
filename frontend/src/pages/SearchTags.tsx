import React, { useCallback, useState, useEffect } from "react";
import { blue, grey, red } from "@mui/material/colors";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { InputAdornment, TextField } from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { SearchTagResult } from "../interfaces";

const SearchTags = () => {
    const [results, setResults] = useState<SearchTagResult>();
    const [search, setSearch] = useState("");

    const searchTags = async (tag: string) => {
        // Search for query
        setSearch(tag);
        if (tag !== "") {
            const res = await axios.get("/search/tags", {
                params: { search: tag },
                withCredentials: true,
            });

            if (res) setResults(res.data);
        } else {
            setResults(undefined);
        }
    };

    const cardsMineTags = results?.mine.map((result) => {
        return (
            <a
                style={{ width: "47%", display: "block" }}
                href={`/album?album_id=${result.album_id}`}
            >
                <img
                    key={result.user_id}
                    src={`http://127.0.0.1:5000/albums/imgs?album_id=${result.album_id}&filename=${result.photo_location}`}
                    style={{ width: "100%", display: "block" }}
                    alt={result.photo_location}
                />
            </a>
        );
    });

    const cardsOtherTags = results?.others.map((result) => {
        return (
            <a
                style={{ width: "47%", display: "block" }}
                href={`/album?album_id=${result.album_id}`}
            >
                <img
                    key={result.user_id}
                    src={`http://127.0.0.1:5000/albums/imgs?album_id=${result.album_id}&filename=${result.photo_location}`}
                    style={{ width: "100%", display: "block" }}
                    alt={result.photo_location}
                />
            </a>
        );
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const populate = params.get("search");
        if (populate) searchTags(populate);
    }, []);

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
                    Search All Tags
                </Typography>

                {/* Search Bar */}
                <TextField
                    label="Search Tags..."
                    sx={{ width: "100%" }}
                    value={search}
                    onChange={(e) => searchTags(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <AiOutlineSearch style={{ fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography component="h3" variant="h5">
                        My Pictures
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        {cardsMineTags}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                    }}
                >
                    <Typography component="h3" variant="h5">
                        Other's Pictures
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        {cardsOtherTags}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SearchTags;
