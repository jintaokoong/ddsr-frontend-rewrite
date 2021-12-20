import { Box, Container, List } from "@mui/material";
import useRequests from "./hooks/use-requests";
import Providers from "./providers";
import AcceptingFab from "./components/accepting-fab";
import CreateRequestInput from "./components/create-request-input";
import Loader from "./components/loader";
import SongRequestListItem from "./components/song-request-list-item";

const Main = () => {
  const { data: requests, isLoading } = useRequests();
  return (
    <Box sx={{ p: "15px 0" }}>
      <CreateRequestInput />
      <Loader isLoading={isLoading} />
      {requests && (
        <List subheader={<li />}>
          {Object.keys(requests).map((k) => (
            <SongRequestListItem date={k} requests={requests[k]} key={k} />
          ))}
        </List>
      )}
    </Box>
  );
};

function App() {
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
