import { useCallback, useState } from "react";
import { Request } from "../../interfaces/request";
import { DeletePayload } from "../../interfaces/delete-payload";
import useDeleteRequestMutation from "../use-delete-request-mutation";

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
export default useDeleteRequest;
