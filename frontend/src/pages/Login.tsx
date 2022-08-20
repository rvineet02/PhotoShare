import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { blue } from "@mui/material/colors";
import { Button, Typography } from "@mui/material";

export default function Login({ loggedIn }: { loggedIn: boolean }) {
  useEffect(() => {
    // Redirect to home if logged in
    if (loggedIn) window.location.replace("http://127.0.0.1:3000");
  }, [loggedIn]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: blue[50],
      }}
    >
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 5,
          width: "30%",
          background: "white",
          borderRadius: 2,
          mt: "100px",
        }}
        method="POST"
        action="http://127.0.0.1:5000/auth/login"
      >
        <Typography variant="h3" component="h1">
          Login
        </Typography>

        <TextField
          name="email"
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
        />
        <Button variant="contained" type="submit">
          Log in
        </Button>
      </Box>
    </Box>
  );
}
