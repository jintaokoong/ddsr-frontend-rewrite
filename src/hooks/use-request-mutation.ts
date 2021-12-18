import { useMutation, useQueryClient } from "react-query";
import { UpdatePayload } from "../interfaces/update-payload";
import apiService from "../services/api-service";
import { GetRequestsResponse } from "../interfaces/get-requests-response";
import { Request } from "../interfaces/request";

const useRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ["request"],
    (payload: UpdatePayload) => apiService.updateRequest(payload),
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries("requests");
        const pvrqs = queryClient.getQueryData<GetRequestsResponse>([
          "requests",
        ]);
        queryClient.setQueryData<GetRequestsResponse>(["requests"], (pv) => ({
          ...pv,
          [variables.key]:
            pv === undefined || pv[variables.key] === undefined
              ? []
              : (pv[variables.key] as Request[]).map((r) => r),
        }));
      },
    }
  );
};

export default useRequestMutation;
