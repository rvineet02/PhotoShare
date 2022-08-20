import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

import { MdDelete } from "react-icons/md";
import { ImFolderUpload } from "react-icons/im";
import { HiViewGridAdd } from "react-icons/hi";
import axios from "axios";

import NewPicture from "./NewPicture";

export default function NewAlbum() {
  const [uploadedImgs, setUploadedImgs] = useState<File[]>([]);
  const [imgCaptions, setImgCaptions] = useState<string[]>([]);
  const [imgTags, setImgTags] = useState<string[][]>([]);

  const [title, setTitle] = useState<string>("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // On upload images, update state
    let imgArr = [];
    const files = e.target.files;
    if (files === null) return;

    for (let i = 0; i < files.length; i++) imgArr.push(files[i]);
    setUploadedImgs([...uploadedImgs, ...imgArr]);
  };

  const handleSubmit = async () => {
    var data = new FormData();
    // Images
    for (const idx in uploadedImgs)
      data.append(uploadedImgs[idx].name, uploadedImgs[idx]);

    // Captions
    for (const idx in imgCaptions)
      data.append("cap_" + uploadedImgs[idx].name, imgCaptions[idx]);

    // Tags
    for (const idx in imgTags) {
      const tagsList = imgTags[idx].join(",")
      data.append("tags_" + uploadedImgs[idx].name, tagsList);
    }

    // Title
    data.append("album_name", title);

    await axios.post("/albums/", data, {
      withCredentials: true,
    });

    window.location.reload();
  };

  const setCaption = (picId: number, caption: string) => {
    // Update image captions and state

    let captions = [...imgCaptions];
    captions[picId] = caption;

    setImgCaptions(captions);
  };

  const setTags = (picId: number, tags: string[]) => {
    // Update image tags and state

    let tagList = [...imgTags];
    tagList[picId] = tags;

    setImgTags(tagList);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Album title field */}
      <TextField
        type="text"
        label="Album title..."
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 1 }}
      />

      {/* List of pictures + caption fields */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          my: uploadedImgs.length > 0 ? 2 : 0,
          gap: 1,
        }}
      >
        {uploadedImgs.map((f, key) => (
          <NewPicture
            image={uploadedImgs[key]}
            caption={imgCaptions[key]}
            key={key}
            id={key}
            setCaption={setCaption}
            setTags={setTags}
          />
        ))}
      </Box>

      {/* Buttons */}
      <input
        accept="image/*"
        id="upload-files"
        multiple
        type="file"
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <label htmlFor="upload-files" style={{ display: "block" }}>
          <Button
            component="span"
            variant="contained"
            startIcon={<ImFolderUpload />}
          >
            Upload
          </Button>
        </label>
        {uploadedImgs.length > 0 && (
          <>
            <Button
              variant="contained"
              startIcon={<MdDelete />}
              onClick={() => {
                setUploadedImgs([]);
                setImgCaptions([]);
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<HiViewGridAdd />}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
