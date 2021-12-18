import { PlayArrow, StopSharp } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import useConfig from "./hooks/use-config";
import useConfigMutation from "./hooks/use-config-mutation";
import useCreateConfigMutation from "./hooks/use-create-config-mutation";
import useRequestMutation from "./hooks/use-request-mutation";
import useRequests from "./hooks/use-requests";
import Providers from "./providers";

const Main = () => {
  const [name, setName] = useState("");
  const qc = useQueryClient();
  const { data: requests } = useRequests();
  const { mutate: createRequestMutate } = useCreateConfigMutation();
  const { mutate: requestMutate } = useRequestMutation();
  const { data: config } = useConfig();
  const [active, setActive] = useState(false);
  const { mutate: configMutate } = useConfigMutation();

  const onClick = useCallback(() => {
    configMutate(undefined, {
      onSuccess: (data) => {
        qc.setQueryData("config", () => data);
      },
    });
  }, [configMutate]);

  const onCheck = useCallback(
    (_id: string, done: boolean) => () => {
      requestMutate(
        { _id, done: !done },
        {
          onSuccess: () => {
            qc.refetchQueries(["requests"]);
          },
        }
      );
    },
    []
  );

  useEffect(() => {
    setActive(config?.accepting === "true");
  }, [config?.accepting]);

  return (
    <Box sx={{ p: "15px 0" }}>
      <Box>
        <TextField
          onKeyUp={(e) => {
            if (name.length > 0 && e.key === "Enter") {
              createRequestMutate(name, {
                onSuccess: () => {
                  qc.refetchQueries(["requests"]);
                },
                onSettled: () => {
                  setName("");
                },
              });
            }
          }}
          sx={{ mb: "5px", width: "87%", mr: "5px" }}
          onChange={(e) => setName(e.currentTarget.value)}
          value={name}
          placeholder={"手動點歌 (ENTER鍵新增)"}
          size="small"
        />
        <IconButton onClick={onClick} color={active ? "error" : "success"}>
          {active ? <StopSharp /> : <PlayArrow />}
        </IconButton>
      </Box>
      {requests && (
        <List
          sx={{
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {Object.keys(requests).map((k) => (
            <li key={k}>
              <ul>
                <ListSubheader sx={{ px: 0 }}>{k}</ListSubheader>
                {requests[k]?.map((i) => (
                  <ListItem
                    key={i._id}
                    sx={{ px: 0 }}
                    secondaryAction={
                      <Checkbox
                        checked={i.done}
                        onClick={onCheck(i._id, i.done)}
                      />
                    }
                  >
                    <ListItemButton
                      sx={{ px: 0 }}
                      onClick={onCheck(i._id, i.done)}
                    >
                      <ListItemText
                        sx={{
                          textDecorationLine: i.done
                            ? "line-through"
                            : undefined,
                          color: i.done ? grey[600] : undefined,
                        }}
                      >
                        {i.name}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
              </ul>
            </li>
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
        <Container
          sx={{
            position: "sticky",
            p: "10px",
            textAlign: "center",
            bottom: "0px",
            bgcolor: "white",
          }}
        >
          v1.0.0
        </Container>
      </Container>
    </Providers>
  );
}

export default App;
