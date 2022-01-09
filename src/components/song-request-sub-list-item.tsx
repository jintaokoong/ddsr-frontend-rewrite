import { Request } from "../interfaces/request";
import { Fragment, SyntheticEvent, useCallback } from "react";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import copy from "copy-to-clipboard";
import { SongRequestTitle } from "./song-request-title";

interface Props {
  request: Request;
  onCopy: () => void;
  onDismiss: () => void;
  deleteProps: {
    isPending: boolean;
    onPreConfirm: () => void;
    onConfirm: () => void;
  };
  moreProps: {
    isOpen: boolean;
    anchorEl: HTMLButtonElement | undefined;
    setAnchorEl: (anchor: HTMLButtonElement | undefined) => void;
  };
  toggleProps: {
    onToggle: (e: SyntheticEvent) => void;
  };
}

export const SongRequestSubListItem = ({
  request,
  deleteProps,
  moreProps,
  onCopy,
  onDismiss,
  toggleProps: { onToggle },
}: Props) => {
  const menuItemOnClick = useCallback(
    (item: "link" | "copy" | "delete", confirm?: boolean) => () => {
      if (!confirm) {
        moreProps.setAnchorEl(undefined);
      }
      console.log(request);
      switch (item) {
        case "link":
          request.details?.url && window.open(request.details.url);
          break;
        case "copy":
          if (request.details?.url) {
            copy(request.details.url);
            onCopy();
            const timeoutRef = setTimeout(() => {
              onDismiss();
              clearTimeout(timeoutRef);
            }, 1000);
          }
          break;
        case "delete":
          if (confirm) {
            deleteProps.onPreConfirm();
          } else {
            deleteProps.onConfirm();
          }
          break;
        default:
      }
    },
    [moreProps, deleteProps, request, onCopy, onDismiss]
  );

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Fragment>
          <Tooltip title={"更多"}>
            <IconButton onClick={(e) => moreProps.setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            onClose={() => {
              moreProps.setAnchorEl(undefined);
            }}
            open={moreProps.isOpen}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            anchorEl={moreProps.anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem
              disabled={request.details?.url === undefined}
              onClick={menuItemOnClick("link")}
            >
              <ListItemIcon>
                <OpenInNewIcon fontSize={"small"} />
              </ListItemIcon>
              <ListItemText>打開鏈接</ListItemText>
            </MenuItem>
            <MenuItem>{request.name}</MenuItem>
            <MenuItem
              disabled={request.details?.url === undefined}
              onClick={menuItemOnClick("copy")}
            >
              <ListItemIcon>
                <ContentCopyIcon fontSize={"small"} />
              </ListItemIcon>
              <ListItemText>複製鏈接</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={menuItemOnClick("delete", deleteProps.isPending)}
            >
              <ListItemIcon>
                {deleteProps.isPending ? (
                  <DeleteIcon fontSize={"small"} />
                ) : (
                  <InfoOutlinedIcon fontSize={"small"} />
                )}
              </ListItemIcon>
              <ListItemText>
                {deleteProps.isPending ? "刪除" : "確認刪除"}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Fragment>
      }
    >
      <ListItemButton sx={{ px: 0 }} onClick={onToggle}>
        <ListItemIcon>
          <Checkbox checked={request.done} />
        </ListItemIcon>
        <SongRequestTitle
          done={request.done}
          secondary={request.details?.title}
        >
          {request.name}
        </SongRequestTitle>
      </ListItemButton>
    </ListItem>
  );
};
