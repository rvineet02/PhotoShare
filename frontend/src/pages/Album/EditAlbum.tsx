import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { ImFolderUpload } from "react-icons/im";

import axios from "axios";


interface PropTypes {
    album_id: number | undefined;
}

export default function EditAlbum({ album_id }: PropTypes) {
    const [uploadedImg, setUploadedImg] = useState<File>();
    const [caption, setCaption] = useState<string>("");
    const [imgTags, setImgTags] = useState<string[]>([]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploadedImg(files[0]);
    };

    const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setCaption(text);

        // Get tags using regex
        const re = /(?<=#)\w+/g;
        setImgTags(text.match(re) || []);
    };

    const handleEdit = () => {
      var data = new FormData();

      // Images
      if(uploadedImg === undefined) return;
      data.append(uploadedImg.name, uploadedImg);

      // Captions
      data.append("cap", caption);

      // Tags
      data.append("tags", imgTags.join(","));

      // Album Id
      data.append("album_id", (album_id || 0).toString());

      axios.post("/albums/add-picture", data, {
        withCredentials: true,
      })
      .then(res => console.log(res))
    }

    return (
        <Box
            sx={{
                display: "flex",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 100,
                background: "rgba(0,0,0,0.5)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 2,
                    height: "50vh",
                    width: "50vw",
                    background: "white",
                    overflow: "hidden",
                }}
            >
                <TextField
                    variant="outlined"
                    label="Photo caption"
                    value={caption}
                    fullWidth
                    rows={2}
                    multiline
                    onChange={handleType}
                />
                <input
                    accept="image/*"
                    id="upload-files"
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleUpload}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                    <label htmlFor="upload-files" style={{ display: "block" }}>
                        <Button
                            component="span"
                            variant="contained"
                            startIcon={<ImFolderUpload />}
                        >
                            Upload
                        </Button>
                    </label>
                </Box>
                <Button component="span" variant="contained" onClick={handleEdit}>
                    Save
                </Button>
            </Box>
        </Box>
    );
}
