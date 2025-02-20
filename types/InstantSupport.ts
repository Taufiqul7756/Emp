export interface InstantSupport {
  id: string;
  phoneNumber: string;
  status: string;
  handled: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Complain {
  id: string;
  phoneNumber: string;
  status: string;
  handled: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface RefundsUpdate {
  id: string;
  phoneNumber: string;
  refundStatus: string;
  handled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}
