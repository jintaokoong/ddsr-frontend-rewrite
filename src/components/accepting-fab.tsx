import { useCallback, useEffect, useState } from "react";
import useConfig from "../hooks/use-config";
import useConfigMutation from "../hooks/use-config-mutation";
import { Fab, SxProps, Theme, Tooltip } from "@mui/material";
import { PlayArrow, StopSharp } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";

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
    <Tooltip title={!active ? "開始接受" : "停止接受"}>
      <Fab
        onClick={onClick}
        sx={{
          ...fabStyle,
          ...(!active ? greenStyle : redStyle),
        }}
        children={!active ? <PlayArrow /> : <StopSharp />}
      />
    </Tooltip>
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

export default AcceptingFab;
