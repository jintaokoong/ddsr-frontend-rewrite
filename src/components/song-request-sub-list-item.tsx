import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import copy from "copy-to-clipboard";
import {
  Fragment,
  memo,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Request } from "../interfaces/request";
import { sleep } from "../utils";
import SongRequestTitle from "./song-request-title";

interface Props {
  request: Request;
  onCopy: () => void;
  deleteProps: {
    isPending: boolean;
    onPreConfirm: () => void;
    onConfirm: () => void;
    resetDelete: () => void;
  };
  toggleProps: {
    onToggle: (e: SyntheticEvent) => void;
  };
}

const SongRequestSubListItem = ({
  request,
  deleteProps,
  onCopy,
  toggleProps: { onToggle },
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const popoverOpen = useMemo(() => anchorEl !== undefined, [anchorEl]);

  const onMenuItemClick = useCallback(
    (callback?: () => void) => () => {
      setAnchorEl(undefined);
      callback && callback();
    },
    []
  );

  const onDeleteClick = useCallback(
    (confirm: boolean) => () => {
      if (confirm) {
        deleteProps.onPreConfirm();
        return;
      }
      deleteProps.onConfirm();
      setAnchorEl(undefined);
    },
    [deleteProps]
  );

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Fragment>
          <Tooltip title={"更多"}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            onClose={async () => {
              setAnchorEl(undefined);
              if (!deleteProps.isPending) {
                await sleep(500);
                deleteProps.resetDelete();
              }
            }}
            open={popoverOpen}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem
              disabled={request.details?.url === undefined}
              onClick={onMenuItemClick(() => {
                request.details?.url && window.open(request.details.url);
              })}
            >
              <ListItemIcon>
                <OpenInNewIcon fontSize={"small"} />
              </ListItemIcon>
              <ListItemText>打開鏈接</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={request.details?.url === undefined}
              onClick={onMenuItemClick(() => {
                if (request.details?.url) {
                  copy(request.details.url);
                  onCopy();
                }
              })}
            >
              <ListItemIcon>
                <ContentCopyIcon fontSize={"small"} />
              </ListItemIcon>
              <ListItemText>複製鏈接</ListItemText>
            </MenuItem>
            <MenuItem onClick={onDeleteClick(deleteProps.isPending)}>
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

export default memo(SongRequestSubListItem);
