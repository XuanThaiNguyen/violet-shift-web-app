export type PaginationResponse<T> = {
  data: T[];
  map?: Record<string, T>;
  pagination: {
    total: number;
    page: number;
    perPage: number;
  };
};