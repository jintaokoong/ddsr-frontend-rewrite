import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { ListingResponse } from "../interfaces/listing-response";
import { Request } from "../interfaces/request";
import apiService from "../services/api-service";

type QueryData = InfiniteData<ListingResponse<Request>> | undefined;

function replaceAt<T>(array: T[], index: number, value: T) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

const useToggleRequest = () => {
  const qc = useQueryClient();
  return useMutation(["toggle-request"], apiService.toggleRequest, {
    onMutate: async (variables) => {
      await qc.cancelQueries(["request-listing"]);
      const pvrqs = qc.getQueryData<QueryData>(["request-listing"]);
      const updater = (pv: QueryData) => {
        if (pv === undefined) return pv;
        const index = pv.pages.findIndex((listing) =>
          listing.data.find((d) => d._id === variables)
        );
        if (index < 0) return pv;
        const updateIndividual = (res: ListingResponse<Request>) => {
          const itemidx = res.data.findIndex((r) => r._id === variables);
          if (itemidx < 0) return res;
          const item = res.data[itemidx];
          return {
            ...res,
            data: replaceAt(res.data, itemidx, { ...item, done: !item.done }),
          };
        };
        const curr = pv.pages[index];
        const next = replaceAt(pv.pages, index, updateIndividual(curr));
        return {
          ...pv,
          pages: next,
        };
      };
      qc.setQueryData<QueryData>(["request-listing"], updater);
      return { pvrqs };
    },
    onError: (err, _, context) => {
      console.error(err);
      qc.setQueryData("request-listing", () => context?.pvrqs);
    },
  });
};

export default useToggleRequest;
