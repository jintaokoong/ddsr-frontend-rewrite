import { Request } from "../interfaces/request";
import { Fragment, PropsWithChildren, useCallback, useState } from "react";
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
import useDeleteRequestMutation from "../hooks/use-delete-request-mutation";
import { DeletePayload } from "../interfaces/delete-payload";
import useRequestMutation from "../hooks/use-request-mutation";

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

const useDeleteRequest = () => {
  const [deletePayload, setDeletePayload] = useState<DeletePayload | undefined>(
    undefined
  );
  const { mutate: deleteMutate } = useDeleteRequestMutation();

  const onPreConfirm = useCallback(
    (key: string, request: Request) => () =>
      setDeletePayload({ key: key, request: request }),
    [setDeletePayload]
  );

  const onConfirm = useCallback(() => {
    if (!deletePayload) {
      return;
    }
    setDeletePayload(undefined);
    deleteMutate(deletePayload);
  }, [deletePayload]);

  return {
    target: deletePayload,
    onPreConfirm,
    onConfirm,
  };
};

const useOnToggleRequest = () => {
  const { mutate: requestMutate } = useRequestMutation();
  return useCallback(
    (key: string, request: Request) => () => {
      requestMutate({ _id: request._id, done: !request.done, key: key });
    },
    []
  );
};

const SongRequestListItem = ({ date, requests }: Props) => {
  const { onConfirm, onPreConfirm, target } = useDeleteRequest();
  const onToggle = useOnToggleRequest();
  return (
    <Fragment>
      <ListSubheader>{date}</ListSubheader>
      {requests.map((r) => (
        <SongRequestSubListItem
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
