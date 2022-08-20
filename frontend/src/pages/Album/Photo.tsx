import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

import { ImageType, UserType } from "../../interfaces";
import Comment from "./Comment";
import CommentField from "./CommentField";

import { FaTrashAlt } from "react-icons/fa";
import { red } from "@mui/material/colors";
import { toast } from "react-toastify";
import EditAlbum from "./EditAlbum";

interface PropTypes {
    current_user: UserType | undefined;
    album_id: number | undefined;
    image: ImageType;
    user_name: string;
    display: boolean;
    id: number;
    edit: boolean;
}

export default function Photo({
    current_user,
    album_id,
    image,
    user_name,
    display,
    id,
    edit,
}: PropTypes) {
    const [liked, setLiked] = useState(false);
    const [popup, setPopup] = useState(false);

    const handleLike = () => {
        // WHEN USER CLICKS HEART ICON
        axios
            .post(
                `/albums/like`,
                { photo_id: image.photo_id, value: !liked },
                {
                    withCredentials: true,
                }
            )
            .then((res) =>
                res.data === "success"
                    ? window.location.reload()
                    : toast.error("Can't like your own picture")
            )
            .catch(() =>
                toast.error("You need to be logged in to like a picture")
            );
    };

    const handleDelete = () => {
        axios.post(
            `/albums/delete-photo`,
            { photo_id: image.photo_id },
            {
                withCredentials: true,
            }
        );
    };

    useEffect(() => {
        if (current_user === undefined) return;

        const userLiked = image.likes.includes(
            `${current_user.first_name} ${current_user.last_name}`
        );

        setLiked(userLiked);
    }, [image, current_user]);

    return (
        <>
            <Box
                sx={{
                    flexDirection: "column",
                    display: display ? "block" : "none",
                }}
            >
                <Box
                    style={{
                        display: "flex",
                        position: "relative",
                        width: "500px",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    {/* DELETE IMAGE */}
                    <Box
                        sx={{
                            position: "absolute",
                            display: edit ? "block" : "none",
                            zIndex: 10,
                            top: 0,
                            left: 0,
                            cursor: "pointer",
                            p: 1,
                            "&:hover": {
                                color: red[500],
                            },
                        }}
                    >
                        <FaTrashAlt onClick={handleDelete} />
                    </Box>

                    {/* EDIT IMAGE */}
                    <Box
                        sx={{
                            position: "absolute",
                            display: edit ? "block" : "none",
                            zIndex: 10,
                            top: 0,
                            left: 10,
                            cursor: "pointer",
                            p: 1,
                            ml: 3,
                            "&:hover": {
                                color: red[500],
                            },
                        }}
                    >
                        <IoMdAddCircle onClick={() => setPopup(true)} />
                    </Box>

                    {/* IMAGE */}
                    <img
                        src={`http://127.0.0.1:5000/albums/imgs?&album_id=${album_id}&filename=${image.filename}`}
                        style={{ width: "100%" }}
                        alt={image.filename}
                    />

                    {/* COMMENT AND LIKE ICONS */}
                    <Box sx={{ display: "flex", gap: 2, my: 1 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.25,
                            }}
                            onClick={handleLike}
                        >
                            {liked ? (
                                <FaHeart style={{ color: "red" }} />
                            ) : (
                                <FaRegHeart />
                            )}
                            {image.num_likes}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.25,
                            }}
                        >
                            <FaRegComment />
                            {image.num_comments}
                        </Box>
                    </Box>

                    {/* COMMENT LIST */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            my: 2,
                            width: "100%",
                        }}
                    >
                        <Comment
                            user={user_name}
                            comment={image.caption}
                            isTitle={true}
                        />
                        {image.comments?.map((c, key) => (
                            <Comment
                                key={key}
                                user={c.user}
                                comment={c.text}
                                isTitle={false}
                            />
                        ))}
                    </Box>

                    {/* COMMENT BOX */}
                    <CommentField photo_id={image.photo_id} />
                </Box>
            </Box>
            {popup && <EditAlbum album_id={album_id} />}
        </>
    );
}
