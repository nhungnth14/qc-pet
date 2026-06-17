export type StandardResponse<T> = {
  data: T;
  serverTime: number;
  requestId: string;
};

export type RFC7807ErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
};
