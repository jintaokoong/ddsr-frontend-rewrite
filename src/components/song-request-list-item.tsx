import ListSubheader from "@mui/material/ListSubheader";
import { Fragment, memo } from "react";
import useDeleteRequest from "../hooks/ui/use-delete-request";
import useToggleRequest from "../hooks/use-toggle-request";
import { Request } from "../interfaces/request";
import SongRequestSubListItem from "./song-request-sub-list-item";
interface Props {
  requests: Request[];
  date: string; // date in yyyy-MM-dd
}

const SongRequestListItem = ({ date, requests }: Props) => {
  const { onConfirm, onPreConfirm, resetDelete, target } = useDeleteRequest();
  const { mutate } = useToggleRequest();

  return (
    <Fragment>
      <ListSubheader>{date}</ListSubheader>
      {requests.map((r) => (
        <SongRequestSubListItem
          key={r._id}
          request={r}
          deleteProps={{
            isPending: target === undefined || target._id !== r._id,
            onPreConfirm: onPreConfirm(r),
            onConfirm: onConfirm,
            resetDelete: resetDelete,
          }}
          toggleProps={{
            onToggle: mutate,
          }}
        />
      ))}
    </Fragment>
  );
};

export default memo(SongRequestListItem);
