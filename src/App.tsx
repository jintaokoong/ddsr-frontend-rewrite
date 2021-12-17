import {
  Box,
  Checkbox,
  Container,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import { Delete, PlayArrow, StopSharp } from "@mui/icons-material";
import { green, grey, red } from "@mui/material/colors";
import { useCallback, useState } from "react";
import Providers from "./providers";
import useRequests from "./hooks/use-requests";

const Main = () => {
  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const { data } = useRequests();

  return (
    <Box sx={{ p: "15px 0" }}>
      <Box>
        <TextField
          onKeyUp={(e) => {
            if (name.length > 0 && e.key === "Enter") {
              setName("");
            }
          }}
          sx={{ mb: "5px", width: "87%", mr: "5px" }}
          onChange={(e) => setName(e.currentTarget.value)}
          value={name}
          placeholder={"手動點歌 (ENTER鍵新增)"}
          size="small"
        />
        <IconButton
          onClick={() => setActive((a) => !a)}
          color={active ? "error" : "success"}
        >
          {active ? <StopSharp /> : <PlayArrow />}
        </IconButton>
      </Box>
      {data && (
        <List
          sx={{
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {Object.keys(data).map((k) => (
            <li key={k}>
              <ul>
                <ListSubheader sx={{ px: 0 }}>{k}</ListSubheader>
                {data[k]?.map((i) => (
                  <ListItem
                    key={i._id}
                    sx={{ px: 0 }}
                    secondaryAction={<Checkbox checked={i.done} />}
                  >
                    <ListItemButton sx={{ px: 0 }}>
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

const greenStyle = {
  bgcolor: green[500],
  "&:hover": {
    bgcolor: green[600],
  },
};

const redStyle = {
  bgcolor: red[500],
  "&:hover": {
    bgcolor: red[600],
  },
};

function App() {
  return (
    <Providers>
      <Container
        sx={{
          minHeight: "100vh",
          position: "relative",
        }}
        maxWidth={"xs"}
      >
        <Main />
      </Container>
    </Providers>
  );
}

export default App;
