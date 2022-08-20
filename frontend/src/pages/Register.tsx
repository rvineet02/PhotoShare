import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { blue } from "@mui/material/colors";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

export default function Register({ loggedIn }: { loggedIn: boolean }) {
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<Date | null | undefined>();

  useEffect(() => {
    // Reddirect if logged in
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
        action="http://127.0.0.1:5000/auth/register"
      >
        <Typography variant="h3" component="h1">
          Register
        </Typography>

        {/* NAME */}
        <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
          <TextField
            id="outlined-basic"
            label="First Name"
            name="first_name"
            variant="outlined"
            sx={{ width: "50%" }}
          />
          <TextField
            id="outlined-basic"
            label="Last Name"
            name="last_name"
            sx={{ width: "50%" }}
            variant="outlined"
          />
        </Box>

        {/* EMAIL */}
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type="email"
          name="email"
        />

        {/* GENDER */}
        <FormControl fullWidth>
          <InputLabel id="select-label">Gender</InputLabel>
          <Select
            labelId="select-label"
            label="Gender"
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            name="gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        {/* DATE OF BIRTH */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of birth"
            onChange={setDob}
            value={dob}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <input
          type="hidden"
          value={dob ? dob.toISOString().substring(0, 10) : ""}
          name="date_of_birth"
        />

        {/* HOMETOWN */}
        <TextField
          id="outlined-basic"
          label="Hometown"
          variant="outlined"
          name="hometown"
        />

        {/* PASSWORD */}
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
        />
        <Button variant="contained" type="submit">
          Register
        </Button>
      </Box>
    </Box>
  );
}
