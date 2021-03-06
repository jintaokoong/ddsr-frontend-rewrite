import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { ListingResponse } from "../interfaces/listing-response";
import apiService from "../services/api-service";
import { Request } from "../interfaces/request";

type QueryData = InfiniteData<ListingResponse<Request>> | undefined;

function deleteAt<T>(array: T[], index: number) {
  const ret = array.slice(0);
  ret.splice(index, 1);
  return ret;
}

function replaceAt<T>(array: T[], index: number, value: T) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

const useDeleteRequestMutation = () => {
  const qc = useQueryClient();
  return useMutation(["delete-request"], apiService.deleteRequest, {
    onMutate: async (variables) => {
      await qc.cancelQueries(["request-listing"]);
      const pvrqs = qc.getQueryData<QueryData>(["request-listing"]);
      const updater = (pv: QueryData) => {
        if (pv === undefined) return pv;
        const index = pv.pages.findIndex((p) =>
          p.data.find((r) => r._id === variables)
        );
        if (index < 0) return pv;
        const page = pv.pages[index];
        const updateData = (res: ListingResponse<Request>) => {
          const itemIndex = page.data.findIndex((r) => r._id === variables);
          if (itemIndex < 0) return res;
          return {
            ...res,
            data: deleteAt(res.data, itemIndex),
          };
        };
        const next = replaceAt(pv.pages, index, updateData(page));
        return {
          ...pv,
          pages: next,
        };
      };
      qc.setQueryData<QueryData>("request-listing", updater);
      return { pvrqs };
    },
    onError: (err, _, context) => {
      console.error(err);
      qc.setQueryData("request-listing", () => context?.pvrqs);
    },
  });
};

export default useDeleteRequestMutation;
