import { useMutation, useQueryClient } from "react-query";
import { GetRequestsResponse } from "../interfaces/get-requests-response";
import apiService from "../services/api-service";
import { v4 as uuidv4 } from "uuid";

const pad = (input: number) => {
  return input.toString().padStart(2, "0");
};

const useCreateRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Promise<any>, any, string, { _id: string; key: string }>(
    ["create-request"],
    apiService.createRequest,
    {
      onMutate: async (name) => {
        await queryClient.cancelQueries(["requests"]);
        const date = new Date();
        const dateString = `${date.getFullYear()}-${pad(
          date.getMonth() + 1
        )}-${pad(date.getDate())}`;
        const generated = uuidv4();
        const updater = (pv: GetRequestsResponse | undefined) => {
          if (pv === undefined) {
            return undefined;
          }
          if (pv[dateString] === undefined) {
            return {
              [dateString]: [
                {
                  _id: generated,
                  name: name,
                  done: false,
                  key: dateString,
                  createdAt: date.getTime(),
                  updatedAt: date.getTime(),
                },
              ],
              ...pv,
            };
          }
          return {
            ...pv,
            [dateString]: [
              ...pv[dateString],
              {
                _id: generated,
                name: name,
                done: false,
                key: dateString,
                createdAt: date.getTime(),
                updatedAt: date.getTime(),
              },
            ],
          };
        };
        queryClient.setQueryData<GetRequestsResponse | undefined>(
          "requests",
          updater
        );
        return {
          _id: generated,
          key: dateString,
        };
      },
      onSuccess: async (data: any, _, context) => {
        if (!context) {
          await queryClient.invalidateQueries(["requests"]);
          return;
        }
        queryClient.setQueryData<GetRequestsResponse | undefined>(
          ["requests"],
          (pv) => {
            if (pv === undefined || pv[context.key] === undefined) {
              return undefined;
            }
            return {
              ...pv,
              [context.key]: pv[context.key].map((r) =>
                r._id === context._id ? data : r
              ),
            };
          }
        );
      },
      onError: (err, variables, context) => {
        console.error("create-error", err);
        if (!context) {
          queryClient.invalidateQueries(["requests"]);
          return;
        }

        queryClient.setQueryData<GetRequestsResponse | undefined>(
          ["requests"],
          (pv) => {
            if (pv === undefined || pv[context.key] === undefined) {
              return undefined;
            }

            if (pv[context.key].length === 1) {
              let copy = { ...pv };
              delete copy[context.key];
              return pv;
            }

            return {
              ...pv,
              [context.key]: pv[context.key].filter(
                (i) => i._id !== context._id
              ),
            };
          }
        );
      },
    }
  );
};

export default useCreateRequestMutation;
