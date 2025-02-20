export interface User {
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
    Address: {
      addressLine1?: string;
      city?: string;
      country?: string;
      zipcode?: string;
      // isDefault?: boolean;
    };
    Profile: {
      profilePhoto?: string;
      gender?: string;
    };
    profile?: {
      profilePhoto?: string;
      gender?: string;
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