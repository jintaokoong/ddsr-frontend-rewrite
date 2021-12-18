import { Delete, PlayArrow, StopSharp } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import useConfig from "./hooks/use-config";
import useConfigMutation from "./hooks/use-config-mutation";
import useCreateRequestMutation from "./hooks/use-create-config-mutation";
import useRequestMutation from "./hooks/use-request-mutation";
import useRequests from "./hooks/use-requests";
import { GetRequestsResponse } from "./interfaces/get-requests-response";
import { Request } from "./interfaces/request";
import Providers from "./providers";

const Main = () => {
  const [name, setName] = useState("");
  const qc = useQueryClient();
  const { data: requests, isLoading } = useRequests();
  const { mutate: createRequestMutate } = useCreateRequestMutation();
  const { mutate: requestMutate } = useRequestMutation();
  const { data: config } = useConfig();

  const onCheck = useCallback(
    (key: string, sr: Request) => () => {
      requestMutate({ _id: sr._id, done: !sr.done, key: key });
    },
    [requestMutate]
  );

  return (
    <Box sx={{ p: "15px 0" }}>
      <Box sx={{ px: "14px" }}>
        <TextField
          disabled={!config ? true : config.accepting === "true"}
          onKeyUp={(e) => {
            if (name.length > 0 && e.key === "Enter") {
              setName("");
              createRequestMutate(name);
            }
          }}
          fullWidth
          sx={{ mb: "5px" }}
          onChange={(e) => setName(e.currentTarget.value)}
          value={name}
          placeholder={"手動點歌 (ENTER鍵新增)"}
          size="small"
        />
      </Box>
      {isLoading && (
        <Box
          sx={{
            height: "calc(100vh - 150px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          children={<CircularProgress />}
        />
      )}
      {requests && (
        <List subheader={<li />}>
          {Object.keys(requests).map((k) => (
            <Fragment key={k}>
              <ListSubheader>{k}</ListSubheader>
              {requests[k]?.map((i) => (
                <ListItem
                  key={i._id}
                  secondaryAction={
                    <IconButton
                      disabled
                      color={"error"}
                      children={<Delete />}
                    />
                  }
                  disablePadding
                >
                  <ListItemButton sx={{ px: 0 }} onClick={onCheck(k, i)}>
                    <ListItemIcon>
                      <Checkbox checked={i.done} />
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        textDecorationLine: i.done ? "line-through" : undefined,
                        color: i.done ? grey[600] : undefined,
                      }}
                    >
                      {i.name}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

const redStyle = {
  bgcolor: red[500],
  "&:hover": {
    bgcolor: red[600],
  },
};

const greenStyle = {
  bgcolor: green[500],
  "&:hover": {
    bgcolor: green[600],
  },
};

const fabStyle: SxProps<Theme> = {
  zIndex: 999,
  position: "sticky",
  bottom: "20px",
  float: "right",
  marginRight: "20px",
  color: "common.white",
};

const AcceptingFab = () => {
  const [active, setActive] = useState(false);
  const { data: config, isLoading } = useConfig();
  const { mutate: configMutate } = useConfigMutation();
  const onClick = useCallback(() => {
    configMutate(undefined);
  }, [configMutate]);
  useEffect(() => {
    setActive(config?.accepting === "true");
  }, [config?.accepting, setActive]);

  return isLoading ? (
    <Fab sx={fabStyle} />
  ) : (
    <Fab
      onClick={onClick}
      sx={{
        ...fabStyle,
        ...(!active ? greenStyle : redStyle),
      }}
      children={!active ? <PlayArrow /> : <StopSharp />}
    />
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
