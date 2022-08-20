import React, { useState, useCallback, useEffect } from "react";
import { MightLikeFriend } from "../interfaces";
import axios from "axios";
import { Grid, Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Card } from "@mui/material";
import { CardHeader } from "@mui/material";

const FriendRecommend = () => {
  const [friends, setFriends] = useState<MightLikeFriend[]>([]);

  const getFriends = useCallback(async () => {
    const res = await axios.get("/recommendations/friends", {
      withCredentials: true,
    });
    if (res) setFriends(res.data);
  }, []);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const cardFriends = friends.map((friend) => {
    return (
      <Grid>
        <Card key={friend.fof_id}>
          <CardHeader title={friend.fof_name} />
        </Card>
      </Grid>
    );
  });

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
          Friend Recommendations
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {cardFriends}
        </Box>
      </Box>
    </Box>
  );
};

export default FriendRecommend;
