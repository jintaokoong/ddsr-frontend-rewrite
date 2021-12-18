import { useMutation } from "react-query";
import apiService from "../services/api-service";

const useCreateConfigMutation = () => {
  return useMutation(["create-request"], apiService.createRequest);
};

export default useCreateConfigMutation;
