import React, { useCallback, useState, useEffect } from "react";
import { blue, grey, red } from "@mui/material/colors";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { InputAdornment, List, TextField } from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { SearchComment } from "../interfaces";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SearchComments = () => {
    const [results, setResults] = useState<SearchComment[]>([]);

    const searchComments = async (comment: string) => {
        // Search for query
        if (comment !== "") {
            const res = await axios.get("/search/comments", {
                params: { search: comment },
                withCredentials: false,
            });

            if (res) setResults(res.data);
        } else {
            setResults([]);
        }
    };

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
                    Search All Comments
                </Typography>

                {/* Search Bar */}
                <TextField
                    label="Search friends..."
                    sx={{ width: "100%" }}
                    onChange={(e) => searchComments(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <AiOutlineSearch style={{ fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {results.length > 0 && <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>User</TableCell>
                                <TableCell sx={{fontWeight: "bold"}} align="right">Num. of comments</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((row, key) => (
                                <TableRow
                                    key={key}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.user_name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.NoOfComments}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </Box>
        </Box>
    );
};

export default SearchComments;
