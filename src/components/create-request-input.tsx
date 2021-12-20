import { Box, TextField } from "@mui/material";
import useConfig from "../hooks/use-config";
import { useState } from "react";
import useCreateRequestMutation from "../hooks/use-create-config-mutation";

const CreateRequestInput = () => {
  const [name, setName] = useState("");
  const { mutate: createRequestMutate } = useCreateRequestMutation();
  const { data: config } = useConfig();

  return (
    <Box sx={{ px: "14px" }}>
      <TextField
        disabled={!config ? true : config.accepting === "false"}
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
  );
};

export default CreateRequestInput;
