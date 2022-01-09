import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Alert,
  Box,
  Container,
  IconButton,
  List,
  Snackbar,
} from "@mui/material";
import { useEffect } from "react";
import AcceptingFab from "./components/accepting-fab";
import Conditional from "./components/conditional";
import CreateRequestInput from "./components/create-request-input";
import Loader from "./components/loader";
import SongRequestListItem from "./components/song-request-list-item";
import { VERSION } from "./config/configs";
import useRequests from "./hooks/use-requests";
import Providers from "./providers";
import useStore from "./store/store";
import useWebSocket from "./hooks/use-websocket";

const Main = () => {
  const { data: requests, isLoading } = useRequests();
  const { showing, hide } = useStore((state) => ({
    showing: state.showing,
    hide: state.hide,
  }));
  useWebSocket();

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
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: 90 } }}
        open={showing}
        children={
          <Alert
            severity={"success"}
            sx={{ width: "360px" }}
            children={"複製成功!"}
          />
        }
      />
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
