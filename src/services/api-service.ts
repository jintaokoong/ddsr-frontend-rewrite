import { UpdatePayload } from "../interfaces/update-payload";
import axios from "../config/axios";
import { Request } from "../interfaces/request";
import { GetRequestsResponse } from "../interfaces/get-requests-response";
import { GetConfigResponse } from "../interfaces/get-config-response";
import { AxiosResponse } from "axios";

const getRequests = () =>
  axios.get<GetRequestsResponse>("/request").then((res) => res.data);

const updateRequest = (payload: UpdatePayload) =>
  axios.put(`/request/${payload._id}`, payload).then((res) => res.data);

const createRequest = (name: string) =>
  axios.post("/request", { name: name }).then(({ data }) => data);

const deleteRequest = (request: Request) =>
  axios.delete(`/request/${request._id}`).then(({ data }) => data);

const getConfig = () =>
  axios.get<GetConfigResponse>("/config").then(({ data }) => data);

const toggleAccepting = () =>
  axios
    .post<undefined, AxiosResponse<GetConfigResponse>>("/config/toggle")
    .then(({ data }) => data);

export default {
  getConfig,
  getRequests,
  updateRequest,
  createRequest,
  toggleAccepting,
  deleteRequest,
};
