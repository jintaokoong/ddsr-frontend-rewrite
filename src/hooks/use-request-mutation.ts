import { useMutation, useQueryClient } from "react-query";
import { UpdatePayload } from "../interfaces/update-payload";
import apiService from "../services/api-service";
import { GetRequestsResponse } from "../interfaces/get-requests-response";
import { Request } from "../interfaces/request";

const useRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Promise<any>,
    any,
    UpdatePayload,
    { pvrqs: GetRequestsResponse | undefined }
  >(
    ["request"],
    (payload: UpdatePayload) => apiService.updateRequest(payload),
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries("requests");
        const pvrqs = queryClient.getQueryData<GetRequestsResponse>([
          "requests",
        ]);
        const updater = (pv: GetRequestsResponse | undefined) => {
          if (pv === undefined || pv[variables.key] === undefined) {
            return undefined;
          }
          return {
            ...pv,
            [variables.key]: pv[variables.key].map((r) =>
              r._id === variables._id ? { ...r, done: !r.done } : r
            ),
          };
        };
        queryClient.setQueryData<GetRequestsResponse | undefined>(
          ["requests"],
          updater
        );
        return { pvrqs };
      },
      onError: (err, _, context) => {
        console.error(err);
        queryClient.setQueryData("requests", () => context?.pvrqs);
      },
    }
  );
};

export default useRequestMutation;
