import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import Feed from "./Feed";

export default function Home({ loggedIn }: { loggedIn: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        background: blue[50],
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 5,
          pt: "100px",
          gap: 2,
          boxSizing: "border-box",
          width: "60%",
          height: "100%",
          minHeight: "100vh",
          background: "white",
        }}
      >
        <Feed loggedIn={loggedIn} />
      </Box>
    </Box>
  );
}
