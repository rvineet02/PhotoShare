import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box } from "@mui/system";
import React, { useState } from "react";
import axios from "axios";

import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";

interface PropTypes {
    photo_id: number;
}

export default function CommentField({ photo_id }: PropTypes) {
    const [typed, setTyped] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        // SUBMIT COMMENT
        e.preventDefault();
        axios
            .post(
                `/albums/comment`,
                { text: typed, photo_id },
                {
                    withCredentials: true,
                }
            )
            .then((res) =>
                res.data === "success"
                    ? window.location.reload()
                    : toast.error("Can't comment own your own picture")
            )

        setTyped("");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                gap: 1,
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="commentForm">Comment</InputLabel>
                <OutlinedInput
                    label="Comment"
                    id="commentForm"
                    fullWidth
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleSubmit}>
                                <IoMdSend
                                    style={{
                                        color:
                                            typed === ""
                                                ? "inherit"
                                                : blue[700],
                                    }}
                                />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Box>
    );
}
