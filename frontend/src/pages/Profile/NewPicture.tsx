import { Box, TextField } from "@mui/material";
import React from "react";

interface PropTypes {
  image: File;
  caption: string;
  id: number;
  setCaption(id: number, text: string): void;
  setTags(id: number, tags: string[]): void;
}

export default function NewPicture({
  image,
  caption,
  id,
  setCaption,
  setTags,
}: PropTypes) {
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCaption(id, text);

    // Get tags using regex
    const re = /(?<=#)\w+/g;
    setTags(id, text.match(re) || []);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 2,
      }}
    >
      <img
        src={URL.createObjectURL(image)}
        style={{ maxHeight: "80px" }}
        alt={caption}
      />
      <TextField
        variant="outlined"
        label="Photo caption"
        value={caption}
        fullWidth
        rows={2}
        multiline
        onChange={handleType}
      />
    </Box>
  );
}
