import { IconButton, Tooltip } from "@mui/material";
import { Delete, InfoOutlined } from "@mui/icons-material";

interface Props {
  isPending: boolean;
  onPreConfirm: () => void;
  onConfirm: () => void;
}

const DeleteButton = (props: Props) => {
  return (
    <Tooltip title={props.isPending ? "刪除" : "確認刪除"}>
      {props.isPending ? (
        <IconButton color={"error"} onClick={props.onPreConfirm}>
          <Delete />
        </IconButton>
      ) : (
        <IconButton color={"warning"} onClick={props.onConfirm}>
          <InfoOutlined />
        </IconButton>
      )}
    </Tooltip>
  );
};

export default DeleteButton;
