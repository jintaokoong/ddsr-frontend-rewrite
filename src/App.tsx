import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Container, List } from "@mui/material";
import { useEffect } from "react";
import AcceptingFab from "./components/accepting-fab";
import Conditional from "./components/conditional";
import CreateRequestInput from "./components/create-request-input";
import Loader from "./components/loader";
import SongRequestListItem from "./components/song-request-list-item";
import { VERSION } from "./config/configs";
import useRequests from "./hooks/use-requests";
import Providers from "./providers";

const Main = () => {
  const { data: requests, isLoading } = useRequests();
  return (
    <Box sx={{ p: "15px 0" }}>
      <CreateRequestInput />
      <Conditional visible={!isLoading} alternate={<Loader />}>
        {requests && (
          <Conditional
            visible={Object.keys(requests).length > 0}
            alternate={
              <Box
                sx={{
                  height: "calc(100vh - 139px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <ErrorOutlineIcon sx={{ fontSize: 38, pb: "0.75rem" }} />
                </div>
                <Box>沒有任何歌曲</Box>
              </Box>
            }
          >
            <List subheader={<li />} sx={{ minHeight: "calc(100vh - 139px)" }}>
              {Object.keys(requests).map((k) => (
                <SongRequestListItem date={k} requests={requests[k]} key={k} />
              ))}
            </List>
          </Conditional>
        )}
      </Conditional>
    </Box>
  );
};

function App() {
  useEffect(() => {
    console.log(`v${VERSION}`);
  }, []);
  return (
    <Providers>
      <Container
        maxWidth={"xs"}
        sx={{
          minHeight: "100vh",
        }}
      >
        <Main />
        <AcceptingFab />
      </Container>
    </Providers>
  );
}

export default App;
