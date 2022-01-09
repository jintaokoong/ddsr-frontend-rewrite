import { Request } from "../interfaces/request";
import { Fragment, memo, useMemo, useState } from "react";
import { ListSubheader } from "@mui/material";
import useDeleteRequest from "../hooks/ui/use-delete-request";
import useToggleRequest from "../hooks/ui/use-toggle-request";
import useStore from "../store/store";
import { SongRequestSubListItem } from "./song-request-sub-list-item";

interface Props {
  requests: Request[];
  date: string; // date in yyyy-MM-dd
}

const SongRequestListItem = ({ date, requests }: Props) => {
  const { onConfirm, onPreConfirm, target } = useDeleteRequest();
  const onToggle = useToggleRequest();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const popoverOpen = useMemo(() => anchorEl !== undefined, [anchorEl]);

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
          moreProps={{
            isOpen: popoverOpen,
            anchorEl: anchorEl,
            setAnchorEl: setAnchorEl,
          }}
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
