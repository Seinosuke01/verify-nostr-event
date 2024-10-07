import { Timeline } from "../components/timeline";
import { PostForm } from "../components/post-form";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";

export const IndexPage = () => {
  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", marginTop: 5 }}>
      <Grid container spacing={10} justifyContent="center">
        <Grid size={8}>
          <Timeline />
        </Grid>
        <Grid size={4}>
          <PostForm />
        </Grid>
      </Grid>
    </Box>
  );
};
