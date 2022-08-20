import { Box, Button, Link, Menu, MenuItem } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { UserType } from "../interfaces";

interface PropTypes {
  loggedIn: boolean;
  user: UserType | undefined;
}

export default function Nav({ loggedIn, user }: PropTypes) {
  const [anchorEl, setAnchorEl] = useState<any>(null);

  const openMenu = (e: React.MouseEvent) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 100,
        width: "100%",
        height: "60px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid " + blue[500],
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* LINKS */}
        <Link sx={LinkStyle} href="/">
          Home
        </Link>
        <Link sx={LinkStyle} href="/active">
            Leaderboard
        </Link>
        <Link sx={LinkStyle} href="/search/comments">
            Searching on Comments
        </Link>
        <Link sx={LinkStyle} href="/search/tags">
            Searching on Tags
        </Link>
        <Link sx={LinkStyle} href="/tags/popular">
            Popular Tags
        </Link>
        {loggedIn ? (
          <>
            <Link sx={LinkStyle} href="/profile">
              Profile
            </Link>
            <Link sx={LinkStyle} href="/also-like">
              You May Also Like
            </Link>
            <Link sx={LinkStyle} href="/friend-recommendation">
              Friend Recommendations
            </Link>
          </>

        ) : (
          <>
            <Link sx={LinkStyle} href="/register">
              Register
            </Link>
            <Link sx={LinkStyle} href="/login">
              Login
            </Link>
          </>
        )}
      </Box>

      {/* PROFILE ICON */}
      {loggedIn && (
        <>
          <Button
            sx={{
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textTransform: "none",
            }}
            aria-haspopup="true"
            onClick={openMenu}
          >
            {user && user.first_name} {user && user.last_name}
            <Box
              sx={{
                fontSize: 20,
                background: grey[300],
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <AiOutlineUser />
            </Box>
          </Button>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closeMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem
              component="a"
              href="http://127.0.0.1:5000/auth/logout"
              sx={{
                color: "black",
                textDecoration: "none",
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}

const LinkStyle = {
  color: blue[700],
  textDecoration: "none",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px",
  "&:hover": {
    textDecoration: "underline",
  },
};
