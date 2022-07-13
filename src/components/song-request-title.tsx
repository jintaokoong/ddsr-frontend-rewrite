import { grey } from "@mui/material/colors";
import ListItemText from "@mui/material/ListItemText";
import { memo, PropsWithChildren } from "react";

const songRequestDoneStyle = {
  textDecorationLine: "line-through",
  color: grey[600],
};
export const SongRequestTitle = ({
  done,
  secondary,
  children,
}: PropsWithChildren<{ done: boolean; secondary: string | undefined }>) => (
  <ListItemText
    sx={done ? songRequestDoneStyle : undefined}
    primary={children}
    secondary={secondary}
  />
);

export default memo(SongRequestTitle);
