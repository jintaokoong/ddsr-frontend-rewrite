import { ListSubheader } from "@mui/material";
import { Fragment, memo } from "react";
import useDeleteRequest from "../hooks/ui/use-delete-request";
import useToggleRequest from "../hooks/ui/use-toggle-request";
import { Request } from "../interfaces/request";
import SongRequestSubListItem from "./song-request-sub-list-item";
interface Props {
  requests: Request[];
  date: string; // date in yyyy-MM-dd
}

const SongRequestListItem = ({ date, requests }: Props) => {
  const { onConfirm, onPreConfirm, resetDelete, target } = useDeleteRequest();
  const onToggle = useToggleRequest();

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
            resetDelete: resetDelete,
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
