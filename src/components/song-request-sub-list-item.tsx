import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
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
import useStore from "../store/store";
import { sleep } from "../utils";
import SongRequestTitle from "./song-request-title";

interface Props {
  request: Request;
  deleteProps: {
    isPending: boolean;
    onPreConfirm: () => void;
    onConfirm: () => void;
    resetDelete: () => void;
  };
  toggleProps: {
    onToggle: (id: string) => void;
  };
}

const SongRequestSubListItem = ({
  request,
  deleteProps,
  toggleProps: { onToggle },
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const popoverOpen = useMemo(() => anchorEl !== undefined, [anchorEl]);

  const show = useStore((state) => state.show);

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
              onClick={onMenuItemClick(() => {
                if (request.name) {
                  copy(request.name);
                  show();
                }
              })}
            >
              <ListItemIcon>
                <ContentCopyIcon fontSize={"small"} />
              </ListItemIcon>
              <ListItemText>複製歌曲</ListItemText>
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
      <ListItemButton sx={{ px: 0 }} onClick={() => onToggle(request._id)}>
        <ListItemIcon>
          <Checkbox checked={request.done} />
        </ListItemIcon>
        <SongRequestTitle done={request.done} secondary={request.audience}>
          {request.name}
        </SongRequestTitle>
      </ListItemButton>
    </ListItem>
  );
};

export default memo(SongRequestSubListItem);
