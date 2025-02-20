export interface Ad {
  id: string;
  thumbnail: string;
  adsName: string;
  providerName: string;
  pageOfAds: string[];
  amount: number;
  paymentMethod: string;
  adsStart: string;
  adsEnd: string;
  state: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdsData {
  ads: Ad[];
  currentPage: number;
  limit: number;
  totalAds: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdsApiResponse {
  success: boolean;
  message: string;
  data: AdsData;
  error: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

export interface FilterState {
  status: string;
  from: Date | "";
  to: Date | "";
  organizationName: string;
}
