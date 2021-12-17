import { useQueries, useQuery } from "react-query";
import apiService from "../services/api-service";

const useRequests = () =>
  useQuery(["requests"], () => apiService.getRequests());

export default useRequests;
