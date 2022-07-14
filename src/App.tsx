import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Snackbar from "@mui/material/Snackbar";
import * as R from "ramda";
import { useEffect, useMemo, useState } from "react";
import AcceptingFab from "./components/accepting-fab";
import Conditional from "./components/conditional";
import CreateRequestInput from "./components/create-request-input";
import Loader from "./components/loader";
import SongRequestListItem from "./components/song-request-list-item";
import { VERSION } from "./config/configs";
import useRequests from "./hooks/use-requests";
import Providers from "./providers";
import useStore from "./store/store";
import { Request } from "./interfaces/request";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import useSubscribeScroll from "./hooks/ui/use-subscribe-scroll";

// filter array of request by createdAt property and return past week
const getPastWeek = (requests: Request[]) =>
  R.filter(
    R.propSatisfies(
      (createdAt: string) =>
        new Date(createdAt).getTime() >
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
      "createdAt"
    ),
    requests
  );

const MySnackbar = () => {
  const { showing } = useStore((state) => ({
    showing: state.showing,
  }));

  return (
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
  );
};

const compareDesc = (a: Request, b: Request) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const Main = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useRequests();

  const l = useMemo(() => {
    if (!data) return [];

    const datas = R.sort(
      compareDesc,
      R.flatten(R.map((p) => p.data, data.pages))
    );
    const g = R.groupBy((r) => r.key, getPastWeek(datas));
    const p = R.sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      R.keys(g)
    );
    return p.map((k) => ({ key: k, data: g[k] }));
  }, [data]);

  const handleScroll = () => {
    const canFetch = !isFetchingNextPage && hasNextPage;
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom && canFetch) {
      fetchNextPage().catch(console.error);
    }
  };

  useEffect(() => {
    if (
      document.body.clientHeight <= window.innerHeight &&
      !isLoading &&
      !isFetchingNextPage &&
      hasNextPage
    ) {
      fetchNextPage().catch(console.error);
    }
  }, [data, isLoading, isFetchingNextPage, hasNextPage]);

  useSubscribeScroll(handleScroll);

  const [inputKey, setInputKey] = useState("");
  const [key, setKey] = useState<string>();

  useEffect(() => {
    const k = localStorage.getItem("api-key");
    setKey(k && k.length > 0 ? k : undefined);
  }, []);

  return (
    <Box sx={{ p: "15px 0" }}>
      <CreateRequestInput />
      <Conditional visible={!isLoading} alternate={<Loader />}>
        {l && (
          <Conditional
            visible={l.length > 0}
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
              {l.map((r) => (
                <SongRequestListItem
                  date={r.key}
                  requests={r.data}
                  key={r.key}
                />
              ))}
            </List>
          </Conditional>
        )}
      </Conditional>
      <MySnackbar />
      <Dialog open={key === undefined || key.length === 0}>
        <DialogTitle>密碼</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            type={"password"}
            value={inputKey}
            onChange={(e) => setInputKey(e.currentTarget.value)}
            fullWidth
            size={"small"}
            variant={"standard"}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={inputKey.length === 0}
            onClick={() => {
              localStorage.setItem("api-key", inputKey);
              setKey(inputKey);
            }}
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>
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
