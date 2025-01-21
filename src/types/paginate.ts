export interface PaginationOptions<T = any> {
  sort?: Record<string, 1 | -1>;
  populate?:
    | {
        path: string;
        select?: string;
      }
    | string;
  filter?: Record<string, any>;
}
