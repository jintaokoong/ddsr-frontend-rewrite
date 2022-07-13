import { useMutation, useQueryClient } from "react-query";
import apiService from "../services/api-service";
import { GetConfigResponse } from "../interfaces/get-config-response";

const useConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(["config"], () => apiService.toggleAccepting(), {
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("config");
      // Snapshot the previous value
      const pvc = queryClient.getQueryData<GetConfigResponse>("config");
      // Optimistically update to the new value
      queryClient.setQueryData<GetConfigResponse>("config", (pv) => ({
        name: pv?.name ?? "",
        value: !pv?.value,
      }));
      // Return a context object with the snapshotted value
      return { pvc };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData("config", () => context?.pvc);
    },
  });
};

export default useConfigMutation;
