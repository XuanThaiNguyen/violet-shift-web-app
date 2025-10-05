export type PaginationResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
  };
};