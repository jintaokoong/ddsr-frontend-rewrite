import { Request } from "../interfaces/request";
import { Fragment, memo, PropsWithChildren, SyntheticEvent } from "react";
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import DeleteButton from "./delete-button";
import useDeleteRequest from "../hooks/ui/use-delete-request";
import useToggleRequest from "../hooks/ui/use-toggle-request";
import copy from "copy-to-clipboard";
import useStore from "../store/store";

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
  secondary,
  children,
}: PropsWithChildren<{ done: boolean; secondary: string | undefined }>) => (
  <ListItemText
    sx={done ? songRequestDoneStyle : undefined}
    primary={children}
    secondary={secondary}
  />
);

const SongRequestSubListItem = ({
  request,
  deleteProps,
  onCopy,
  onDismiss,
  toggleProps: { onToggle },
}: {
  request: Request;
  onCopy: () => void;
  onDismiss: () => void;
  deleteProps: {
    isPending: boolean;
    onPreConfirm: () => void;
    onConfirm: () => void;
  };
  toggleProps: {
    onToggle: (e: SyntheticEvent) => void;
  };
}) => {
  return (
    <ListItem
      disablePadding
      secondaryAction={<DeleteButton {...deleteProps} />}
    >
      <Tooltip title={"點擊複製YT連結"}>
        <ListItemButton
          sx={{ px: 0 }}
          onClick={() => {
            copy(request.details?.url ?? "");
            onCopy();
            const timeoutRef = setTimeout(() => {
              onDismiss();
              clearTimeout(timeoutRef);
            }, 1000);
          }}
        >
          <ListItemIcon>
            <Checkbox checked={request.done} onClick={onToggle} />
          </ListItemIcon>
          <SongRequestTitle
            done={request.done}
            secondary={request.details?.title}
          >
            {request.name}
          </SongRequestTitle>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

const SongRequestListItem = ({ date, requests }: Props) => {
  const { onConfirm, onPreConfirm, target } = useDeleteRequest();
  const onToggle = useToggleRequest();
  const { show, hide } = useStore((state) => ({
    show: state.show,
    hide: state.hide,
  }));
  return (
    <Fragment>
      <ListSubheader>{date}</ListSubheader>
      {requests.map((r) => (
        <SongRequestSubListItem
          key={r._id}
          request={r}
          onCopy={show}
          onDismiss={hide}
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

export default memo(SongRequestListItem);
