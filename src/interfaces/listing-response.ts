export interface ListingResponse<T> {
  data: T[];
  totalPages: number;
  page: number;
  pageSize: number;
}
