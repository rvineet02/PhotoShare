import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { ReactElement, useEffect, useState } from "react";

const A = ({ word }: { word: string }) => {
  return (
    <>
      <a href={`/search/tags?search=${word.substring(1)}`} style={{ color: blue[700] }}>
        {word}
      </a>{" "}
    </>
  );
};

interface PropTypes {
  user: string;
  comment: string;
  isTitle: boolean;
}

export default function Comment({ user, comment, isTitle }: PropTypes) {
  const [commentText, setCommentText] = useState<(string | ReactElement)[]>();

  useEffect(() => {
    // HIGHLIGHT TAGS
    let splitText = comment.split(" ");
    let resultText = splitText.map((word, key) => {
      if (word[0] === "#") return <A word={word} key={key} />;
      else return word + " ";
    });

    setCommentText(resultText);
  }, [comment]);

  return (
    <Box sx={{ width: "100%" }} component="p">
      <Typography
        variant="body1"
        component="span"
        sx={{
          fontWeight: "bold",
          display: "inline",
          mr: 1,
          color: isTitle ? blue[800] : "black",
        }}
      >
        {user}
      </Typography>
      {commentText}
    </Box>
  );
}
