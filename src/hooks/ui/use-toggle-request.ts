import useRequestMutation from "../use-request-mutation";
import { Request } from "../../interfaces/request";
import { useCallback } from "react";

const useToggleRequest = () => {
  const { mutate: requestMutate } = useRequestMutation();
  return useCallback(
    (key: string, request: Request) => () => {
      requestMutate({ _id: request._id, done: !request.done, key: key });
    },
    []
  );
};

export default useToggleRequest;
