import { Request } from "../interfaces/request";
import { Fragment, memo, PropsWithChildren } from "react";
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import DeleteButton from "./delete-button";
import useDeleteRequest from "../hooks/ui/use-delete-request";
import useToggleRequest from "../hooks/ui/use-toggle-request";

interface Props {
  requests: Request[];
  date: string; // date in yyyy-MM-dd
}

const songRequestDoneStyle = {
  textDecorationLine: "line-through",
  color: grey[600],
};

const SongRequestTitle = ({
  done,
  children,
}: PropsWithChildren<{ done: boolean }>) => (
  <ListItemText sx={done ? songRequestDoneStyle : undefined}>
    {children}
  </ListItemText>
);

const SongRequestSubListItem = ({
  request,
  deleteProps,
  toggleProps: { onToggle },
}: {
  request: Request;
  deleteProps: {
    isPending: boolean;
    onPreConfirm: () => void;
    onConfirm: () => void;
  };
  toggleProps: {
    onToggle: () => void;
  };
}) => {
  return (
    <ListItem
      disablePadding
      secondaryAction={<DeleteButton {...deleteProps} />}
    >
      <ListItemButton sx={{ px: 0 }} onClick={onToggle}>
        <ListItemIcon>
          <Checkbox checked={request.done} />
        </ListItemIcon>
        <SongRequestTitle done={request.done}>{request.name}</SongRequestTitle>
      </ListItemButton>
    </ListItem>
  );
};

export const MemoizedSongRequestSubListItem = memo(SongRequestSubListItem);

const SongRequestListItem = ({ date, requests }: Props) => {
  const { onConfirm, onPreConfirm, target } = useDeleteRequest();
  const onToggle = useToggleRequest();
  return (
    <Fragment>
      <ListSubheader>{date}</ListSubheader>
      {requests.map((r) => (
        <MemoizedSongRequestSubListItem
          key={r._id}
          request={r}
          deleteProps={{
            isPending: target === undefined || target.request._id !== r._id,
            onPreConfirm: onPreConfirm(date, r),
            onConfirm: onConfirm,
          }}
          toggleProps={{
            onToggle: onToggle(date, r),
          }}
        />
      ))}
    </Fragment>
  );
};

export default SongRequestListItem;
