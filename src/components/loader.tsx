import { Box, CircularProgress } from "@mui/material";

interface Props {
  isLoading: boolean;
}

export const Loader = ({ isLoading }: Props) => {
  return isLoading ? (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      children={<CircularProgress />}
    />
  ) : null;
};

export default Loader;
