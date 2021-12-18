import { useMutation } from "react-query";
import apiService from "../services/api-service";

const useConfigMutation = () => {
  return useMutation(["config"], () => apiService.toggleAccepting());
};

export default useConfigMutation;
