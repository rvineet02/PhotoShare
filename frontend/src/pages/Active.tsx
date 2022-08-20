import React, { useCallback, useState, useEffect } from "react";
import { blue } from "@mui/material/colors";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { ContributionType } from "../interfaces";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Active = () => {
    const [user, setUsers] = useState<ContributionType[]>([]);

    const getMostActiveUsers = useCallback(async () => {
        const res = await axios.get("/active", {
            withCredentials: false,
        });
        if (res) setUsers(res.data);
    }, []);

    useEffect(() => {
        getMostActiveUsers();
    }, [getMostActiveUsers]);

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
                    Most Active Users
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
                                    Number of contributions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.map((row, key) => (
                                <TableRow
                                    key={key}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.Final_Contribution}
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

export default Active;
