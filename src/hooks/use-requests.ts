import { useInfiniteQuery } from "react-query";
import apiService from "../services/api-service";

const useRequests = () =>
  useInfiniteQuery(
    ["request-listing"],
    ({ pageParam }) => apiService.getRequests({ page: pageParam }),
    {
      getNextPageParam: (lp) =>
        lp.page >= lp.totalPages ? undefined : lp.page + 1,
    }
  );

export default useRequests;
