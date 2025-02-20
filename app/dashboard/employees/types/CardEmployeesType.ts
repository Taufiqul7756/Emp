export type HttpHeaders = { [key: string]: string };

export enum HttpMethod {
  get = "GET",
  post = "POST",
  put = "PUT",
  patch = "PATCH",
  del = "DELETE",
}

export interface FetchOption {
  method: HttpMethod;
  headers: HttpHeaders;
  body?: string | FormData;
}

export interface ApiCallStartLog {
  url: string;
  method: HttpMethod;
  headers: HttpHeaders;
  body?: object;
}

export interface ApiCallFinishedLog extends ApiCallStartLog {
  status: number;
  data: object;
}

type Address = {
  addressId: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  zipcode: string;
  country: string;
  fullAddress: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  joinDate: string;
  avatar: string;
  permissions: string[];
  password: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role: "ADMIN" | "MODERATOR" | "CLIENT";
  createdAt: string;
  address: Address[];
  Profile: {
    profilePhoto?: string;
    gender?: string;
    profileId: string;
    dateOfBirth: string | null;
    department: string | null;
    experience: string | null;
    licenseNo: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    bloodGroup: string | null;
    licenseFile: string[]; // Assuming URLs or file names
    preferredLocations: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
  profile?: {
    profilePhoto?: string;
    gender?: string;
    profileId: string;
    dateOfBirth: string | null;
    department: string | null;
    experience: string | null;
    licenseNo: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    bloodGroup: string | null;
    licenseFile: string[]; // Assuming URLs or file names
    preferredLocations: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
}

export interface AmbulanceAdminApiResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error: null | string;
}
export interface UsersManagementApiResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error: null | string;
}
