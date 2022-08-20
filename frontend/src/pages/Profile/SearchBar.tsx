import {
  Box,
  InputAdornment,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import axios from "axios";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import SearchFriend from "../../components/SearchFriend";
import { TiDelete } from "react-icons/ti";
import { FriendType, UserType } from "../../interfaces";

const checkFriendship = (friends: FriendType[], friend_id: number) => {
  // Check if friend is my friend
  for (const f of friends) if (f.friend_id === friend_id) return true;

  return false;
};

interface PropTypes {
  friends: FriendType[];
  getFriends(): void;
}

export default function SearchBar({ friends, getFriends }: PropTypes) {
  const [showFriends, setShowFriends] = useState(false);
  const [results, setResults] = useState<UserType[]>([]);

  const searchFriends = async (name: string) => {
    // Hide menu if empty
    setShowFriends(name !== "");

    // Search for query
    if (name !== "") {
      const res = await axios.get("/friends/search", {
        params: { search: name },
        withCredentials: true,
      });

      if (res) setResults(res.data);
    }
  };

  const editFriends = async (friend_id: number, value: boolean) => {
    // Add/Remove friend
    await axios.post(
      "/friends/edit",
      { friend_id, value },
      { withCredentials: true }
    );

    getFriends();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* FRIENDS LIST */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        Current friends:{" "}
        {friends.map((f, key) => (
          <Box
            sx={{
              background: grey[300],
              borderRadius: 2,
              py: 0.5,
              px: 1.5,
              gap: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                background: red[300],
              },
            }}
            key={key}
            onClick={() => editFriends(f.friend_id, false)}
          >
            <Typography variant="body1" component="span">
              {f.friend_name}
            </Typography>
            <TiDelete style={{ background: "transparent" }} />
          </Box>
        ))}
      </Box>

      {/* SEARCH BAR */}
      <TextField
        label="Search friends..."
        sx={{ width: "100%" }}
        onChange={(e) => searchFriends(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AiOutlineSearch style={{ fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* SEARCH BAR RESULTS */}
      <Box
        sx={{
          borderRadius: 1,
          border: `1px solid ${grey[400]}`,
          marginTop: 1,
          padding: 0,
          display: showFriends ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        <List
          sx={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {results.map((f, key) => (
            <SearchFriend
              key={key}
              name={f.first_name + " " + f.last_name}
              added={checkFriendship(friends, f.user_id)}
              id={f.user_id}
              editFriends={editFriends}
            />
          ))}
          {results.length === 0 && (
            <Typography variant="body1" sx={{ p: 2 }}>
              No results found...
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
}
