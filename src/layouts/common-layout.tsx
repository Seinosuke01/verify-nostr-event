import { ListItemText, MenuItem, MenuList } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export const CommonLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: 200,
          maxWidth: "100%",
          backgroundColor: "transparent",
          margin: 10,
        }}
      >
        <MenuList>
          <Link to={"/"}>
            <MenuItem>
              <ListItemText>Home</ListItemText>
            </MenuItem>
          </Link>

          <Link to={"/profile"}>
            <MenuItem>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
          </Link>
        </MenuList>
      </div>

      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};
