import { useCallback, useState } from "react";
import { Request } from "../../interfaces/request";
import useDeleteRequestMutation from "../use-delete-request-mutation";

const useDeleteRequest = () => {
  const [deletePayload, setDeletePayload] = useState<Request | undefined>(
    undefined
  );
  const { mutate: deleteMutate } = useDeleteRequestMutation();

  const onPreConfirm = useCallback(
    (request: Request) => () => setDeletePayload(request),
    [setDeletePayload]
  );

  const onConfirm = useCallback(() => {
    if (!deletePayload) {
      return;
    }
    setDeletePayload(undefined);
    deleteMutate(deletePayload._id);
  }, [deletePayload]);

  const resetDelete = useCallback(() => {
    setDeletePayload(undefined);
  }, []);

  return {
    target: deletePayload,
    onPreConfirm,
    onConfirm,
    resetDelete,
  };
};
export default useDeleteRequest;
