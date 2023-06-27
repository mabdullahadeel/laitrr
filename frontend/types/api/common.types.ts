export type StructuredResponse<T> = {
  data: T;
  status: number;
  message: string;
  error: any | null;
};

export type DestructuredResponse<T extends StructuredResponse<unknown>> =
  T["data"];
