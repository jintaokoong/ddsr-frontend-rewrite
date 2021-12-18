import { useMutation } from "react-query";
import { UpdatePayload } from "../interfaces/update-payload";
import apiService from "../services/api-service";

const useRequestMutation = () => {
  return useMutation(["request"], (payload: UpdatePayload) =>
    apiService.updateRequest(payload)
  );
};

export default useRequestMutation;
