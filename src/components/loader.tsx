import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

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
