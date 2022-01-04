import { Box, CircularProgress } from "@mui/material";

export const Loader = () => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      children={<CircularProgress />}
    />
  );
};

export default Loader;
