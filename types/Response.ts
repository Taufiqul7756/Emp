import { AxiosError } from "axios";

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  error: null | string;
}

export type ErrorResponse = AxiosError<Response<{}> | undefined>;
