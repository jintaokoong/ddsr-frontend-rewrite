import { AxiosResponse } from "axios";
import axios from "../config/axios";
import { GetConfigResponse } from "../interfaces/get-config-response";
import { ListingOptions } from "../interfaces/listing-options";
import { ListingResponse } from "../interfaces/listing-response";
import { Request } from "../interfaces/request";
import { UpdatePayload } from "../interfaces/update-payload";

const getRequests = (options: ListingOptions) =>
  axios
    .get<ListingResponse<Request>>("/requests", {
      params: { page: options.page, pageSize: 10 },
    })
    .then((res) => res.data);

const toggleRequest = (id: string) =>
  axios.patch(`/requests/${id}`).then(({ data }) => data);

const updateRequest = (payload: UpdatePayload) =>
  axios.put(`/requests/${payload._id}`, payload).then((res) => res.data);

const createRequest = (name: string) =>
  axios.post("/requests", { name: name }).then(({ data }) => data);

const deleteRequest = (id: string) =>
  axios.delete(`/requests/${id}`).then(({ data }) => data);

const getConfig = () =>
  axios.get<GetConfigResponse>("/status").then(({ data }) => data);

const toggleAccepting = () =>
  axios
    .patch<undefined, AxiosResponse<GetConfigResponse>>("/status")
    .then(({ data }) => data);

export default {
  getConfig,
  getRequests: getRequests,
  updateRequest,
  toggleRequest,
  createRequest,
  toggleAccepting,
  deleteRequest,
};
