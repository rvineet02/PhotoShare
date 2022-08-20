import React, { useState, useCallback, useEffect } from "react";
import { PopularTag } from "../interfaces";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import { blue } from "@mui/material/colors";
import Box from "@mui/material/Box";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const PopularTags = () => {
    const [tags, setTags] = useState<PopularTag[]>([]);

    const getPopularTags = useCallback(async () => {
        const res = await axios.get("/tags/popular", {
            withCredentials: false,
        });
        if (res) setTags(res.data);
    }, []);

    useEffect(() => {
        getPopularTags();
    }, [getPopularTags]);

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
                    Most Popular Tags
                </Typography>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                    User
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: "bold" }}
                                    align="right"
                                >
                                    Num. of photos
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tags.map((row, key) => (
                                <TableRow
                                    key={key}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <a href={`/search/tags?search=${row.tag}`}>#{row.tag}</a>
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.count}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default PopularTags;
