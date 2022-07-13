import { useMutation, useQueryClient, InfiniteData } from "react-query";
import apiService from "../services/api-service";
import { v4 as uuidv4 } from "uuid";
import { ListingResponse } from "../interfaces/listing-response";
import { Request } from "../interfaces/request";
import * as R from "ramda";

const pad = (input: number) => {
  return input.toString().padStart(2, "0");
};

type QueryData = InfiniteData<ListingResponse<Request>> | undefined;

const useCreateRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Promise<any>, any, string, { _id: string; key: string }>(
    ["create-request"],
    apiService.createRequest,
    {
      onMutate: async (name) => {
        const key = "request-listing";
        await queryClient.cancelQueries([key]);
        const date = new Date();
        const dateString = `${date.getFullYear()}-${pad(
          date.getMonth() + 1
        )}-${pad(date.getDate())}`;
        const generated = uuidv4();
        const req: Request = {
          _id: generated,
          name: name,
          done: false,
          key: dateString,
          audience: "系統",
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        };

        const updater = (pv: QueryData) => {
          if (pv === undefined) return undefined;
          const f = R.head(pv.pages);
          if (f === undefined) {
            return R.assoc(
              "pages",
              [
                {
                  data: [req],
                  page: 1,
                  pageSize: 10,
                  totalPages: 1,
                },
              ],
              pv
            );
          }
          const n = R.assoc("data", R.concat([req], f.data), f);
          return R.assoc("pages", R.concat([n], R.tail(pv.pages)), pv);
        };
        queryClient.setQueryData<QueryData>(key, updater);
        return {
          _id: generated,
          key: dateString,
        };
      },
      onSettled: () => {
        return queryClient.invalidateQueries(["request-listing"]);
      },
    }
  );
};

export default useCreateRequestMutation;
