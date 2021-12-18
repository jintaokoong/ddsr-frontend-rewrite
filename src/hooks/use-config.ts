import { useQuery } from "react-query";
import apiService from "../services/api-service";

const useConfig = () => {
  return useQuery(["config"], () => apiService.getConfig());
};

export default useConfig;
