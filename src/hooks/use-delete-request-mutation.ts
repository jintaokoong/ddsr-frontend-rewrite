import { useMutation, useQueryClient } from "react-query";
import { DeletePayload } from "../interfaces/delete-payload";
import { GetRequestsResponse } from "../interfaces/get-requests-response";
import { Request } from "../interfaces/request";
import apiService from "../services/api-service";

const useDeleteRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Promise<any>,
    unknown,
    DeletePayload,
    { request: Request; key: string }
  >(
    ["delete-request"],
    (payload: DeletePayload) => apiService.deleteRequest(payload.request),
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(["requests"]);
        queryClient.setQueryData<GetRequestsResponse | undefined>(
          "requests",
          (pv) => {
            if (!pv || !pv[variables.key]) {
              return pv;
            }
            if (pv[variables.key].length === 1) {
              let next = { ...pv };
              delete next[variables.key];
              return next;
            }
            return {
              ...pv,
              [variables.key]: pv[variables.key].filter(
                (r) => r._id !== variables.request._id
              ),
            };
          }
        );
        return { request: variables.request, key: variables.key };
      },
      onError: async (error, variables, context) => {
        if (!context) {
          await queryClient.invalidateQueries(["requests"]);
          return;
        }

        queryClient.setQueryData<GetRequestsResponse | undefined>(
          "requests",
          (pv) => {
            if (!pv || !pv[variables.key]) {
              return pv;
            }
            return {
              [variables.key]: [...pv[variables.key], context.request],
            };
          }
        );
      },
    }
  );
};

export default useDeleteRequestMutation;
