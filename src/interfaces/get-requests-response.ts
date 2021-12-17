import { Request } from "./request";

export interface GetRequestsResponse {
  [key: string]: Request[];
}
