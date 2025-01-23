import {
  Box,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Typography,
} from "@mui/material";
import { Home, Person } from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";

export const CommonLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      
      {/* サイドバー */}
      <Box
        sx={{
          width: 240,
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center", fontWeight: "bold" }}>
          Event Manager
        </Typography>
        <MenuList>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "#34495e" } }}>
              <ListItemIcon>
                <Home sx={{ color: "#ecf0f1" }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
          </Link>

          <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "#34495e" } }}>
              <ListItemIcon>
                <Person sx={{ color: "#ecf0f1" }} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
          </Link>
        </MenuList>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            backgroundColor: "#ecf0f1",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

