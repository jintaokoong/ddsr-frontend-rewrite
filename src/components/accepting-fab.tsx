import PlayArrow from "@mui/icons-material/PlayArrow";
import StopSharp from "@mui/icons-material/StopSharp";
import { green, red } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import { SxProps, Theme } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import useConfig from "../hooks/use-config";
import useConfigMutation from "../hooks/use-config-mutation";

const AcceptingFab = () => {
  const { data: config, isLoading } = useConfig();
  const { mutate: configMutate } = useConfigMutation();
  const onClick = useCallback(() => {
    configMutate(undefined);
  }, [configMutate]);
  return isLoading ? (
    <Fab sx={fabStyle} />
  ) : (
    <Tooltip title={!config?.value ? "開始接受" : "停止接受"}>
      <Fab
        onClick={onClick}
        sx={createFabStyle(config?.value ?? false)}
        children={!config?.value ? <PlayArrow /> : <StopSharp />}
      />
    </Tooltip>
  );
};

const createFabStyle = (isActive: boolean): SxProps<Theme> => ({
  ...fabStyle,
  bgcolor: !isActive ? green[500] : red[500],
  "&:hover": {
    bgcolor: !isActive ? green[600] : red[600],
  },
});

const fabStyle: SxProps<Theme> = {
  zIndex: 999,
  position: "sticky",
  bottom: "20px",
  float: "right",
  marginRight: "20px",
  color: "common.white",
};

export default AcceptingFab;
