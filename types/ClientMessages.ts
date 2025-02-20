import { BlogReply } from './../app/dashboard/order-management/ambulance/Types/Types';
export interface ClientMessage {
  id: string;
  name: string;
  subject: string;
  message: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}


export interface PaginatedResponse<T> {
  clientTestimonial: T[];
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export interface BlogPaginatedResponse<T> {
  blog: T[];
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export interface JobPostPaginatedResponse<T> {
  blog: T[];
  totalJobPosts: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export interface BlogReplyPaginatedResponse<T> {
  BlogReply: T[];
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Client {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  profilePhoto: string;
  role: string;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  basicInfo: any[];
  address: any[];
}

export interface ClientApiResponse<T> {
  success: boolean;
  message: string;
  data: { user: T };
  error: string | null;
}
