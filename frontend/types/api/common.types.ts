export type StructuredResponse<T> = {
  data: T;
  status: number;
  message: string;
  error: any | null;
};
