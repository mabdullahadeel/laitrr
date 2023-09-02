import { HTTPError } from "ky";

export type StructuredResponse<T, E = unknown> = {
  data: T;
  status: number;
  message: string;
  error: E | null;
};

export type DestructuredResponse<T extends StructuredResponse<unknown>> =
  T["data"];

export type PaginatedResponse<T> = StructuredResponse<{
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}>;

export type TimeStamped = {
  created_at: string;
  updated_at: string;
};

export type TPaginationParams = {
  limit: number;
  offset: number;
};

export type TStructuredErrorResponse<E = any> = HTTPError & {
  message: StructuredResponse<null, E>;
};
