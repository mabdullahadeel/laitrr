export type StructuredResponse<T> = {
  data: T;
  status: number;
  message: string;
  error: any | null;
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
